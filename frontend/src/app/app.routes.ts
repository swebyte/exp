import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./about/about').then((m) => m.AboutComponent),
    pathMatch: 'full',
  },
  {
    path: 'blog',
    loadComponent: () => import('./blog/blog').then((m) => m.BlogComponent),
  },
  { path: 'blog/', redirectTo: 'blog', pathMatch: 'full' },
  {
    path: 'blog/:id',
    loadComponent: () => import('./blog-detail/blog-detail').then((m) => m.BlogDetailComponent),
  },
  {
    path: 'experience',
    loadComponent: () => import('./experience/experience').then((m) => m.ExperienceComponent),
  },
  { path: 'experience/', redirectTo: 'experience', pathMatch: 'full' },
  {
    path: 'about',
    loadComponent: () => import('./about/about').then((m) => m.AboutComponent),
  },
  { path: 'about/', redirectTo: 'about', pathMatch: 'full' },
];
