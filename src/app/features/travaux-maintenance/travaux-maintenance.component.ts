import { Component, OnInit, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as Chart from 'chart.js';

// Enregistrement des composants Chart.js nécessaires
Chart.Chart.register(
  Chart.CategoryScale,
  Chart.LinearScale,
  Chart.BarElement,
  Chart.LineElement,
  Chart.PointElement,
  Chart.ArcElement,
  Chart.Title,
  Chart.Tooltip,
  Chart.Legend,
  Chart.DoughnutController,
  Chart.BarController,
  Chart.LineController
);

interface MaintenanceStats {
  plannedWorks: number;
  inProgress: number;
  completed: number;
  budgetConsumed: number;
  totalBudget: number;
  delayedWorks: number;
}

interface MonthlyWork {
  month: string;
  planned: number;
  inProgress: number;
  completed: number;
}

interface WorkTypeDistribution {
  type: string;
  percentage: number;
  color: string;
}

interface ExecutionDelay {
  month: string;
  days: number;
}

interface BuildingIncident {
  building: string;
  incidents: number;
}

interface SupplierIntervention {
  supplier: string;
  electricity: number;
  plumbing: number;
}

interface WorkTypeCost {
  type: string;
  cost: number;
}

@Component({
  selector: 'app-travaux-maintenance',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './travaux-maintenance.component.html'
})
export class TravauxMaintenanceComponent implements OnInit, AfterViewInit {
  
  @ViewChild('monthlyWorksChart') monthlyWorksChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('workTypeChart') workTypeChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('executionDelayChart') executionDelayChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('delayedWorksChart') delayedWorksChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('incidentsChart') incidentsChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('supplierChart') supplierChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('costChart') costChart!: ElementRef<HTMLCanvasElement>;

  private charts: Chart.Chart[] = [];

  // Statistiques principales
  stats = signal<MaintenanceStats>({
    plannedWorks: 24,
    inProgress: 14,
    completed: 38,
    budgetConsumed: 62,
    totalBudget: 425000000,
    delayedWorks: 40
  });

  // Données mensuelles des travaux
  monthlyWorks = signal<MonthlyWork[]>([
    { month: 'Fév', planned: 4, inProgress: 1, completed: 3 },
    { month: 'Mars', planned: 2, inProgress: 1, completed: 4 },
    { month: 'Avril', planned: 3, inProgress: 2, completed: 1 },
    { month: 'Mai', planned: 5, inProgress: 2, completed: 4 }
  ]);

  // Répartition par type de travaux
  workTypeDistribution = signal<WorkTypeDistribution[]>([
    { type: 'Électricité', percentage: 35, color: '#4F81FF' },
    { type: 'Plomberie', percentage: 25, color: '#4CAF50' },
    { type: 'BTP', percentage: 20, color: '#FFB84D' },
    { type: 'Nettoyage', percentage: 20, color: '#E8E8E8' }
  ]);

  // Délais d'exécution
  executionDelays = signal<ExecutionDelay[]>([
    { month: 'Jan', days: 15 },
    { month: 'Fév', days: 12 },
    { month: 'Mar', days: 20 },
    { month: 'Avril', days: 10 },
    { month: 'Mai', days: 14 }
  ]);

  // Incidents par bâtiment
  buildingIncidents = signal<BuildingIncident[]>([
    { building: 'Bâtiment A', incidents: 10 },
    { building: 'Bâtiment B', incidents: 7 },
    { building: 'Bâtiment C', incidents: 5 },
    { building: 'Bâtiment D', incidents: 8 }
  ]);

  // Interventions par fournisseur
  supplierInterventions = signal<SupplierIntervention[]>([
    { supplier: 'Fournisseur X', electricity: 8, plumbing: 7 },
    { supplier: 'Fournisseur Y', electricity: 7, plumbing: 10 },
    { supplier: 'Fournisseur Z', electricity: 7, plumbing: 2 },
    { supplier: 'Fournisseur N', electricity: 1, plumbing: 2 }
  ]);

  // Coût moyen par type
  workTypeCosts = signal<WorkTypeCost[]>([
    { type: 'Électricité', cost: 1200 },
    { type: 'Plomberie', cost: 800 },
    { type: 'BTP', cost: 1400 },
    { type: 'Nettoyage', cost: 600 }
  ]);

  ngOnInit(): void {
    // Initialisation des données si nécessaire
  }

  ngAfterViewInit(): void {
    // Attendre un tick pour que les éléments soient rendus
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    // Nettoyer les graphiques
    this.charts.forEach(chart => chart.destroy());
  }

  private initializeCharts(): void {
    this.createMonthlyWorksChart();
    this.createWorkTypeChart();
    this.createExecutionDelayChart();
    this.createDelayedWorksChart();
    this.createIncidentsChart();
    this.createSupplierChart();
    this.createCostChart();
  }

  private createMonthlyWorksChart(): void {
    const ctx = this.monthlyWorksChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart.Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.monthlyWorks().map(work => work.month),
        datasets: [
          {
            label: 'Planifiés',
            data: this.monthlyWorks().map(work => work.planned),
            backgroundColor: '#3B82F6',
            borderRadius: 4
          },
          {
            label: 'En cours',
            data: this.monthlyWorks().map(work => work.inProgress),
            backgroundColor: '#F59E0B',
            borderRadius: 4
          },
          {
            label: 'Achevés',
            data: this.monthlyWorks().map(work => work.completed),
            backgroundColor: '#10B981',
            borderRadius: 4
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
          y: {
            beginAtZero: true,
            grid: {
              color: '#F3F4F6'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createWorkTypeChart(): void {
    const ctx = this.workTypeChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart.Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.workTypeDistribution().map(item => item.type),
        datasets: [{
          data: this.workTypeDistribution().map(item => item.percentage),
          backgroundColor: this.workTypeDistribution().map(item => item.color),
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
        },
        cutout: '60%'
      }
    });
    this.charts.push(chart);
  }

  private createExecutionDelayChart(): void {
    const ctx = this.executionDelayChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart.Chart(ctx, {
      type: 'line',
      data: {
        labels: this.executionDelays().map(delay => delay.month),
        datasets: [{
          label: 'Délai (jours)',
          data: this.executionDelays().map(delay => delay.days),
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#EF4444',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 6,
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
          y: {
            beginAtZero: true,
            grid: {
              color: '#F3F4F6'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createDelayedWorksChart(): void {
    const ctx = this.delayedWorksChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const delayedPercentage = this.stats().delayedWorks;
    
    const chart = new Chart.Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [delayedPercentage, 100 - delayedPercentage],
          backgroundColor: ['#EF4444', '#F3F4F6'],
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
        },
        cutout: '80%'
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: (chart) => {
          const { ctx, chartArea: { top, bottom, left, right } } = chart;
          ctx.save();
          ctx.font = 'bold 24px Arial';
          ctx.fillStyle = '#1F2937';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const centerX = (left + right) / 2;
          const centerY = (top + bottom) / 2;
          ctx.fillText(`${delayedPercentage}%`, centerX, centerY);
          ctx.restore();
        }
      }]
    });
    this.charts.push(chart);
  }

  private createIncidentsChart(): void {
    const ctx = this.incidentsChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart.Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.buildingIncidents().map(incident => incident.building),
        datasets: [{
          label: 'Incidents',
          data: this.buildingIncidents().map(incident => incident.incidents),
          backgroundColor: '#F97316',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: '#F3F4F6'
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createSupplierChart(): void {
    const ctx = this.supplierChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart.Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.supplierInterventions().map(supplier => supplier.supplier),
        datasets: [
          {
            label: 'Électricité',
            data: this.supplierInterventions().map(supplier => supplier.electricity),
            backgroundColor: '#3B82F6',
            borderRadius: 4
          },
          {
            label: 'Plomberie',
            data: this.supplierInterventions().map(supplier => supplier.plumbing),
            backgroundColor: '#10B981',
            borderRadius: 4
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
          y: {
            beginAtZero: true,
            grid: {
              color: '#F3F4F6'
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  private createCostChart(): void {
    const ctx = this.costChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const chart = new Chart.Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.workTypeCosts().map(cost => cost.type),
        datasets: [{
          label: 'Coût moyen (Fcfa)',
          data: this.workTypeCosts().map(cost => cost.cost),
          backgroundColor: '#3B82F6',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: {
              color: '#F3F4F6'
            }
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    });
    this.charts.push(chart);
  }

  // Méthodes utilitaires
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getMaxValue(data: any[], key: string): number {
    return Math.max(...data.map(item => item[key]));
  }

  calculatePercentage(value: number, total: number): number {
    return Math.round((value / total) * 100);
  }
}