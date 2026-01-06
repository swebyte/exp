import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LikeButton } from '../../components/like-button/like-button';
import { AuthService } from '../../services/auth.service';
import { BlogPost, BlogService } from './blog.service';
import { BlogFormComponent } from './components/blog-form/blog-form';

@Component({
  selector: 'app-blog',
  imports: [DatePipe, RouterLink, LikeButton],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class BlogComponent {
  private blogService = inject(BlogService);
  private modalService = inject(NgbModal);
  protected authService = inject(AuthService);
  protected posts = signal<BlogPost[]>([]);

  ngOnInit() {
    this.loadBlogPosts();
  }

  loadBlogPosts() {
    this.blogService.getBlogPosts().subscribe({
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
      this.blogService.deleteBlogPost(id).subscribe({
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
