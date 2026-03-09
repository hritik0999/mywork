import { Component, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../../shared/components/chart/chart.component';
import { WorkflowApiService } from '../../core/services/workflow-api.service';
import { map, shareReplay } from 'rxjs/operators';
import { WorkflowStatus } from '../../core/models';

interface DashboardStats {
  totalByStatus: Record<string, number>;
  overdueCount: number;
  avgCompletionDays: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Dashboard</h1>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total by Status</h3>
        <div class="chart-container">
          <app-chart
            type="bar"
            [data]="chartDataByStatus()"
            ariaLabel="Workflows by status"
          />
        </div>
      </div>
      <div class="stat-card">
        <h3>Overdue Workflows</h3>
        <p class="big-number">{{ stats()?.overdueCount ?? 0 }}</p>
      </div>
      <div class="stat-card">
        <h3>Avg. Completion (days)</h3>
        <p class="big-number">{{ stats()?.avgCompletionDays ?? 0 }}</p>
      </div>
    </div>
    <div class="chart-row">
      <div class="stat-card">
        <h3>Status Distribution</h3>
        <div class="chart-container pie">
          <app-chart
            type="doughnut"
            [data]="chartDataPie()"
            ariaLabel="Status distribution"
          />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1rem; }
    .stat-card { background: var(--card-bg); padding: 1rem; border-radius: 8px; box-shadow: var(--shadow); }
    .chart-container { height: 200px; }
    .chart-container.pie { height: 260px; }
    .big-number { font-size: 2rem; font-weight: 700; margin: 0; }
  `],
})
export class DashboardComponent {
  private readonly api = inject(WorkflowApiService);
  private stats$ = this.api.getWorkflows({ pageSize: 100 }).pipe(
    map((res) => {
      const today = new Date().toISOString().slice(0, 10);
      let overdue = 0;
      let completedCount = 0;
      let totalDays = 0;
      const byStatus: Record<string, number> = {};
      const statuses: WorkflowStatus[] = ['Draft', 'In Review', 'Approved', 'Rejected'];
      statuses.forEach((s) => (byStatus[s] = 0));
      res.data.forEach((w) => {
        byStatus[w.status] = (byStatus[w.status] ?? 0) + 1;
        if (w.dueDate < today && w.status !== 'Approved' && w.status !== 'Rejected') overdue++;
        if (w.completedAt && w.createdAt) {
          completedCount++;
          const created = new Date(w.createdAt).getTime();
          const completed = new Date(w.completedAt).getTime();
          totalDays += (completed - created) / (1000 * 60 * 60 * 24);
        }
      });
      return {
        totalByStatus: byStatus,
        overdueCount: overdue,
        avgCompletionDays: completedCount ? Math.round(totalDays / completedCount) : 0,
      };
    }),
    shareReplay(1)
  );
  stats = toSignal(this.stats$, { requireSync: false });

  chartDataByStatus = computed(() => {
    const s = this.stats();
    if (!s?.totalByStatus) return { labels: [], datasets: [{ data: [], backgroundColor: [] }] };
    const labels = Object.keys(s.totalByStatus);
    const data = labels.map((l) => s.totalByStatus[l]);
    const colors = ['#1976d2', '#ffa726', '#66bb6a', '#ef5350'];
    return {
      labels,
      datasets: [{ data, backgroundColor: labels.map((_, i) => colors[i % colors.length]) }],
    };
  });

  chartDataPie = computed(() => {
    const s = this.stats();
    if (!s?.totalByStatus) return { labels: [], datasets: [{ data: [], backgroundColor: [] }] };
    const labels = Object.keys(s.totalByStatus);
    const data = labels.map((l) => s.totalByStatus[l]);
    const colors = ['#42a5f5', '#ffb74d', '#81c784', '#e57373'];
    return {
      labels,
      datasets: [{ data, backgroundColor: colors }],
    };
  });

}
