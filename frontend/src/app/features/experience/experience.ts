import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownComponent } from 'ngx-markdown';
import { AuthService } from '../../services/auth.service';
import { ExperienceFormComponent } from './components/experience-form/experience-form';
import { ExperienceService } from './experience.service';

interface Experience {
  id: number;
  title: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string | null;
  created_at: string;
  user_id: string;
}

@Component({
  selector: 'app-experience',
  imports: [MarkdownComponent],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class ExperienceComponent {
  protected authService = inject(AuthService);
  private modalService = inject(NgbModal);
  private experienceService = inject(ExperienceService);
  protected experiences = this.experienceService.experiences;
  protected numYearsInBusiness = this.experienceService.numYearsInBussiness;

  ngOnInit() {
    this.experienceService.loadExperiences();
  }

  deleteExperience(id: number) {
    if (confirm('Are you sure you want to delete this experience?')) {
      this.experienceService.deleteExperience(id).subscribe({
        next: () => {
          console.log('Experience deleted');
          this.experienceService.loadExperiences();
        },
        error: (error) => {
          console.error('Failed to delete experience:', error);
        },
      });
    }
  }

  openNewExperienceModal() {
    const modalRef = this.modalService.open(ExperienceFormComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.result.then(
      (result) => {
        console.log('Experience created:', result);
        this.experienceService.loadExperiences();
      },
      (reason) => {
        console.log('Modal dismissed');
      }
    );
  }

  openEditExperienceModal(experience: Experience) {
    const modalRef = this.modalService.open(ExperienceFormComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.experience = experience;

    modalRef.result.then(
      (result) => {
        console.log('Experience updated:', result);
        this.experienceService.loadExperiences();
      },
      (reason) => {
        console.log('Modal dismissed');
      }
    );
  }

  formatDateRange(start: string, end: string | null): string {
    const startYear = new Date(start).getFullYear();
    const endYear = end ? new Date(end).getFullYear() : 'Present';
    return `${startYear} - ${endYear}`;
  }
}
