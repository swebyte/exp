import { Component, inject, Input, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MarkdownComponent } from 'ngx-markdown';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ImageUploadComponent } from '../image-upload/image-upload';

interface ExperienceData {
  title: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string | null;
}

interface Experience extends ExperienceData {
  id: number;
  created_at: string;
  user_id: string;
}

@Component({
  selector: 'app-experience-form',
  imports: [FormsModule, MarkdownComponent, ImageUploadComponent],
  templateUrl: './experience-form.html',
  styleUrl: './experience-form.scss',
})
export class ExperienceFormComponent {
  activeModal = inject(NgbActiveModal);
  private platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId);
  private http = inject(HttpClient);

  @Input() experience?: Experience;

  title = '';
  company = '';
  description = '';
  start_date = '';
  end_date = '';
  isCurrentPosition = false;
  errorMessage = '';
  showPreview = false;

  get isEditMode(): boolean {
    return !!this.experience;
  }

  ngOnInit() {
    if (this.experience) {
      this.title = this.experience.title;
      this.company = this.experience.company;
      this.description = this.experience.description;
      this.start_date = this.experience.start_date;
      this.end_date = this.experience.end_date || '';
      this.isCurrentPosition = !this.experience.end_date;
    }
  }

  onImageUploaded(imageUrl: string) {
    // Insert HTML img tag with editable width attribute
    const html = `\n<img src="${imageUrl}" alt="Image" width="600">\n`;
    this.description = this.description + html;
  }

  onSubmit() {
    const experienceData: ExperienceData = {
      title: this.title,
      company: this.company,
      description: this.description,
      start_date: this.start_date,
      end_date: this.isCurrentPosition ? null : this.end_date,
    };

    if (this.isEditMode && this.experience) {
      // Update existing experience
      this.http
        .patch(`${environment.apiBaseUrl}/experience?id=eq.${this.experience.id}`, experienceData)
        .subscribe({
          next: (response) => {
            console.log('Experience updated:', response);
            this.activeModal.close(response);
          },
          error: (error) => {
            console.error('Failed to update experience:', error);
            this.errorMessage = 'Failed to update experience. Please try again.';
          },
        });
    } else {
      // Create new experience
      this.http.post(`${environment.apiBaseUrl}/experience`, experienceData).subscribe({
        next: (response) => {
          console.log('Experience created:', response);
          this.activeModal.close(response);
        },
        error: (error) => {
          console.error('Failed to create experience:', error);
          this.errorMessage = 'Failed to create experience. Please try again.';
        },
      });
    }
  }

  onCurrentPositionChange() {
    if (this.isCurrentPosition) {
      this.end_date = '';
    }
  }
}
