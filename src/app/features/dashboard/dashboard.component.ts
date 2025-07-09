import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef, signal, Inject, PLATFORM_ID, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  Chart, 
  ChartConfiguration, 
  ArcElement, 
  DoughnutController,
  Legend,
  Tooltip,
  Title, 
  registerables
} from 'chart.js';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


import { GeoJsonObject, Feature } from 'geojson';


let L: any;

if (typeof window !== 'undefined') {
  import('leaflet').then((leaflet) => {
    L = leaflet;
  });
}

// Enregistrer tous les composants Chart.js
Chart.register(...registerables);



interface StatCard {
  value: string;
  title: string;
  change: string;
  changeText: string;
  icon: string;
  iconPath: string;
  iconColor: string;
  changeType: 'positive' | 'negative' | 'warning';
}

interface ChartData {
  name: string;
  value: number;
}

interface RegionData {
  name: string;
  density: number;
  cities: string[];
}
interface RegionData {
  name: string;
  center: [number, number];
  density: number;
  properties: number;
  population: number;
  coords: [number, number][];
  cities: string[];
}


@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild('barChart', { static: false }) barChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('completionChart', { static: false }) completionChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('revenueChart', { static: false }) revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChart', { static: false }) pieChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('donutChart', { static: false }) donutChart!: ElementRef<HTMLCanvasElement>;

  
  private map!: L.Map;
  private senegalLayer!: L.LayerGroup;
  isPlatformBrowser = isPlatformBrowser;
  private L: any;
  // Exemple de densités fictives
  regionDensities: Record<string, number> = {
    'Dakar': 120,
    'Thiès': 65,
    'Kaolack': 35,
    'Diourbel': 45,
    'Saint-Louis': 15,
    'Fatick': 30,
    'Ziguinchor': 50,
    'Kolda': 12,
    'Matam': 8,
    'Kaffrine': 10,
    'Sédhiou': 20,
    'Kédougou': 5,
    'Tambacounda': 7,
    'Louga': 18
  };

