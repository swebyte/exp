import { Component } from '@angular/core';
import { SkillsComponent } from '../skills/skills.component';
import { CanvasBoxComponent } from '../3d/canvas-box/canvas-box.component';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [SkillsComponent, CanvasBoxComponent],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.css'
})
export class AboutMeComponent {

}
