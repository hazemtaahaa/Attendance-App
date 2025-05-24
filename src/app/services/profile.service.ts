import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'https://localhost:7170/api/employee';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  updateSignature(signatureUrl: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/signature`, { signatureUrl }, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Failed to update signature.';
        if (error.status === 400) {
          errorMessage = error.error || 'Signature already exists.';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized: Invalid user.';
        } else if (error.status === 404) {
          errorMessage = 'Employee not found.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}