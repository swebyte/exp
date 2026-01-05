import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BlogFormComponent } from '../blog-form/blog-form';
import { environment } from '../../environments/environment';
import { DatePipe } from '@angular/common';

interface BlogPost {
  id: number;
  title: string;
  created_at: string;
  body: string;
}

@Component({
  selector: 'app-blog',
  imports: [DatePipe, RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class BlogComponent {
  private http = inject(HttpClient);
  private modalService = inject(NgbModal);
  protected authService = inject(AuthService);
  protected posts = signal<BlogPost[]>([]);

  ngOnInit() {
    this.loadBlogPosts();
  }

  loadBlogPosts() {
    this.http.get<BlogPost[]>(`${environment.apiBaseUrl}/blog?order=created_at.desc`).subscribe({
      next: (data) => {
        this.posts.set(data);
      },
      error: (error) => {
        console.error('Failed to load blog posts:', error);
      },
    });
  }

  deleteBlogPost(id: number) {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.http.delete(`${environment.apiBaseUrl}/blog?id=eq.${id}`).subscribe({
        next: () => {
          console.log('Blog post deleted');
          this.loadBlogPosts();
        },
        error: (error) => {
          console.error('Failed to delete blog post:', error);
        },
      });
    }
  }

  openNewBlogModal() {
    const modalRef = this.modalService.open(BlogFormComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.result.then(
      (result) => {
        console.log('Blog post created:', result);
        this.loadBlogPosts();
      },
      (reason) => {
        console.log('Modal dismissed');
      }
    );
  }
}
