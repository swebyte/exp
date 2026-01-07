import { Component, inject, input, signal } from '@angular/core';
import { LikesService } from './likes.service';

@Component({
  selector: 'app-like-button',
  imports: [],
  templateUrl: './like-button.html',
  styleUrl: './like-button.scss',
})
export class LikeButton {
  private likesService = inject(LikesService);

  postId = input.required<number>();
  count = input.required<number>();
  readonly = input<boolean>(false);

  protected liked = signal(false);

  ngOnInit() {
    this.liked.set(this.likesService.isPostLiked(this.postId()));
  }

  protected toggleLike() {
    if (this.readonly()) {
      return;
    }
    const result = this.likesService.toggleLike(this.postId());
    this.liked.set(result.liked);
  }
}
