import { Component } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NzButtonModule, NzCheckboxModule, NzFormModule, NzInputModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  validateForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    remember: this.fb.control(true)
  });

  constructor(
    private fb: NonNullableFormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Handles form submission when the user tries to log in.
   * Validates form, performs login, and navigates upon success.
   */
  submitForm(): void {
    if (this.validateForm.valid) {
      const username = this.validateForm.get('username')?.value ?? '';
      const password = this.validateForm.get('password')?.value ?? '';

      this.authService.login(username, password).subscribe(
        (user) => {
          console.log('Login successful!', user);
          this.router.navigate(['/offer-page']);  // Navigate to the offer page after successful login
        },
        (error) => {
          console.error('Login failed:', error);  // Log any error that occurs during login
        }
      );
    } else {
      // If the form is invalid, mark all controls as dirty to trigger validation messages
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
