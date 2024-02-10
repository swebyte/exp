import { Component } from '@angular/core';
import { SkillsComponent } from '../skills/skills.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ExperienceComponent } from '../experience/experience.component';
import { AboutMeComponent } from '../about-me/about-me.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgbNavModule,
    AboutMeComponent,
    ExperienceComponent, 
    RouterOutlet,
    RouterModule,
    NavbarComponent
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
