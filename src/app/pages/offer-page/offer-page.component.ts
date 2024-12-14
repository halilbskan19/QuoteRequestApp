import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzFlexModule } from 'ng-zorro-antd/flex';

import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'app-offer-page',
  standalone: true,
  imports: [FormsModule, NzSelectModule, NzFlexModule],
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

  isVertical = true;
}
