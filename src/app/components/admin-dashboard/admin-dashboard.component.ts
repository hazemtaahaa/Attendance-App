import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {
  adminName: string | null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.adminName = this.authService.getUserName() || 'Admin';
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}