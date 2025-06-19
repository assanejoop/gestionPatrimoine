import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Building {
  id: string;
  name: string;
  coordinates: [number, number];
  isGeolocalized: boolean;
  type: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
}

interface GeolocationStats {
  totalBuildings: number;
  geolocalizedBuildings: number;
  nonGeolocalizedBuildings: number;
  completionRate: number;
}

interface MapFilter {
  period: string;
  region: string;
}

@Component({
  selector: 'app-geolocalisation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './geolocalisation.component.html',
  styleUrls: ['./geolocalisation.component.css']
})
export class GeolocalisationComponent implements OnInit {
  
  // Signaux pour les données de géolocalisation
  stats = signal<GeolocationStats>({
    totalBuildings: 203,
    geolocalizedBuildings: 159,
    nonGeolocalizedBuildings: 44,
    completionRate: 82
  });

  buildings = signal<Building[]>([
    {
      id: '1',
      name: 'Bâtiment A',
      coordinates: [14.6937, -17.4441],
      isGeolocalized: true,
      type: 'A'
    },
    {
      id: '2',
      name: 'Bâtiment B',
      coordinates: [14.6947, -17.4431],
      isGeolocalized: false,
      type: 'B'
    },
    {
      id: '3',
      name: 'Bâtiment C',
      coordinates: [14.6927, -17.4451],
      isGeolocalized: true,
      type: 'C'
    },
    {
      id: '4',
      name: 'Bâtiment D',
      coordinates: [14.6957, -17.4421],
      isGeolocalized: true,
      type: 'D'
    },
    {
      id: '5',
      name: 'Bâtiment E',
      coordinates: [14.6917, -17.4461],
      isGeolocalized: true,
      type: 'E'
    },
    {
      id: '6',
      name: 'Bâtiment F',
      coordinates: [14.6967, -17.4411],
      isGeolocalized: false,
      type: 'F'
    },
    {
      id: '7',
      name: 'Bâtiment G',
      coordinates: [14.6907, -17.4471],
      isGeolocalized: false,
      type: 'G'
    },
    {
      id: '8',
      name: 'Bâtiment H',
      coordinates: [14.6977, -17.4401],
      isGeolocalized: true,
      type: 'H'
    }
  ]);

  filters = signal<MapFilter>({
    period: 'all',
    region: 'all'
  });

  selectedBuilding = signal<Building | null>(null);
  
  // Computed signals
  geolocalizedBuildings = signal<Building[]>([]);
  nonGeolocalizedBuildings = signal<Building[]>([]);

  constructor() {
    // Effect pour calculer les bâtiments géolocalisés et non géolocalisés
    effect(() => {
      const allBuildings = this.buildings();
      this.geolocalizedBuildings.set(allBuildings.filter(b => b.isGeolocalized));
      this.nonGeolocalizedBuildings.set(allBuildings.filter(b => !b.isGeolocalized));
    });
  }

  ngOnInit(): void {
    this.loadGeolocationData();
  }

  loadGeolocationData(): void {
    // Simulation du chargement des données
    console.log('Chargement des données de géolocalisation...');
  }

  onPeriodChange(period: string): void {
    this.filters.update(current => ({ ...current, period }));
    this.applyFilters();
  }

  onRegionChange(region: string): void {
    this.filters.update(current => ({ ...current, region }));
    this.applyFilters();
  }

  applyFilters(): void {
    // Logique pour appliquer les filtres
    console.log('Application des filtres:', this.filters());
  }

  onBuildingClick(building: Building): void {
    this.selectedBuilding.set(building);
    console.log('Bâtiment sélectionné:', building);
  }

  exportData(): void {
    const data = {
      stats: this.stats(),
      buildings: this.buildings(),
      filters: this.filters()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'geolocalisation-data.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getBuildingMarkerColor(building: Building): string {
    return building.isGeolocalized ? '#3b82f6' : '#ef4444';
  }

  getCompletionPercentage(): number {
    const total = this.stats().totalBuildings;
    const geolocalized = this.stats().geolocalizedBuildings;
    return total > 0 ? Math.round((geolocalized / total) * 100) : 0;
  }
}