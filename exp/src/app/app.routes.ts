import { Routes } from '@angular/router';
import { ExperienceComponent } from './experience/experience.component';
import { AboutMeComponent } from './about-me/about-me.component';

export const routes: Routes = [
    { path: '', redirectTo: '/aboutme', pathMatch: 'full' },
    { path: 'aboutme', component: AboutMeComponent },
    { path: 'experience', component: ExperienceComponent },
];
