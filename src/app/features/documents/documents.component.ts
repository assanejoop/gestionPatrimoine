import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-documemts',
  imports: [],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('paymentChart', { static: false }) paymentChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('orderChart', { static: false }) orderChart!: ElementRef<HTMLCanvasElement>;

  private paymentChartInstance: Chart | null = null;
  private orderChartInstance: Chart | null = null;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    // Initialisation des données si nécessaire
  }

  ngAfterViewInit(): void {
    this.createPaymentChart();
    this.createOrderChart();
  }

  private createPaymentChart(): void {
    const ctx = this.paymentChart.nativeElement.getContext('2d');
    
    if (ctx) {
      this.paymentChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [{
            data: [8, 12, 8, 16],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              borderColor: '#3B82F6',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: false,
              callbacks: {
                label: function(context) {
                  return `${context.parsed.y} millions d'euro`;
                }
              }
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
                color: '#6B7280',
                font: {
                  size: 12
                }
              }
            },
            y: {
              beginAtZero: true,
              max: 18,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawOnChartArea: true
              },
              border: {
                display: false
              },
              ticks: {
                stepSize: 2,
                color: '#6B7280',
                font: {
                  size: 12
                },
                callback: function(value) {
                  return value + '';
                }
              }
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          },
          elements: {
            point: {
              hoverBackgroundColor: '#3B82F6',
              hoverBorderColor: '#ffffff'
            }
          }
        }
      });
    }
  }

  private createOrderChart(): void {
    const ctx = this.orderChart.nativeElement.getContext('2d');
    
    if (ctx) {
      this.orderChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
          datasets: [
            {
              label: 'Bon de commande',
              data: [25, 20, 23, 25, 27, 29],
              backgroundColor: '#3B82F6',
              borderRadius: 4,
              borderSkipped: false,
              barThickness: 24
            },
            {
              label: 'Facture',
              data: [23, 18, 21, 22, 10, 27],
              backgroundColor: '#10B981',
              borderRadius: 4,
              borderSkipped: false,
              barThickness: 24
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#ffffff',
              bodyColor: '#ffffff',
              borderColor: '#3B82F6',
              borderWidth: 1,
              cornerRadius: 8,
              displayColors: true,
              boxPadding: 5
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
                color: '#6B7280',
                font: {
                  size: 12
                }
              }
            },
            y: {
              beginAtZero: true,
              max: 35,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)',
                drawOnChartArea: true
              },
              border: {
                display: false
              },
              ticks: {
                stepSize: 5,
                color: '#6B7280',
                font: {
                  size: 12
                }
              }
            }
          },
          interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.paymentChartInstance) {
      this.paymentChartInstance.destroy();
    }
    if (this.orderChartInstance) {
      this.orderChartInstance.destroy();
    }
  }
}