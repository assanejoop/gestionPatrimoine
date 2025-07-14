import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ArcElement, Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

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
    imports: [CommonModule, RouterModule],
    templateUrl: './documents-archivage.component.html',
    styleUrls: ['./documents-archivage.component.css']
})
export class DocumentsArchivageComponent implements OnInit, AfterViewInit, OnDestroy {
  
  // ViewChild déclarations corrigées
  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart', { static: false }) pieChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('donutChart', { static: false }) donutChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('groupedBarChart', { static: false }) groupedBarChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineChart', { static: false }) lineChartCanvas!: ElementRef<HTMLCanvasElement>;

  // Stockage des graphiques
  private charts: Chart[] = [];
  private barChart: Chart | null = null;

  isOpen = false;
  
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

  selectedPeriod: string = 'Mensuel';
  isDropdownOpen: boolean = false;
  periods: string[] = ['Mensuel', 'Hebdomadaire', 'Annuel'];

  public occupiedPercentage: number = 80;
  public vacantPercentage: number = 20;

  // Données du graphique
  chartData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avril'],
    datasets: [{
      data: [39, 45, 59, 15],
      backgroundColor: '#4F96FF',
      borderColor: '#4F96FF',
      borderWidth: 0,
      borderRadius: 0,
      borderSkipped: false,
    }]
  };

  constructor() {}

  ngOnInit(): void {
    console.log('Composant initialisé');
  }

  ngAfterViewInit(): void {
    // Augmenter le délai pour être sûr que les éléments sont rendus
    setTimeout(() => {
      this.initializeAllCharts();
    }, 200);
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
    if (this.barChart) {
      this.barChart.destroy();
    }
  }

  private initializeAllCharts(): void {
    console.log('Initialisation des graphiques...');
    
    // Vérifier et créer chaque graphique
    this.createBarChart();
    this.createPieChart();
    this.createDonutChart();
    this.createGroupedBarChart();
    
    console.log('Tous les graphiques initialisés');
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  exportToPDF() {
    console.log('Export en PDF...');
    this.closeDropdown();
  }

  exportToExcel() {
    console.log('Export en Excel...');
    this.closeDropdown();
  }

  createBarChart(): void {
    if (!this.chartCanvas?.nativeElement) {
      console.error('Canvas pour le graphique en barres non trouvé');
      return;
    }

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Impossible d\'obtenir le contexte 2D');
      return;
    }

    // Détruire le graphique existant s'il y en a un
    if (this.barChart) {
      this.barChart.destroy();
    }

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: this.chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: 'white',
            bodyColor: 'white',
            borderColor: 'rgba(0, 0, 0, 0.8)',
            borderWidth: 1,
            cornerRadius: 4,
            displayColors: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            },
            ticks: {
              color: '#9CA3AF',
              font: {
                size: 14,
                weight: 'normal'
              },
              padding: 10
            }
          },
          y: {
            beginAtZero: true,
            max: 70,
            grid: {
              color: '#F3F4F6',
              lineWidth: 1
            },
            border: {
              display: false
            },
            ticks: {
              color: '#9CA3AF',
              font: {
                size: 14,
                weight: 'normal'
              },
              stepSize: 10,
              padding: 15,
              callback: function(value) {
                return value.toString();
              }
            }
          }
        },
        elements: {
          bar: {
            borderWidth: 0
          }
        },
        layout: {
          padding: {
            top: 20,
            bottom: 10,
            left: 10,
            right: 20
          }
        }
      }
    };

    this.barChart = new Chart(ctx, config);
    console.log('Graphique en barres créé avec succès');
  }

  togglesDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onPeriod(period: string): void {
    this.selectedPeriod = period;
    this.isDropdownOpen = false;
    this.updateChartData(period);
  }

  private updateChartData(period: string): void {
    let newData;
    let newLabels;

    switch (period) {
      case 'Hebdomadaire':
        newLabels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
        newData = [25, 35, 42, 28];
        break;
      case 'Annuel':
        newLabels = ['2021', '2022', '2023', '2024'];
        newData = [180, 220, 195, 240];
        break;
      default:
        newLabels = ['Jan', 'Fév', 'Mar', 'Avril'];
        newData = [39, 45, 59, 15];
        break;
    }

    if (this.barChart) {
      this.barChart.data.labels = newLabels;
      this.barChart.data.datasets[0].data = newData;
      this.barChart.update();
    }
  }

  onClickOutside(): void {
    this.isDropdownOpen = false;
  }

  private createPieChart(): void {
    if (!this.pieChartCanvas?.nativeElement) {
      console.error('Canvas pour le graphique en secteurs non trouvé');
      return;
    }

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
    console.log('Graphique en secteurs créé avec succès');
  }

  private createDonutChart(): void {
    if (!this.donutChartCanvas?.nativeElement) {
      console.error('Canvas pour le graphique donut non trouvé');
      return;
    }
    
    const ctx = this.donutChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: ['Bâtiments occupés', 'Bâtiments vacants'],
        datasets: [{
          data: [this.occupiedPercentage, this.vacantPercentage],
          backgroundColor: [
            '#096BFF',
            '#95A4FC'
          ],
          borderWidth: 0,
          hoverBackgroundColor: [
            '#2563eb',
            '#8b5cf6'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'white',
            titleColor: '#374151',
            bodyColor: '#374151',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                return `${label}: ${value}%`;
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutCubic'
        }
      }
    };

    const chart = new Chart(ctx, config);
    this.charts.push(chart);
    console.log('Graphique donut créé avec succès');
  }

  private createGroupedBarChart(): void {
    if (!this.groupedBarChartCanvas?.nativeElement) {
      console.error('Canvas pour le graphique en barres groupées non trouvé');
      return;
    }

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
    console.log('Graphique en barres groupées créé avec succès');
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