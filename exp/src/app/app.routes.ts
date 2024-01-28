import { Routes } from '@angular/router';
import { ExperienceComponent } from './experience/experience.component';
import { AboutMeComponent } from './about-me/about-me.component';

export const routes: Routes = [
    { path: '', redirectTo: '/experience', pathMatch: 'full' },
    { path: 'experience', component: ExperienceComponent },
    { path: 'aboutme', component: AboutMeComponent },
];
