import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { Workflow, WorkflowFilters, PaginatedWorkflows } from '../models';

export interface WorkflowBackend {
  getWorkflows(filters: WorkflowFilters): Observable<PaginatedWorkflows>;
  getWorkflowById(id: string): Observable<Workflow | null>;
  createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Observable<Workflow>;
  updateWorkflow(id: string, workflow: Partial<Workflow>): Observable<Workflow>;
  deleteWorkflow(id: string): Observable<void>;
  checkNameUnique(name: string, excludeId?: string): Observable<boolean>;
}

export const WORKFLOW_BACKEND = new InjectionToken<WorkflowBackend>('WorkflowBackend');
