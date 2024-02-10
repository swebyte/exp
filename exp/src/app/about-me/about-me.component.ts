import { Component } from '@angular/core';
import { SkillsComponent } from '../skills/skills.component';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [SkillsComponent],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.css'
})
export class AboutMeComponent {

}
