import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  standalone: false,
  styleUrls: ['./signature.component.css']
})
export class SignatureComponent implements AfterViewInit {
  @Input() signatureUrl: string = '';
  @Output() signatureChanged = new EventEmitter<string>();
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private profileService: ProfileService) {}

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#000';
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';

    if (this.signatureUrl) {
      const img = new Image();
      img.src = this.signatureUrl;
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.signatureUrl = reader.result as string;
        this.signatureChanged.emit(this.signatureUrl);
        this.saveSignature();
      };
      reader.readAsDataURL(file);
    }
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    this.drawing = true;
    const { x, y } = this.getXY(event);
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.drawing) return;
    event.preventDefault();
    const { x, y } = this.getXY(event);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  stopDrawing() {
    if (!this.drawing) return;
    this.drawing = false;
    this.signatureUrl = this.canvasRef.nativeElement.toDataURL('image/png');
    this.signatureChanged.emit(this.signatureUrl);
    this.saveSignature();
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height);
    this.signatureUrl = '';
    this.signatureChanged.emit('');
    this.message = '';
  }

  private saveSignature() {
    if (this.signatureUrl) {
      this.profileService.updateSignature(this.signatureUrl).subscribe({
        next: () => {
          this.messageType = 'success';
          this.message = 'Signature saved successfully!';
        },
        error: (err) => {
          this.messageType = 'error';
          this.message = err.message || 'Failed to save signature.';
        }
      });
    }
  }

  private getXY(event: any) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }
}