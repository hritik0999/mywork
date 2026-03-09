import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const WORKFLOWS_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./pages/workflow-list/workflow-list.component').then(m => m.WorkflowListComponent) },
  {
    path: 'create',
    canActivate: [roleGuard(['admin', 'user'])],
    loadComponent: () => import('./pages/workflow-create/workflow-create.component').then(m => m.WorkflowCreateComponent),
  },
  {
    path: 'edit/:id',
    canActivate: [roleGuard(['admin'])],
    loadComponent: () => import('./pages/workflow-edit/workflow-edit.component').then(m => m.WorkflowEditComponent),
  },
];
