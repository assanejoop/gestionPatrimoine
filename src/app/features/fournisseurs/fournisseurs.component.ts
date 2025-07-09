// fournisseurs.component.ts
import { Component, OnInit, inject, signal, effect, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface FournisseurStats {
  fournisseursActifs: number;
  contratsEnCours: number;
  tauxSatisfaction: number;
}

interface SpecialiteData {
  specialite: string;
  count: number;
  percentage: number;
  color: string;
}

interface MontantData {
  facture: number;
  paye: number;
  facturePercentage: number;
  payePercentage: number;
}

interface ContratData {
  fournisseur: string;
  contrats: number;
}

interface MontantEngageData {
  fournisseur: string;
  montant: number;
}

interface InterventionHistorique {
  id: string;
  type: string;
  date: string;
  time: string;
  fournisseur: string;
  icon: string;
}

interface FournisseurFilters {
  periode: string;
  region: string;
}
interface DocumentStats {
  associatedDocuments: number;
  archivedDocuments: number;
  expiredDocuments: number;
}


@Component({
    selector: 'app-fournisseurs',
    imports: [CommonModule, RouterModule],
    templateUrl: './fournisseurs.component.html',
    styleUrls: ['./fournisseurs.component.css']
})
export class FournisseursComponent implements OnInit {

  documentStats: DocumentStats = {
    associatedDocuments: 1248,
    archivedDocuments: 127,
    expiredDocuments: 12
  };
  isDropdownOpen = false;
  selectedTheme = 'Pdf';
  elementRef: any;

  isOpen = false;
  selectedRegion = '';
  // Signaux pour les données principales
  fournisseurStats = signal<FournisseurStats>({
    fournisseursActifs: 42,
    contratsEnCours: 67,
    tauxSatisfaction: 4.2
  });

  // Données pour la répartition par spécialité (correspondant à l'image)
  specialiteData = signal<SpecialiteData[]>([
    { specialite: 'Maintenance', count: 18, percentage: 42.8, color: '#4285f4' },
    { specialite: 'Sécurité', count: 8, percentage: 19.1, color: '#34a853' },
    { specialite: 'Informatique', count: 10, percentage: 23.8, color: '#fbbc04' },
    { specialite: 'Nettoyage', count: 6, percentage: 14.3, color: '#f4b6c2' }
  ]);

  // Données pour montant facturé vs payé
  montantData = signal<MontantData>({
    facture: 80,
    paye: 20,
    facturePercentage: 80,
    payePercentage: 20
  });

  // Données pour les contrats actifs par fournisseur
  contratsData = signal<ContratData[]>([
    { fournisseur: 'Fournisseur X', contrats: 16 },
    { fournisseur: 'Fournisseur Y', contrats: 24 },
    { fournisseur: 'Fournisseur Z', contrats: 20 }
  ]);

  // Données pour les montants engagés par fournisseur
  montantEngageData = signal<MontantEngageData[]>([
    { fournisseur: 'Fournisseur X', montant: 40000 },
    { fournisseur: 'Fournisseur Y', montant: 30000 },
    { fournisseur: 'Fournisseur Z', montant: 20000 }
  ]);



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
  // Historique des interventions
  interventionsHistorique = signal<InterventionHistorique[]>([
    {
      id: '1',
      type: 'Intervention de maintenance',
      date: '10/04/2025',
      time: '14:30',
      fournisseur: 'Fournisseur X',
      icon: 'maintenance'
    },
    {
      id: '2',
      type: 'Livraison matériel IT',
      date: '08/04/2025',
      time: '09:15',
      fournisseur: 'Fournisseur Y',
      icon: 'delivery'
    },
    {
      id: '3',
      type: 'Audit sécurité',
      date: '05/04/2025',
      time: '16:45',
      fournisseur: 'Fournisseur Z',
      icon: 'security'
    }
  ]);

  // Filtres
  filters = signal<FournisseurFilters>({
    periode: 'Période',
    region: 'Région'
  });

  ngOnInit(): void {
    this.loadFournisseurData();
    this.initializeCharts();
  }

  private loadFournisseurData(): void {
    console.log('Chargement des données fournisseurs...');
  }

  private initializeCharts(): void {
    setTimeout(() => {
      this.createPieChart();
      this.createDonutChart();
      this.createBarCharts();
    }, 100);
  }

  private createPieChart(): void {
    const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = this.specialiteData();
    const total = data.reduce((sum, item) => sum + item.count, 0);
    
    let currentAngle = -Math.PI / 2; // Commencer en haut
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 80;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    data.forEach(item => {
      const sliceAngle = (item.count / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      
      currentAngle += sliceAngle;
    });
  }

  private createDonutChart(): void {
    const canvas = document.getElementById('donutChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = 70;
    const innerRadius = 45;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Montant facturé (80%)
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, -Math.PI / 2, -Math.PI / 2 + (0.8 * 2 * Math.PI));
    ctx.arc(centerX, centerY, innerRadius, -Math.PI / 2 + (0.8 * 2 * Math.PI), -Math.PI / 2, true);
    ctx.closePath();
    ctx.fillStyle = '#4285f4';
    ctx.fill();

    // Montant payé (20%)
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, -Math.PI / 2 + (0.8 * 2 * Math.PI), -Math.PI / 2 + (2 * Math.PI));
    ctx.arc(centerX, centerY, innerRadius, -Math.PI / 2 + (2 * Math.PI), -Math.PI / 2 + (0.8 * 2 * Math.PI), true);
    ctx.closePath();
    ctx.fillStyle = '#a8c7fa';
    ctx.fill();

    // Texte central
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('80%', centerX, centerY + 8);
  }

  private createBarCharts(): void {
    this.createContractsBarChart();
    this.createMontantBarChart();
  }

  private createContractsBarChart(): void {
    const canvas = document.getElementById('contractsChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = this.contratsData();
    const maxValue = Math.max(...data.map(d => d.contrats));
    const barWidth = 60;
    const barSpacing = 40;
    const chartHeight = 200;
    const startX = 50;
    const startY = 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Axe Y
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY + chartHeight);
    ctx.stroke();

    // Axe X
    ctx.beginPath();
    ctx.moveTo(startX, startY + chartHeight);
    ctx.lineTo(startX + (barWidth + barSpacing) * data.length, startY + chartHeight);
    ctx.stroke();

    // Barres
    data.forEach((item, index) => {
      const barHeight = (item.contrats / maxValue) * chartHeight;
      const x = startX + (barWidth + barSpacing) * index + barSpacing / 2;
      const y = startY + chartHeight - barHeight;

      ctx.fillStyle = '#4285f4';
      ctx.fillRect(x, y, barWidth, barHeight);

      // Labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.fournisseur, x + barWidth / 2, startY + chartHeight + 20);
      
      // Valeurs
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(item.contrats.toString(), x + barWidth / 2, y - 5);
    });
  }

  private createMontantBarChart(): void {
    const canvas = document.getElementById('montantChart') as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = this.montantEngageData();
    const maxValue = Math.max(...data.map(d => d.montant));
    const barWidth = 60;
    const barSpacing = 40;
    const chartHeight = 200;
    const startX = 50;
    const startY = 20;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Axe Y
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY + chartHeight);
    ctx.stroke();

    // Axe X
    ctx.beginPath();
    ctx.moveTo(startX, startY + chartHeight);
    ctx.lineTo(startX + (barWidth + barSpacing) * data.length, startY + chartHeight);
    ctx.stroke();

    // Barres
    data.forEach((item, index) => {
      const barHeight = (item.montant / maxValue) * chartHeight;
      const x = startX + (barWidth + barSpacing) * index + barSpacing / 2;
      const y = startY + chartHeight - barHeight;

      ctx.fillStyle = '#4285f4';
      ctx.fillRect(x, y, barWidth, barHeight);

      // Labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.fournisseur, x + barWidth / 2, startY + chartHeight + 20);
      
      // Valeurs
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(this.formatMontant(item.montant), x + barWidth / 2, y - 5);
    });
  }

  // Méthodes utilitaires
  getMaxContrats(): number {
    return Math.max(...this.contratsData().map(item => item.contrats));
  }

  getMaxMontant(): number {
    return Math.max(...this.montantEngageData().map(item => item.montant));
  }

  formatMontant(montant: number): string {
    if (montant >= 1000) {
      return (montant / 1000).toFixed(0) + 'k';
    }
    return montant.toString();
  }

  onExport(): void {
    console.log('Export des données fournisseurs');
  }

  onFilterChange(filterType: string, event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.filters.update(current => ({
      ...current,
      [filterType]: target.value
    }));
  }
  formatNumber(num: number): string {
    return num.toLocaleString('fr-FR');
  }
}