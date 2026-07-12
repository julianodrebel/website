import { Routes } from '@angular/router'

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'resume',
    loadComponent: () =>
      import('./features/resume/resume.component').then((m) => m.ResumeComponent),
  },
  {
    path: 'projects',
    loadComponent: () =>
      import('./features/projects/projects.component').then((m) => m.ProjectsComponent),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./features/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '/404',
  },
]
