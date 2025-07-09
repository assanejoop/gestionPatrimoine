import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuildingDocumentsComponent } from '../building-documents/building-documents.component';
import { BuildingMaintenanceComponent } from '../building-maintenance/building-maintenance.component';
import { BuildingInformationsComponent } from "../building-informations/building-informations.component";
import { BuildingLocationComponent } from "../building-location/building-location.component";

interface Tab {
  name: string;
  active: boolean;
  link: string;
  id: string; // Ajout d'un id pour identifier l'onglet
}

@Component({
    selector: 'app-building-detail',
    imports: [CommonModule,
    BuildingDocumentsComponent,
    BuildingMaintenanceComponent, BuildingInformationsComponent, BuildingLocationComponent],
    templateUrl: './building-detail.component.html',
    styleUrls: ['./building-detail.component.css']
})
export class BuildingDetailComponent implements OnInit {
  activeTab: string = 'Informations Generales';
   tabs: Tab[] = [
      { name: 'Informations générales', active: true, link: '#', id: 'Informations Generales' },
      { name: 'Travaux & Maintenance', active: false, link: '#', id: 'maintenance' },
      { name: 'Documents', active: false, link: '#', id: 'documents' },
      { name: 'Locations', active: false, link: '#', id: 'location' },
      { name: 'Copropriété', active: false, link: '#', id: 'Coproprietes' }
    
  ];

  buildingData = {
    name: 'Résidence Administrative Cheikh Anta Diop',
    address: 'Avenue Georges Pompidou, Dakar Plateau, Sénégal',
    mainImage: '/assets/images/immo.png', 
    interiorImage1: '/assets/images/bureau.png', 
    interiorImage2: '/assets/images/espace.png', 
    additionalImages: 15,
    description: 'La Résidence Administrative Cheikh Anta Diop, située sur l\'Avenue Georges Pompidou à Dakar Plateau (Sénégal), est un immeuble résidentiel construit en 2002. Le bâtiment s\'élève sur 5 étages et comprend 20 unités, réparties harmonieusement sur une superficie d\'environ 5 100 m² (85 m × 60 m).',
    additionalInfo: 'De type résidentiel, cette résidence combine fonctionnalité et modernité, en plein cœur du quartier administratif de Dakar. Le statut d\'occupation actuel est "occupé". La résidence bénéficie d\'un emplacement stratégique, à proximité des institutions clés et des axes principaux de la ville, ce qui en fait un lieu prisé pour l\'hébergement administratif ou résidentiel.',
    constructionYear: '2002',
    floors: '5 étages',
    units: '20 unités',
    type: 'Résidence',
    dimensions: '85 × 60 m²',
    occupancyStatus: 'Occupé'
  };

  residence = {
    name: 'Résidence Administrative Cheikh Anta Diop',
    address: 'Avenue Georges Pompidou, Dakar Plateau, Sénégal',
    type: 'Résidence',
    status: 'Occupé',
    image: 'assets/images/residence-building.jpg'
  };

  // 
  //   { id: 'general', label: 'Informations générales', active: true },
  //   { id: 'maintenance', label: 'Travaux & Maintenance', active: false },
  //   { id: 'documents', label: 'Documents', active: false },
  //   { id: 'locations', label: 'Locations', active: false },
  //   { id: 'ownership', label: 'Copropriété', active: false }
  // ];

  onTabClick(selectedTab: any) {
    this.tabs.forEach(tab => tab.active = false);
    selectedTab.active = true;
  }

  onModifyBuilding() {
    console.log('Modifier le bâtiment clicked');
    // Logique pour modifier le bâtiment
  }

  onChangeOccupationStatus() {
    console.log('Changer le statut d\'occupation clicked');
    // Logique pour changer le statut d'occupation
  }

  constructor() { }

  ngOnInit(): void {
  }
  selectTab(selectedTab: Tab): void {
    this.tabs.forEach(tab => {
      tab.active = tab === selectedTab;
    });
    this.activeTab = selectedTab.id;
  }
}