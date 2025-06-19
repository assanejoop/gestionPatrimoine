import { Component, OnInit, signal, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

interface RentalStats {
  totalProperties: number;
  monthlyRent: number;
  activeContracts: number;
  paymentRate: number;
}

interface MonthlyRent {
  month: string;
  amount: number;
}

interface ContractExpiration {
  month: string;
  count: number;
}

interface PaymentDelay {
  ministry: string;
  count: number;
  amount: number;
}

interface MinistryDistribution {
  ministry: string;
  percentage: number;
  color: string;
}

interface RegionalCost {
  region: string;
  amount: number;
}

@Component({
  selector: 'app-gestion-locative',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gestion-locative.component.html',
  styleUrls: ['./gestion-locative.component.css']
})
export class GestionLocativeComponent implements OnInit, AfterViewInit {
  
  @ViewChild('paymentRateChart', { static: false }) paymentRateChart!: ElementRef;
  @ViewChild('monthlyRentChart', { static: false }) monthlyRentChart!: ElementRef;
  @ViewChild('contractExpirationChart', { static: false }) contractExpirationChart!: ElementRef;
  @ViewChild('paymentDelayChart', { static: false }) paymentDelayChart!: ElementRef;
  @ViewChild('ministryDistributionChart', { static: false }) ministryDistributionChart!: ElementRef;
  @ViewChild('regionalCostChart', { static: false }) regionalCostChart!: ElementRef;

  private charts: Chart[] = [];

  // Statistiques principales
  stats = signal<RentalStats>({
    totalProperties: 1248,
    monthlyRent: 1.8,
    activeContracts: 76,
    paymentRate: 94
  });

  // Données pour le graphique des loyers mensuels
  monthlyRents = signal<MonthlyRent[]>([
    { month: 'Jan', amount: 38000 },
    { month: 'Fév', amount: 20000 },
    { month: 'Mar', amount: 20000 },
    { month: 'Avr', amount: 20000 },
    { month: 'Mai', amount: 20000 },
    { month: 'Juin', amount: 15000 }
  ]);

  // Données pour les contrats expirant
  contractExpirations = signal<ContractExpiration[]>([
    { month: 'Mars', count: 3 },
    { month: 'Avr', count: 7 },
    { month: 'Mai', count: 9 },
    { month: 'Juin', count: 4 }
  ]);

  // Données pour les retards de paiement
  paymentDelays = signal<PaymentDelay[]>([
    { ministry: 'Min. Education', count: 0, amount: 18000 },
    { ministry: 'Min. Santé', count: 0, amount: 25000 },
    { ministry: 'Min. Intérieur', count: 0, amount: 10000 }
  ]);

  // Répartition par ministère
  ministryDistribution = signal<MinistryDistribution[]>([
    { ministry: 'Min. Education', percentage: 55, color: '#3B82F6' },
    { ministry: 'Min. Santé', percentage: 30, color: '#F59E0B' },
    { ministry: 'Min. Intérieur', percentage: 15, color: '#E5E7EB' }
  ]);

  // Coût moyen par région
  regionalCosts = signal<RegionalCost[]>([
    { region: 'Dakar', amount: 40000 },
    { region: 'Saint-Louis', amount: 22000 },
    { region: 'Thiès', amount: 22000 }
  ]);

  // Filtres
  selectedPeriod = signal<string>('Mensuel');
  selectedRegion = signal<string>('Toutes les régions');
  selectedTab = signal<string>('Indicateur');

  // Taux de paiement pour le graphique circulaire
  paymentOnTime = signal<number>(80);
  paymentLate = signal<number>(20);

  ngOnInit(): void {
    // Initialisation des données si nécessaire
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createPaymentRateChart();
      this.createMonthlyRentChart();
      this.createContractExpirationChart();
      this.createPaymentDelayChart();
      this.createMinistryDistributionChart();
      this.createRegionalCostChart();
    }, 100);
  }

  ngOnDestroy(): void {
    this.charts.forEach(chart => chart.destroy());
  }

  // Création du graphique en donut pour le taux de paiement
  private createPaymentRateChart(): void {
    const ctx = this.paymentRateChart.nativeElement.getContext('2d');
    
    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: ['Payé à temps', 'Retard'],
        datasets: [{
          data: [this.paymentOnTime(), this.paymentLate()],
          backgroundColor: ['#10B981', '#EF4444'],
          borderWidth: 0,
          // cutout: '70%'
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

  // Création du graphique en barres pour les loyers mensuels
  private createMonthlyRentChart(): void {
    const ctx = this.monthlyRentChart.nativeElement.getContext('2d');
    
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.monthlyRents().map(r => r.month),
        datasets: [{
          label: 'Montant en (Fcfa)',
          data: this.monthlyRents().map(r => r.amount),
          backgroundColor: '#3B82F6',
          borderRadius: 4,
          barThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              display: false
            },
            grid: {
              display: false
            },
            border: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            }
          }
        },
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

  // Création du graphique en barres pour les contrats expirants
  private createContractExpirationChart(): void {
    const ctx = this.contractExpirationChart.nativeElement.getContext('2d');
    
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.contractExpirations().map(c => c.month),
        datasets: [{
          label: 'Nombre de contrats',
          data: this.contractExpirations().map(c => c.count),
          backgroundColor: '#F59E0B',
          borderRadius: 4,
          barThickness: 30
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              display: false
            },
            grid: {
              display: false
            },
            border: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            }
          }
        },
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

  // Création du graphique en barres pour les retards de paiement
  private createPaymentDelayChart(): void {
    const ctx = this.paymentDelayChart.nativeElement.getContext('2d');
    
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.paymentDelays().map(d => d.ministry.replace('Min. ', '')),
        datasets: [{
          label: 'Montant',
          data: this.paymentDelays().map(d => d.amount),
          backgroundColor: '#10B981',
          borderRadius: 4,
          barThickness: 20
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              display: false
            },
            grid: {
              display: false
            },
            border: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            },
            ticks: {
              maxRotation: 0,
              font: {
                size: 10
              }
            }
          }
        },
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

  // Création du graphique en donut pour la répartition par ministère
  private createMinistryDistributionChart(): void {
    const ctx = this.ministryDistributionChart.nativeElement.getContext('2d');
    
    const config: ChartConfiguration = {
      type: 'doughnut',
      data: {
        labels: this.ministryDistribution().map(m => m.ministry),
        datasets: [{
          data: this.ministryDistribution().map(m => m.percentage),
          backgroundColor: this.ministryDistribution().map(m => m.color),
          borderWidth: 0,
          // cutout: '60%'
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

  // Création du graphique en barres pour les coûts régionaux
  private createRegionalCostChart(): void {
    const ctx = this.regionalCostChart.nativeElement.getContext('2d');
    
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: this.regionalCosts().map(r => r.region),
        datasets: [{
          label: 'Montant en (Fcfa)',
          data: this.regionalCosts().map(r => r.amount),
          backgroundColor: '#3B82F6',
          borderRadius: 4,
          barThickness: 40
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              display: false
            },
            grid: {
              display: false
            },
            border: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            },
            border: {
              display: false
            }
          }
        },
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

  // Méthodes pour les filtres
  onPeriodChange(period: string): void {
    this.selectedPeriod.set(period);
  }

  onRegionChange(region: string): void {
    this.selectedRegion.set(region);
  }

  onTabChange(tab: string): void {
    this.selectedTab.set(tab);
  }

  // Méthode pour exporter les données
  exportData(): void {
    console.log('Export des données...');
  }

  // Méthodes utilitaires pour le formatage
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('fr-FR').format(num);
  }
}