import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

interface StatCard {
  title: string;
  value: number;
  subtitle: string;
  trend: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  icon: string;
}

interface ChartData {
  name: string;
  value: number;
}

interface RegionData {
  name: string;
  density: number;
  coordinates?: [number, number];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  
  @ViewChild('barChart', { static: false }) barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('completionChart', { static: false }) completionChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart', { static: false }) revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('geoChart', { static: false }) geoChartRef!: ElementRef<HTMLCanvasElement>;

  private barChart?: Chart;
  private completionChart?: Chart;
  private revenueChart?: Chart;
  private geoChart?: Chart;

  // Signaux pour les données du dashboard
  statCards = signal<StatCard[]>([
    {
      title: 'Biens immobiliers',
      value: 1500,
      subtitle: '',
      trend: { value: 5, label: 'nouveaux cette année', isPositive: true },
      icon: 'home'
    },
    {
      title: 'En location',
      value: 963,
      subtitle: '',
      trend: { value: 20, label: 'nouveaux ce mois-ci', isPositive: true },
      icon: 'key'
    },
    {
      title: 'En copropriété',
      value: 127,
      subtitle: 'En litige',
      trend: { value: 2, label: '', isPositive: false },
      icon: 'building'
    },
    {
      title: 'Bâtiments occupés',
      value: 1090,
      subtitle: '',
      trend: { value: 20, label: 'cette année', isPositive: true },
      icon: 'users'
    },
    {
      title: 'Bâtiments',
      value: 410,
      subtitle: '',
      trend: { value: 40, label: '', isPositive: false },
      icon: 'building-2'
    }
  ]);

  // Données pour le graphique en barres
  buildingDocumentsData = signal<ChartData[]>([
    { name: 'Education', value: 950 },
    { name: 'Intérieur', value: 1450 },
    { name: 'Justice', value: 1300 },
    { name: 'Autres', value: 1100 }
  ]);

  // Taux de complétion
  completionRate = signal(40);

  // Données pour le graphique en donut
  revenueData = signal({
    occupied: 80,
    vacant: 20
  });

  // Données de géolocalisation
  geoData = signal({
    withGPS: 75,
    withoutGPS: 25
  });

  // Régions avec densité
  regions = signal<RegionData[]>([
    { name: 'Dakar', density: 85 },
    { name: 'Saint-Louis', density: 45 },
    { name: 'Thiès', density: 60 },
    { name: 'Kaolack', density: 35 },
    { name: 'Ziguinchor', density: 25 },
    { name: 'Tambacounda', density: 15 },
    { name: 'Kolda', density: 20 },
    { name: 'Matam', density: 30 },
    { name: 'Kaffrine', density: 40 },
    { name: 'Kédougou', density: 10 },
    { name: 'Sédhiou', density: 18 },
    { name: 'Fatick', density: 25 },
    { name: 'Louga', density: 35 },
    { name: 'Diourbel', density: 50 }
  ]);

  selectedPeriod = signal('2024');
  selectedRegion = signal('Toutes les régions');

  periods = signal(['2024', '2023', '2022', '2021']);
  regionsList = signal(['Toutes les régions', 'Dakar', 'Saint-Louis', 'Thiès', 'Kaolack']);

  ngOnInit() {
    this.loadDashboardData();
  }

