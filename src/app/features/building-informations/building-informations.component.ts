import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
interface Tab {
  name: string;
  active: boolean;
}

@Component({
    selector: 'app-building-informations',
    imports: [CommonModule],
    templateUrl: './building-informations.component.html',
    styleUrl: './building-informations.component.css'
})
export class BuildingInformationsComponent {


  tabs: Tab[] = [
    { name: 'Informations générales', active: true },
    { name: 'Travaux & Maintenance', active: false },
    { name: 'Documents', active: false },
    { name: 'Locations', active: false },
    { name: 'Copropriété', active: false }
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

  constructor() { }

  ngOnInit(): void {
  }

  selectTab(selectedTab: Tab): void {
    this.tabs.forEach(tab => {
      tab.active = tab === selectedTab;
    });
  }
}

