import { Component ,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-check-in',
  standalone: false,
  templateUrl: './check-in.component.html',
  styleUrl: './check-in.component.css'
})
export class CheckInComponent implements OnInit {
  message: string = '';
  messageType: 'success' | 'error' | '' = '';
  canCheckIn: boolean = false;
  isCheckedInToday: boolean = false;




  now: Date = new Date();

  timerSubscription!: Subscription;

  startTime = new Date();
  endTime = new Date();

  hoursLeft: number = 0;
  minutesLeft: number = 0;
  secondsLeft: number = 0;

  progressPercent: number = 0;

  constructor(
    private atttendanceService : AttendanceService
  ) {
    // Set window from 7:30 AM to 9:00 AM today
    this.startTime.setHours(7, 30, 0, 0);
    this.endTime.setHours(9, 0, 0, 0);
  }

  ngOnInit(): void {
    this.checkStatus();

    // Update timer every second
    this.timerSubscription = interval(1000).subscribe(() => {
      this.now = new Date();
      this.updateTimer();
      this.checkStatus();
    });
  }

ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

  checkStatus() {
    this.canCheckIn = this.now >= this.startTime && this.now <= this.endTime;
    this.isCheckedInToday = this.hasCheckedInToday();
  }

  hasCheckedInToday(): boolean {
    const lastCheckIn = localStorage.getItem('lastCheckInDate');
    if (!lastCheckIn) return false;

    const lastDate = new Date(lastCheckIn);
    const today = new Date();

    return lastDate.toDateString() === today.toDateString();
  }

  updateTimer() {
    if (this.now < this.startTime) {
      // Time until start window
      const diff = this.startTime.getTime() - this.now.getTime();
      this.calcTimeLeft(diff);
      this.progressPercent = 0;
    } else if (this.now > this.endTime) {
      // Time window ended
      this.hoursLeft = 0;
      this.minutesLeft = 0;
      this.secondsLeft = 0;
      this.progressPercent = 100;
      this.canCheckIn = false;
    } else {
      // Time remaining in window
      const diff = this.endTime.getTime() - this.now.getTime();
      this.calcTimeLeft(diff);

      // Calculate progress % between start and end time
      const totalWindow = this.endTime.getTime() - this.startTime.getTime();
      const elapsed = this.now.getTime() - this.startTime.getTime();
      this.progressPercent = (elapsed / totalWindow) * 100;
    }
  }

  calcTimeLeft(diff: number) {
    this.hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    this.minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    this.secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);
  }

  onCheckIn() {
    if (!this.canCheckIn) {
      this.message = 'Check-in is only allowed between 7:30 AM and 9:00 AM.';
      this.messageType = 'error';
      return;
    }

    if (this.isCheckedInToday) {
      this.message = 'You have already checked in today.';
      this.messageType = 'error';
      return;
    }
    this.atttendanceService.check_in().subscribe({
      next: () => {
        this.messageType = 'success';
        this.message = 'Login successful!';
      },
      error: (err) => {
        console.error(err);
        this.messageType = 'error';
        this.message = err.message || 'Login failed. Please check your credentials.';
      }
    });
    localStorage.setItem('lastCheckInDate', new Date().toISOString());
    this.message = 'Check-in successful. Have a great day!';
    this.messageType = 'success';
    this.isCheckedInToday = true;
  }
}
