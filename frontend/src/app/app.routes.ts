import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/about/about').then((m) => m.AboutComponent) },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about').then((m) => m.AboutComponent),
  },
  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog').then((m) => m.BlogComponent),
  },
  {
    path: 'blog/:id',
    loadComponent: () =>
      import('./features/blog-detail/blog-detail').then((m) => m.BlogDetailComponent),
  },
  {
    path: 'experience',
    loadComponent: () =>
      import('./features/experience/experience').then((m) => m.ExperienceComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile').then((m) => m.ProfileComponent),
  },
];
