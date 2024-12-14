import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/auth/register/register.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { OfferPageComponent } from './pages/offer-page/offer-page.component';
import { OfferListPageComponent } from './pages/offer-list-page/offer-list-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },
  { path: 'offer-page', component: OfferPageComponent },
  { path: 'offer-list-page', component: OfferListPageComponent }
];
