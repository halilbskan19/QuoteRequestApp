import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OfferItems } from '../models/offer-item.model';
import { OfferListItems } from '../models/offer-list.model';

@Injectable({
  providedIn: 'root'
})
export class OffersService {
  private offerItemsApiUrl = 'http://localhost:3000/offerItems';
  private offersListApiUrl = 'http://localhost:3000/offers';

  constructor(private http: HttpClient) { }

  getOfferItems(): Observable<OfferItems> {
    return this.http.get<OfferItems>(this.offerItemsApiUrl);
  }

  getOffersList(): Observable<OfferListItems[]> {
    return this.http.get<OfferListItems[]>(this.offersListApiUrl);
  }
}
