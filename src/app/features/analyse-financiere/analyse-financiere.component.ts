import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

// Enregistrer tous les composants Chart.js nécessaires
Chart.register(...registerables);

@Component({
  selector: 'app-analyse-financiere',
  standalone: true,
  imports: [],
  templateUrl: './analyse-financiere.component.html',
  styleUrl: './analyse-financiere.component.css'
})
export class AnalyseFinanciereComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.createCostSitesChart();
      this.createRentOwnershipChart();
      this.createExpensesEvolutionChart();
    }, 100);
  }

  createCostSitesChart(): void {
    const ctx = document.getElementById('costSitesChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Résidence A', 'Résidence B', 'Résidence C', 'Résidence D'],
          datasets: [{
            data: [300, 250, 230, 190],
            backgroundColor: '#FB923C',
            borderRadius: 8,
            borderSkipped: false,
            barPercentage: 0.5, // Réduit la largeur des barres (valeur entre 0 et 1)
            categoryPercentage: 0.8 // Ajuste l'espace entre les groupes de barres
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
              max: 350,
              grid: {
                color: '#E5E7EB'
              },
              ticks: {
                color: '#6B7280',
                callback: function(value) {
                  return value;
                }
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

  createRentOwnershipChart(): void {
    const ctx = document.getElementById('rentOwnershipChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Location', 'Propriété'],
          datasets: [{
            data: [65, 35],
            backgroundColor: [
              '#10B981', // Green for Location
              '#3B82F6'  // Blue for Propriété
            ],
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
      });
    }
  }

  createExpensesEvolutionChart(): void {
    const ctx = document.getElementById('expensesEvolutionChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Fev', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Aout', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            data: [2000, 2700, 2400, 2800, 3000, 3500, 3100, 2500, 3000, 3500, 4000, 4500],
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
              beginAtZero: false,
              min: 1500,
              max: 5000,
              grid: {
                color: '#E5E7EB'
              },
              ticks: {
                color: '#6B7280',
                callback: function(value) {
                  return value;
                }
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