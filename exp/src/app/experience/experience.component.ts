import { Component } from '@angular/core';
import { ScrollAnimationDirective } from '../directives/scrollanimationdirective';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [ScrollAnimationDirective],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent {

}
