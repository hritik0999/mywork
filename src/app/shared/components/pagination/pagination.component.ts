import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    <nav role="navigation" aria-label="Pagination" class="pagination">
      <button
        type="button"
        class="btn-page"
        [disabled]="currentPage <= 1"
        (click)="goTo(currentPage - 1)"
        aria-label="Previous page"
      >
        Previous
      </button>
      <span class="page-info" aria-live="polite">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        type="button"
        class="btn-page"
        [disabled]="currentPage >= totalPages"
        (click)="goTo(currentPage + 1)"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  `,
  styles: [`
    .pagination { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
    .btn-page { padding: 0.5rem 1rem; cursor: pointer; }
    .btn-page:disabled { opacity: 0.5; cursor: not-allowed; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Output() pageChange = new EventEmitter<number>();

  goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages) this.pageChange.emit(page);
  }
}
