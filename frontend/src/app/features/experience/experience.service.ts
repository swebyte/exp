import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Experience {
  id: number;
  title: string;
  company: string;
  description: string;
  start_date: string;
  end_date: string | null;
  type?: string;
  created_at: string;
  user_id: string;
}

export const ExpericeType_Default = 'Default';
export const ExpericeType_LifeEvent = 'LifeEvent';

@Injectable({
  providedIn: 'root',
})
export class ExperienceService {
  private http = inject(HttpClient);
  private _experiences = signal<Experience[]>([]);

  readonly experiences = computed(() => this._experiences());

  readonly numYearsInBussiness = computed(() => {
    const totalYears = this._experiences().reduce((sum, exp) => {
      const start = new Date(exp.start_date);
      const end = exp.end_date ? new Date(exp.end_date) : new Date();
      if (isNaN(start.getTime()) || isNaN(end.getTime())) return sum;
      const years = (end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
      return sum + years;
    }, 0);
    return Math.round(totalYears);
  });

  loadExperiences() {
    this.http
      .get<Experience[]>(`${environment.apiBaseUrl}/experience?order=start_date.desc`)
      .pipe(map((data) => data || []))
      .subscribe({
        next: (data) =>
          this._experiences.set([
            ...data,
            // {
            //   id: 0,
            //   title: 'I was born.',
            //   company: '',
            //   description: '',
            //   start_date: '1994-01-01T00:00:00.000Z',
            //   end_date: null,
            //   created_at: new Date().toISOString(),
            //   user_id: '',
            //   type: ExpericeType_LifeEvent,
            // },
          ]),
        error: (err) => {
          console.error('Failed to load experiences:', err);
          this._experiences.set([]);
        },
      });
  }

  deleteExperience(id: number) {
    return this.http.delete<void>(`${environment.apiBaseUrl}/experience?id=eq.${id}`);
  }
}
