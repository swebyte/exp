import { Routes } from '@angular/router';
import { BlogComponent } from './blog/blog';
import { BlogDetailComponent } from './blog-detail/blog-detail';
import { ExperienceComponent } from './experience/experience';
import { AboutComponent } from './about/about';

export const routes: Routes = [
  { path: '', redirectTo: '/about', pathMatch: 'full' },
  { path: 'blog', component: BlogComponent },
  { path: 'blog/:id', component: BlogDetailComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: 'about', component: AboutComponent },
];
