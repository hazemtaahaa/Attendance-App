import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'https://localhost:7170/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  getAttendanceHistory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/employee/history`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Failed to fetch attendance history.';
        if (error.status === 401) {
          errorMessage = 'Unauthorized: Invalid user.';
        } else if (error.status === 404) {
          errorMessage = 'Employee not found.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  getWeeklySummary(startDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/employee/weekly-summary?startDate=${startDate}`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Failed to fetch weekly summary.';
        if (error.status === 401) {
          errorMessage = 'Unauthorized: Invalid user.';
        } else if (error.status === 404) {
          errorMessage = 'Employee not found.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
  check_in(): Observable<any> {
    return this.http.post(`https://localhost:7170/api/Employee/checkin`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).pipe(
      tap(() => {
              //this.router.navigate(['/employee-list']);
            }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Failed .';
        if (error.status === 400) {
          errorMessage = error.error || 'Invalid employee details. Ensure all fields are provided and Age is 18–100.';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized: Admin access required.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}