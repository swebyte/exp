import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface BlogPost {
  id: number;
  title: string;
  created_at: string;
  body: string;
  user_id: number;
  likes?: number;
  users?: {
    fullname: string;
  };
  author?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private http = inject(HttpClient);
  private _posts = signal<BlogPost[]>([]);
  private _selectedPost = signal<BlogPost | null>(null);

  readonly posts = computed(() => this._posts());
  readonly selectedPost = computed(() => this._selectedPost());

  /** Loads all blog posts and updates internal state */
  loadBlogPosts() {
    this.http
      .get<BlogPost[]>(
        `${environment.apiBaseUrl}/blog?order=created_at.desc&select=*,users(fullname)`
      )
      .pipe(
        map((posts) =>
          posts.map((post) => ({
            ...post,
            author: post.users?.fullname || 'Unknown Author',
          }))
        ),
        catchError((err) => {
          console.error('Failed to load blog posts:', err);
          return of([] as BlogPost[]);
        })
      )
      .subscribe((posts) => this._posts.set(posts));
  }

  /** Loads a single blog post, updates internal selected state and returns the observable */
  loadBlogPost(id: number): Observable<BlogPost | null> {
    return this.http
      .get<BlogPost[]>(`${environment.apiBaseUrl}/blog?id=eq.${id}&select=*,users(fullname)`)
      .pipe(
        map((data) => {
          if (data.length > 0) {
            const post = data[0];
            post.author = post.users?.fullname || 'Unknown Author';
            return post;
          }
          return null;
        }),
        tap((post) => this._selectedPost.set(post)),
        catchError((err) => {
          console.error('Failed to load blog post:', err);
          this._selectedPost.set(null);
          return of(null);
        })
      );
  }

  deleteBlogPost(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/blog?id=eq.${id}`);
  }

  /**
   * Increment likes for a post via RPC and update in-memory state.
   * Returns the new likes count or null on error.
   */
  incrementBlogLikes(postId: number) {
    return this.http
      .post<any[]>(`${environment.apiBaseUrl}/rpc/inc_blog_likes`, { blog_id: postId })
      .pipe(
        map((res) => (res && res.length > 0 ? res[0].likes : null)),
        tap((likes) => {
          if (likes == null) return;
          // update list
          this._posts.update((posts) => posts.map((p) => (p.id === postId ? { ...p, likes } : p)));
          // update selected post if it matches
          const sp = this._selectedPost();
          if (sp && sp.id === postId) {
            this._selectedPost.set({ ...sp, likes });
          }
        }),
        catchError((err) => {
          console.error('Failed to increment likes:', err);
          return of(null);
        })
      );
  }

  /**
   * Decrement likes for a post via RPC and update in-memory state.
   * Returns the new likes count or null on error.
   */
  decrementBlogLikes(postId: number) {
    return this.http
      .post<any[]>(`${environment.apiBaseUrl}/rpc/dec_blog_likes`, { blog_id: postId })
      .pipe(
        map((res) => (res && res.length > 0 ? res[0].likes : null)),
        tap((likes) => {
          if (likes == null) return;
          this._posts.update((posts) => posts.map((p) => (p.id === postId ? { ...p, likes } : p)));
          const sp = this._selectedPost();
          if (sp && sp.id === postId) {
            this._selectedPost.set({ ...sp, likes });
          }
        }),
        catchError((err) => {
          console.error('Failed to decrement likes:', err);
          return of(null);
        })
      );
  }

  /**
   * Send the blog body to an AI-generation endpoint and return generated text (or null on error).
   * The endpoint is expected to return `{ message: string }`.
   */
  generateAI(body: string) {
    if (!body) return of(null);
    return this.http
      .post<{ message?: string }>(`${environment.apiBaseUrl}/b2/ask`, {
        Message: body,
      })
      .pipe(
        map((res) => (res && res.message ? res.message : null)),
        catchError((err) => {
          console.error('AI generation failed:', err);
          return of(null);
        })
      );
  }
}
