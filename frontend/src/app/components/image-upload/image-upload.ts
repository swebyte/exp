import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageService } from '../services/image.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="image-upload mb-2">
      <input type="file" accept="image/*" (change)="onFileSelected($event)" #fileInput />

      <button
        type="button"
        class="btn btn-sm btn-secondary"
        (click)="fileInput.click()"
        [disabled]="uploading"
      >
        <i class="bi bi-image"></i> {{ uploading ? 'Uploading...' : 'Upload Image' }}
      </button>

      @if (error) {
      <small class="error text-danger ms-2">{{ error }}</small>
      }
    </div>
  `,
  styles: [
    `
      input[type='file'] {
        display: none;
      }
    `,
  ],
})
export class ImageUploadComponent {
  @Output() imageUploaded = new EventEmitter<string>();

  uploading = false;
  error: string | null = null;

  constructor(private imageService: ImageService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        this.error = 'File size must be less than 10MB';
        return;
      }

      this.uploading = true;
      this.error = null;

      this.imageService.uploadImage(file).subscribe({
        next: (response) => {
          this.imageUploaded.emit(response.url);
          this.uploading = false;
          this.error = null;
          // Reset file input
          input.value = '';
        },
        error: (err) => {
          this.error = 'Upload failed';
          this.uploading = false;
        },
      });
    }
  }
}
