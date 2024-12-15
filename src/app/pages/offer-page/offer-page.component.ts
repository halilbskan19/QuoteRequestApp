import { Component } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { NzSelectModule } from 'ng-zorro-antd/select';
import { InchToCmConverterComponent } from '../../components/inch-to-cm-converter/inch-to-cm-converter.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-offer-page',
  standalone: true,
  imports: [FormsModule, NzSelectModule, NzFlexModule, ReactiveFormsModule, NzButtonModule, NzFormModule, NzInputModule, CommonModule, InchToCmConverterComponent],
  templateUrl: './offer-page.component.html',
  styleUrls: ['./offer-page.component.scss']
})
export class OfferPageComponent {
  selectedMode = null;
  selectedMovementType = null;
  selectedIncoterms = null;
  selectedCountriesCities = null;
  selectedPackageType = null;
  selectedUnit1 = null;
  selectedUnit2 = null;
  selectedCurrency = null;
  unit1Value = null;
  unit2Value = null;

  dimensions: any[] = []; // Store dimensions fetched from API
  palletCount: number = 0; // Store calculated pallet count
  errorMessage: string = ''; // Store error message for validation checks

  isVertical = true;
  isUnit1InputVisible = false; // Boolean to toggle Unit 1 input visibility
  isUnit2InputVisible = false; // Boolean to toggle Unit 2 input visibility

  /**
   * Fetch dimensions data from the API and assign it to the dimensions array.
   */
  fetchDimensions() {
    this.http.get<any[]>('http://localhost:3000/dimensions').subscribe(data => {
      this.dimensions = data;
    });
  }

  /**
   * Form group that contains all the required form controls for the offer form.
   */
  validateForm = this.fb.group({
    mode: this.fb.control('', [Validators.required]),
    movementType: this.fb.control('', [Validators.required]),
    incoterms: this.fb.control('', [Validators.required]),
    countriesCities: this.fb.control('', [Validators.required]),
    packageType: this.fb.control('', [Validators.required]),
    unit1: this.fb.control('', [Validators.required]),
    unit1Value: this.fb.control('', [Validators.required]),
    unit2: this.fb.control('', [Validators.required]),
    unit2Value: this.fb.control('', [Validators.required]),
    currency: this.fb.control('', [Validators.required])
  });

  /**
   * Method to show Unit 1 input field when a value is selected for unit 1.
   */
  onUnit1Change() {
    if (this.validateForm.get('unit1')?.value) {
      this.isUnit1InputVisible = true;
    }
  }

  /**
   * Method to show Unit 2 input field when a value is selected for unit 2.
   */
  onUnit2Change() {
    if (this.validateForm.get('unit2')?.value) {
      this.isUnit2InputVisible = true;
    }
  }

  /**
   * This method calculates the pallet count based on selected dimensions and package type.
   * It checks if the unit values and package type are valid and calculates accordingly.
   */
  calculate() {
    const packageType = this.validateForm.get('packageType')?.value;
    const unit1Value = parseFloat(this.validateForm.get('unit1Value')?.value || '0');
    const unit2Value = parseFloat(this.validateForm.get('unit2Value')?.value || '0');

    // Find the selected dimension for the given package type
    const selectedDimension = this.dimensions.find(d => d.type === packageType);

    if (!selectedDimension) {
      this.errorMessage = 'Selected package type is not valid.';
      return;
    }

    // Extract box dimensions (width, length, height)
    const boxWidth = selectedDimension.width;
    const boxLength = selectedDimension.length;
    const boxHeight = selectedDimension.height;

    // Calculate pallet count based on the selected package type
    if (packageType === 'Carton') {
      const boxCount = Math.floor(24 / unit1Value) * Math.floor(16 / unit2Value);
      this.palletCount = Math.floor(40 / boxWidth) * Math.floor(48 / boxLength) * Math.floor(60 / boxHeight) * boxCount;
    } else if (packageType === 'Box') {
      this.palletCount = Math.floor(40 / boxWidth) * Math.floor(48 / boxLength) * Math.floor(60 / boxHeight);
    } else if (packageType === 'Pallet') {
      this.palletCount = 1;
    }

    // Validate mode (LCL or FCL) based on pallet count
    this.validateMode();
  }

  /**
   * This method checks if the selected mode is valid based on the pallet count.
   * It shows an error message if there are validation issues.
   */
  validateMode() {
    const mode = this.validateForm.get('mode')?.value;

    if (mode === 'LCL' && this.palletCount >= 24) {
      this.errorMessage = 'LCL mode is not valid for 24 or more pallets. Please choose FCL.';
    } else if (mode === 'FCL' && this.palletCount > 24) {
      this.errorMessage = 'FCL mode cannot ship more than 24 pallets.';
    } else {
      this.errorMessage = '';  // Clear error if validation passes
    }
  }

  /**
   * This method is called when the form is submitted.
   * It performs validation, runs the calculation, and posts the data if no errors are present.
   */
  submitForm(): void {
    if (this.validateForm.invalid) {
      // If form is invalid, mark all fields as dirty to show validation errors
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });

      return;
    }

    // Run calculation based on selected form values
    this.calculate();

    if (this.errorMessage) {
      alert('Please fix the errors before submitting.');
      return;
    }

    // Prepare form data to be sent to the API
    const formData = {
      ...this.validateForm.value,
      palletCount: this.palletCount
    };

    // Send form data to the API
    this.http.post('http://localhost:3000/offers', formData).subscribe(response => {
      console.log('Offer saved:', response);
      alert('Offer submitted successfully!');
    });
  }

  /**
   * The constructor fetches dimensions data when the component is initialized.
   */
  constructor(private fb: NonNullableFormBuilder, private http: HttpClient) {
    this.fetchDimensions();
  }
}
