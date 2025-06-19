import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface MaintenanceStats {
  plannedWorks: number;
  inProgress: number;
  completed: number;
  budgetConsumed: number;
  totalBudget: number;
  delayedWorks: number;
}

interface MonthlyWork {
  month: string;
  planned: number;
  inProgress: number;
  completed: number;
}

interface WorkTypeDistribution {
  type: string;
  percentage: number;
  color: string;
}

interface ExecutionDelay {
  month: string;
  days: number;
}

interface BuildingIncident {
  building: string;
  incidents: number;
}

interface SupplierIntervention {
  supplier: string;
  electricity: number;
  plumbing: number;
}

interface WorkTypeCost {
  type: string;
  cost: number;
}

@Component({
  selector: 'app-travaux-maintenance',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './travaux-maintenance.component.html',
  styleUrls: ['./travaux-maintenance.component.css']
})
export class TravauxMaintenanceComponent implements OnInit {
  
  // Statistiques principales
  stats = signal<MaintenanceStats>({
    plannedWorks: 24,
    inProgress: 14,
    completed: 38,
    budgetConsumed: 62,
    totalBudget: 425000000,
    delayedWorks: 40
  });

  // Données mensuelles des travaux
  monthlyWorks = signal<MonthlyWork[]>([
    { month: 'Fév', planned: 4, inProgress: 1, completed: 3 },
    { month: 'Mars', planned: 2, inProgress: 1, completed: 4 },
    { month: 'Avril', planned: 3, inProgress: 2, completed: 1 },
    { month: 'Mai', planned: 5, inProgress: 2, completed: 4 }
  ]);

  // Répartition par type de travaux
  workTypeDistribution = signal<WorkTypeDistribution[]>([
    { type: 'Électricité', percentage: 35, color: '#4F81FF' },
    { type: 'Plomberie', percentage: 25, color: '#4CAF50' },
    { type: 'BTP', percentage: 20, color: '#FFB84D' },
    { type: 'Nettoyage', percentage: 20, color: '#E8E8E8' }
  ]);

  // Délais d'exécution
  executionDelays = signal<ExecutionDelay[]>([
    { month: 'Jan', days: 15 },
    { month: 'Fév', days: 12 },
    { month: 'Mar', days: 20 },
    { month: 'Avril', days: 10 },
    { month: 'Mai', days: 14 }
  ]);

  // Incidents par bâtiment
  buildingIncidents = signal<BuildingIncident[]>([
    { building: 'Bâtiment A', incidents: 10 },
    { building: 'Bâtiment B', incidents: 7 },
    { building: 'Bâtiment C', incidents: 5 },
    { building: 'Bâtiment D', incidents: 8 }
  ]);

  // Interventions par fournisseur
  supplierInterventions = signal<SupplierIntervention[]>([
    { supplier: 'Fournisseur X', electricity: 8, plumbing: 7 },
    { supplier: 'Fournisseur Y', electricity: 7, plumbing: 10 },
    { supplier: 'Fournisseur Z', electricity: 7, plumbing: 2 },
    { supplier: 'Fournisseur N', electricity: 1, plumbing: 2 }
  ]);

  // Coût moyen par type
  workTypeCosts = signal<WorkTypeCost[]>([
    { type: 'Électricité', cost: 1200 },
    { type: 'Plomberie', cost: 800 },
    { type: 'BTP', cost: 1400 },
    { type: 'Nettoyage', cost: 600 }
  ]);
incident: any;

  ngOnInit(): void {
    // Initialisation des données si nécessaire
  }

  // Méthodes utilitaires
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  }

  getMaxValue(data: any[], key: string): number {
    return Math.max(...data.map(item => item[key]));
  }

  calculatePercentage(value: number, total: number): number {
    return Math.round((value / total) * 100);
  }
}