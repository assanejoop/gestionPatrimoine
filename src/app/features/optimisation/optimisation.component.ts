
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-optimisation',
  imports: [],
  templateUrl: './optimisation.component.html',
  styleUrl: './optimisation.component.css'
})
export class OptimisationComponent {
  @ViewChild('economiesChart', { static: false }) economiesChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('coutChart', { static: false }) coutChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('budgetChart', { static: false }) budgetChart!: ElementRef<HTMLCanvasElement>;

  private economiesChartInstance!: Chart;
  private coutChartInstance!: Chart;
  private budgetChartInstance!: Chart;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initializeCharts();
  }

  private initializeCharts(): void {
    this.createEconomiesChart();
    this.createCoutChart();
    this.createBudgetChart();
  }

  private createEconomiesChart(): void {
    const ctx = this.economiesChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: ['Regroupement\nlocatif', 'Négociation\nContrats', 'Maintenance\npréventive', 'Optimisation\nénergie'],
        datasets: [{
          data: [27000, 23000, 21000, 17500],
          backgroundColor: '#FDB49A',
          borderColor: '#FDB49A',
          borderWidth: 0,
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
            max: 30000,
            ticks: {
              stepSize: 5000,
              callback: function(value) {
                return value === 0 ? '0' : (Number(value) / 1000).toString();
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
              maxRotation: 0,
              minRotation: 0,
              font: {
                size: 11
              }
            }
          }
        }
      }
    };

    this.economiesChartInstance = new Chart(ctx, config);
  }

  private createCoutChart(): void {
    const ctx = this.coutChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar' as ChartType,
      data: {
        labels: ['Dakar', 'Thiès', 'Saint-Louis', 'Autres'],
        datasets: [{
          data: [27000, 23000, 25000, 24000],
          backgroundColor: '#FDB49A',
          borderColor: '#FDB49A',
          borderWidth: 0,
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
            max: 30000,
            ticks: {
              stepSize: 5000,
              callback: function(value) {
                return value === 0 ? '0' : (Number(value) / 1000).toString();
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
              maxRotation: 0,
              minRotation: 0,
              font: {
                size: 11
              }
            }
          }
        }
      }
    };

    this.coutChartInstance = new Chart(ctx, config);
  }

  private createBudgetChart(): void {
    const ctx = this.budgetChart.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line' as ChartType,
      data: {
        labels: ['2023', '2024', '2025', '2025 (Prévision)'],
        datasets: [
          {
            label: 'Location',
            data: [12, 13.5, 14.3, 15.8],
            borderColor: '#60A5FA',
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.1,
            pointBackgroundColor: '#60A5FA',
            pointBorderColor: '#60A5FA',
            pointRadius: 4,
            pointHoverRadius: 6
          },
          {
            label: 'Maintenance',
            data: [7.5, 8, 8.2, 8.3],
            borderColor: '#4ADE80',
            backgroundColor: 'rgba(74, 222, 128, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.1,
            pointBackgroundColor: '#4ADE80',
            pointBorderColor: '#4ADE80',
            pointRadius: 4,
            pointHoverRadius: 6
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
            beginAtZero: false,
            min: 6,
            max: 16,
            ticks: {
              stepSize: 2,
              callback: function(value) {
                return value.toString();
              }
            },
            grid: {
              color: '#F3F4F6'
            },
            title: {
              display: true,
              text: 'Montant en Milliards (euro)',
              font: {
                size: 11
              },
              color: '#6B7280'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11
              }
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
        }
      }
    };

    this.budgetChartInstance = new Chart(ctx, config);
  }

  ngOnDestroy(): void {
    if (this.economiesChartInstance) {
      this.economiesChartInstance.destroy();
    }
    if (this.coutChartInstance) {
      this.coutChartInstance.destroy();
    }
    if (this.budgetChartInstance) {
      this.budgetChartInstance.destroy();
    }
  }
}


