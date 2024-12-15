import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Route } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { RegisterComponent } from './app/pages/auth/register/register.component';
import { LoginComponent } from './app/pages/auth/login/login.component';
import { OfferPageComponent } from './app/pages/offer-page/offer-page.component';
import { authGuard } from './app/guards/auth.guards';
import { OfferListPageComponent } from './app/pages/offer-list-page/offer-list-page.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

const routes: Route[] = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Ana rota
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'offer-page', component: OfferPageComponent, canActivate: [authGuard] },
  { path: 'offer-list-page', component: OfferListPageComponent, canActivate: [authGuard] }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideNoopAnimations(),
    provideHttpClient()
  ]
}).catch(err => console.error(err));
