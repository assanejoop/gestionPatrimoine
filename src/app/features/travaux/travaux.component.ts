import { CommonModule } from '@angular/common';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

@Component({
  selector: 'app-travaux',
  imports: [CommonModule],
  templateUrl: './travaux.component.html',
  styleUrl: './travaux.component.css'
})
export class TravauxComponent {

  @ViewChild('buildingCostsChart', { static: false }) buildingCostsChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('budgetChart', { static: false }) budgetChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('regionCostsChart', { static: false }) regionCostsChart!: ElementRef<HTMLCanvasElement>;

  private buildingChart: Chart | undefined;
  private budgetPieChart: Chart | undefined;
  private regionChart: Chart | undefined;
  

  // Données pour les graphiques
  buildingCostsData = {
    labels: ['Résidence A', 'Résidence B', 'Résidence C', 'Résidence D'],
    datasets: [{
      data: [300, 250, 230, 190],
      backgroundColor: ['#FF5C0280',],
      borderWidth: 0,
      borderRadius: 1,
      borderSkipped: false,
      barPercentage: 0.5, // Réduit la largeur des barres (valeur entre 0 et 1)
      categoryPercentage: 0.8 // Ajuste l'espace entre les groupes de barres
    }]
  };

  budgetData = {
    labels: ['Consommé', 'Restant'],
    datasets: [{
      data: [62, 38],
      backgroundColor: ['#FF6B35', '#E0E0E0'],
      borderWidth: 0,
      cutout: '75%'
    }]
  };

  regionCostsData = {
    labels: ['Dakar', 'Thiès', 'Saint-Louis', 'Autres'],
    datasets: [
      {
        label: 'Peinture',
        data: [120, 80, 60, 40],
        backgroundColor: '#3B82F6',
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Plomberie',
        data: [100, 60, 40, 25],
        backgroundColor: '#FCD34D',
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: 'Électricité',
        data: [110, 40, 20, 18],
        backgroundColor: '#10B981',
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };
isBrowser: any;
loading: any;

  constructor() { }

  ngOnInit(): void {
    // Initialisation des données si nécessaire
  }

  ngAfterViewInit(): void {
    this.initializeBuildingCostsChart();
    this.initializeBudgetChart();
    this.initializeRegionCostsChart();
  }

  ngOnDestroy(): void {
    if (this.buildingChart) {
      this.buildingChart.destroy();
    }
    if (this.budgetPieChart) {
      this.budgetPieChart.destroy();
    }
    if (this.regionChart) {
      this.regionChart.destroy();
    }
  }

  private initializeBuildingCostsChart(): void {
    const ctx = this.buildingCostsChart.nativeElement.getContext('2d');
    if (ctx) {
      this.buildingChart = new Chart(ctx, {
        type: 'bar',
        data: this.buildingCostsData,
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
              max: 350,
              ticks: {
                stepSize: 50,
                callback: function(value) {
                  return value;
                }
              },
              grid: {
                color: '#F3F4F6'
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#6B7280'
              }
            }
          },
          elements: {
            bar: {
              borderRadius: 6
            }
          }
        }
      });
    }
  }

  private initializeBudgetChart(): void {
    const ctx = this.budgetChart.nativeElement.getContext('2d');
    if (ctx) {
      this.budgetPieChart = new Chart(ctx, {
        type: 'doughnut',
        data: this.budgetData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.label + ': ' + context.parsed + '%';
                }
              }
            }
          },
          cutout: '70%'
        }
      });
    }
  }

  private initializeRegionCostsChart(): void {
    const ctx = this.regionCostsChart.nativeElement.getContext('2d');
    if (ctx) {
      this.regionChart = new Chart(ctx, {
        type: 'bar',
        data: this.regionCostsData,
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
              max: 140,
              ticks: {
                stepSize: 20,
                callback: function(value) {
                  return value;
                }
              },
              grid: {
                color: '#F3F4F6'
              }
            },
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#6B7280'
              }
            }
          },
          elements: {
            bar: {
              borderRadius: 4
            }
          }
        }
      });
    }
  }

  // Méthodes pour mettre à jour les données
  updateBuildingCosts(newData: any): void {
    if (this.buildingChart) {
      this.buildingChart.data = newData;
      this.buildingChart.update();
    }
  }

  updateBudgetData(consumed: number, remaining: number): void {
    if (this.budgetPieChart) {
      this.budgetPieChart.data.datasets[0].data = [consumed, remaining];
      this.budgetPieChart.update();
    }
  }

  updateRegionCosts(newData: any): void {
    if (this.regionChart) {
      this.regionChart.data = newData;
      this.regionChart.update();
    }
  }

  // Méthode pour changer la période (mensuel, trimestriel, annuel)
  onPeriodChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const period = target.value;
    
    // Ici vous pouvez implémenter la logique pour changer les données
    // selon la période sélectionnée
    console.log('Période sélectionnée:', period);
    
    // Exemple de mise à jour des données selon la période
    switch (period) {
      case 'mensuel':
        this.updateRegionCostsForPeriod('monthly');
        break;
      case 'trimestriel':
        this.updateRegionCostsForPeriod('quarterly');
        break;
      case 'annuel':
        this.updateRegionCostsForPeriod('yearly');
        break;
    }
  }

  private updateRegionCostsForPeriod(period: string): void {
    // Logique pour mettre à jour les données selon la période
    let newData = { ...this.regionCostsData };
    
    if (period === 'monthly') {
      // Données mensuelles (exemple)
      newData.datasets[0].data = [120, 80, 60, 40];
      newData.datasets[1].data = [100, 60, 40, 25];
      newData.datasets[2].data = [110, 40, 20, 18];
    } else if (period === 'quarterly') {
      // Données trimestrielles (exemple)
      newData.datasets[0].data = [360, 240, 180, 120];
      newData.datasets[1].data = [300, 180, 120, 75];
      newData.datasets[2].data = [330, 120, 60, 54];
    } else if (period === 'yearly') {
      // Données annuelles (exemple)
      newData.datasets[0].data = [1440, 960, 720, 480];
      newData.datasets[1].data = [1200, 720, 480, 300];
      newData.datasets[2].data = [1320, 480, 240, 216];
    }
    
    this.updateRegionCosts(newData);
  }
}


