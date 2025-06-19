import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

interface DocumentStats {
  associatedDocuments: number;
  archivedDocuments: number;
  expiredDocuments: number;
}

interface MonthlyData {
  month: string;
  count: number;
}

interface DocumentTypeData {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

interface BuildingVersionData {
  building: string;
  v1: number;
  v2: number;
}

interface UpdateRate {
  updated: number;
  missing: number;
  updatedPercentage: number;
  missingPercentage: number;
}

interface ExecutionDelay {
  week: string;
  days: number;
}

@Component({
  selector: 'app-documents-archivage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './documents-archivage.component.html',
  styleUrls: ['./documents-archivage.component.css']
})
export class DocumentsArchivageComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild('barChart', { static: false }) barChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart', { static: false }) pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('donutChart', { static: false }) donutChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('groupedBarChart', { static: false }) groupedBarChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart', { static: false }) lineChartCanvas!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];

  // Données principales
  documentStats: DocumentStats = {
    associatedDocuments: 1248,
    archivedDocuments: 127,
    expiredDocuments: 12
  };

  monthlyData: MonthlyData[] = [
    { month: 'Jan', count: 40 },
    { month: 'Fév', count: 45 },
    { month: 'Mar', count: 60 },
    { month: 'Avr', count: 15 }
  ];

  documentTypes: DocumentTypeData[] = [
    { type: 'Contrats', count: 562, percentage: 45, color: '#3b82f6' },
    { type: 'Photos', count: 374, percentage: 30, color: '#f59e0b' },
    { type: 'Plans', count: 187, percentage: 15, color: '#10b981' },
    { type: 'PV', count: 94, percentage: 7.5, color: '#ec4899' },
    { type: 'Autres', count: 31, percentage: 2.5, color: '#9ca3af' }
  ];

  buildingVersions: BuildingVersionData[] = [
    { building: 'Bâtiment A', v1: 5, v2: 3.5 },
    { building: 'Bâtiment B', v1: 3.5, v2: 1.5 },
    { building: 'Bâtiment C', v1: 1, v2: 0 }
  ];

  updateRate: UpdateRate = {
    updated: 80,
    missing: 20,
    updatedPercentage: 80,
    missingPercentage: 20
  };

  executionDelays: ExecutionDelay[] = [
    { week: 'Semaine 1', days: 2.5 },
    { week: 'Semaine 2', days: 7.5 },
    { week: 'Semaine 3', days: 11.5 },
    { week: 'Semaine 4', days: 8 }
  ];

  selectedTimeframe: string = 'Mensuel';
  selectedWeeklyTimeframe: string = 'Semaine';
  renewalAlert: boolean = true;
  renewalCount: number = 4;

  constructor() {}

  ngOnInit(): void {
    console.log('Composant initialisé');
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createBarChart();
      this.createPieChart();
      this.createDonutChart();
      this.createGroupedBarChart();
      this.createLineChart();
    }, 100);
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }

  private createBarChart(): void {
    if (!this.barChartCanvas) return;

    const ctx = this.barChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.monthlyData.map(d => d.month),
        datasets: [{
          data: this.monthlyData.map(d => d.count),
          backgroundColor: '#3b82f6',
          borderRadius: 4,
          barThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            }
          },
          y: {
            display: false,
            beginAtZero: true,
            max: 70
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private createPieChart(): void {
    if (!this.pieChartCanvas) return;

    const ctx = this.pieChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: this.documentTypes.map(d => d.type),
        datasets: [{
          data: this.documentTypes.map(d => d.count),
          backgroundColor: this.documentTypes.map(d => d.color),
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private createDonutChart(): void {
    if (!this.donutChartCanvas) return;

    const ctx = this.donutChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['Document à jour', 'Document manquant'],
        datasets: [{
          data: [this.updateRate.updated, this.updateRate.missing],
          backgroundColor: ['#3b82f6', '#a5b4fc'],
          borderWidth: 0,
          // cutout: '65%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private createGroupedBarChart(): void {
    if (!this.groupedBarChartCanvas) return;

    const ctx = this.groupedBarChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.buildingVersions.map(d => d.building),
        datasets: [
          {
            label: 'V1',
            data: this.buildingVersions.map(d => d.v1),
            backgroundColor: '#3b82f6',
            borderRadius: 2,
            barThickness: 20
          },
          {
            label: 'V2',
            data: this.buildingVersions.map(d => d.v2),
            backgroundColor: '#10b981',
            borderRadius: 2,
            barThickness: 20
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            }
          },
          y: {
            display: false,
            beginAtZero: true,
            max: 6
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  private createLineChart(): void {
    if (!this.lineChartCanvas) return;

    const ctx = this.lineChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: this.executionDelays.map(d => d.week),
        datasets: [{
          data: this.executionDelays.map(d => d.days),
          borderColor: '#ef4444',
          backgroundColor: '#ef4444',
          borderWidth: 2,
          pointRadius: 4,
          pointBorderWidth: 0,
          fill: false,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: true,
              color: '#f3f4f6'
            },
            border: {
              display: false
            }
          },
          y: {
            display: false,
            beginAtZero: true,
            max: 15
          }
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
  }

  onPeriodChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    console.log('Période changée:', target.value);
  }

  onRegionChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    console.log('Région changée:', target.value);
  }

  onTimeframeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedTimeframe = target.value;
    console.log('Timeframe changé:', target.value);
  }

  onWeeklyTimeframeChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedWeeklyTimeframe = target.value;
    console.log('Weekly timeframe changé:', target.value);
  }

  exportData(): void {
    const data = {
      stats: this.documentStats,
      monthlyData: this.monthlyData,
      documentTypes: this.documentTypes,
      buildingVersions: this.buildingVersions,
      updateRate: this.updateRate,
      executionDelays: this.executionDelays
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'documents-archivage-data.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  dismissAlert(): void {
    this.renewalAlert = false;
  }

  formatNumber(num: number): string {
    return num.toLocaleString('fr-FR');
  }
}