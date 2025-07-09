import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

// Enregistrer tous les composants Chart.js nécessaires
Chart.register(...registerables, annotationPlugin);

@Component({
    selector: 'app-users',
    imports: [],
    templateUrl: './users.component.html',
    styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

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
      type: 'pie', // Changé de 'doughnut' à 'pie' pour un cercle plein
      data: {
        labels: ['Admin', 'Utilisateur', 'Consultant'],
        datasets: [{
          data: [20, 61,70],
          backgroundColor: [
            '#3B82F6', // Bleu
            '#10B981', // Vert
            '#F59E0B'  // Jaune/Orange
          ],
          borderWidth: 0,
          hoverOffset: 4
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
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                const value = context.raw as number;
                const percentage = Math.round((value / total) * 100);
                return `${context.label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
        // Supprimé cutout pour avoir un cercle plein
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
          data: [120, 150, 130, 180, 210, 200], // Données ajustées avec pic en février puis descente
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderWidth: 2,
          pointBackgroundColor: '#3B82F6',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: false,
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
            min: 100,
            max: 220,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            },
            ticks: {
              stepSize: 20
            }
          },
          x: {
            grid: {
              display: false
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
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
          data: [85, 65, 58, 40, 30],
          backgroundColor: '#3B82F6',
          borderRadius: 4,
          borderSkipped: false,
          barThickness: 20
        }]
      },
      options: {
        indexAxis: 'y' as const, // Barres horizontales
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
            beginAtZero: true,
            max: 100,
            grid: {
              display: false
            },
            ticks: {
              stepSize: 20,
              callback: function(value) {
                return value + '%';
              }
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

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin'],
        datasets: [{
          label: 'Connexions échouées',
          data: [2, 6, 8, 3, 12, 14],
          backgroundColor: '#FB923C', // Couleur orange comme dans l'image
          borderRadius: 4,
          borderSkipped: false,
          barPercentage: 0.6,
          categoryPercentage: 0.8
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
              line1: {
                type: 'line' as const,
                yMin: 10,
                yMax: 10,
                borderColor: '#EF4444',
                borderWidth: 2,
                borderDash: [6, 6],
                label: {
                  content: "Seuil d'alerte",
                  // enabled: true,
                  position: 'end' as const,
                  backgroundColor: 'rgba(239, 68, 68, 0.8)',
                  color: 'white',
                  font: {
                    size: 10,
                    weight: 'bold'
                  },
                  padding: {
                    x: 8,
                    y: 4
                  },
                  borderRadius: 4
                }
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 16,
            ticks: {
              stepSize: 2
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
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
}