import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Tab {
  id: string;
  name: string;
  active: boolean;
}

interface FileCreator {
  name: string;
  role: string;
  avatar?: string;
  initials: string;
  image:string;
}

interface DocumentFile {
  id: number;
  name: string;
  creator: FileCreator;
  size: string;
  creationDate: string;
  lastModified: string;
  selected: boolean;
  
}

interface Folder {
  id: number;
  name: string;
  fileCount: number;
  icon: string;
  color: string;
}

@Component({
    selector: 'app-building-documents',
    imports: [CommonModule, FormsModule],
    templateUrl: './building-documents.component.html'
})
export class BuildingDocumentsComponent implements OnInit {
  tabs: Tab[] = [
    { id: 'info', name: 'Informations générales', active: false },
    { id: 'maintenance', name: 'Travaux & Maintenance', active: false },
    { id: 'documents', name: 'Documents', active: true },
    { id: 'locations', name: 'Locations', active: false },
    { id: 'co-ownership', name: 'Copropriété', active: false }
  ];

  folders: Folder[] = [
    { id: 1, name: 'Contrats', fileCount: 5, icon: 'document', color: 'red' },
    { id: 2, name: 'Factures', fileCount: 7, icon: 'document', color: 'purple' },
    { id: 3, name: 'Devis', fileCount: 4, icon: 'calculator', color: 'amber' },
    { id: 4, name: 'Autres', fileCount: 9, icon: 'folder', color: 'blue' }
  ];

  files: DocumentFile[] = [
    {
      id: 1,
      name: 'contratdeconstruction.pdf',
      creator: {
        name: 'Lamine Niang',
        role: 'Administrateur',
        initials: 'LN',
        image:'assets/images/avatar3.png',
      },
      size: '675 MB',
      creationDate: '27/03/2025',
      lastModified: '09/04/2025',
      selected: false
    },
    {
      id: 2,
      name: 'conventiondetravaux​bâtiment.doc',
      creator: {
        name: 'Moussa Camara',
        role: 'Gestionnaire',
        initials: 'MC', 
        image:'assets/images/avatar1.png',
      },
      size: '208 MB',
      creationDate: '05/02/2025',
      lastModified: '10/02/2025',
      selected: true
    },
    {
      id: 3,
      name: 'ProBat_Agreement.doc',
      creator: {
        name: 'Cheikh Gueye',
        role: 'Administrateur',
        initials: 'CG',
        image:'assets/images/persona.png',
      },
      size: '18 MB',
      creationDate: '14/01/2025',
      lastModified: '08/04/2025',
      selected: false
    },
    {
      id: 4,
      name: 'Contrat_de_Réalisation BTP.pdf',
      creator: {
        name: 'Aminata Diallo',
        role: 'Gestionnaire',
        initials: 'AD',
        image:'assets/images/avatar2.png',
      },
      size: '30 MB',
      creationDate: '22/03/2025',
      lastModified: '01/02/2025',
      selected: false
    }
  ];

  openDropdown: string | null = null;
  allSelected: boolean = false;

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
    this.files.forEach(file => {
      file.selected = this.allSelected;
    });
  }

  updateSelectAllState(): void {
    this.allSelected = this.files.length > 0 && this.files.every(file => file.selected);
  }

  createNewFolder(): void {
    // Logique pour créer un nouveau dossier
    console.log('Création d\'un nouveau dossier');
  }

  uploadFile(): void {
    // Logique pour télécharger un fichier
    console.log('Téléchargement d\'un fichier');
  }
}