import { Component, OnInit, OnDestroy, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';

// Interface pour les données des régions
interface RegionData {
  name: string;
  coords: [number, number];
  density: number;
  color: string;
}

// Interface pour les coordonnées des régions
interface RegionBoundary {
  [key: string]: [number, number][];
}

@Component({
  selector: 'app-senegal-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full h-screen bg-gray-100">
      <!-- Message de chargement pour SSR -->
      <div *ngIf="!isPlatformBrowser(platformId)" class="flex items-center justify-center h-full">
        <div class="text-center">
          <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p class="text-gray-600">Chargement de la carte...</p>
        </div>
      </div>

      <!-- Contenu de la carte (uniquement côté client) -->
      <div *ngIf="isPlatformBrowser(platformId)">
        <!-- Titre et légende -->
        <div class="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 class="text-lg font-bold text-blue-600 mb-3">Densité immobilière</h3>
          <div class="space-y-2">
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded" style="background-color: #fef3e2"></div>
              <span class="text-sm">< 10</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded" style="background-color: #fed7aa"></div>
              <span class="text-sm">10 à 25</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded" style="background-color: #fdba74"></div>
              <span class="text-sm">25 à 45</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded" style="background-color: #fb923c"></div>
              <span class="text-sm">45 à 70</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-4 h-4 rounded" style="background-color: #dc2626"></div>
              <span class="text-sm">> 100</span>
            </div>
          </div>
        </div>
        
        <!-- Conteneur de la carte -->
        <div id="map" class="w-full h-full"></div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100vh;
    }
    
    .leaflet-container {
      background: #f3f4f6;
    }
    
    .leaflet-popup-content-wrapper {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    
    .leaflet-popup-content {
      margin: 12px 16px;
      font-family: system-ui, -apple-system, sans-serif;
    }
    
    .leaflet-control-attribution {
      background: rgba(255, 255, 255, 0.8);
      font-size: 10px;
    }
  `]
})
export class SenegalMapComponent implements OnInit, AfterViewInit, OnDestroy {
  private map!: L.Map;
  private senegalLayer!: L.LayerGroup;
  private L: any; // Import dynamique de Leaflet

  constructor(@Inject(PLATFORM_ID) public platformId: Object) {}

  // Méthode utilitaire pour vérifier si on est côté client
  isPlatformBrowser = isPlatformBrowser;

  // Données des régions avec leurs densités immobilières
  private regions: RegionData[] = [
    // Région de Dakar (densité très élevée)
    { name: 'Dakar', coords: [14.6928, -17.4467], density: 120, color: '#dc2626' },
    { name: 'Pikine', coords: [14.7549, -17.4035], density: 95, color: '#dc2626' },
    { name: 'Guédiawaye', coords: [14.7751, -17.4198], density: 88, color: '#dc2626' },
    { name: 'Rufisque', coords: [14.7167, -17.2833], density: 75, color: '#dc2626' },
    
    // Région de Thiès (densité élevée)
    { name: 'Thiès', coords: [14.7886, -16.9246], density: 65, color: '#fb923c' },
    { name: 'Mbour', coords: [14.4205, -16.9573], density: 55, color: '#fb923c' },
    { name: 'Tivaouane', coords: [14.9505, -16.8203], density: 35, color: '#fdba74' },
    
    // Région de Diourbel (densité modérée)
    { name: 'Diourbel', coords: [14.6582, -16.2317], density: 45, color: '#fdba74' },
    { name: 'Touba', coords: [14.8500, -15.8833], density: 68, color: '#fb923c' },
    { name: 'Mbacké', coords: [14.7969, -15.9111], density: 38, color: '#fdba74' },
    
    // Région de Kaolack (densité modérée)
    { name: 'Kaolack', coords: [14.1547, -16.0736], density: 42, color: '#fdba74' },
    { name: 'Kaffrine', coords: [14.1064, -15.5503], density: 25, color: '#fdba74' },
    { name: 'Nioro du Rip', coords: [13.7500, -15.7833], density: 18, color: '#fed7aa' },
    
    // Région de Fatick (densité faible à modérée)
    { name: 'Fatick', coords: [14.3347, -16.4118], density: 28, color: '#fdba74' },
    { name: 'Foundiougne', coords: [14.1333, -16.4667], density: 15, color: '#fed7aa' },
    { name: 'Gossas', coords: [14.4969, -16.0675], density: 20, color: '#fed7aa' },
    
    // Région de Saint-Louis (densité faible)
    { name: 'Saint-Louis', coords: [16.0201, -16.4912], density: 32, color: '#fdba74' },
    { name: 'Louga', coords: [15.6181, -16.2269], density: 22, color: '#fed7aa' },
    { name: 'Linguère', coords: [15.3922, -15.1197], density: 8, color: '#fef3e2' },
    
    // Région de Matam (densité très faible)
    { name: 'Matam', coords: [15.6558, -13.2553], density: 7, color: '#fef3e2' },
    { name: 'Podor', coords: [16.6519, -14.9608], density: 5, color: '#fef3e2' },
    { name: 'Ranérou-Ferlo', coords: [15.3000, -14.2000], density: 3, color: '#fef3e2' },
    
    // Région de Tambacounda (densité très faible)
    { name: 'Tambacounda', coords: [13.7708, -13.6681], density: 9, color: '#fef3e2' },
    { name: 'Bakel', coords: [14.9069, -12.4581], density: 4, color: '#fef3e2' },
    { name: 'Goudiry', coords: [14.1833, -12.7167], density: 6, color: '#fef3e2' },
    
    // Région de Kédougou (densité très faible)
    { name: 'Kédougou', coords: [12.5569, -12.1756], density: 5, color: '#fef3e2' },
    { name: 'Salemata', coords: [12.9167, -12.3333], density: 3, color: '#fef3e2' },
    { name: 'Saraya', coords: [12.8167, -11.7500], density: 2, color: '#fef3e2' },
    
    // Région de Kolda (densité très faible)
    { name: 'Kolda', coords: [12.8939, -14.9406], density: 12, color: '#fed7aa' },
    { name: 'Médina Yoro Foulah', coords: [12.8833, -14.6167], density: 8, color: '#fef3e2' },
    { name: 'Vélingara', coords: [13.1500, -14.1167], density: 6, color: '#fef3e2' },
    
    // Région de Sédhiou (densité très faible)
    { name: 'Sédhiou', coords: [12.7083, -15.5572], density: 10, color: '#fef3e2' },
    { name: 'Bounkiling', coords: [12.9167, -15.3333], density: 7, color: '#fef3e2' },
    { name: 'Goudomp', coords: [12.6167, -15.8833], density: 5, color: '#fef3e2' },
    
    // Région de Ziguinchor (densité faible)
    { name: 'Ziguinchor', coords: [12.5681, -16.2719], density: 28, color: '#fdba74' },
    { name: 'Oussouye', coords: [12.4850, -16.5486], density: 15, color: '#fed7aa' },
    { name: 'Bignona', coords: [12.8100, -16.2267], density: 18, color: '#fed7aa' }
  ];

  // Polygones simplifiés des régions administratives
  private regionBoundaries: RegionBoundary = {
    'Dakar': [
      [14.6, -17.5], [14.8, -17.5], [14.8, -17.2], [14.6, -17.2], [14.6, -17.5]
    ],
    'Thiès': [
      [14.6, -17.2], [15.0, -17.2], [15.0, -16.5], [14.6, -16.5], [14.6, -17.2]
    ],
    'Diourbel': [
      [14.4, -16.5], [15.0, -16.5], [15.0, -15.8], [14.4, -15.8], [14.4, -16.5]
    ],
    'Kaolack': [
      [13.8, -16.5], [14.4, -16.5], [14.4, -15.3], [13.8, -15.3], [13.8, -16.5]
    ],
    'Fatick': [
      [13.8, -16.8], [14.6, -16.8], [14.6, -15.8], [13.8, -15.8], [13.8, -16.8]
    ],
    'Saint-Louis': [
      [15.0, -17.0], [16.8, -17.0], [16.8, -15.8], [15.0, -15.8], [15.0, -17.0]
    ],
    'Louga': [
      [14.8, -16.8], [15.8, -16.8], [15.8, -15.0], [14.8, -15.0], [14.8, -16.8]
    ],
    'Matam': [
      [15.2, -14.8], [16.8, -14.8], [16.8, -12.8], [15.2, -12.8], [15.2, -14.8]
    ],
    'Tambacounda': [
      [13.0, -15.0], [15.2, -15.0], [15.2, -12.0], [13.0, -12.0], [13.0, -15.0]
    ],
    'Kédougou': [
      [12.0, -13.0], [13.2, -13.0], [13.2, -11.5], [12.0, -11.5], [12.0, -13.0]
    ],
    'Kolda': [
      [12.5, -15.5], [13.5, -15.5], [13.5, -13.8], [12.5, -13.8], [12.5, -15.5]
    ],
    'Sédhiou': [
      [12.2, -16.2], [13.2, -16.2], [13.2, -15.0], [12.2, -15.0], [12.2, -16.2]
    ],
    'Ziguinchor': [
      [12.0, -16.8], [13.0, -16.8], [13.0, -16.0], [12.0, -16.0], [12.0, -16.8]
    ]
  };

  ngOnInit(): void {
    // Configuration initiale si nécessaire
  }

  ngAfterViewInit(): void {
    // Vérifier si nous sommes côté client avant d'initialiser Leaflet
    if (isPlatformBrowser(this.platformId)) {
      this.loadLeafletAndInitialize();
    }
  }

  private async loadLeafletAndInitialize(): Promise<void> {
    try {
      // Import dynamique de Leaflet uniquement côté client
      this.L = await import('leaflet');
      
      // Configurer les icônes par défaut de Leaflet
      const iconRetinaUrl = 'assets/leaflet/marker-icon-2x.png';
      const iconUrl = 'assets/leaflet/marker-icon.png';
      const shadowUrl = 'assets/leaflet/marker-shadow.png';
      
      const iconDefault = this.L.icon({
        iconRetinaUrl,
        iconUrl,
        shadowUrl,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        tooltipAnchor: [16, -28],
        shadowSize: [41, 41]
      });
      
      this.L.Marker.prototype.options.icon = iconDefault;
      
      // Initialiser la carte
      this.initializeMap();
    } catch (error) {
      console.error('Erreur lors du chargement de Leaflet:', error);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private initializeMap(): void {
    // Vérifier que Leaflet est chargé
    if (!this.L) return;

    // Initialiser la carte centrée sur le Sénégal
    this.map = this.L.map('map', {
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      keyboard: true,
      dragging: true,
      touchZoom: true
    }).setView([14.4974, -14.4524], 7);

    // Ajouter une couche de fond neutre
    this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 10,
      minZoom: 6
    }).addTo(this.map);

    // Créer le groupe de couches pour les régions
    this.senegalLayer = this.L.layerGroup().addTo(this.map);

    // Ajouter les polygones des régions
    this.addRegionPolygons();
    
    // Ajouter les marqueurs des villes
    this.addCityMarkers();

    // Ajuster la vue pour montrer tout le Sénégal
    this.map.setMaxBounds([
      [11.5, -18.0], // Sud-Ouest
      [16.8, -11.0]  // Nord-Est
    ]);
  }

  private addRegionPolygons(): void {
    // Vérifier que Leaflet est chargé
    if (!this.L) return;

    // Créer les polygones pour chaque région
    Object.entries(this.regionBoundaries).forEach(([regionName, coordinates]) => {
      // Rechercher la région correspondante
      const region = this.regions.find(r => 
        r.name === regionName || this.isInRegion(r.name, regionName)
      );
      
      // Utiliser les données de la région si trouvée, sinon valeurs par défaut
      const color = region ? region.color : this.getDensityColor(0);
      const regionDensity = region ? region.density : 0;
      
      const polygon = this.L.polygon(coordinates, {
        color: '#94a3b8',
        weight: 1,
        fillColor: color,
        fillOpacity: 0.7,
        opacity: 0.8
      });

      polygon.bindPopup(`
        <div class="text-center">
          <h3 class="font-bold text-lg text-gray-800">${regionName}</h3>
          <p class="text-sm text-gray-600">Région administrative</p>
          ${region ? `<p class="text-xs text-gray-500 mt-1">Densité moyenne: ${regionDensity}</p>` : ''}
        </div>
      `);

      polygon.addTo(this.senegalLayer);
    });
  }

  private addCityMarkers(): void {
    // Vérifier que Leaflet est chargé
    if (!this.L) return;

    this.regions.forEach((region: RegionData) => {
      // Créer une icône personnalisée basée sur la densité
      const iconSize = this.getIconSize(region.density);
      const icon = this.L.divIcon({
        html: `
          <div class="flex flex-col items-center">
            <div class="w-${iconSize} h-${iconSize} rounded-full border-2 border-white shadow-lg" 
                 style="background-color: ${region.color}"></div>
            <div class="text-xs font-semibold text-gray-800 mt-1 bg-white px-2 py-1 rounded shadow-sm">
              ${region.name}
            </div>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [60, 40],
        iconAnchor: [30, 20]
      });

      const marker = this.L.marker([region.coords[0], region.coords[1]], { icon });
      
      marker.bindPopup(`
        <div class="text-center p-2">
          <h3 class="font-bold text-lg text-gray-800 mb-2">${region.name}</h3>
          <div class="flex items-center justify-center gap-2 mb-2">
            <div class="w-4 h-4 rounded-full" style="background-color: ${region.color}"></div>
            <span class="text-sm font-medium">Densité: ${region.density}</span>
          </div>
          <p class="text-xs text-gray-600">
            ${this.getDensityCategory(region.density)}
          </p>
        </div>
      `);

      marker.addTo(this.senegalLayer);
    });
  }

  private getDensityColor(density: number): string {
    if (density > 100) return '#dc2626';
    if (density > 70) return '#fb923c';
    if (density > 45) return '#fdba74';
    if (density > 25) return '#fed7aa';
    if (density > 10) return '#fed7aa';
    return '#fef3e2';
  }

  private getIconSize(density: number): string {
    if (density > 100) return '6';
    if (density > 70) return '5';
    if (density > 45) return '4';
    if (density > 25) return '3';
    return '2';
  }

  private getDensityCategory(density: number): string {
    if (density > 100) return 'Très haute densité';
    if (density > 70) return 'Haute densité';
    if (density > 45) return 'Densité moyenne-haute';
    if (density > 25) return 'Densité moyenne';
    if (density > 10) return 'Densité faible';
    return 'Très faible densité';
  }

  private isInRegion(cityName: string, regionName: string): boolean {
    // Mapping des villes principales aux régions
    const regionMapping: { [key: string]: string[] } = {
      'Dakar': ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque'],
      'Thiès': ['Thiès', 'Mbour', 'Tivaouane'],
      'Diourbel': ['Diourbel', 'Touba', 'Mbacké'],
      'Kaolack': ['Kaolack', 'Kaffrine', 'Nioro du Rip'],
      'Fatick': ['Fatick', 'Foundiougne', 'Gossas'],
      'Saint-Louis': ['Saint-Louis', 'Louga', 'Linguère'],
      'Matam': ['Matam', 'Podor', 'Ranérou-Ferlo'],
      'Tambacounda': ['Tambacounda', 'Bakel', 'Goudiry'],
      'Kédougou': ['Kédougou', 'Salemata', 'Saraya'],
      'Kolda': ['Kolda', 'Médina Yoro Foulah', 'Vélingara'],
      'Sédhiou': ['Sédhiou', 'Bounkiling', 'Goudomp'],
      'Ziguinchor': ['Ziguinchor', 'Oussouye', 'Bignona']
    };

    return regionMapping[regionName]?.includes(cityName) || false;
  }
}