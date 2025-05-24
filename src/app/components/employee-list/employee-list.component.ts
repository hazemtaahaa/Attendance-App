import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { EmployeeService } from '../../services/employee.service';
import { Router } from '@angular/router';

interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  phoneNumber: string;
  nationalId: string;
}

@Component({
  selector: 'app-employee-list',
  standalone: false,
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'age', 'phoneNumber', 'nationalId', 'actions'];
  dataSource = new MatTableDataSource<Employee>([]);
  filterValue: string = '';
  error: string = '';
  pageSize = 10;
  pageIndex = 0;
  totalCount = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      const dataStr = `${data.firstName} ${data.lastName} ${data.age} ${data.phoneNumber} ${data.nationalId}`.toLowerCase();
      return dataStr.includes(filter);
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe((sort: Sort) => {
      this.loadEmployees({
        page: this.pageIndex + 1,
        pageSize: this.pageSize,
        sortBy: sort.active,
        filter: this.filterValue
      });
    });
  }

  loadEmployees(params: { page?: number; pageSize?: number; sortBy?: string; filter?: string } = {}): void {
    const requestParams = {
      page: params.page || this.pageIndex + 1,
      pageSize: params.pageSize || this.pageSize,
      sortBy: params.sortBy || 'name',
      filter: params.filter || this.filterValue
    };

    this.employeeService.getEmployees(requestParams).subscribe({
      next: (response) => {
        this.dataSource.data = response.employees;
        this.totalCount = response.totalCount;
        this.paginator.length = response.totalCount;
        this.error = '';
      },
      error: (err: Error) => {
        this.error = err.message || 'Failed to load employees.';
      }
    });
  }

  applyFilter(): void {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    this.loadEmployees({ page: 1, pageSize: this.pageSize, filter: this.filterValue });
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEmployees({ page: this.pageIndex + 1, pageSize: this.pageSize, filter: this.filterValue });
  }

  editEmployee(id: number): void {
    this.router.navigate([`/employee-form/${id}`]);
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (err: Error) => {
          this.error = err.message || 'Failed to delete employee.';
        }
      });
    }
  }
}