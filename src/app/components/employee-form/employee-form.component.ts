import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: false,
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm!: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  roles = ['Admin', 'Employee'];
  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef // Add this
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
      nationalId: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      signatureUrl: [null]
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.employeeId = +params['id'];
        this.employeeService.getEmployees({}).subscribe({
          next: (res) => {
            const employee = res.employees.find((e: any) => e.id === this.employeeId);
            if (employee) {
              this.employeeForm.patchValue({
                firstName: employee.firstName,
                lastName: employee.lastName,
                phoneNumber: employee.phoneNumber,
                nationalId: employee.nationalId,
                age: employee.age,
                signatureUrl: employee.signatureUrl
              });
            } else {
              this.messageType = 'error';
              this.message = 'Employee not found.';
            }
          },
          error: (err) => {
            this.messageType = 'error';
            this.message = err.message || 'Failed to load employee data.';
          }
        });
      }
    });
  }

  onSignatureChanged(signatureUrl: string): void {
    this.employeeForm.patchValue({ signatureUrl });
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      this.messageType = 'error';
      this.message = 'Please fill all fields correctly!';
      this.employeeForm.markAllAsTouched();
      return;
    }

    const employee = this.employeeForm.value;
    const request = this.isEditMode
      ? this.employeeService.updateEmployee(this.employeeId!, employee)
      : this.employeeService.addEmployee(employee);

    request.subscribe({
      next: () => {
        
        this.messageType = 'success';
        this.message = this.isEditMode ? 'Employee updated successfully!' : 'Employee added successfully!';
        this.router.navigate(['/employee-list']);
      },
      // error: (err) => {
      //   console.error(err);
      //    // Use ChangeDetectorRef to ensure the view updates
      //    // when the error message is set
      //   this.messageType = 'error';
      //   this.message = err.message || 'Failed to save employee.';
      //   this.cdr.detectChanges(); // Force view update 
      // }
    });
  }

  go(){
    this.router.navigate(['/employee-list']);

  }
}