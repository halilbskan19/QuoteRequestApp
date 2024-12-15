import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-inch-to-cm-converter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzModalModule
  ],
  templateUrl: './inch-to-cm-converter.component.html',
  styleUrls: ['./inch-to-cm-converter.component.scss']
})
export class InchToCmConverterComponent {
  conversionForm: FormGroup;
  result: number | null = null;

  isVisible = false;

  constructor(private fb: FormBuilder) {
    // Reactive form oluşturuluyor
    this.conversionForm = this.fb.group({
      inch: ['', [Validators.required, Validators.min(0)]]
    });
  }

  // Dönüştürme işlemi
  convertToCm(): void {
    if (this.conversionForm.valid) {
      const inch = this.conversionForm.get('inch')?.value;
      this.result = inch * 2.54;
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
