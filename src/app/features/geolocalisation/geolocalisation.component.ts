import { Component, effect, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
     imports: [CommonModule, RouterModule],
      templateUrl: './geolocalisation.component.html',
      styleUrls: ['./geolocalisation.component.css']
   })

export class GeolocalisationComponent {
  private isBrowser: boolean;
  isOpen=false ;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId)
    effect(() => {
      const allBuildings = this.buildings();
      this.geolocalizedBuildings.set(allBuildings.filter(b => b.isGeolocalized));
      this.nonGeolocalizedBuildings.set(allBuildings.filter(b => !b.isGeolocalized));
    });;
  }
  stats = signal<GeolocationStats>({
        totalBuildings: 203,
        geolocalizedBuildings: 159,
        nonGeolocalizedBuildings: 44,
        completionRate: 82
      });

  ngOnInit() {
    if (this.isBrowser) {
      this.initMap();
      this.loadGeolocationData();
    }
  }
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
  selectedBuilding = signal<Building | null>(null);
  
  // Computed signals
  geolocalizedBuildings = signal<Building[]>([]);
  nonGeolocalizedBuildings = signal<Building[]>([]);

  


  loadGeolocationData(): void {
    // Simulation du chargement des données
    console.log('Chargement des données de géolocalisation...');
  }

  private initMap(): void {
    import('leaflet').then(L => {
      const map = L.map('map').setView([14.6928, -17.4467], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const buildings = [
        { name: 'Bâtiment A', lat: 14.692, lng: -17.446, hasGPS: true },
        { name: 'Bâtiment B', lat: 14.693, lng: -17.444, hasGPS: true },
        { name: 'Bâtiment C', lat: 14.694, lng: -17.442, hasGPS: false },
        { name: 'Bâtiment D', lat: 14.691, lng: -17.445, hasGPS: true },
        { name: 'Bâtiment E', lat: 14.695, lng: -17.447, hasGPS: false },
        { name: 'Bâtiment F', lat: 14.690, lng: -17.443, hasGPS: true },
        { name: 'Bâtiment G', lat: 14.689, lng: -17.448, hasGPS: false },
        { name: 'Bâtiment H', lat: 14.688, lng: -17.446, hasGPS: true }
      ];

      buildings.forEach(b => {
        const marker = L.circleMarker([b.lat, b.lng], {
          radius: 12,
          fillColor: b.hasGPS ? '#3B82F6' : '#EF4444', // bleu ou rouge
          color: '#fff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9
        }).addTo(map);

        marker.bindTooltip(`<strong>${b.name}</strong>`, {
          permanent: true,
          direction: 'top',
          offset: [0, -10]
        });
      });
    });
  }
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

