import { Component, inject, Input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ImageUploadComponent } from '../image-upload/image-upload';
import { AuthService } from '../services/auth.service';

interface BlogPostData {
  title: string;
  body: string;
}

interface BlogPost extends BlogPostData {
  id: number;
  created_at: string;
  user_id: string;
}

@Component({
  selector: 'app-blog-form',
  imports: [FormsModule, MarkdownComponent, ImageUploadComponent],
  templateUrl: './blog-form.html',
  styleUrl: './blog-form.scss',
})
export class BlogFormComponent {
  activeModal = inject(NgbActiveModal);
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  @Input() blogPost?: BlogPost;

  title = '';
  body = '';
  errorMessage = '';
  showPreview = false;

  get isEditMode(): boolean {
    return !!this.blogPost;
  }

  ngOnInit() {
    if (this.blogPost) {
      this.title = this.blogPost.title;
      this.body = this.blogPost.body;
    }
  }

  onImageUploaded(imageUrl: string) {
    // Insert HTML img tag with editable width attribute
    const html = `\n<img src="${imageUrl}" alt="Image" width="600">\n`;
    this.body = this.body + html;
  }

  onSubmit() {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.errorMessage = 'You must be logged in to create/edit posts';
      return;
    }

    const blogData: BlogPostData = {
      title: this.title,
      body: this.body,
    };

    if (this.isEditMode && this.blogPost) {
      // Update existing blog post
      this.http
        .patch(`${environment.apiBaseUrl}/blog?id=eq.${this.blogPost.id}`, blogData)
        .subscribe({
          next: (response) => {
            console.log('Blog post updated:', response);
            this.activeModal.close(response);
          },
          error: (error) => {
            console.error('Failed to update blog post:', error);
            this.errorMessage = 'Failed to update blog post. Please try again.';
          },
        });
    } else {
      // Create new blog post - include user_id
      const newBlogData = { ...blogData, user_id: userId };
      this.http.post(`${environment.apiBaseUrl}/blog`, newBlogData).subscribe({
        next: (response) => {
          console.log('Blog post created:', response);
          this.activeModal.close(response);
        },
        error: (error) => {
          console.error('Failed to create blog post:', error);
          this.errorMessage = 'Failed to create blog post. Please try again.';
        },
      });
    }
  }
}
