import { Component } from '@angular/core';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { Skill } from '../models/skill';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [NgbRatingModule],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.css'
})

// <h3>Snabblista på erfarenheter inom Programmering/IT</h3>
// .NET <ngb-rating [rate]="5" [max]="5" [readonly]="true"  /> <br>, .NET ASP REST, C#, C++, 
// Nvidia PhysX, Nvidia Flex, Python, WPF,  DirectX 11, Node.js, Lua, HTML, CSS, SCSS, Angular, 
// Blazor Server-side, .NET MAUI, gRPC, MySQL, PostgreSQL, Microsoft SQL, Clean Architecture, SOLID,
//  Unit Testing, Javascript, Typescript, Microsoft Azure, Azure DevOps, IT drift & administration, 
//  Jira Administrator, Atlassian Bamboo, OpenSearch, Microsoft 365, Plastic SCM, Git, GitKraken, Linux, 
//  Windows Server, Docker, 
// <h3>Utbildning</h3>
// Playground Squad, 3D Programmering, Falun, 2013-2015
// Yrkesförberedande utbildning inom spelutveckling/3D
// NTI Gymnasiet, Falun - Inriktning El/Programmering,  2010 - 2013
// .NET/C++/Databaser

export class SkillsComponent {

  skills: Skill[] = [
    {name: "c++", rate: 5},
    {name: "c#", rate: 5},
    {name: "Python", rate: 5},
    {name: "LUA", rate: 4},
    {name: ".NET", rate: 5},
    {name: "Angular", rate: 5},
    {name: "Typescript", rate: 5},
    {name: "PostgreSQL", rate: 5},
    {name: "Blazor", rate: 4},
    {name: "Git", rate: 4},
    {name: "Unit Testing", rate: 4},
    {name: "Creating bugs", rate: 0},

  ]

  constructor() {

  }
}
