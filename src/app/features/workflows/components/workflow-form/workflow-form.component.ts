import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Workflow, WorkflowStatus, WorkflowPriority } from '../../../../core/models';
import { dueDateNotPastValidator } from '../../validators/workflow.validators';
import { workflowNameUniqueValidator } from '../../validators/workflow-async.validators';
import { WorkflowApiService } from '../../../../core/services/workflow-api.service';

@Component({
  selector: 'app-workflow-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" class="workflow-form">
      <label for="wf-name">Name</label>
      <input id="wf-name" type="text" formControlName="name" />
      @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
        <span class="error">Name is required</span>
      }
      @if (form.get('name')?.hasError('nameNotUnique')) {
        <span class="error">This workflow name already exists</span>
      }

      <label for="wf-priority">Priority</label>
      <select id="wf-priority" formControlName="priority">
        @for (p of priorities; track p) {
          <option [value]="p">{{ p }}</option>
        }
      </select>

      <label for="wf-status">Status</label>
      <select id="wf-status" formControlName="status">
        @for (s of statuses; track s) {
          <option [value]="s">{{ s }}</option>
        }
      </select>

      <label for="wf-due">Due Date</label>
      <input id="wf-due" type="date" formControlName="dueDate" />
      @if (form.get('dueDate')?.hasError('dueDatePast')) {
        <span class="error">Due date cannot be in the past</span>
      }

      <label>Assigned Users</label>
      <div class="assignees">
        @for (u of users; track u.id) {
          <label class="checkbox">
            <input type="checkbox" [value]="u.id" (change)="toggleAssignee(u.id, $event)" [checked]="isSelected(u.id)" />
            {{ u.name }}
          </label>
        }
      </div>

      <div class="actions">
        <button type="submit" [disabled]="form.invalid">Save</button>
        <button type="button" (click)="cancel.emit()">Cancel</button>
      </div>
    </form>
  `,
  styles: [`
    .workflow-form { display: flex; flex-direction: column; gap: 0.75rem; max-width: 480px; }
    .workflow-form label { font-weight: 500; }
    .workflow-form input[type="text"], .workflow-form input[type="date"], .workflow-form select { padding: 0.5rem; border-radius: 6px; }
    .error { color: var(--error, #c62828); font-size: 0.875rem; }
    .assignees { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .checkbox { font-weight: normal; }
    .actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
  `],
})
export class WorkflowFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(WorkflowApiService);

  @Input() workflow: Workflow | null = null;
  @Input() users: { id: string; name: string }[] = [];
  @Output() save = new EventEmitter<Partial<Workflow>>();
  @Output() cancel = new EventEmitter<void>();

  priorities: WorkflowPriority[] = ['Low', 'Medium', 'High', 'Critical'];
  statuses: WorkflowStatus[] = ['Draft', 'In Review', 'Approved', 'Rejected'];

  assignedUserIds: string[] = [];

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    priority: ['Medium' as WorkflowPriority, Validators.required],
    status: ['Draft' as WorkflowStatus, Validators.required],
    dueDate: ['', [Validators.required, dueDateNotPastValidator()]],
  });

  ngOnInit(): void {
    this.assignedUserIds = [...(this.workflow?.assignedUserIds ?? [])];
    if (this.workflow) {
      this.form.patchValue({
        name: this.workflow.name,
        priority: this.workflow.priority,
        status: this.workflow.status,
        dueDate: this.workflow.dueDate,
      });
      this.form.get('name')?.setAsyncValidators(
        workflowNameUniqueValidator(this.api, this.workflow.id)
      );
    } else {
      this.form.get('name')?.setAsyncValidators(workflowNameUniqueValidator(this.api));
    }
  }

  isSelected(userId: string): boolean {
    return this.assignedUserIds.includes(userId);
  }

  toggleAssignee(userId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) this.assignedUserIds = [...this.assignedUserIds, userId];
    else this.assignedUserIds = this.assignedUserIds.filter((id) => id !== userId);
  }

  submit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    this.save.emit({
      ...value,
      assignedUserIds: this.assignedUserIds,
    } as Partial<Workflow>);
  }
}
