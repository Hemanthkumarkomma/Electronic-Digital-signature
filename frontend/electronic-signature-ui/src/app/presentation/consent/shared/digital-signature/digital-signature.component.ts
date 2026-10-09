import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export type SignatureMethod = 'draw' | 'type' | 'upload';

export interface SignatureResult {
  method: SignatureMethod;
  dataUrl: string;
  fullName?: string;
}

/**
 * Reusable Digital Signature capture UI shared by the Junior and Open
 * consent forms.
 */
@Component({
  selector: 'app-digital-signature',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './digital-signature.component.html',
  styleUrl: './digital-signature.component.css',
})
export class DigitalSignatureComponent
  implements AfterViewInit, OnDestroy {

  @Input() heading = 'Digital Signature';

  @Input()
  description =
    'Please provide your signature to confirm the information and give consent.';

  @Output()
  signatureSaved =
    new EventEmitter<SignatureResult>();

  @Output()
  signatureCleared =
    new EventEmitter<void>();

  @ViewChild('signatureCanvas')
  canvasRef?: ElementRef<HTMLCanvasElement>;

  protected readonly selectedMethod =
    signal<SignatureMethod>('draw');

  protected readonly hasDrawing =
    signal(false);

  protected readonly isSaved =
    signal(false);

  protected readonly typedName =
    signal('');

  protected readonly uploadedPreview =
    signal<string | null>(null);

  protected readonly uploadError =
    signal('');

  private ctx:
    CanvasRenderingContext2D | null = null;

  private isDrawing = false;

  ngAfterViewInit(): void {
    this.setupCanvas();
  }

  ngOnDestroy(): void {
    this.isDrawing = false;
    this.ctx = null;
  }

  // =====================================================
  // SELECT SIGNATURE METHOD
  // =====================================================

  selectMethod(
    method: SignatureMethod
  ): void {

    this.selectedMethod.set(method);

    this.isSaved.set(false);

    if (method === 'draw') {

      // Canvas may be recreated by *ngIf.
      setTimeout(() => {
        this.setupCanvas();
      });
    }
  }

  // =====================================================
  // SETUP CANVAS
  // =====================================================

  private setupCanvas(): void {

    const canvas =
      this.canvasRef?.nativeElement;

    if (!canvas) {
      return;
    }

    this.ctx =
      canvas.getContext('2d');

    if (!this.ctx) {
      return;
    }

    /*
     * Drawing configuration
     */
    this.ctx.lineWidth = 2.5;

    this.ctx.lineCap = 'round';

    this.ctx.lineJoin = 'round';

    this.ctx.strokeStyle = '#1f2d3d';
  }

  // =====================================================
  // GET EXACT CANVAS POSITION
  // =====================================================

  private getCanvasPoint(
    event: MouseEvent | TouchEvent
  ): { x: number; y: number } {

    const canvas =
      this.canvasRef?.nativeElement;

    if (!canvas) {
      return {
        x: 0,
        y: 0
      };
    }

    /*
     * Get the actual displayed size of the canvas.
     */
    const rect =
      canvas.getBoundingClientRect();

    let clientX: number;
    let clientY: number;

    // ---------------------------------------------
    // TOUCH
    // ---------------------------------------------

    if (event instanceof TouchEvent) {

      const touch =
        event.touches[0] ||
        event.changedTouches[0];

      if (!touch) {
        return {
          x: 0,
          y: 0
        };
      }

      clientX =
        touch.clientX;

      clientY =
        touch.clientY;

    }

    // ---------------------------------------------
    // MOUSE
    // ---------------------------------------------

    else {

      clientX =
        event.clientX;

      clientY =
        event.clientY;
    }

    /*
     * IMPORTANT:
     *
     * The canvas can have a CSS/display size
     * different from its internal drawing size.
     *
     * These scale values convert the mouse/touch
     * coordinates to the canvas coordinates.
     */
    const scaleX =
      canvas.width / rect.width;

    const scaleY =
      canvas.height / rect.height;

    return {

      x:
        (clientX - rect.left) *
        scaleX,

      y:
        (clientY - rect.top) *
        scaleY
    };
  }

  // =====================================================
  // START DRAWING
  // =====================================================

  startDrawing(
    event: MouseEvent | TouchEvent
  ): void {

    if (!this.ctx) {
      return;
    }

    event.preventDefault();

    this.isDrawing = true;

    const {
      x,
      y
    } =
      this.getCanvasPoint(event);

    this.ctx.beginPath();

    this.ctx.moveTo(
      x,
      y
    );

    this.isSaved.set(false);
  }

  // =====================================================
  // DRAW
  // =====================================================

  draw(
    event: MouseEvent | TouchEvent
  ): void {

    if (
      !this.isDrawing ||
      !this.ctx
    ) {
      return;
    }

    event.preventDefault();

    const {
      x,
      y
    } =
      this.getCanvasPoint(event);

    this.ctx.lineTo(
      x,
      y
    );

    this.ctx.stroke();

    this.hasDrawing.set(true);

    this.isSaved.set(false);
  }

  // =====================================================
  // STOP DRAWING
  // =====================================================

  stopDrawing(
    event?: MouseEvent | TouchEvent
  ): void {

    if (event) {
      event.preventDefault();
    }

    if (!this.isDrawing) {
      return;
    }

    this.isDrawing = false;

    if (this.ctx) {
      this.ctx.closePath();
    }
  }

  // =====================================================
  // CLEAR DRAWING
  // =====================================================

  clearDrawing(): void {

    const canvas =
      this.canvasRef?.nativeElement;

    if (
      canvas &&
      this.ctx
    ) {

      this.ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );
    }

    this.isDrawing = false;

    this.hasDrawing.set(false);

    this.isSaved.set(false);

    this.signatureCleared.emit();
  }

  // =====================================================
  // SAVE DRAWN SIGNATURE
  // =====================================================

  saveDrawnSignature(): void {

    const canvas =
      this.canvasRef?.nativeElement;

    if (
      !canvas ||
      !this.hasDrawing()
    ) {
      return;
    }

    this.isSaved.set(true);

    this.signatureSaved.emit({

      method: 'draw',

      dataUrl:
        canvas.toDataURL('image/png')
    });
  }

  // =====================================================
  // TYPED SIGNATURE
  // =====================================================

  onTypedNameChange(
    value: string
  ): void {

    this.typedName.set(value);

    this.isSaved.set(false);
  }

  // =====================================================
  // SAVE TYPED SIGNATURE
  // =====================================================

  saveTypedSignature(): void {

    const name =
      this.typedName().trim();

    if (!name) {
      return;
    }

    this.isSaved.set(true);

    this.signatureSaved.emit({

      method: 'type',

      dataUrl: '',

      fullName: name
    });
  }

  // =====================================================
  // UPLOAD SIGNATURE
  // =====================================================

  onFileSelected(
    event: Event
  ): void {

    this.uploadError.set('');

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/jpg'
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {

      this.uploadError.set(
        'Please upload a PNG or JPG/JPEG image file.'
      );

      return;
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {

      this.uploadError.set(
        'File is too large. Maximum size is 2MB.'
      );

      return;
    }

    const reader =
      new FileReader();

    reader.onload = () => {

      const result =
        reader.result as string;

      this.uploadedPreview.set(
        result
      );

      this.isSaved.set(true);

      this.signatureSaved.emit({

        method: 'upload',

        dataUrl: result
      });
    };

    reader.readAsDataURL(file);
  }

  // =====================================================
  // REMOVE UPLOADED SIGNATURE
  // =====================================================

  removeUploadedSignature(): void {

    this.uploadedPreview.set(null);

    this.uploadError.set('');

    this.isSaved.set(false);

    this.signatureCleared.emit();
  }
}