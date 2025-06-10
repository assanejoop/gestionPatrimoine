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
  // Menu mobile states
  isMenuOpen = false;
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  // Optional: methods for handling dropdowns
  toggleDropdown(dropdownId: string) {
    // Logic to handle dropdown toggle
    console.log(`Toggle dropdown: ${dropdownId}`);
  }
}