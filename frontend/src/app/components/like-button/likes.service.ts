import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { BlogService } from '../../features/blog/blog.service';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private blogService = inject(BlogService);
  private platformId = inject(PLATFORM_ID);
  private likedPostsStore = signal<Set<number>>(new Set());

  constructor() {
    this.loadLikedPostsFromStorage();
  }

  private loadLikedPostsFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('likedPosts');
      if (stored) {
        const likedArray = JSON.parse(stored) as number[];
        this.likedPostsStore.set(new Set(likedArray));
      }
    }
  }

  private saveLikedPostsToStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const likedArray = Array.from(this.likedPostsStore());
      localStorage.setItem('likedPosts', JSON.stringify(likedArray));
    }
  }

  isPostLiked(postId: number): boolean {
    return this.likedPostsStore().has(postId);
  }

  toggleLike(postId: number): { liked: boolean } {
    const likedPosts = new Set(this.likedPostsStore());
    const isCurrentlyLiked = likedPosts.has(postId);

    if (isCurrentlyLiked) {
      likedPosts.delete(postId);
      this.likedPostsStore.set(likedPosts);
      this.saveLikedPostsToStorage();
      this.blogService.decrementBlogLikes(postId).subscribe({
        next: (likes) => {
          console.log('Likes decremented on server, new count:', likes);
        },
        error: (error) => {
          console.error('Failed to decrement likes:', error);
        },
      });
      return { liked: false };
    } else {
      likedPosts.add(postId);
      this.likedPostsStore.set(likedPosts);
      this.saveLikedPostsToStorage();
      this.blogService.incrementBlogLikes(postId).subscribe({
        next: (likes) => {
          console.log('Likes incremented on server, new count:', likes);
        },
        error: (error) => {
          console.error('Failed to increment likes:', error);
        },
      });
      return { liked: true };
    }
  }
}
