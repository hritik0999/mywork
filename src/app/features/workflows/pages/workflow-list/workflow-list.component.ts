import { Component, inject, OnInit, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { WorkflowTableComponent } from '../../components/workflow-table/workflow-table.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import * as fromStore from '../../store';
import { Workflow, WorkflowStatus } from '../../../../core/models';
import { MOCK_USERS } from '../../../../core/data/mock-users';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-workflow-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    WorkflowTableComponent,
    PaginationComponent,
    LoadingSpinnerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toolbar">
      <input
        type="search"
        placeholder="Search workflows..."
        [ngModel]="searchInput()"
        (ngModelChange)="onSearch($event)"
        aria-label="Search workflows"
      />
      <select [ngModel]="filterStatus()" (ngModelChange)="onStatusFilter($event)" aria-label="Filter by status">
        <option value="">All statuses</option>
        @for (s of statuses; track s) {
          <option [value]="s">{{ s }}</option>
        }
      </select>
      <select [ngModel]="filterUser()" (ngModelChange)="onUserFilter($event)" aria-label="Filter by assignee">
        <option value="">All assignees</option>
        @for (u of users; track u.id) {
          <option [value]="u.id">{{ u.name }}</option>
        }
      </select>
      <label for="dateFrom">From</label>
      <input id="dateFrom" type="date" [ngModel]="dateFrom()" (ngModelChange)="onDateFrom($event)" />
      <label for="dateTo">To</label>
      <input id="dateTo" type="date" [ngModel]="dateTo()" (ngModelChange)="onDateTo($event)" />
      @if (canCreate()) {
          <button type="button" (click)="createNew()">New Workflow</button>
        }
    </div>
    @if (loading()) {
      <app-loading-spinner />
    } @else {
      <app-workflow-table
        [workflows]="workflows()"
        [showEdit]="canEdit()"
        [showDelete]="canDelete()"
        [showApprove]="canApprove()"
        (edit)="edit($event)"
        (delete)="delete($event)"
        (approve)="approve($event)"
        (reject)="reject($event)"
      />
      <app-pagination
        [currentPage]="filters().page ?? 1"
        [totalPages]="totalPages()"
        (pageChange)="goToPage($event)"
      />
    }
  `,
  styles: [`
    .toolbar { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem; align-items: center; }
    .toolbar input, .toolbar select { padding: 0.5rem; }
  `],
})
export class WorkflowListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private searchSubject = new Subject<string>();

  users = MOCK_USERS;
  statuses: WorkflowStatus[] = ['Draft', 'In Review', 'Approved', 'Rejected'];

  workflows = this.store.selectSignal(fromStore.selectAllWorkflows);
  loading = this.store.selectSignal(fromStore.selectWorkflowsLoading);
  filters = this.store.selectSignal(fromStore.selectWorkflowFilters);
  totalPages = this.store.selectSignal(fromStore.selectWorkflowTotalPages);
  searchInput = computed(() => this.filters().search ?? '');
  filterStatus = computed(() => this.filters().status ?? '');
  filterUser = computed(() => this.filters().assignedUserId ?? '');
  dateFrom = computed(() => this.filters().dateFrom ?? '');
  dateTo = computed(() => this.filters().dateTo ?? '');

  canCreate = computed(() => this.auth.hasRole(['admin', 'user']));
  canDelete = computed(() => this.auth.hasRole(['admin']));
  canEdit = computed(() => this.auth.hasRole(['admin']));
  canApprove = computed(() => this.auth.hasRole(['admin', 'manager']));

  ngOnInit(): void {
    this.store.dispatch(fromStore.loadWorkflows({ filters: { page: 1, pageSize: 10 } }));
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((search) => {
        const next = { ...this.filters(), search: search || undefined, page: 1 };
        this.store.dispatch(fromStore.setFilters({ filters: next }));
        this.store.dispatch(fromStore.loadWorkflows({ filters: next }));
      });
  }

  onSearch(value: string): void {
    this.searchSubject.next(value);
  }

  onStatusFilter(status: string): void {
    const next = { ...this.filters(), status: (status || undefined) as WorkflowStatus | undefined, page: 1 };
    this.store.dispatch(fromStore.setFilters({ filters: next }));
    this.store.dispatch(fromStore.loadWorkflows({ filters: next }));
  }

  onUserFilter(userId: string): void {
    const next = { ...this.filters(), assignedUserId: userId || undefined, page: 1 };
    this.store.dispatch(fromStore.setFilters({ filters: next }));
    this.store.dispatch(fromStore.loadWorkflows({ filters: next }));
  }

  onDateFrom(value: string): void {
    const next = { ...this.filters(), dateFrom: value || undefined, page: 1 };
    this.store.dispatch(fromStore.setFilters({ filters: next }));
    this.store.dispatch(fromStore.loadWorkflows({ filters: next }));
  }

  onDateTo(value: string): void {
    const next = { ...this.filters(), dateTo: value || undefined, page: 1 };
    this.store.dispatch(fromStore.setFilters({ filters: next }));
    this.store.dispatch(fromStore.loadWorkflows({ filters: next }));
  }

  goToPage(page: number): void {
    const next = { ...this.filters(), page };
    this.store.dispatch(fromStore.setFilters({ filters: next }));
    this.store.dispatch(fromStore.loadWorkflows({ filters: next }));
  }

  createNew(): void {
    this.router.navigate(['/workflows/create']);
  }

  edit(w: Workflow): void {
    this.router.navigate(['/workflows/edit', w.id]);
  }

  delete(w: Workflow): void {
    if (this.canDelete() && confirm(`Delete "${w.name}"?`)) {
      this.store.dispatch(fromStore.deleteWorkflow({ id: w.id }));
    }
  }

  approve(w: Workflow): void {
    if (this.canApprove()) {
      this.store.dispatch(fromStore.updateWorkflow({ id: w.id, workflow: { status: 'Approved' } }));
    }
  }

  reject(w: Workflow): void {
    if (this.canApprove()) {
      this.store.dispatch(fromStore.updateWorkflow({ id: w.id, workflow: { status: 'Rejected' } }));
    }
  }
}
