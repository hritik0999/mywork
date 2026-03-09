import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { WorkflowFormComponent } from '../../components/workflow-form/workflow-form.component';
import { MOCK_USERS } from '../../../../core/data/mock-users';
import * as fromStore from '../../store';
import { Workflow } from '../../../../core/models';

@Component({
  selector: 'app-workflow-create',
  standalone: true,
  imports: [WorkflowFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Create Workflow</h2>
    <app-workflow-form
      [users]="users"
      (save)="onSave($event)"
      (cancel)="onCancel()"
    />
  `,
})
export class WorkflowCreateComponent {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  users = MOCK_USERS;

  onSave(payload: Partial<Workflow>): void {
    const w = {
      name: payload.name!,
      priority: payload.priority!,
      status: payload.status!,
      assignedUserIds: payload.assignedUserIds ?? [],
      dueDate: payload.dueDate!,
    };
    this.store.dispatch(fromStore.createWorkflow({ workflow: w }));
    this.router.navigate(['/workflows']);
  }

  onCancel(): void {
    this.router.navigate(['/workflows']);
  }
}
