import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-building-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './building-modal.component.html',
  styleUrls: ['./building-modal.component.css']
})
export class BuildingModalComponent implements OnInit {
  buildingForm!: FormGroup;
  currentStep = 1;
  totalSteps = 3;
  
  // Données pour les listes déroulantes
  typesBatiment = [
    { value: 'administratif', label: 'Bâtiment administratif' },
    { value: 'scolaire', label: 'Établissement scolaire' },
    { value: 'sanitaire', label: 'Établissement sanitaire' },
    { value: 'commercial', label: 'Bâtiment commercial' },
    { value: 'residentiel', label: 'Bâtiment résidentiel' }
  ];
  
  statutsOccupation = [
    { value: 'occupe', label: 'Occupé' },
    { value: 'vacant', label: 'Vacant' },
    { value: 'partiel', label: 'Partiellement occupé' },
    { value: 'construction', label: 'En construction' },
    { value: 'renovation', label: 'En rénovation' }
  ];
  
  regions = [
    { value: 'dakar', label: 'Dakar' },
    { value: 'thies', label: 'Thiès' },
    { value: 'diourbel', label: 'Diourbel' },
    { value: 'fatick', label: 'Fatick' },
    { value: 'kaolack', label: 'Kaolack' },
    { value: 'kaffrine', label: 'Kaffrine' },
    { value: 'kolda', label: 'Kolda' },
    { value: 'louga', label: 'Louga' },
    { value: 'matam', label: 'Matam' },
    { value: 'saint-louis', label: 'Saint-Louis' },
    { value: 'sedhiou', label: 'Sédhiou' },
    { value: 'tambacounda', label: 'Tambacounda' },
    { value: 'kedougou', label: 'Kédougou' },
    { value: 'ziguinchor', label: 'Ziguinchor' }
  ];
  
  departements: { [key: string]: Array<{value: string, label: string}> } = {
    'dakar': [
      { value: 'dakar', label: 'Dakar' },
      { value: 'pikine', label: 'Pikine' },
      { value: 'rufisque', label: 'Rufisque' },
      { value: 'guediawaye', label: 'Guédiawaye' },
      { value: 'keur-massar', label: 'Keur Massar' }
    ],
    'thies': [
      { value: 'thies', label: 'Thiès' },
      { value: 'mbour', label: 'Mbour' },
      { value: 'tivaouane', label: 'Tivaouane' }
    ],
    // Ajouter les autres départements pour chaque région
  };
  
  communes: { [key: string]: Array<{value: string, label: string}> } = {
    'dakar': [
      { value: 'dakar-plateau', label: 'Dakar Plateau' },
      { value: 'medina', label: 'Médina' },
      { value: 'grand-dakar', label: 'Grand Dakar' },
      { value: 'fann-point-e-amitie', label: 'Fann-Point E-Amitié' }
    ],
    'pikine': [
      { value: 'pikine-est', label: 'Pikine Est' },
      { value: 'pikine-nord', label: 'Pikine Nord' },
      { value: 'pikine-ouest', label: 'Pikine Ouest' }
    ],
    // Ajouter les autres communes pour chaque département
  };
  
  selectedDepartements: Array<{value: string, label: string}> = [];
  selectedCommunes: Array<{value: string, label: string}> = [];
  
  constructor(private fb: FormBuilder, private router: Router) {}
  
  ngOnInit(): void {
    this.initForm();
    
    // Écouter les changements de région pour mettre à jour les départements
    this.buildingForm.get('region')?.valueChanges.subscribe(region => {
      this.selectedDepartements = this.departements[region] || [];
      this.buildingForm.get('departement')?.setValue('');
      this.buildingForm.get('commune')?.setValue('');
    });
    
    // Écouter les changements de département pour mettre à jour les communes
    this.buildingForm.get('departement')?.valueChanges.subscribe(departement => {
      this.selectedCommunes = this.communes[departement] || [];
      this.buildingForm.get('commune')?.setValue('');
    });
  }
  
  initForm(): void {
    this.buildingForm = this.fb.group({
      // Étape 1: Informations générales
      nomBatiment: ['', Validators.required],
      typeBatiment: ['', Validators.required],
      statutOccupation: ['', Validators.required],
      region: ['', Validators.required],
      departement: ['', Validators.required],
      commune: ['', Validators.required],
      adresse: ['', Validators.required],
      superficie: ['', [Validators.required, Validators.min(0)]],
      nombreEtages: ['', [Validators.required, Validators.min(0)]],
      dateConstruction: ['', Validators.required],
      description: [''],
      
      // Étape 2: Informations juridiques (à compléter)
      
      // Étape 3: Documents (à compléter)
    });
  }
  
  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }
  
  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  onSubmit(): void {
    if (this.buildingForm.valid) {
      console.log('Formulaire soumis:', this.buildingForm.value);
      // Traitement du formulaire
      // Redirection vers la liste des bâtiments après soumission
      // this.router.navigate(['/buildings']);
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.markFormGroupTouched(this.buildingForm);
    }
  }
  
  // Fonction utilitaire pour marquer tous les champs comme touchés
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}