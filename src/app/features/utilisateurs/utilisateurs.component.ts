import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import { AnnotationOptions } from 'chartjs-plugin-annotation';

// Enregistrez uniquement le plugin d'annotation
import annotationPlugin from 'chartjs-plugin-annotation';
Chart.register(annotationPlugin);

@Component({
  standalone:true,
  selector: 'app-utilisateurs',
  templateUrl: './utilisateurs.component.html',
  styleUrls: ['./utilisateurs.component.css']
})
export class UtilisateursComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.createRoleChart(); 
      this.createConnectionsChart();
      this.createUsageChart();
      this.createFailedLoginsChart();
    }, 100);
  }
  private createRoleChart(): void {
    const ctx = document.getElementById('roleChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Admin', 'Utilisateur', 'Consultant'],
        datasets: [{
          data: [15, 100, 41],
          backgroundColor: [
            '#3B82F6', // blue-500
            '#10B981', // emerald-500
            '#8B5CF6'  // violet-500
          ],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 20
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const value = context.raw as number;
                const percentage = Math.round((value / total) * 100);
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '70%'
      }
    });
  }

  private createConnectionsChart(): void {
    const ctx = document.getElementById('connectionsChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Connexions actives',
          data: [850, 920, 1020, 1100, 1200, 1248],
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#3B82F6',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4
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
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: {
              drawOnChartArea: true,
              color: 'rgba(0, 0, 0, 0.05)'
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
  }

  private createUsageChart(): void {
    const ctx = document.getElementById('usageChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Tableau de bord', 'Profil', 'Historique', 'Alertes', 'Exports'],
        datasets: [{
          label: 'Utilisation (%)',
          data: [85, 72, 58, 45, 30],
          backgroundColor: [
            '#3B82F6', // blue-500
            '#10B981', // emerald-500
            '#8B5CF6', // violet-500
            '#F59E0B', // amber-500
            '#EF4444'  // red-500
          ],
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.raw}%`
            }
          }
        },
        scales: {
          x: {
            max: 100,
            grid: {
              drawOnChartArea: false
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
  }

  private createFailedLoginsChart(): void {
    const ctx = document.getElementById('failedLoginsChart') as HTMLCanvasElement;
    if (!ctx) return;
  
    const annotation: AnnotationOptions = {
      type: 'line',
      yMin: 10,
      yMax: 10,
      borderColor: '#EF4444',
      borderWidth: 2,
      borderDash: [6, 6],
      label: {
        content: 'Seuil d\'alerte',
        position: 'end' as const, // Correction ici - utilisez 'end' au lieu de 'right'
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        color: 'white',
        font: {
          weight: 'bold'
        },
        padding: {
          x: 10,
          y: 4
        },
        borderRadius: 4
      }
    };
  
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Connexions échouées',
          data: [12, 19, 15, 8, 11, 6],
          backgroundColor: '#EF4444',
          borderRadius: 4,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          annotation: {
            annotations: {
              line1: annotation
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}