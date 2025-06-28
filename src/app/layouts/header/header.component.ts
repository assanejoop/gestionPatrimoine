import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  // Menu states
  isUserMenuOpen = false;
  isMobileMenuOpen = false;
  
  // User information
  currentUser = {
    name: 'Cheikh Gueye',
    role: 'Administrateur',
    avatar: 'assets/images/persona.png'
  };
  
  // Breadcrumb data
  breadcrumbs = [
    { label: 'Tableau de bord', link: '/dashboard', active: false },
    { label: 'État du Patrimoine Immobilier', link: null, active: true }
  ];
  

 

  isDropdownOpen = false;
  selectedTheme = 'Clair';

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectTheme(theme: string) {
    this.selectedTheme = theme;
    this.isDropdownOpen = false;
    // Ici vous pouvez ajouter la logique pour appliquer le thème
    console.log('Thème sélectionné:', theme);
  }

  // Fermer le dropdown quand on clique ailleurs
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.theme-dropdown')) {
      this.isDropdownOpen = false;
    }
  }

  // Toggle user menu dropdown
  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  
  // Toggle mobile menu
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  
  // Close menus when clicking outside (optional)
  closeMenus() {
    this.isUserMenuOpen = false;
    this.isMobileMenuOpen = false;
  }
  
  // Navigation methods
  navigateTo(link: string | null) {
    if (link) {
      // Implement navigation logic here
      console.log(`Navigate to: ${link}`);
    }
  }
  
  // User actions
  onNotificationClick() {
    console.log('Notification clicked');
    // Implement notification logic
  }
  
  onThemeToggle() {
    console.log('Theme toggle clicked');
    // Implement theme switching logic
  }
  
  onProfileClick() {
    console.log('Profile clicked');
    // Implement profile navigation
  }
  
  onLogout() {
    console.log('Logout clicked');
    // Implement logout logic
  }
}