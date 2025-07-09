import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Building {
  id: number;
  name: string;
  type: string;
  location: string;
  status: 'Vacant' | 'Occupé';
  imageUrl: string;
}

@Component({
    selector: 'app-building',
    imports: [CommonModule],
    templateUrl: './building.component.html',
    styleUrls: ['./building.component.css']
})
export class BuildingComponent implements OnInit {
  buildings: Building[] = [];
  activeFilters: { [key: string]: boolean } = {
    region: false,
    type: false,
    etat: false,
    date: false
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Simuler les données de l'API
    this.buildings = [
      {
        id: 1,
        name: 'Résidence Administrative Cheikh Anta Diop',
        type: 'Résidence',
        location: 'Dakar',
        status: 'Vacant',
        imageUrl: 'assets/images/building1.png'
      },
      {
        id: 2,
        name: 'Résidence Administrative Cheikh Anta Diop',
        type: 'Résidence',
        location: 'Dakar',
        status: 'Occupé',
        imageUrl: 'assets/images/bg1.png'
      },
      {
        id: 3,
        name: 'Résidence Administrative Cheikh Anta Diop',
        type: 'Résidence',
        location: 'Dakar',
        status: 'Occupé',
        imageUrl: 'assets/images/building3.png'
      },
      {
        id: 4,
        name: 'Résidence Administrative Cheikh Anta Diop',
        type: 'Résidence',
        location: 'Dakar',
        status: 'Occupé',
        imageUrl: 'assets/images/bg3.png'
      },
      {
        id: 5,
        name: 'Résidence Administrative Cheikh Anta Diop',
        type: 'Résidence',
        location: 'Dakar',
        status: 'Occupé',
        imageUrl: 'assets/images/bg4.png'
      },
      {
        id: 6,
        name: 'Résidence Administrative Cheikh Anta Diop',
        type: 'Résidence',
        location: 'Dakar',
        status: 'Vacant',
        imageUrl: 'assets/buildings/building6.jpg'
      },
      {
        id: 7,
        name: 'Résidence Administrative Cheikh Anta Diop',
        type: 'Résidence',
        location: 'Dakar',
        status: 'Vacant',
        imageUrl: 'assets/buildings/building6.jpg'
      },
      {
        id: 8,
        name: 'Résidence Administrative Cheikh Anta Diop',
        type: 'Résidence',
        location: 'Dakar',
        status: 'Vacant',
        imageUrl: 'assets/buildings/building4.jpg'
      }
    ];
  }

  toggleFilter(filterName: string): void {
    this.activeFilters[filterName] = !this.activeFilters[filterName];
    // Logique pour appliquer les filtres
  }

  searchBuildings(searchTerm: string): void {
    // Implémentation de la logique de recherche
    console.log('Recherche:', searchTerm);
  }

  addNewBuilding(): void {
    // Navigation ou ouverture de modal pour ajouter un nouveau bâtiment
    console.log('Ajouter un nouveau bâtiment');
  }

  viewBuildingDetails(buildingId: number): void {
    // Navigation vers la page de détails
    console.log('Voir les détails du bâtiment:', buildingId);
  }

  onSubmit(): void {
    this.router.navigate(['/dashboard/building-detail/:id']);
  }
}