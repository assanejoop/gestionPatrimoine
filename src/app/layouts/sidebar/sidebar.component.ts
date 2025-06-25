// sidebar.component.ts
import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  private router = inject(Router);
  
  currentTheme = signal<'light' | 'dark'>('light');
  menuItems = signal([
    { 
      name: 'Tableau de bord', 
      icon: 'dashboard', 
      expanded: false,
      route: '/dashboard',
      subItems: [
        { name: 'Etat du Patrimoine', route: '/dashboard' },
        { name: 'Geolocatisation et Densité', route: '/dashboard/geolocalisation' },
        { name: 'Documents et Archivage', route: '/dashboard/documents-archivage' },
        { name: 'Travaux Maintenance', route: '/dashboard/travaux-maintenance' },
        { name: 'Gestion Locative', route: '/dashboard/gestion-locative' },
        { name: 'Fournisseurs', route: '/dashboard/fournisseurs' },
        { name: 'Rapports', route: '/dashboard/rapport' },
        { name: 'Analyses Financières', route: '/dashboard/analyse-financiere' }
      ]
    },
    { 
      name: 'Utilisateurs', 
      icon: 'users', 
      expanded: false,
      route: '/dashboard/utilisateurs'  // Correction: route vers utilisateurs
    },
    { 
      name: 'Biens immobiliers', 
      icon: 'buildings', 
      expanded: false,  // Changé à false par défaut
      // Supprimé la route car on a des subItems
      subItems: [
        { name: 'Liste des bâtiments', route: '/dashboard/building' },
        { name: 'Cartographie', route: '/dashboard/building/maps' }
      ]
    },
    { 
      name: 'Paramètres', 
      icon: 'settings', 
      expanded: false,
      route: '/dashboard/settings'
    },
    { 
      name: 'Aide & Support', 
      icon: 'help', 
      expanded: false,
      route: '/support'
    }
  ]);

  ngOnInit(): void {
    this.initTheme();
  }

  initTheme(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        this.currentTheme.set(savedTheme);
      } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          this.currentTheme.set('dark');
        }
      }
      
      this.applyTheme(this.currentTheme());
      
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(event.matches ? 'dark' : 'light');
        }
      });
    }
  }

  setTheme(theme: 'light' | 'dark'): void {
    this.currentTheme.set(theme);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    this.applyTheme(theme);
  }

  applyTheme(theme: string): void {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Méthode améliorée pour gérer les clics sur les items
  onMenuItemClick(item: any, index: number): void {
    if (item.subItems) {
      // Si l'item a des sous-items, on toggle l'expansion
      this.toggleSubmenu(index);
    } else if (item.route) {
      // Si l'item a une route et pas de sous-items, on navigue
      this.router.navigate([item.route]);
    }
  }

  toggleSubmenu(index: number): void {
    const items = this.menuItems();
    const updatedItems = [...items];
    updatedItems[index].expanded = !updatedItems[index].expanded;
    this.menuItems.set(updatedItems);
  }

  isActiveRoute(route: string): boolean {
    if (typeof window !== 'undefined') {
      return window.location.pathname.startsWith(route);
    }
    return false;
  }

  logout(): void {
    console.log('Logging out...');
    // Ajoutez ici votre logique de déconnexion
    // Par exemple: this.router.navigate(['/login']);
  }
}