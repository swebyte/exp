import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private http = inject(HttpClient);
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

  toggleLike(postId: number, currentCount: number): { liked: boolean; newCount: number } {
    const likedPosts = new Set(this.likedPostsStore());
    const isCurrentlyLiked = likedPosts.has(postId);

    let newCount: number;

    if (isCurrentlyLiked) {
      likedPosts.delete(postId);
      newCount = Math.max(0, currentCount - 1);
    } else {
      likedPosts.add(postId);
      newCount = currentCount + 1;
    }

    this.likedPostsStore.set(likedPosts);
    this.saveLikedPostsToStorage();
    this.updateLikesOnServer(postId, newCount);

    return { liked: !isCurrentlyLiked, newCount };
  }

  private updateLikesOnServer(postId: number, newCount: number) {
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
