import { Component } from '@angular/core';
import { ScrollAnimationDirective } from '../directives/scrollanimationdirective';
import { SkillsComponent } from '../skills/skills.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ExperienceComponent } from '../experience/experience.component';
import { AboutMeComponent } from '../about-me/about-me.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgbNavModule,
    SkillsComponent, 
    AboutMeComponent,
    ExperienceComponent, 
    RouterOutlet,
    RouterModule
    ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
	rating = 8;
  activeNavMenu = 1;
  
  ngOnInit()
  {

  }

}
