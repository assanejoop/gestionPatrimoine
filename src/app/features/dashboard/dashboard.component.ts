import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
export class DashboardComponent implements OnInit {
  
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

  // Données pour le graphique en barres (Nombre de bâtiments avec documents manquants)
  buildingDocumentsData = signal<ChartData[]>([
    { name: 'Éducation', value: 950 },
    { name: 'Intérieur', value: 1450 },
    { name: 'Justice', value: 1300 },
    { name: 'Autres', value: 1100 }
  ]);

  // Taux de complétion
  completionRate = signal(40);

  // Données pour le graphique en donut (Total Revenue)
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
    // Initialisation des données si nécessaire
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // Simulation du chargement des données
    console.log('Chargement des données du dashboard...');
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
    // Logique d'exportation
    console.log('Export des données...');
  }

  // Méthodes utilitaires pour les graphiques
  getBarHeight(value: number): number {
    const maxValue = Math.max(...this.buildingDocumentsData().map(d => d.value));
    return (value / maxValue) * 100;
  }

  getBarColor(index: number): string {
    const colors = ['bg-blue-400', 'bg-blue-600', 'bg-gray-800', 'bg-yellow-500'];
    return colors[index] || 'bg-gray-400';
  }

  getDensityColor(density: number): string {
    if (density >= 70) return 'bg-red-800';
    if (density >= 45) return 'bg-red-600';
    if (density >= 25) return 'bg-orange-500';
    if (density >= 10) return 'bg-orange-300';
    return 'bg-orange-200';
  }

  // getCompletionStrokeDasharray(): string {
  //   const circumference = 2 * Math.PI * 45; // rayon de 45
  //   const progress = (this.completionRate() / 100) * circumference;
  //   return `${progress} ${circumference}`;
  // }

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

  // Ajoutez ces méthodes dans votre DashboardComponent

// Méthode pour calculer la largeur des barres en pourcentage
getBarWidthPercentage(value: number): number {
  const maxValue = Math.max(...this.buildingDocumentsData().map(d => d.value));
  return (value / maxValue) * 100;
}

// Méthode pour les couleurs des barres horizontales
getHorizontalBarColor(index: number): string {
  const colors = ['bg-blue-400', 'bg-blue-600', 'bg-gray-800', 'bg-yellow-500'];
  return colors[index] || 'bg-gray-400';
}

// Méthode pour le cercle de progression (mise à jour)
getCompletionStrokeDasharray(): string {
  const circumference = 2 * Math.PI * 40; // rayon de 40 au lieu de 45
  const progress = (this.completionRate() / 100) * circumference;
  return `${progress} ${circumference}`;
}

// Méthode pour positionner le point sur le cercle
getProgressDotPosition(): string {
  const percentage = this.completionRate();
  const angle = (percentage / 100) * 360 - 90; // -90 pour commencer en haut
  const radians = (angle * Math.PI) / 180;
  const radius = 80; // rayon en pixels pour le positionnement du point
  const centerX = 80; // centre du conteneur (160px / 2)
  const centerY = 80;
  
  const x = centerX + radius * Math.cos(radians);
  const y = centerY + radius * Math.sin(radians);
  
  return `top: ${y}px; left: ${x}px; transform: translate(-50%, -50%);`;
}
}