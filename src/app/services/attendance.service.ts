import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = 'https://localhost:7170/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
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
}