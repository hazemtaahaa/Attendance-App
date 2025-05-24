import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7170/api/auth'; // Matches baseUrl from Postman collection

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('employeeId', res.employeeId),
          localStorage.setItem('role',res.role);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Login failed. Please try again.';
        if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check if the API is running.';
        } else if (error.status === 401) {
          errorMessage = 'Invalid email or password.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(user: {
    email: string;
    password: string;
    role: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    nationalId: string;
    age: number;
    signatureUrl: string | null;
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, user, {
      headers: { Authorization: `Bearer ${this.getToken()}` }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Registration failed.';
        if (error.status === 400) {
          errorMessage = error.error || 'Invalid employee details or role.';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized: Admin token required.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('employeeId');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('role');
    if (role!== 'Admin') return false;
    
    return role === 'Admin';
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getEmployeeId(): string | null {
    return localStorage.getItem('employeeId');
  }

  getUserName(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.name || null;
  }
}