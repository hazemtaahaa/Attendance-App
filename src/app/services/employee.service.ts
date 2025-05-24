import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'https://localhost:7170/api/admin/employees';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  getEmployees(params: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    filter?: string;
  }): Observable<any> {
    let query = '';
    if (params.page) query += `page=${params.page}&`;
    if (params.pageSize) query += `pageSize=${params.pageSize}&`;
    if (params.sortBy) query += `sortBy=${params.sortBy}&`;
    if (params.filter) query += `filter=${params.filter}`;
    return this.http.get(`${this.apiUrl}?${query}`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Failed to fetch employees.';
        if (error.status === 400) {
          errorMessage = 'Invalid page or pageSize.';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized: Admin access required.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  addEmployee(employee: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    nationalId: string;
    email: string;
    password: string;
    role: string;
    age: number;
    signatureUrl: string | null;
  }): Observable<any> {
    return this.http.post(`https://localhost:7170/api/Auth/register`, employee, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).pipe(
     
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Failed to add employee.';
        if (error.status === 400) {
          errorMessage = error.error || 'Invalid employee details. Ensure all fields are provided and Age is 18–100.';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized: Admin access required.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  updateEmployee(id: number, employee: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    nationalId: string;
    age: number;
    signatureUrl: string | null;
  }): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, employee, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        
        let errorMessage = 'Failed to update employee.';
        if (error.status === 400) {
          errorMessage = error.error || 'Invalid employee details. Ensure all fields are provided and Age is 18–100.';
        } else if (error.status === 404) {
          errorMessage = 'Employee not found.';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized: Admin access required.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${this.authService.getToken()}` }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Failed to delete employee.';
        if (error.status === 404) {
          errorMessage = 'Employee not found.';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized: Admin access required.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  
}