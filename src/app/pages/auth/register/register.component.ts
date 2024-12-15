import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule, NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzInputModule, NzSelectModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  
  // Subject used to manage subscription cleanup on component destruction
  private destroy$ = new Subject<void>();

  // FormGroup definition with email, password, and confirm password fields
  validateForm = this.fb.group({
    email: this.fb.control('', [Validators.email, Validators.required]), // Email field with email validation
    password: this.fb.control('', [Validators.required]), // Password field
    checkPassword: this.fb.control('', [Validators.required]) // Confirm password field, required
  });

  // Tooltip for CAPTCHA (used for informational purposes)
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

  constructor(private fb: NonNullableFormBuilder, private authService: AuthService, private router: Router) { }

  /**
   * ngOnInit lifecycle hook.
   * This method subscribes to the password field's value changes and triggers
   * a check on the confirm password field's validity each time the password field changes.
   */
  ngOnInit(): void {
    this.validateForm.controls.password.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.validateForm.controls.checkPassword.updateValueAndValidity(); // Ensure that confirm password is validated against password field
    });
  }

  /**
   * ngOnDestroy lifecycle hook.
   * This method ensures that all active subscriptions are cleaned up when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.destroy$.next();  // Emit a value to notify subscribers to clean up
    this.destroy$.complete();  // Complete the subject to avoid memory leaks
  }

  /**
   * This method is called when the form is submitted.
   * It checks if the form is valid and then sends the registration request.
   */
  submitForm(): void {
    if (this.validateForm.valid) {  // Only proceed if the form is valid
      const email = this.validateForm.get('email')?.value ?? '';  // Get email value from the form
      const password = this.validateForm.get('password')?.value ?? '';  // Get password value from the form

      // Call the AuthService to register the user with email and password
      this.authService.register(email, password).subscribe(
        (response) => {
          console.log('Registration successful!', response);  // Log success response
          this.router.navigate(['/login']);  // Navigate to login page after successful registration
        },
        (error) => {
          console.error('Registration failed:', error);  // Log any error that occurs during registration
        }
      );
    } else {
      // If form is invalid, mark all fields as dirty and trigger their validation
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();  // Mark the control as dirty to display validation messages
          control.updateValueAndValidity({ onlySelf: true });  // Update validity status
        }
      });
    }
  }

  /**
   * Custom confirmation password validator.
   * This checks if the confirm password matches the original password field.
   * @param control - The AbstractControl for the confirm password field
   * @returns ValidationErrors or null if passwords match
   */
  confirmationValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { required: true };  // Return error if the confirm password field is empty
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };  // Return error if passwords don't match
    }
    return {};  // Return empty object if passwords match (valid)
  }

  /**
   * Placeholder method for CAPTCHA functionality (currently not implemented).
   * @param e - MouseEvent
   */
  getCaptcha(e: MouseEvent): void {
    e.preventDefault();  // Prevent default action (e.g., form submission or reloading)
  }
}
