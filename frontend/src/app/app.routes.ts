import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/about/about').then((m) => m.AboutComponent),
    pathMatch: 'full',
  },
  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog').then((m) => m.BlogComponent),
  },
  { path: 'blog/', redirectTo: 'blog', pathMatch: 'full' },
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
  { path: 'experience/', redirectTo: 'experience', pathMatch: 'full' },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile').then((m) => m.ProfileComponent),
  },
  { path: 'profile/', redirectTo: 'profile', pathMatch: 'full' },
];
