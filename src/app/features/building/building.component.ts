import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BuildingModalComponent } from '../building-modal/building-modal.component';


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
    imports: [CommonModule, RouterLink],
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

  private readonly router = inject(Router);

  

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
        imageUrl: 'assets/images/bg3.png'
      },
      {
        id: 7,
        name: 'Résidence Administrative Cheikh Anta Diop',
        type: 'Résidence',
        location: 'Dakar',
        status: 'Vacant',
        imageUrl: 'assets/images/bg3.png'
      },
      {
        id: 8,
        name: 'Résidence Administrative Cheikh Anta Diop',
        type: 'Résidence',
        location: 'Dakar',
        status: 'Vacant',
        imageUrl: 'assets/images/building4.png'
      }
    ];
  }

  showModal = false;

openModal() {
  this.showModal = true;
}

closeModal() {
  this.showModal = false;
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