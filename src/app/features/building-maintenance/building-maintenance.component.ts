import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Tab {
  id: string;
  name: string;
  active: boolean;
}

interface Task {
  id: number;
  name: string;
  nature: string;
  provider: string;
  status: string;
  creationDate: string;
  dueDate: string;
  isUrgent: boolean;
  selected: boolean;
}

@Component({
    selector: 'app-building-maintenance',
    imports: [CommonModule, FormsModule],
    templateUrl: './building-maintenance.component.html'
})
export class BuildingMaintenanceComponent implements OnInit {
  tabs: Tab[] = [
    { id: 'info', name: 'Informations générales', active: false },
    { id: 'maintenance', name: 'Travaux & Maintenance', active: true },
    { id: 'documents', name: 'Documents', active: false },
    { id: 'locations', name: 'Locations', active: false },
    { id: 'co-ownership', name: 'Copropriété', active: false }
  ];

  openDropdown: string | null = null;
  allSelected: boolean = false;
  currentPage: number = 1;

  tasks: Task[] = [
    {
      id: 1,
      name: 'Réparation fuite WC',
      nature: 'Plomberie',
      provider: 'WCHelp',
      status: 'Annulé',
      creationDate: '27/03/2025',
      dueDate: '10/04/2025',
      isUrgent: false,
      selected: false
    },
    {
      id: 2,
      name: 'Réfection éclairage LED',
      nature: 'Électricité',
      provider: 'ElectroPlus',
      status: 'Terminé',
      creationDate: '10/03/2025',
      dueDate: '10/04/2025',
      isUrgent: false,
      selected: true
    },
    {
      id: 3,
      name: 'Repeindre cage escalier',
      nature: 'Peinture',
      provider: 'ColorPlus Services',
      status: 'En cours',
      creationDate: '05/02/2025',
      dueDate: '06/03/2025',
      isUrgent: true,
      selected: false
    },
    {
      id: 4,
      name: 'Réparation fuite WC',
      nature: 'Plomberie',
      provider: 'ToiletCall',
      status: 'En attente',
      creationDate: '01/04/2025',
      dueDate: '20/04/2025',
      isUrgent: false,
      selected: false
    },
    {
      id: 5,
      name: 'Repeindre cage escalier',
      nature: 'Peinture',
      provider: 'ColorPlus Services',
      status: 'Terminé',
      creationDate: '05/02/2025',
      dueDate: '07/04/2025',
      isUrgent: false,
      selected: true
    },
    {
      id: 6,
      name: 'Réparation fuite WC',
      nature: 'Plomberie',
      provider: 'WCHelp',
      status: 'Annulé',
      creationDate: '27/03/2025',
      dueDate: '10/04/2025',
      isUrgent: false,
      selected: false
    }
  ];

  constructor() {}

  ngOnInit(): void {
    this.updateSelectAllState();
  }

  selectTab(tabId: string): void {
    this.tabs.forEach(tab => {
      tab.active = tab.id === tabId;
    });
  }

  toggleDropdown(dropdown: string): void {
    if (this.openDropdown === dropdown) {
      this.openDropdown = null;
    } else {
      this.openDropdown = dropdown;
    }
  }

  toggleSelectAll(): void {
    this.tasks.forEach(task => {
      task.selected = this.allSelected;
    });
  }

  updateSelectAllState(): void {
    this.allSelected = this.tasks.length > 0 && this.tasks.every(task => task.selected);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= 2) {
      this.currentPage = page;
    }
  }
}