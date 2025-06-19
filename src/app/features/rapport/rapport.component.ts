import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

// Enregistrer tous les composants Chart.js nécessaires
Chart.register(...registerables);

@Component({
  selector: 'app-rapport',
  standalone: true,
  imports: [],
  templateUrl: './rapport.component.html',
  styleUrl: './rapport.component.css'
})
export class RapportComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.createReportTypesChart();
      this.createMonthlyReportsChart();
      this.createExportTypesChart();
      this.createExportFrequencyChart();
    }, 100);
  }

  createReportTypesChart(): void {
    const ctx = document.getElementById('reportTypesChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Financier', 'Statistique', 'RH', 'Activité'],
          datasets: [{
            data: [60, 50, 40, 20],
            backgroundColor: [
              '#3B82F6', // Blue
              '#10B981', // Green
              '#F59E0B', // Orange
              '#8B5CF6'  // Purple
            ],
            borderRadius: 8,
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
              max: 70,
              grid: {
                color: '#E5E7EB'
              },
              ticks: {
                color: '#6B7280'
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
          }
        }
      });
    }
  }

  createMonthlyReportsChart(): void {
    const ctx = document.getElementById('monthlyReportsChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fev', 'Mars', 'Avril', 'Mai', 'Juin'],
          datasets: [{
            data: [20, 25, 30, 40, 35, 45],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#3B82F6',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 6
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
              max: 50,
              grid: {
                color: '#E5E7EB'
              },
              ticks: {
                color: '#6B7280'
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
          }
        }
      });
    }
  }

  createExportTypesChart(): void {
    const ctx = document.getElementById('exportTypesChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['PDF', 'EXCEL', 'CSV', 'JSON'],
          datasets: [{
            data: [15, 37, 47, 20],
            backgroundColor: '#FB923C',
            borderRadius: 8,
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
              max: 60,
              grid: {
                color: '#E5E7EB'
              },
              ticks: {
                color: '#6B7280'
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
          }
        }
      });
    }
  }

  createExportFrequencyChart(): void {
    const ctx = document.getElementById('exportFrequencyChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
          datasets: [{
            data: [6, 8, 8, 12, 9, 10, 6, 2],
            borderColor: '#EF4444',
            backgroundColor: 'transparent',
            tension: 0.4,
            pointBackgroundColor: '#EF4444',
            pointBorderColor: '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 6
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
              max: 14,
              grid: {
                color: '#E5E7EB'
              },
              ticks: {
                color: '#6B7280'
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
          }
        }
      });
    }
  }
}