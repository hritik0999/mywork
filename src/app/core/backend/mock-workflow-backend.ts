import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Workflow, WorkflowFilters, PaginatedWorkflows } from '../models';
import { WorkflowBackend } from './workflow-backend';

const MOCK_WORKFLOWS: Workflow[] = [
  {
    id: '1',
    name: 'Q1 Budget Approval',
    priority: 'High',
    status: 'Approved',
    assignedUserIds: ['u1', 'u2'],
    dueDate: '2025-02-15',
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-02-01T00:00:00Z',
    completedAt: '2025-02-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Security Audit',
    priority: 'Critical',
    status: 'In Review',
    assignedUserIds: ['u1'],
    dueDate: '2025-03-20',
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-03-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Onboarding Process',
    priority: 'Medium',
    status: 'Draft',
    assignedUserIds: [],
    dueDate: '2025-04-01',
    createdAt: '2025-03-01T00:00:00Z',
    updatedAt: '2025-03-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Vendor Contract Renewal',
    priority: 'High',
    status: 'Rejected',
    assignedUserIds: ['u2'],
    dueDate: '2025-02-28',
    createdAt: '2025-01-20T00:00:00Z',
    updatedAt: '2025-02-15T00:00:00Z',
  },
  {
    id: '5',
    name: 'API Migration',
    priority: 'Critical',
    status: 'In Review',
    assignedUserIds: ['u1', 'u2'],
    dueDate: '2025-03-10',
    createdAt: '2025-02-10T00:00:00Z',
    updatedAt: '2025-03-05T00:00:00Z',
  },
];

@Injectable()
export class MockWorkflowBackend implements WorkflowBackend {
  private workflows: Workflow[] = [...MOCK_WORKFLOWS];

  getWorkflows(filters: WorkflowFilters = {}): Observable<PaginatedWorkflows> {
    return of(this.filterAndPage(filters)).pipe(delay(300));
  }

  getWorkflowById(id: string): Observable<Workflow | null> {
    const w = this.workflows.find(x => x.id === id) ?? null;
    return of(w).pipe(delay(100));
  }

  createWorkflow(w: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Observable<Workflow> {
    const now = new Date().toISOString();
    const newWorkflow: Workflow = {
      ...w,
      id: `id-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    this.workflows = [...this.workflows, newWorkflow];
    return of(newWorkflow).pipe(delay(200));
  }

  updateWorkflow(id: string, partial: Partial<Workflow>): Observable<Workflow> {
    const idx = this.workflows.findIndex(x => x.id === id);
    if (idx === -1) return of(null as unknown as Workflow).pipe(delay(200));
    const updated: Workflow = {
      ...this.workflows[idx],
      ...partial,
      updatedAt: new Date().toISOString(),
      completedAt: partial.status === 'Approved' || partial.status === 'Rejected'
        ? new Date().toISOString()
        : this.workflows[idx].completedAt,
    };
    this.workflows = this.workflows.map((w, i) => (i === idx ? updated : w));
    return of(updated).pipe(delay(200));
  }

  deleteWorkflow(id: string): Observable<void> {
    this.workflows = this.workflows.filter(w => w.id !== id);
    return of(undefined).pipe(delay(200));
  }

  checkNameUnique(name: string, excludeId?: string): Observable<boolean> {
    const exists = this.workflows.some(
      w => w.name.toLowerCase() === name.trim().toLowerCase() && w.id !== excludeId
    );
    return of(!exists).pipe(delay(400));
  }

  private filterAndPage(f: WorkflowFilters): PaginatedWorkflows {
    let list = [...this.workflows];
    if (f.status) list = list.filter(w => w.status === f.status);
    if (f.dateFrom) list = list.filter(w => w.dueDate >= f.dateFrom!);
    if (f.dateTo) list = list.filter(w => w.dueDate <= f.dateTo!);
    if (f.assignedUserId) list = list.filter(w => w.assignedUserIds.includes(f.assignedUserId!));
    if (f.search?.trim()) {
      const q = f.search.trim().toLowerCase();
      list = list.filter(w => w.name.toLowerCase().includes(q));
    }
    const total = list.length;
    const page = Math.max(1, f.page ?? 1);
    const pageSize = Math.min(50, Math.max(1, f.pageSize ?? 10));
    const start = (page - 1) * pageSize;
    const data = list.slice(start, start + pageSize);
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  }
}
