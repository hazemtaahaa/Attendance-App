import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  formFields = [
    { label: 'Email', controlName: 'email' },
    { label: 'Password', controlName: 'password' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.messageType = 'error';
      this.message = 'Please fill all fields correctly!';
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.messageType = 'success';
        this.message = 'Login successful!';
        debugger;     
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/employee-dashboard']);
        }
      },
      error: (err) => {
        console.error(err);
        this.messageType = 'error';
        this.message = err.message || 'Login failed. Please check your credentials.';
      }
    });
  }
}