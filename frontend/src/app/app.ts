import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, NgScrollbarModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('frontend');
}
