import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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

  getBlogPosts(): Observable<BlogPost[]> {
    return this.http
      .get<BlogPost[]>(
        `${environment.apiBaseUrl}/blog?order=created_at.desc&select=*,users(fullname)`
      )
      .pipe(
        map((posts) =>
          posts.map((post) => ({
            ...post,
            author: post.users?.fullname || 'Unknown Author',
          }))
        )
      );
  }

  getBlogPost(id: number): Observable<BlogPost | null> {
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
        })
      );
  }

  deleteBlogPost(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/blog?id=eq.${id}`);
  }
}
