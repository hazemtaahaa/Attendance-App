import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  standalone: true,
  styleUrls: ['./employee-dashboard.component.css']
})
export class EmployeeDashboardComponent {
  userName: string | null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.userName = this.authService.getUserName() || 'Employee';
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }
}