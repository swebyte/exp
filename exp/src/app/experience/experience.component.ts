import { Component } from '@angular/core';
import { ScrollAnimationDirective } from '../directives/scrollanimationdirective';
import { ExperienceDto } from '../models/experiencedto';
import { ExperienceArticleComponent } from '../experience-article/experience-article.component';
import { ExperienceService } from '../experience.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [ScrollAnimationDirective, ExperienceArticleComponent],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent {

  experiences: ExperienceDto[] = new Array<ExperienceDto>();

  constructor(private experienceService: ExperienceService){
  }

  ngOnInit(){
    this.experienceService.getExperiences().subscribe(
      (experiences: ExperienceDto[]) => {
        this.experiences = experiences;
      }
    );
  }

}
