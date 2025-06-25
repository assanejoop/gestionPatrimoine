import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, signal } from '@angular/core';
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
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  
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
      subtitle: 'Total des biens',
      trend: { value: 5, label: 'nouveaux cette année', isPositive: true },
      icon: '🏠'
    },
    {
      title: 'En location',
      value: 963,
      subtitle: 'Propriétés louées',
      trend: { value: 20, label: 'nouveaux ce mois-ci', isPositive: true },
      icon: '🏘️'
    },
    {
      title: 'En copropriété',
      value: 127,
      subtitle: 'Unités en copropriété',
      trend: { value: 2, label: 'En litige', isPositive: false },
      icon: '🏢'
    },
    {
      title: 'Bâtiments occupés',
      value: 1090,
      subtitle: 'Unités occupées',
      trend: { value: 20, label: 'cette année', isPositive: true },
      icon: '👥'
    },
    {
      title: 'Bâtiments vacants',
      value: 410,
      subtitle: 'Unités vacantes',
      trend: { value: 40, label: 'cette année', isPositive: false },
      icon: '🏗️'
    }
    ,
    {
      title: 'Bâtiments vacants',
      value: 410,
      subtitle: 'Unités vacantes',
      trend: { value: 40, label: 'cette année', isPositive: false },
      icon: '🏗️'
    }
  ]);

  barChartData = signal<ChartData[]>([
    { name: 'Éducation', value: 1000 },
    { name: 'Intérieur', value: 1500 },
    { name: 'Justice', value: 1300 },
    { name: 'Autres', value: 1100 }
  ]);

  completionRate = signal<number>(40);

  revenueData = signal<{ occupied: number; vacant: number }>({
    occupied: 80,
    vacant: 20
  });

  geoData = signal<{ withGPS: number; withoutGPS: number }>({
    withGPS: 75,
    withoutGPS: 25
  });

  selectedPeriod = signal<string>('Cette année');
  selectedRegion = signal<string>('Toutes les régions');

  ngOnInit(): void {
    // Initialisation des données
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  private initializeCharts(): void {
    this.createBarChart();
    this.createCompletionChart();
    this.createRevenueChart();
    this.createGeoChart();
  }

  private destroyCharts(): void {
    if (this.barChart) {
      this.barChart.destroy();
    }
    if (this.completionChart) {
      this.completionChart.destroy();
    }
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }
    if (this.geoChart) {
      this.geoChart.destroy();
    }
  }

  private createBarChart(): void {
    if (!this.barChartRef?.nativeElement) return;

    const ctx = this.barChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const data = this.barChartData();
    
    this.barChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(item => item.name),
        datasets: [{
          data: data.map(item => item.value),
          backgroundColor: ['#60A5FA', '#60A5FA', '#1F2937', '#F59E0B'],
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
          y: {
            beginAtZero: true,
            max: 1600,
            ticks: {
              stepSize: 200,
              color: '#6B7280'
            },
            grid: {
              color: '#E5E7EB'
            }
          },
          x: {
            ticks: {
              color: '#6B7280'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  private createCompletionChart(): void {
    if (!this.completionChartRef?.nativeElement) return;

    const ctx = this.completionChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const completion = this.completionRate();
    
    this.completionChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [completion, 100 - completion],
          backgroundColor: ['#EC4899', '#F3F4F6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '80%',
        plugins: {
          legend: {
            display: false
          }
        }
      },
      plugins: [{
        id: 'centerText',
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          ctx.save();
          ctx.font = 'bold 48px Arial';
          ctx.fillStyle = '#1F2937';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
          const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
          ctx.fillText(`${completion}%`, centerX, centerY - 10);
          
          ctx.font = '14px Arial';
          ctx.fillStyle = '#6B7280';
          ctx.fillText('Taux de complétion', centerX, centerY + 25);
          ctx.restore();
        }
      }]
    });
  }

  private createRevenueChart(): void {
    if (!this.revenueChartRef?.nativeElement) return;

    const ctx = this.revenueChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const revenue = this.revenueData();
    
    this.revenueChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Bâtiments occupés', 'Bâtiments vacants'],
        datasets: [{
          data: [revenue.occupied, revenue.vacant],
          backgroundColor: ['#3B82F6', '#93C5FD'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '60%',
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  private createGeoChart(): void {
    if (!this.geoChartRef?.nativeElement) return;

    const ctx = this.geoChartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const geo = this.geoData();
    
    this.geoChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Bâtiments localisés avec coordonnées GPS', 'Bâtiments localisés sans coordonnées GPS'],
        datasets: [{
          data: [geo.withGPS, geo.withoutGPS],
          backgroundColor: ['#3B82F6', '#E5E7EB'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  onPeriodChange(period: string): void {
    this.selectedPeriod.set(period);
    // Actualiser les données selon la période
    this.updateChartsData();
  }

  onRegionChange(region: string): void {
    this.selectedRegion.set(region);
    // Actualiser les données selon la région
    this.updateChartsData();
  }

  private updateChartsData(): void {
    // Logique pour mettre à jour les données des graphiques
    this.destroyCharts();
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  exportData(): void {
    // Logique d'exportation
    console.log('Exportation des données...');
  }
}