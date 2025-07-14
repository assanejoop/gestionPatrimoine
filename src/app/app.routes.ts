import { DocumentsArchivageComponent } from './features//documents-archivage/documents-archivage.component';
import { GestionLocativeComponent } from './features/gestion-locative/gestion-locative.component';
import { Routes } from '@angular/router';
import { BuildingDetailComponent } from './features/building-detail/building-detail.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { BuildingModalComponent } from './features/building-modal/building-modal.component';
import { DetailTaravauxComponent } from './features/detail-taravaux/detail-taravaux.component';


export const routes: Routes = [
  {
    path: 'dashboard',
    // component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'building',
        loadChildren: () => import('./features/building/building.routes').then(m => m.BUILDINGS_ROUTES)
      },
      
        // path: 'building-detail', 
        // component: BuildingDetailComponent
        {
          path: 'building-detail/:id', // ou simplement 'building-detail' si vous n'utilisez pas de paramètre
          component: BuildingDetailComponent
        },
        // { path: 'building-modal', component: BuildingModalComponent },
        // {
        //   path: 'building',
        //   loadComponent: () => import('./features/building/building.component').then(m => m.BuildingComponent)
        // },
        {
          path: 'fournisseurs',
          loadComponent: () => import('./features/fournisseurs/fournisseurs.component').then(m => m.FournisseursComponent)
        },
        {
          path: 'geolocalisation',
          loadComponent: () => import('./features/geolocalisation/geolocalisation.component').then(m => m.GeolocalisationComponent)
        },
        {
          path: 'documents-archivage',
          loadComponent: () => import('./features/documents-archivage/documents-archivage.component').then(m => m.DocumentsArchivageComponent)
        },
        {
          path: 'location',
          loadComponent: () => import('./features/gestion-locative/gestion-locative.component').then(m => m.GestionLocativeComponent)
        },
        {
          path: 'rapport',
          loadComponent: () => import('./features/rapport/rapport.component').then(m => m.RapportComponent)
        },
        {
          path: 'analyse-financiere',
          loadComponent: () => import('./features/analyse-financiere/analyse-financiere.component').then(m => m.AnalyseFinanciereComponent)
        },
        {
          path: 'utilisateurs',
          loadComponent: () => import('./features/utilisateurs/utilisateurs.component')
            .then(m => {
              console.log('Utilisateurs component loaded:', m); // Pour le debug
              return m.UtilisateursComponent;
            })
        },
        {
          path: 'travaux-maintenance',
          loadComponent: () => import('./features/travaux-maintenance/travaux-maintenance.component').then(m => m.TravauxMaintenanceComponent)
        },
      // {
      //   path: 'users',
      //   loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
      // },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  {
    path: 'building-modal',
    component: BuildingModalComponent
  },
  {
    path: 'detail-travaux',
    component: DetailTaravauxComponent
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];