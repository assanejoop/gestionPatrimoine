import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Tab {
  label: string;
  icon: string;
}

interface WorkDetails {
  nature: string;
  startDate: string;
  endDate: string;
  responsible: string;
  description: string;
}

interface Photo {
  url: string;
  alt: string;
}

interface BuildingInfo {
  name: string;
  location: string;
  type: string;
  occupancyStatus: string;
}

interface Proposition {
  id: number;
  company: string;
  amount: number;
  currency: string;
  proposedDelay: number;
  submissionDate: string;
  status: 'En attente' | 'Sélectionné' | 'Non retenue';
}
interface WorkStep {
  id: number;
  date: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  avatar?: string;
}
@Component({
  selector: 'app-detail-taravaux',
  imports: [CommonModule, FormsModule],
  templateUrl: './detail-taravaux.component.html',
  styleUrl: './detail-taravaux.component.css'
})
export class DetailTaravauxComponent implements OnInit {
  workTitle: string = 'Repeindre cage escalier';
  status: string = 'En cours';
  activeTab: number = 0;
  selectedYear: number = 2025;
  
  tabs: Tab[] = [
    { label: 'Fiche de travail', icon: 'document' },
    { label: 'Gestion des propositions', icon: 'clipboard' },
    { label: 'Suivi du Travail', icon: 'chart' },
    { label: 'Factures/Devis', icon: 'invoice' }
  ];

  workDetails: WorkDetails = {
    nature: 'Peinture',
    startDate: '11/04/2025',
    endDate: '30/04/2025',
    responsible: 'Cheikh Gueye',
    description: 'Ce travail consiste à repeindre l\'ensemble de la cage d\'escalier, incluant murs, plafonds et éventuellement les rampes si nécessaire. Il s\'agit d\'un travail de rafraîchissement esthétique, avec une attention particulière portée à la propreté, la finition et la protection des zones sensibles (sols, interrupteurs, rampes, etc.).'
  };

  photos: Photo[] = [
    { url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=300&h=200&fit=crop', alt: 'Cage d\'escalier vue 1' },
    { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=300&h=200&fit=crop', alt: 'Cage d\'escalier vue 2' },
    { url: 'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=300&h=200&fit=crop', alt: 'Cage d\'escalier vue 3' },
    { url: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=200&fit=crop', alt: 'Cage d\'escalier vue 4' }
  ];

  buildingImage: string = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop';
  
  buildingInfo: BuildingInfo = {
    name: 'Résidence Administrative Cheikh Anta Diop',
    location: 'Dakar',
    type: 'Résidence',
    occupancyStatus: 'Occupé'
  };

  
  propositions: Proposition[] = [
    {
      id: 1,
      company: 'SEN Peinture',
      amount: 3500000,
      currency: 'FCFA',
      proposedDelay: 15,
      submissionDate: '05/04/2025',
      status: 'En attente'
    },
    {
      id: 2,
      company: 'Dakar Pro Services',
      amount: 4200000,
      currency: 'FCFA',
      proposedDelay: 20,
      submissionDate: '03/04/2025',
      status: 'Non retenue'
    }
  ];

  // Nouvelles données pour le suivi du travail
  workSteps: WorkStep[] = [
    {
      id: 1,
      date: '12/04/2025',
      title: 'Début des travaux',
      description: 'Préparation des surfaces et protection des zones sensibles',
      isCompleted: true
    },
    {
      id: 2,
      date: '15/04/2025',
      title: 'Première couche appliquée',
      description: 'Photos disponibles dans la galerie',
      isCompleted: true
    },
    {
      id: 3,
      date: '18/04/2025',
      title: 'Réunion de suivi',
      description: 'Validation des couleurs et finitions',
      isCompleted: false
    }
  ];

  comments: Comment[] = [
    {
      id: 1,
      author: 'Cheikh Gueye',
      content: 'Retard dans la livraison de la peinture spéciale pour les rampes. Nouvelle date prévue: 17/04.',
      date: '15/04/2025'
    }
  ];

  newComment: string = '';
$last: any;

  constructor() { }

  ngOnInit(): void {
    // Initialisation du composant
  }

  setActiveTab(index: number): void {
    this.activeTab = index;
  }

  getTabClass(index: number): string {
    const baseClass = 'flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors duration-200';
    if (index === this.activeTab) {
      return `${baseClass} text-blue-600 border-blue-600 bg-blue-50`;
    } else {
      return `${baseClass} text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300`;
    }
  }

  addPhoto(): void {
    console.log('Ajouter une photo');
  }

  goBack(): void {
    console.log('Retour à la page précédente');
    
  }

  requestPropositions(): void {
    console.log('Demander des propositions');
  }

  selectProposition(propositionId: number): void {
    console.log(`Sélectionner la proposition ${propositionId}`);
    this.propositions = this.propositions.map(prop => ({
      ...prop,
      status: prop.id === propositionId ? 'Sélectionné' : 'Non retenue'
    }));
  }

  viewQuote(propositionId: number): void {
    console.log(`Voir le devis de la proposition ${propositionId}`);
  }

  formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-FR').format(amount);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'En attente':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Sélectionné':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Non retenue':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }

  // Nouvelles méthodes pour le suivi du travail
  addComment(): void {
    if (this.newComment.trim()) {
      const comment: Comment = {
        id: this.comments.length + 1,
        author: 'Utilisateur', // À remplacer par l'utilisateur connecté
        content: this.newComment,
        date: new Date().toLocaleDateString('fr-FR')
      };
      this.comments.unshift(comment);
      this.newComment = '';
    }
  }

  getStepIcon(step: WorkStep): string {
    return step.isCompleted ? 'check-circle' : 'circle';
  }

  getStepClass(step: WorkStep): string {
    return step.isCompleted ? 'text-blue-600' : 'text-gray-400';
  }
  // Dans la classe du composant, ajoutez cette méthode pour compléter les méthodes existantes
getStepStatusClass(step: WorkStep): string {
  return step.isCompleted 
    ? 'border-blue-600 bg-blue-100' 
    : 'border-gray-300';
}
}