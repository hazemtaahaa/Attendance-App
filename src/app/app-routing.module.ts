import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { AttendanceReportComponent } from './components/attendance-report/attendance-report.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CheckInComponent } from './components/check-in/check-in.component';
import { SignatureComponent } from './components/signature/signature.component';
import { CheckInHistoryComponent } from './components/check-in-history/check-in-history.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard, RoleGuard], data: { role: 'Admin' } },
  {
    path: 'employee-list',
    component: EmployeeListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'employee-form',
    component: EmployeeFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'employee-form/:id',
    component: EmployeeFormComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'attendance-report',
    component: AttendanceReportComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'check-in',
    component: CheckInComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Employee' }
  },
  {
    path: 'check-in-history',
    component: CheckInHistoryComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Employee' }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Employee' }
  },
  {
    path: 'signature',
    component: SignatureComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Employee' }
  },
  {
    path: 'employee-dashboard',
    component: EmployeeDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Employee' }
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { role: 'Admin' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}