import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';

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

@Component({
  selector: 'experience-card',
  standalone: true,
  imports: [CommonModule, MarkdownComponent],
  templateUrl: './experience-card.html',
  styleUrls: ['./experience-card.scss'],
})
export class ExperienceCardComponent {
  @Input() experience!: Experience;
  @Input() isLifeEvent = false;
}
