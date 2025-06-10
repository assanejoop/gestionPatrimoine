import { Routes } from '@angular/router';
import { BuildingDetailComponent } from './features/building-detail/building-detail.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

// export const routes: Routes = [

//   {
//     path: 'dashboard',
//     component: DashboardComponent,
//     children: [
//       {
//         path: 'buildings',
//          loadChildren: () => import('./features/buildings/building.routes').then(m => m.BUILDINGS_ROUTES)
//       },
//       { path: 'building-detail', component: BuildingDetailComponent },
//       {
//         path: 'users',
//         loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
//       },
//       {
//         path: 'settings',
//         loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
//       },
//       { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
//     ]
//   },
 
 
// ];

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
      {
        path: 'users',
        loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];