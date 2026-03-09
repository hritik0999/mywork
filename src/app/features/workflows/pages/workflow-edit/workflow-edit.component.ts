import { Component, inject, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { WorkflowFormComponent } from '../../components/workflow-form/workflow-form.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { MOCK_USERS } from '../../../../core/data/mock-users';
import * as fromStore from '../../store';
import { Workflow } from '../../../../core/models';

@Component({
  selector: 'app-workflow-edit',
  standalone: true,
  imports: [WorkflowFormComponent, LoadingSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>Edit Workflow</h2>
    @if (loading()) {
      <app-loading-spinner />
    } @else if (workflow()) {
      <app-workflow-form
        [workflow]="workflow()!"
        [users]="users"
        (save)="onSave($event)"
        (cancel)="onCancel()"
      />
    } @else {
      <p>Workflow not found.</p>
    }
  `,
})
export class WorkflowEditComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  users = MOCK_USERS;

  workflow = this.store.selectSignal(fromStore.selectSelectedWorkflow);
  loading = this.store.selectSignal(fromStore.selectWorkflowLoadingById);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.store.dispatch(fromStore.loadWorkflowById({ id }));
  }

  onSave(payload: Partial<Workflow>): void {
    const w = this.workflow();
    if (!w) return;
    this.store.dispatch(fromStore.updateWorkflow({
      id: w.id,
      workflow: {
        name: payload.name,
        priority: payload.priority,
        status: payload.status,
        assignedUserIds: payload.assignedUserIds,
        dueDate: payload.dueDate,
      },
    }));
    this.router.navigate(['/workflows']);
  }

  onCancel(): void {
    this.router.navigate(['/workflows']);
  }
}
