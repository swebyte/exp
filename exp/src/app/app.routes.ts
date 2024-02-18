import { Routes } from '@angular/router';
import { ExperienceComponent } from './experience/experience.component';
import { AboutMeComponent } from './about-me/about-me.component';
import { MethodsComponent } from './methods/methods.component';

export const routes: Routes = [
    { path: '', redirectTo: '/aboutme', pathMatch: 'full' },
    { path: 'aboutme', component: AboutMeComponent },
    { path: 'experience', component: ExperienceComponent },
    { path: 'methods', component: MethodsComponent },
];
