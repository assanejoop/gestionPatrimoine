import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

interface LocationData {
  bailleur: string;
  dureeDebut: string;
  dureeFin: string;
  loyerMensuel: number;
  prochaineEcheance: string;
  coordonnees: {
    adresse: string;
    telephone: string;
    representantLegal: string;
    email: string;
  };
  coordonneesBancaires: {
    iban: string;
    banque: string;
    frequencePaiement: string;
    datePaiement: string;
  };
  conditionsBail: {
    modaliteRevision: string;
    clauseReconduction: string;
    preavisResiliation: string;
  };
  historiquePaiements: PaiementHistorique[];
  documents: DocumentAssocie[];
}

interface PaiementHistorique {
  date: string;
  periode: string;
  montant: number;
  modePaiement: string;
  statut: 'Payé' | 'En attente' | 'Retard';
}

interface DocumentAssocie {
  nom: string;
  type: 'PDF' | 'DOC' | 'XLSX';
  dateAjout: string;
  taille?: string;
}
interface BailData {
  nomBailleur: string;
  representantLegal: string;
  telephone: string;
  email: string;
  adresse: string;
  dateDebut: string;
  dateFin: string;
  montantLoyer: number;
  frequencePaiement: string;
}

@Component({
  selector: 'app-building-location',
  imports: [ CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './building-location.component.html',
  styleUrl: './building-location.component.css'
})
export class BuildingLocationComponent implements OnInit {

  @Input() isOpen = false;
  @Output() closeEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<BailData>();



ajouterBail() {
  this.isOpen = true;
}

closeModal() {
  this.isOpen = false;
}

  bailData: BailData = {
    nomBailleur: '',
    representantLegal: '',
    telephone: '',
    email: '',
    adresse: '',
    dateDebut: '',
    dateFin: '',
    montantLoyer: 0,
    frequencePaiement: ''
  };


  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }



  onSubmit(): void {
    if (this.isFormValid()) {
      this.submitEvent.emit({ ...this.bailData });
      this.closeModal();
    }
  }

  private isFormValid(): boolean {
    return !!(
      this.bailData.nomBailleur &&
      this.bailData.telephone &&
      this.bailData.dateDebut &&
      this.bailData.dateFin &&
      this.bailData.montantLoyer > 0 &&
      this.bailData.frequencePaiement
    );
  }

  private resetForm(): void {
    this.bailData = {
      nomBailleur: '',
      representantLegal: '',
      telephone: '',
      email: '',
      adresse: '',
      dateDebut: '',
      dateFin: '',
      montantLoyer: 0,
      frequencePaiement: ''
    };
  }

  locationData: LocationData = {
    bailleur: 'Société Immobilière A',
    dureeDebut: '01/01/2025',
    dureeFin: '31/12/2027',
    loyerMensuel: 20000000,
    prochaineEcheance: '15/06/2025',
    coordonnees: {
      adresse: 'Dakar, Point E',
      telephone: '77 000 00 00',
      representantLegal: 'Ibrahima Ndiaye',
      email: 'societe@domaine.sn'
    },
    coordonneesBancaires: {
      iban: 'SN 3000 **** **** 123',
      banque: 'BNP Paribas',
      frequencePaiement: 'Virement mensuel',
      datePaiement: 'Le 5 de chaque mois'
    },
    conditionsBail: {
      modaliteRevision: 'Indexation sur IRL',
      clauseReconduction: 'Tacite reconduction',
      preavisResiliation: '3 mois'
    },
    historiquePaiements: [
      {
        date: '05/05/2025',
        periode: 'Mai 2025',
        montant: 20000000,
        modePaiement: 'Virement',
        statut: 'Payé'
      }
    ],
    documents: [
      {
        nom: 'Contrat de bail.pdf',
        type: 'PDF',
        dateAjout: '01/01/2025'
      },
      {
        nom: 'Quittance mai 2025.pdf',
        type: 'PDF',
        dateAjout: '05/05/2025'
      },
      {
        nom: 'Quittance avril 2025.pdf',
        type: 'PDF',
        dateAjout: '05/04/2025'
      },
      {
        nom: 'Quittance mars 2025.pdf',
        type: 'PDF',
        dateAjout: '05/03/2025'
      }
    ]
  };

  constructor() { }

  ngOnInit(): void {
  }


  modifierCoordonnees(): void {
    console.log('Modifier coordonnées');
    // Logique pour modifier les coordonnées
  }

  modifierCoordonneesBancaires(): void {
    console.log('Modifier coordonnées bancaires');
    // Logique pour modifier les coordonnées bancaires
  }

  enregistrerPaiement(): void {
    console.log('Enregistrer un paiement');
    // Logique pour enregistrer un nouveau paiement
  }

  ajouterDocument(): void {
    console.log('Ajouter un document');
    // Logique pour ajouter un document
  }

  telechargerDocument(document: DocumentAssocie): void {
    console.log('Télécharger document:', document.nom);
    // Logique pour télécharger le document
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0
    }).format(amount) + ' F cfa';
  }

  getStatusClass(statut: string): string {
    switch(statut) {
      case 'Payé':
        return 'bg-green-100 text-green-800';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Retard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getDocumentIcon(type: string): string {
    switch(type) {
      case 'PDF':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'DOC':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'XLSX':
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      default:
        return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }
}


