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
  result: number | null = null; // This stores the conversion result (in cm)
  isVisible = false; // Flag to control the visibility of the modal

  constructor(private fb: FormBuilder) {
    // Initialize the form with a control for 'inchValue' with validation
    this.conversionForm = this.fb.group({
      inchValue: ['', [Validators.required, Validators.min(0)]], // Requires a positive inch value
    });
  }

  /**
   * Converts the input inch value to centimeters.
   */
  convertToCm(): void {
    if (this.conversionForm.valid) {
      // Retrieve the value of 'inchValue' from the form
      const inch = this.conversionForm.get('inchValue')?.value;
      // Perform the conversion and store the result
      this.result = this.calculateCm(inch);
    }
  }

  /**
   * Helper function to calculate centimeters from inches.
   * @param inch The inch value entered by the user
   * @returns The equivalent value in centimeters
   */
  private calculateCm(inch: number): number {
    return inch * 2.54; // Conversion factor for inches to centimeters
  }

  /**
   * Shows the modal when the 'Open Converter' button is clicked.
   */
  showModal(): void {
    this.isVisible = true;
  }

  /**
   * Handles the OK button click on the modal.
   * Closes the modal.
   */
  handleOk(): void {
    this.isVisible = false;
  }

  /**
   * Handles the Cancel button click on the modal.
   * Closes the modal.
   */
  handleCancel(): void {
    this.isVisible = false;
  }
}
