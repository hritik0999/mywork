import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  SimpleChanges,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-chart',
  standalone: true,
  template: `<canvas #canvas role="img" [attr.aria-label]="ariaLabel"></canvas>`,
  styles: [`:host { display: block; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnChanges, OnDestroy, AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() type: 'bar' | 'line' | 'pie' | 'doughnut' = 'bar';
  @Input() data!: ChartConfiguration['data'];
  @Input() options: ChartConfiguration['options'] = {};
  @Input() ariaLabel = 'Chart';

  private chart: Chart | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['type'] || changes['options']) {
      this.updateChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
    this.chart = null;
  }

  private updateChart(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas || !this.data) return;

    this.chart?.destroy();
    this.chart = new Chart(canvas, {
      type: this.type,
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        ...this.options,
      },
    });
  }

  ngAfterViewInit(): void {
    if (this.data) this.updateChart();
  }
}
