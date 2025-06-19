import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
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
      route: '/dashboard/users'
    },
    { 
      name: 'Biens immobiliers', 
      icon: 'buildings', 
      expanded: false,
      route: '/dashboard/building',
      subItems: [
        { name: 'Liste des bâtiments', route: '/dashboard/building/list' },
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
      // Check if theme is stored in local storage
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        this.currentTheme.set(savedTheme);
      } else {
        // Check for system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          this.currentTheme.set('dark');
        }
      }
      
      // Apply theme immediately
      this.applyTheme(this.currentTheme());
      
      // Listen for system theme changes
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
    // Implement logout logic here
    console.log('Logging out...');
  }
}