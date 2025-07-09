import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { TravauxComponent } from "../travaux/travaux.component";
import { DocumentsComponent } from "../documents/documents.component";
import { OptimisationComponent } from "../optimisation/optimisation.component";




// Enregistrer tous les composants Chart.js nécessaires
Chart.register(...registerables);

interface Tab {
  id: string;
  label: string;
}


@Component({
    selector: 'app-analyse-financiere',
    imports: [CommonModule, TravauxComponent, DocumentsComponent, OptimisationComponent],
    templateUrl: './analyse-financiere.component.html',
    styleUrl: './analyse-financiere.component.css'
})
export class AnalyseFinanciereComponent implements OnInit {
  
  activeTab: string = 'location';
  isOpen = false;
  
  tabs = [
    { name: 'Locations', active: true, link: '#' },
    { name: 'Travaux', active: false, link: '#', highlight: true },
    { name: 'Documents & Prestations', active: false, link: '#' },
    { name: 'Optimisation', active: false, link: '#' },
  ];

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    // Optionnel: mettre à jour le tableau tabs
    this.tabs.forEach(t => t.active = false);
    const currentTab = this.tabs.find(t => t.name.toLowerCase() === tab.toLowerCase());
    if (currentTab) {
      currentTab.active = true;
    }
  }


  
  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.createCostSitesChart();
      this.createRentOwnershipChart();
      this.createExpensesEvolutionChart();
    }, 100);
  }
//  methode pour le dropdow
toggleDropdown() {
  this.isOpen = !this.isOpen;
}

closeDropdown() {
  this.isOpen = false;
}

exportToPDF() {
  console.log('Export en PDF...');
  // Ajoutez ici votre logique d'export PDF
  this.closeDropdown();
}

exportToExcel() {
  console.log('Export en Excel...');
  // Ajoutez ici votre logique d'export Excel
  this.closeDropdown();
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
            backgroundColor: '#FF5C0280',
            borderRadius: 1,
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
  // setActiveTab(tab: string): void {
  //   this.activeTab = tab;
  // }
}