// variable pour le scroll horizontale des statCards

  scrollOffset = 0;
  maxScrollOffset = 0;
  private regionLayers!: any;
  isOpen = false;
  selectedRegion = '';
  showRegionInfo = false;
  regionInfo: any = {};
  private isBrowser: boolean;

  isDropdownOpen = false;
  selectedTheme = 'Pdf';

  private svg: any;
  private width = 900;
  private height = 600;
  private tooltip: any;
  // Données précises des régions basées sur votre image
  regionsData: { [key: string]: RegionData } = {
    'dakar': {
      name: 'DAKAR',
      center: [14.7167, -17.4677],
      density: 120,
      properties: 25420,
      population: 3732284,
      cities: ['Dakar', 'Pikine', 'Guédiawaye', 'Rufisque'],
      coords: [
        [14.6000, -17.5500],
        [14.8200, -17.5500],
        [14.8200, -17.2800],
        [14.6000, -17.2800]
      ]
    },
    'thies': {
      name: 'THIÈS',
      center: [14.7886, -16.9260],
      density: 55,
      properties: 12950,
      population: 1941166,
      cities: ['Thiès', 'Tivaouane', 'Mbour', 'Joal-Fadiouth'],
      coords: [
        [14.4000, -17.2000],
        [15.2000, -17.2000],
        [15.2000, -16.4000],
        [14.4000, -16.4000]
      ]
    },
    'diourbel': {
      name: 'DIOURBEL',
      center: [14.6561, -16.2372],
      density: 45,
      properties: 8650,
      population: 1677651,
      cities: ['Diourbel', 'Touba', 'Mbacké'],
      coords: [
        [14.2000, -16.8000],
        [15.2000, -16.8000],
        [15.2000, -15.8000],
        [14.2000, -15.8000]
      ]
    },
    'fatick': {
      name: 'FATICK',
      center: [14.3347, -16.4017],
      density: 35,
      properties: 6200,
      population: 792477,
      cities: ['Fatick', 'Gossas', 'Foundiougne', 'Sokone'],
      coords: [
        [13.7000, -16.8000],
        [14.6000, -16.8000],
        [14.6000, -15.6000],
        [13.7000, -15.6000]
      ]
    },
    'kaolack': {
      name: 'KAOLACK',
      center: [14.1542, -16.0728],
      density: 42,
      properties: 7100,
      population: 960875,
      cities: ['Kaolack', 'Nioro du Rip', 'Guinguinéo'],
      coords: [
        [13.6000, -16.4000],
        [14.6000, -16.4000],
        [14.6000, -15.4000],
        [13.6000, -15.4000]
      ]
    },
    'kaffrine': {
      name: 'KAFFRINE',
      center: [14.1058, -15.5506],
      density: 25,
      properties: 3850,
      population: 620137,
      cities: ['Kaffrine', 'Birkilane', 'Koungheul', 'Malem Hodar'],
      coords: [
        [13.6000, -15.8000],
        [14.8000, -15.8000],
        [14.8000, -14.8000],
        [13.6000, -14.8000]
      ]
    },
    'saint-louis': {
      name: 'SAINT-LOUIS',
      center: [16.0300, -16.4900],
      density: 18,
      properties: 4200,
      population: 1039251,
      cities: ['Saint-Louis', 'Dagana', 'Podor', 'Richard-Toll'],
      coords: [
        [15.4000, -17.0000],
        [16.8000, -17.0000],
        [16.8000, -15.6000],
        [15.4000, -15.6000]
      ]
    },
    'louga': {
      name: 'LOUGA',
      center: [15.6186, -16.2269],
      density: 22,
      properties: 4850,
      population: 968171,
      cities: ['Louga', 'Kebemer', 'Linguère'],
      coords: [
        [14.8000, -16.8000],
        [16.2000, -16.8000],
        [16.2000, -15.0000],
        [14.8000, -15.0000]
      ]
    },
    'matam': {
      name: 'MATAM',
      center: [15.6547, -13.2553],
      density: 12,
      properties: 2950,
      population: 673364,
      cities: ['Matam', 'Kanel', 'Ranérou Ferlo', 'Ourossogui'],
      coords: [
        [15.0000, -14.2000],
        [16.8000, -14.2000],
        [16.8000, -12.0000],
        [15.0000, -12.0000]
      ]
    },
    'tambacounda': {
      name: 'TAMBACOUNDA',
      center: [13.7671, -13.6679],
      density: 8,
      properties: 2200,
      population: 711651,
      cities: ['Tambacounda', 'Bakel', 'Goudiry', 'Koumpentoum'],
      coords: [
        [12.8000, -15.2000],
        [15.2000, -15.2000],
        [15.2000, -11.8000],
        [12.8000, -11.8000]
      ]
    },
    'kedougou': {
      name: 'KÉDOUGOU',
      center: [12.5569, -12.1831],
      density: 5,
      properties: 880,
      population: 197175,
      cities: ['Kédougou', 'Saraya', 'Salémata'],
      coords: [
        [11.8000, -13.2000],
        [13.4000, -13.2000],
        [13.4000, -11.0000],
        [11.8000, -11.0000]
      ]
    },
    'kolda': {
      name: 'KOLDA',
      center: [13.2392, -14.9431],
      density: 15,
      properties: 3650,
      population: 714392,
      cities: ['Kolda', 'Vélingara', 'Médina Yoro Foulah'],
      coords: [
        [12.6000, -15.8000],
        [13.8000, -15.8000],
        [13.8000, -13.8000],
        [12.6000, -13.8000]
      ]
    },
    'sedhiou': {
      name: 'SÉDHIOU',
      center: [12.7081, -15.5581],
      density: 18,
      properties: 3200,
      population: 584887,
      cities: ['Sédhiou', 'Goudomp', 'Bounkiling'],
      coords: [
        [12.1000, -16.4000],
        [13.4000, -16.4000],
        [13.4000, -14.8000],
        [12.1000, -14.8000]
      ]
    },
    'ziguinchor': {
      name: 'ZIGUINCHOR',
      center: [12.5681, -16.2725],
      density: 28,
      properties: 4800,
      population: 614786,
      cities: ['Ziguinchor', 'Oussouye', 'Bignona'],
      coords: [
        [11.9000, -16.8000],
        [13.2000, -16.8000],
        [13.2000, -15.6000],
        [11.9000, -15.6000]
      ]
    }
  };

 

  
  regions = [
    'Toutes les régions',
    'Dakar',
    'Thiès',
    'Saint-Louis',
    'Diourbel',
    'Kaolack',
    'Tambacounda',
    'Ziguinchor',
    'Louga',
    'Fatick',
    'Kolda',
    'Matam',
    'Kaffrine',
    'Kédougou',
    'Sédhiou'
  ];

  periods = [
    'Toutes les périodes',
    '2024',
    '2023',
    '2022',
    '2021',
    '2020'
  ];


  public occupiedPercentage: number = 80;
  public vacantPercentage: number = 20;
  
  private chart: Chart | null = null;

  // Positions des étiquettes
  label80X: number = 0;
  label80Y: number = 0;
  label20X: number = 0;
  label20Y: number = 0;

    // Propriétés pour le graphique de progression

  selectedPeriod = 'Période';
  
  // Données de la charte (environ 75% avec GPS, 25% sans GPS)
  chartData = {
    withGPS: 75,
    withoutGPS: 25
  };

  // Propriétés du graphique
  completionRate: number = 40;
  
  // Propriétés pour le SVG
  centerX: number = 150;
  centerY: number = 150;
  radius: number = 100;
  
  // Propriétés calculées
  circumference: number = 0;
  dashOffset: number = 0;
  backgroundPath: string = '';
  progressPath: string = '';
  indicatorX: number = 0;
  indicatorY: number = 0;


 
  private barChart?: Chart;
  private completionChart?: Chart;
  // private revenueChart?: Chart;
  private geoChart?: Chart;

 


  // Signaux pour les données du dashboard
  currentIndex = 0;
  allStats: StatCard[] = [
    {
      value: "1500",
      title: "Biens immobiliers",
      change: "+5",
      changeText: "nouveaux cette année",
      icon: "house",
      iconPath: "assets/images/icones/case.svg",
      iconColor: "text-blue-500",
      changeType: "positive"
    },
    {
      value: "963",
      title: "En location",
      change: "+20",
      changeText: "nouveaux ce mois-ci",
      icon: "location",
      iconPath: "assets/images/icones/case.svg",
      iconColor: "text-blue-500",
      changeType: "positive"
    },
    {
      value: "127",
      title: "En copropriété",
      change: "02",
      changeText: "En litige",
      icon: "copropriete",
      iconPath: "assets/images/icones/case.svg",
      iconColor: "text-blue-500",
      changeType: "warning"
    },
    {
      value: "1090",
      title: "Bâtiments occupés",
      change: "+20",
      changeText: "cette année",
      icon: "building",
      iconPath: "assets/images/icones/case.svg",
      iconColor: "text-blue-500",
      changeType: "positive"
    },
    {
      value: "410",
      title: "Bâtiments",
      change: "-40",
      changeText: "cette année",
      icon: "user",
      iconPath: "assets/images/icones/case.png",
      iconColor: "text-blue-500",
      changeType: "negative"
    }
  ];


  
  barChartData = signal<ChartData[]>([
    { name: 'Éducation', value: 1000 },
    { name: 'Intérieur', value: 1500 },
    { name: 'Justice', value: 1300 },
    { name: 'Autres', value: 1100 }
  ]);

  

  revenueData = signal<{ occupied: number; vacant: number }>({
    occupied: 80,
    vacant: 20
  });

  geoData = signal<{ withGPS: number; withoutGPS: number }>({
    withGPS: 75,
    withoutGPS: 25
  });
  elementRef: any;




  // selectedPeriod = signal<string>('Cette année');
  // selectedRegion = signal<string>('Toutes les régions');

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
    ) 
  {
    
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    
    
    // N'enregistrer Chart.js que côté client
    if (this.isBrowser && typeof Chart !== 'undefined') {
      Chart.register(...registerables);
    }
  }

  ngOnInit(): void {
    this.calculatePaths();
    this.animateProgress();
    this.createChart();
      
  }


   ngAfterViewInit(): void {
    // Ne créer les graphiques que côté client
    this.initMap();

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeCharts();
      }, 0);
    }
    this.maxScrollOffset = -50;
    
  
  }

  ngOnDestroy(): void {
    // Nettoyer les graphiques seulement côté client
    if (this.isBrowser) {
      this.destroyCharts();
    }
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private initializeCharts(): void {
    if (!this.isBrowser) return;

    this.createBarChart();
    this.drawPieChart();
    //  this.createRevenueChart();
    this.createChart();
  }

  private destroyCharts(): void {
    if (!this.isBrowser) return;

    try {
      if (this.barChart) {
        this.barChart.destroy();
        this.barChart = undefined;
      }
      if (this.completionChart) {
        this.completionChart.destroy();
        this.completionChart = undefined;
      }
    
      if (this.geoChart) {
        this.geoChart.destroy();
        this.geoChart = undefined;
      }
    } catch (error) {
      console.error('Erreur lors de la destruction des graphiques:', error);
    }
  }

  // methode pour les statCards
  onScroll(event: WheelEvent): void {
    event.preventDefault();
    
    const scrollSensitivity = 2;
    const deltaX = event.deltaX || event.deltaY;
    
    // Calculer le nouveau offset
    let newOffset = this.scrollOffset - (deltaX * scrollSensitivity);
    
    // Limiter le défilement
    if (newOffset > 0) {
      newOffset = 0; // Pas de défilement vers la gauche au-delà de la position initiale
    } else if (newOffset < this.maxScrollOffset) {
      newOffset = this.maxScrollOffset; // Limiter le défilement vers la droite
    }
    
    this.scrollOffset = newOffset;
  }


  selectTheme(theme: string) {
    this.selectedTheme = theme;
    this.isDropdownOpen = false;
    // Ici vous pouvez ajouter la logique pour appliquer le thème
    console.log('Thème sélectionné:', theme);
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

  // Fermer le dropdown si on clique à l'extérieur
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    this.closeDropdown();
  }

    
// methode pour la bar de progression
  private createBarChart(): void {
    if (!this.isBrowser || !this.barChartRef?.nativeElement) return;

    try {
      const ctx = this.barChartRef.nativeElement.getContext('2d');
      if (!ctx) return;

      const data = this.barChartData();
      
      this.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(item => item.name),
          datasets: [{
            data: data.map(item => item.value),
            backgroundColor: ['#95A4FC', '#096BFF', '#1C1C1C', '#FFC803'],
            borderRadius: 6,
            barThickness: 20
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
              max: 1600,
              ticks: {
                stepSize: 200,
                color: '#6B7280'
              },
              grid: {
                color: '#E5E7EB'
              }
            },
            x: {
              ticks: {
                color: '#6B7280'
              },
              grid: {
                display: false
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création du graphique en barres:', error);
    }
  }

 
  /**
   * Crée le graphique de progression
   * Crée le graphique donut avec Chart.js
   */
  private createChart(): void {
    // Vérifier que l'élément existe
    if (!this.donutChart?.nativeElement) {
      console.error('Canvas element not found');
      return;
    }
    
    const ctx = this.donutChart.nativeElement.getContext('2d');
    
    if (!ctx) {
      console.error('Unable to get 2D context');
      return;
    }

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: ['Bâtiments occupés', 'Bâtiments vacants'],
        datasets: [{
          data: [this.occupiedPercentage, this.vacantPercentage],
          backgroundColor: [
            '#096BFF', // Bleu pour occupés
            '#95A4FC',// Violet pour vacants

          ],
          borderWidth: 0,
          hoverBackgroundColor: [
            '#2563eb', // Bleu plus foncé au hover
            '#8b5cf6'  // Violet plus foncé au hover
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '50%',
        plugins: {
          legend: {
            display: false // Légende personnalisée en HTML
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'white',
            titleColor: '#374151',
            bodyColor: '#374151',
            borderColor: '#e5e7eb',
            borderWidth: 1,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed;
                return `${label}: ${value}%`;
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutCubic'
        },
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        onHover: (event, elements) => {
          if (event.native?.target) {
            (event.native.target as HTMLElement).style.cursor = elements.length > 0 ? 'pointer' : 'default';
          }
        }
      },
      plugins: [{
        id: 'percentageLabels',
        afterDatasetsDraw: (chart) => {
          const ctx = chart.ctx;
          const data = chart.data.datasets[0].data as number[];
          
          chart.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            
            meta.data.forEach((element, index) => {
              const percentage = data[index];
              
              // Cast vers ArcElement pour accéder aux propriétés spécifiques
              const arcElement = element as ArcElement;
              
              // Utiliser les propriétés spécifiques à ArcElement
              const centerPoint = {
                x: arcElement.x,
                y: arcElement.y
              };
              
              const radius = (arcElement.outerRadius + arcElement.innerRadius) / 2;
              
              // Calculer la position de l'étiquette
              const angle = (arcElement.startAngle + arcElement.endAngle) / 2;
              const x = centerPoint.x + Math.cos(angle) * radius * 1.4;
              const y = centerPoint.y + Math.sin(angle) * radius * 1.4;
              
              // Dessiner l'étiquette avec fond blanc
              ctx.save();
              ctx.fillStyle = 'white';
              ctx.strokeStyle = '#e5e7eb';
              ctx.lineWidth = 1;
              
              // Fond arrondi
              const labelWidth = 35;
              const labelHeight = 25;
              ctx.beginPath();
              ctx.roundRect(x - labelWidth/2, y - labelHeight/2, labelWidth, labelHeight, 12);
              ctx.fill();
              ctx.stroke();
              
              // Texte
              ctx.fillStyle = '#374151';
              ctx.font = 'bold 12px sans-serif';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(`${percentage}%`, x, y);
              ctx.restore();
            });
          });
        }
      }]
    };

    // Détruire le graphique existant s'il y en a un
    if (this.chart) {
      this.chart.destroy();
    }

    // Créer le nouveau graphique
    this.chart = new Chart(ctx, config);
    
    console.log('Chart created successfully');
  }
  
  



  /**
   * Met à jour les données du graphique
   */
  public updateData(occupied: number, vacant: number): void {
    if (occupied + vacant === 100 && occupied >= 0 && vacant >= 0) {
      this.occupiedPercentage = occupied;
      this.vacantPercentage = vacant;
      
      if (this.chart) {
        this.chart.data.datasets[0].data = [occupied, vacant];
        this.chart.update('active');
      }
    }
  }

  /**
   * Charge les données depuis une API
   */
  public async loadRevenueData(): Promise<void> {
    try {
      // Exemple d'appel API
      // const response = await this.apiService.getRevenueData().toPromise();
      // this.updateData(response.occupied, response.vacant);
      
      // Simulation pour l'exemple
      setTimeout(() => {
        this.updateData(75, 25); // Nouvelles valeurs simulées
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      this.handleApiError(error);
    }
  }

  /**
   * Gère les erreurs d'API
   */
  private handleApiError(error: any): void {
    // Logique de gestion d'erreur
    console.error('Erreur API:', error);
    // Afficher un message d'erreur à l'utilisateur
    // this.notificationService.showError('Erreur lors du chargement des données');
  }


  /**
   * Calcule les chemins SVG pour le graphique semi-circulaire
   */
  private calculatePaths(): void {
    // Calcul du chemin de fond (demi-cercle complet)
    this.backgroundPath = this.createSemicirclePath(this.centerX, this.centerY, this.radius);
    this.progressPath = this.createSemicirclePath(this.centerX, this.centerY, this.radius);
    
    // Calcul de la circonférence pour le demi-cercle
    this.circumference = Math.PI * this.radius;
  }

  /**
   * Crée le chemin SVG pour un demi-cercle
   */
  private createSemicirclePath(centerX: number, centerY: number, radius: number): string {
    const startX = centerX - radius;
    const startY = centerY;
    const endX = centerX + radius;
    const endY = centerY;
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`;
  }

  /**
   * Anime la progression du graphique
   */
  private animateProgress(): void {
    // Animation avec un délai pour l'effet visuel
    setTimeout(() => {
      // Calcul du décalage pour afficher le pourcentage correct
      const progressPercentage = this.completionRate / 100;
      this.dashOffset = this.circumference * (1 - progressPercentage);
      
      // Calcul de la position du point indicateur
      this.calculateIndicatorPosition();
    }, 100);
  }

  /**
   * Calcule la position du point indicateur
   */
  private calculateIndicatorPosition(): void {
    // Angle pour le pourcentage donné (0 à 180 degrés pour un demi-cercle)
    const angle = (this.completionRate / 100) * Math.PI;
    
    // Position du point indicateur
    this.indicatorX = this.centerX - this.radius * Math.cos(angle);
    this.indicatorY = this.centerY - this.radius * Math.sin(angle);
  }

  /**
   * Met à jour le taux de complétion (méthode publique pour les tests ou mises à jour)
   */
  public updateCompletionRate(newRate: number): void {
    if (newRate >= 0 && newRate <= 100) {
      this.completionRate = newRate;
      this.animateProgress();
    }
  }

//  Methode pour le graphique géographique
  onRegionChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedRegion = target.value;
  }

  // methode pour le graphique géographique
  onPeriodChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.selectedPeriod = target.value;
  }

  // methode pour le graphique géographique
  drawPieChart() {
    const canvas = this.pieChart.nativeElement;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.warn('Cannot get canvas context');
      return;
    }
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 100;

    // Calculer les angles
    const withGPSAngle = (this.chartData.withGPS / 100) * 2 * Math.PI;
    const withoutGPSAngle = (this.chartData.withoutGPS / 100) * 2 * Math.PI;

    // Dessiner la partie bleue (avec GPS)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, 0, withGPSAngle);
    ctx.closePath();
    ctx.fillStyle = '#4F9CF9'; // Couleur bleue
    ctx.fill();

    // Dessiner la partie grise (sans GPS)
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, withGPSAngle, withGPSAngle + withoutGPSAngle);
    ctx.closePath();
    ctx.fillStyle = '#E5E7EB'; // Couleur grise
    ctx.fill();
  }
 /**
  * Rafraîchit le graphique avec de nouvelles données
   */
  public refreshChart(data: { occupied: number, vacant: number }): void {
    this.updateData(data.occupied, data.vacant);
  }

  /**
   * Exporte le graphique en image
   */
  public exportChart(): string | undefined {
    return this.chart?.toBase64Image();
  }

  /**
   * Détruit et recrée le graphique
   */
  public recreateChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    this.createChart();
  }

  

  // onPeriodChange(period: string): void {
  //   this.selectedPeriod.set(period);
  //   if (this.isBrowser) {
  //     this.updateChartsData();
  //   }
  // }

  // onRegionChange(region: string): void {
  //   this.selectedRegion.set(region);
  //   if (this.isBrowser) {
  //     this.updateChartsData();
  //   }
  // }

  private updateChartsData(): void {
    if (!this.isBrowser) return;

    // Logique pour mettre à jour les données des graphiques
    this.destroyCharts();
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }

  exportData(): void {
    // Logique d'exportation
    console.log('Exportation des données...');
    
    if (this.isBrowser) {
      // Exemple d'exportation côté client
      const data = {
        // statCards: this.statCards(),
        barChartData: this.barChartData(),
        // completionRate: this.completionRate(),
        revenueData: this.revenueData(),
        geoData: this.geoData(),
        // selectedPeriod: this.selectedPeriod(),
        // selectedRegion: this.selectedRegion()
      };
      
      // Créer et télécharger un fichier JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }
 

  // Coordonnées simplifiées des régions du Sénégal
  private regionPaths = {
    'DAKAR': 'M120,320 L180,310 L190,340 L170,360 L140,365 L115,345 Z',
    'THIES': 'M180,310 L240,300 L260,330 L250,350 L220,355 L190,340 Z',
    'DIOURBEL': 'M240,300 L300,290 L320,320 L310,340 L280,345 L260,330 Z',
    'FATICK': 'M140,365 L170,360 L190,380 L180,400 L150,405 L130,385 Z',
    'KAOLACK': 'M190,380 L250,370 L270,390 L260,410 L230,415 L200,400 Z',
    'KAFFRINE': 'M270,390 L330,380 L350,400 L340,420 L310,425 L280,410 Z',
    'LOUGA': 'M200,180 L280,170 L300,200 L290,220 L260,225 L230,205 Z',
    'SAINT-LOUIS': 'M150,80 L220,70 L240,100 L230,120 L200,125 L170,105 Z',
    'MATAM': 'M500,120 L580,110 L600,140 L590,160 L560,165 L530,145 Z',
    'TAMBACOUNDA': 'M450,260 L550,250 L570,280 L560,300 L530,305 L480,285 Z',
    'KÉDOUGOU': 'M650,380 L730,370 L750,400 L740,420 L710,425 L680,405 Z',
    'KOLDA': 'M350,420 L430,410 L450,440 L440,460 L410,465 L380,445 Z',
    'SÉDHIOU': 'M280,460 L360,450 L380,480 L370,500 L340,505 L310,485 Z',
    'ZIGUINCHOR': 'M200,500 L280,490 L300,520 L290,540 L260,545 L230,525 Z'
  };

  // Getter pour vérifier si les graphiques peuvent être affichés
  get canShowCharts(): boolean {
    return this.isBrowser;
  }

 
  private initMap(): void {
    this.map = L.map('map', {
      center: [14.5, -14.5],
      zoom: 8,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Ajout des régions colorées
    L.geoJSON(this.regions as any, {
      style: (feature: any) => {
        const region = feature.properties.name;
        const density = this.regionDensities[region] || 0;
        return {
          fillColor: this.getColor(density),
          weight: 1,
          opacity: 1,
          color: '#999',
          fillOpacity: 0.7
        };
      },
      
onEachFeature: (feature: Feature, layer: L.Layer) => {
  const region = (feature.properties as any).name;
  const density = this.regionDensities[region] || 0;
  layer.bindTooltip(`${region} : ${density}`);
}
    }).addTo(this.map);
  }

  private getColor(d: number): string {
    return d > 100 ? '#7f1d1d' :
           d > 70  ? '#b91c1c' :
           d > 45  ? '#ef4444' :
           d > 25  ? '#f97316' :
           d > 10  ? '#fdba74' :
                     '#fef3c7';
  }
  
  private getStyle = (feature: any) => {
    const density = feature.properties.density;
    return {
      fillColor: getColor(density),
      weight: 1,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };
  
  private onEachFeature = (feature: any, layer: any) => {
    const name = feature.properties.name || 'Département';
    const density = feature.properties.density || 'N/A';
    layer.bindPopup(`<strong>${name}</strong><br/>Densité : ${density}`);
  };
  

  
}

// 💡 Couleur selon densité (identique à la légende sur l’image)
function getColor(d: number): string {
  return d > 100 ? '#6A0D1F' :
         d > 70  ? '#B22222' :
         d > 45  ? '#FF7F50' :
         d > 25  ? '#FFA07A' :
         d > 10  ? '#FFE4B5' :
                   '#F5F5DC';
}


