import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Workflow, WorkflowFilters, PaginatedWorkflows } from '../models';
import { WORKFLOW_BACKEND } from '../backend/workflow-backend';
import { MockWorkflowBackend } from '../backend/mock-workflow-backend';

@Injectable({ providedIn: 'root' })
export class WorkflowApiService {
  private readonly backend = inject(WORKFLOW_BACKEND, { optional: true }) ?? inject(MockWorkflowBackend);

  getWorkflows(filters: WorkflowFilters = {}): Observable<PaginatedWorkflows> {
    return this.backend.getWorkflows(filters);
  }

  getWorkflowById(id: string): Observable<Workflow | null> {
    return this.backend.getWorkflowById(id);
  }

  createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Observable<Workflow> {
    return this.backend.createWorkflow(workflow);
  }

  updateWorkflow(id: string, workflow: Partial<Workflow>): Observable<Workflow> {
    return this.backend.updateWorkflow(id, workflow);
  }

  deleteWorkflow(id: string): Observable<void> {
    return this.backend.deleteWorkflow(id);
  }

  checkNameUnique(name: string, excludeId?: string): Observable<boolean> {
    return this.backend.checkNameUnique(name, excludeId);
  }
}
