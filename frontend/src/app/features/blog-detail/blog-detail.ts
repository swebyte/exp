import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownComponent } from 'ngx-markdown';
import { environment } from '../../environments/environment';
import { BlogFormComponent } from '../blog-form/blog-form';
import { AuthService } from '../services/auth.service';

interface BlogPost {
  id: number;
  title: string;
  created_at: string;
  body: string;
  user_id: string;
  likes?: number;
  author?: string;
}

@Component({
  selector: 'app-blog-detail',
  imports: [DatePipe, MarkdownComponent],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.scss',
})
export class BlogDetailComponent {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(NgbModal);
  protected authService = inject(AuthService);
  protected post = signal<BlogPost | null>(null);
  protected loading = signal(true);
  protected liked = signal(false);
  protected likesCount = signal(0);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadBlogPost(Number(id));
    } else {
      this.router.navigate(['/blog/']);
    }
  }

  loadBlogPost(id: number) {
    this.loading.set(true);
    this.http.get<BlogPost[]>(`${environment.apiBaseUrl}/blog?id=eq.${id}`).subscribe({
      next: (data) => {
        if (data.length > 0) {
          data[0].author = 'Unknown Author';
          this.post.set(data[0]);
          this.likesCount.set(data[0].likes || 0);
          this.loadLikeStatus(id);
        } else {
          console.error('Blog post not found');
          this.router.navigate(['/blog/']);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load blog post:', error);
        this.loading.set(false);
        this.router.navigate(['/blog/']);
      },
    });
  }

  deleteBlogPost() {
    const postId = this.post()?.id;
    if (!postId) return;

    if (confirm('Are you sure you want to delete this post?')) {
      this.http.delete(`${environment.apiBaseUrl}/blog?id=eq.${postId}`).subscribe({
        next: () => {
          console.log('Blog post deleted');
          this.router.navigate(['/blog/']);
        },
        error: (error) => {
          console.error('Failed to delete blog post:', error);
        },
      });
    }
  }

  openEditBlogModal() {
    const currentPost = this.post();
    if (!currentPost) return;

    const modalRef = this.modalService.open(BlogFormComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.blogPost = currentPost;

    modalRef.result.then(
      (result) => {
        console.log('Blog post updated:', result);
        this.loadBlogPost(currentPost.id);
      },
      (reason) => {
        console.log('Modal dismissed');
      }
    );
  }

  goBack() {
    this.router.navigate(['/blog/']);
  }

  loadLikeStatus(postId: number) {
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    this.liked.set(likedPosts.includes(postId));
  }

  toggleLike() {
    const postId = this.post()?.id;
    if (!postId) return;

    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]') as number[];
    const isCurrentlyLiked = this.liked();

    if (isCurrentlyLiked) {
      // Unlike
      const index = likedPosts.indexOf(postId);
      if (index > -1) {
        likedPosts.splice(index, 1);
      }
      this.likesCount.update((count) => Math.max(0, count - 1));
      this.liked.set(false);
    } else {
      // Like
      likedPosts.push(postId);
      this.likesCount.update((count) => count + 1);
      this.liked.set(true);
    }

    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    this.updateLikesOnServer(postId, this.likesCount());
  }

  updateLikesOnServer(postId: number, newCount: number) {
    this.http
      .patch(`${environment.apiBaseUrl}/blog?id=eq.${postId}`, { likes: newCount })
      .subscribe({
        next: () => {
          console.log('Likes updated on server');
        },
        error: (error) => {
          console.error('Failed to update likes:', error);
        },
      });
  }
}
