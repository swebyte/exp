import { Component, Input } from '@angular/core';
import { ExperienceDto } from '../models/experiencedto';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ScrollAnimationDirective } from '../directives/scrollanimationdirective';

@Component({
  selector: 'app-experience-article',
  standalone: true,
  imports: [ScrollAnimationDirective],
  templateUrl: './experience-article.component.html',
  styleUrl: './experience-article.component.css'
})
export class ExperienceArticleComponent {
  @Input({required: true}) experience!: ExperienceDto

  renderedHtml: SafeHtml;

  constructor(private sanitizer: DomSanitizer){
  
  }

  ngOnInit() {
    this.renderedHtml = this.sanitizer.bypassSecurityTrustHtml(this.experience.contentHtml);
  }

}
