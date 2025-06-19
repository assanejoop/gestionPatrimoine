import { Component } from '@angular/core';
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