  ngAfterViewInit() {
    // Délai pour s'assurer que les éléments DOM sont prêts
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  private loadDashboardData() {
    console.log('Chargement des données du dashboard...');
  }

  private initializeCharts() {
    this.createBarChart();
    this.createCompletionChart();
    this.createRevenueChart();
    this.createGeoChart();
  }

  private createBarChart() {
    if (!this.barChartRef?.nativeElement) return;

    const ctx = this.barChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.buildingDocumentsData();
    
    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: data.map(item => item.name),
        datasets: [{
          data: data.map(item => item.value),
          backgroundColor: ['#60a5fa', '#3b82f6', '#1f2937', '#eab308'],
          borderRadius: 4,
          borderSkipped: false,
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
              display: false
            },
            ticks: {
              display: false
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 12
              },
              color: '#6b7280'
            }
          }
        }
      }
    };

    this.barChart = new Chart(ctx, config);
  }

  private createCompletionChart() {
    if (!this.completionChartRef?.nativeElement) return;

    const ctx = this.completionChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const completionRate = this.completionRate();
    
    const config: ChartConfiguration = {
      type: 'doughnut' as ChartType,
      data: {
        datasets: [{
          data: [completionRate, 100 - completionRate],
          backgroundColor: ['#8b5cf6', '#e5e7eb'],
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

    this.completionChart = new Chart(ctx, config);
  }

  private createRevenueChart() {
    if (!this.revenueChartRef?.nativeElement) return;

    const ctx = this.revenueChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const revenue = this.revenueData();
    
    const config: ChartConfiguration = {
      type: 'doughnut' as ChartType,
      data: {
        labels: ['Bâtiments occupés', 'Bâtiments vacants'],
        datasets: [{
          data: [revenue.occupied, revenue.vacant],
          backgroundColor: ['#3b82f6', '#93c5fd'],
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

    this.revenueChart = new Chart(ctx, config);
  }

  private createGeoChart() {
    if (!this.geoChartRef?.nativeElement) return;

    const ctx = this.geoChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const geo = this.geoData();
    
    const config: ChartConfiguration = {
      type: 'doughnut' as ChartType,
      data: {
        labels: ['Avec GPS', 'Sans GPS'],
        datasets: [{
          data: [geo.withGPS, geo.withoutGPS],
          backgroundColor: ['#3b82f6', '#e5e7eb'],
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

    this.geoChart = new Chart(ctx, config);
  }

  onPeriodChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.selectedPeriod.set(target.value);
      this.loadDashboardData();
    }
  }

  onRegionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.selectedRegion.set(target.value);
      this.loadDashboardData();
    }
  }

  exportData() {
    console.log('Export des données...');
  }

  getDensityColor(density: number): string {
    if (density >= 70) return 'bg-red-800';
    if (density >= 45) return 'bg-red-600';
    if (density >= 25) return 'bg-orange-500';
    if (density >= 10) return 'bg-orange-300';
    return 'bg-orange-200';
  }

  getRegionPosition(regionName: string): string {
    const positions: { [key: string]: string } = {
      'Dakar': 'top: 45%; left: 8%; width: 60px; height: 30px;',
      'Thiès': 'top: 40%; left: 15%; width: 50px; height: 25px;',
      'Saint-Louis': 'top: 15%; left: 12%; width: 70px; height: 30px;',
      'Louga': 'top: 28%; left: 18%; width: 50px; height: 25px;',
      'Diourbel': 'top: 48%; left: 25%; width: 60px; height: 30px;',
      'Fatick': 'top: 55%; left: 30%; width: 50px; height: 25px;',
      'Kaolack': 'top: 50%; left: 35%; width: 60px; height: 30px;',
      'Kaffrine': 'top: 45%; left: 45%; width: 60px; height: 30px;',
      'Tambacounda': 'top: 40%; left: 65%; width: 80px; height: 35px;',
      'Kédougou': 'top: 65%; left: 70%; width: 70px; height: 30px;',
      'Kolda': 'top: 72%; left: 45%; width: 50px; height: 25px;',
      'Sédhiou': 'top: 68%; left: 35%; width: 60px; height: 30px;',
      'Ziguinchor': 'top: 85%; left: 25%; width: 70px; height: 30px;',
      'Matam': 'top: 25%; left: 55%; width: 50px; height: 25px;'
    };
    
    return positions[regionName] || 'top: 50%; left: 50%; width: 50px; height: 25px;';
  }

  ngOnDestroy() {
    // Nettoyer les graphiques
    if (this.barChart) this.barChart.destroy();
    if (this.completionChart) this.completionChart.destroy();
    if (this.revenueChart) this.revenueChart.destroy();
    if (this.geoChart) this.geoChart.destroy();
  }
}

// le html
