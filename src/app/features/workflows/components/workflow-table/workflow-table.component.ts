
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Workflow } from '../../../../core/models';

@Component({
  selector: 'app-workflow-table',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="wf-table" role="grid">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Priority</th>
          <th scope="col">Status</th>
          <th scope="col">Due Date</th>
          @if (showEdit || showApprove || showDelete) {
            <th scope="col">Actions</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (workflow of workflows; track workflow.id) {
          <tr>
            <td>{{ workflow.name }}</td>
            <td><span class="badge priority-{{ workflow.priority | lowercase }}">{{ workflow.priority }}</span></td>
            <td><span class="badge" [ngClass]="'status-' + statusClass(workflow.status)">{{ workflow.status }}</span></td>
            <td>{{ workflow.dueDate }}</td>
            <td>
              @if (showEdit) {
                <button type="button" (click)="edit.emit(workflow)" [attr.aria-label]="'Edit ' + workflow.name">Edit</button>
              }
              @if (showApprove && workflow.status === 'In Review') {
                <button type="button" (click)="approve.emit(workflow)" [attr.aria-label]="'Approve ' + workflow.name">Approve</button>
                <button type="button" (click)="reject.emit(workflow)" [attr.aria-label]="'Reject ' + workflow.name">Reject</button>
              }
              @if (showDelete) {
                <button type="button" (click)="delete.emit(workflow)" [attr.aria-label]="'Delete ' + workflow.name">Delete</button>
              }
            </td>
          </tr>
        } @empty {
          <tr><td colspan="5">No workflows found.</td></tr>
        }
      </tbody>
    </table>
  `,
  styles: [`
    .wf-table { width: 100%; border-collapse: collapse; }
    .wf-table th, .wf-table td { padding: 0.5rem; text-align: left; border-bottom: 1px solid var(--border-color); }
    .badge { padding: 0.25rem 0.5rem; border-radius: 4px; font-size: 0.875rem; }
    .priority-critical { background: #ffebee; color: #c62828; }
    .priority-high { background: #fff3e0; color: #e65100; }
    .priority-medium { background: #e3f2fd; color: #1565c0; }
    .priority-low { background: #e8f5e9; color: #2e7d32; }
    .status-approved { background: #e8f5e9; }
    .status-rejected { background: #ffebee; }
    .status-inreview { background: #fff8e1; }
    .status-draft { background: #eceff1; }
    .wf-table button { margin-right: 0.25rem; }
  `],
})
export class WorkflowTableComponent {
  @Input() workflows: Workflow[] = [];
  @Input() showEdit = false;
  @Input() showDelete = false;
  @Input() showApprove = false;
  @Output() edit = new EventEmitter<Workflow>();
  @Output() delete = new EventEmitter<Workflow>();
  @Output() approve = new EventEmitter<Workflow>();
  @Output() reject = new EventEmitter<Workflow>();

  ngOnChanges(): void {
    console.log(this.workflows)
  }

  trackByWorkflowId(_: number, w: Workflow): string {
    return w.id;
  }

  statusClass(status: string): string {
    return status?.toLowerCase().replace(/\s+/g, '') ?? '';
  }
}
