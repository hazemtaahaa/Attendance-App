import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone:false,
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  employee = {
    firstName: 'Alaa',
    lastName: 'Elsayed',
    email: 'Alaa@gmail.com',
    phoneNumber: '1234567890',
    nationalId: '987654321',
    age: 23,
    role: 'Employee',
    imageUrl: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    signatureUrl: ''
  };

  constructor(private profileService:ProfileService) {

  }
  attendanceHistory: { date: string, status: string }[] = [];

  ngOnInit() {
    const storedHistory = localStorage.getItem('checkInHistory');
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    this.attendanceHistory = history.map((date: string) => ({
      date,
      status: 'Checked In'
    }));
    this.ddo();
  }
ddo()
{
  this.profileService.getProfileData().subscribe({
    next: (res) => {
      console.log('Employee data loaded:', res);
      const employee = res;
      if (employee) {
        this.employee= employee;
        
      } else {
        console.error('Employee not found.');  
      }
    },
    error: (err) => {
      console.error('Failed to load employee data:', err);  
    }
  });
}
  onSignatureChanged(newSignature: string) {
    this.employee.signatureUrl = newSignature;
  }

  saveChanges() {
     console.log('Updated employee:', this.employee);
  }
}
