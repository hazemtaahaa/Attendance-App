import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['role'];
    const isAdmin = this.authService.isAdmin();
    const isCorrectRole = expectedRole === 'Admin' ? isAdmin : !isAdmin;

    if (this.authService.isLoggedIn() && isCorrectRole) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}