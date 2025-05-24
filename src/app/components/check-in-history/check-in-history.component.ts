import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../services/attendance.service';
import { FormBuilder, FormGroup } from '@angular/forms';

interface CheckInEntry {
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Late' | 'Absent';
}

interface WeeklySummary {
  label: string;
  attendedDays: number;
}

interface AttendanceHistoryResponse {
  checkInTime: string;
  // Add other fields if provided by the API
}

interface WeeklySummaryResponse {
  weekStartDate: string;
  daysCheckedIn: number;
}

@Component({
  selector: 'app-check-in-history',
  standalone: false,
  templateUrl: './check-in-history.component.html',
  styleUrls: ['./check-in-history.component.css']
})
export class CheckInHistoryComponent implements OnInit {
  checkInHistory: CheckInEntry[] = [];
  weeklySummary: WeeklySummary[] = [];
  showWeeklySummary = false;
  dateForm: FormGroup;
  error: string = '';

  constructor(
    private attendanceService: AttendanceService,
    private fb: FormBuilder
  ) {
    this.dateForm = this.fb.group({
      startDate: [new Date().toISOString().split('T')[0]]
    });
  }

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.attendanceService.getAttendanceHistory().subscribe({
      next: (history: AttendanceHistoryResponse[]) => {
        this.checkInHistory = history.map(entry => ({
          date: entry.checkInTime ? new Date(entry.checkInTime).toLocaleDateString() : 'N/A',
          checkIn: entry.checkInTime ? new Date(entry.checkInTime).toLocaleTimeString() : 'N/A',
          checkOut: 'N/A', // Update if API provides check-out time
          status: entry.checkInTime ? 'Present' : 'Absent' // Adjust if API provides status
        }));
        this.error = '';
      },
      error: (err: Error) => {
        this.error = this.getErrorMessage(err);
      }
    });
  }

  onToggleSummary(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.showWeeklySummary = input.checked;
    if (this.showWeeklySummary) {
      this.loadWeeklySummary();
    } else {
      this.weeklySummary = [];
      this.error = '';
    }
  }

  onDateChange(): void {
    if (this.showWeeklySummary) {
      this.loadWeeklySummary();
    }
  }

  loadWeeklySummary(): void {
    const startDate = this.dateForm.value.startDate;
    if (!startDate) {
      this.error = 'Please select a start date.';
      return;
    }
    this.attendanceService.getWeeklySummary(startDate).subscribe({
      next: (summary: WeeklySummaryResponse) => {
        this.weeklySummary = [{
          label: `Week of ${new Date(summary.weekStartDate).toLocaleDateString()}`,
          attendedDays: summary.daysCheckedIn
        }];
        this.error = '';
      },
      error: (err: Error) => {
        this.error = this.getErrorMessage(err);
      }
    });
  }

  retry(): void {
    this.error = '';
    if (this.showWeeklySummary) {
      this.loadWeeklySummary();
    } else {
      this.loadHistory();
    }
  }

  private getErrorMessage(err: Error): string {
    if (err.message.includes('401')) {
      return 'Unauthorized: Please log in again.';
    } else if (err.message.includes('404')) {
      return 'No attendance records found.';
    }
    return err.message || 'Failed to load data. Please try again.';
  }
}