import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      idNumber: ['', Validators.required],
      signatureUrl: [''],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.messageType = 'error';
      this.message = 'Please fill in all fields correctly!';
      return;
    }

    const formValue = this.registerForm.value;
    const user = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      phoneNumber: formValue.phone,
      nationalId: formValue.idNumber,
      signatureUrl: formValue.signatureUrl || null,
      age: formValue.age,
      role: formValue.role,
      password: formValue.password
    };

    this.authService.register(user).subscribe({
      next: () => {
        this.messageType = 'success';
        this.message = `Welcome, ${formValue.firstName}! Your account has been created.`;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.messageType = 'error';
        this.message = err.message || 'Registration failed.';
      }
    });
  }
}