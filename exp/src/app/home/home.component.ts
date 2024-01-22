import { Component } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollAnimationDirective } from '../directives/scrollanimationdirective';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgbRatingModule, ScrollAnimationDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
	rating = 8;

  
  ngOnInit()
  {

  }

}
