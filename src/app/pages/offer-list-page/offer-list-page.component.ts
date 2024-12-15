import { Component } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableModule,
  NzTableSortFn,
  NzTableSortOrder
} from 'ng-zorro-antd/table';
import { OfferItems } from '../../models/offer-item.model';
import { OfferListItems } from '../../models/offer-list.model';
import { OffersService } from '../../services/offers.service';
import { InchToCmConverterComponent } from '../../components/inch-to-cm-converter/inch-to-cm-converter.component';

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<OfferListItems> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<OfferListItems> | null;
}

@Component({
  selector: 'app-offer-list-page',
  standalone: true,
  imports: [NzButtonModule, NzTableModule, InchToCmConverterComponent],
  templateUrl: './offer-list-page.component.html',
  styleUrls: ['./offer-list-page.component.scss']
})
export class OfferListPageComponent {
  listOfData: OfferListItems[] = []
  offerItems: OfferItems = {
    modes: [],
    movementTypes: [],
    incoterms: [],
    countriesCities: {
      USA: [],
      China: [],
      Turkey: [],
    },
    packageTypes: [],
    unit1: [],
    unit2: [],
    currencies: [],
  };

  columnGenerator() {
    this.listOfColumns.forEach(column => {
      if (column.name === 'Mode') {
        column.listOfFilter = this.offerItems.modes.map(mode => ({
          text: mode,
          value: mode
        }));
      } else if (column.name === 'Movement Type') {
        column.listOfFilter = this.offerItems.movementTypes.map(movementType => ({
          text: movementType,
          value: movementType
        }));
      } else if (column.name === 'Incoterms') {
        column.listOfFilter = this.offerItems.incoterms.map(incoterm => ({
          text: incoterm,
          value: incoterm
        }));
      } else if (column.name === 'Package Type') {
        column.listOfFilter = this.offerItems.packageTypes.map(packageTypes => ({
          text: packageTypes,
          value: packageTypes
        }));
      }
    });
  }

  getOffersList(): void {
    this.offersService.getOffersList().subscribe(
      (response) => {
        this.listOfData = response;
      },
      (error) => {
        console.error('Error fetching offers:', error);
      }
    );
  }

  getOfferItems(): void {
    this.offersService.getOfferItems().subscribe(
      (response: OfferItems) => {
        this.offerItems = response;

        this.columnGenerator();
      },
      (error) => {
        console.error('Error fetching offer items:', error);
      }
    );
  }

  listOfColumns: ColumnItem[] = [
    {
      name: 'Mode',
      sortOrder: null,
      sortFn: (a: OfferListItems, b: OfferListItems) => a.mode.localeCompare(b.mode),
      listOfFilter: [],
      filterFn: (mode: string[], item: OfferListItems) => mode.some(mode => item.mode.indexOf(mode) !== -1)
    },
    {
      name: 'Movement Type',
      sortOrder: null,
      sortFn: (a: OfferListItems, b: OfferListItems) => a.movementType.localeCompare(b.movementType),
      listOfFilter: [],
      filterFn: (movementType: string[], item: OfferListItems) => movementType.some(movementType => item.movementType.indexOf(movementType) !== -1)
    },
    {
      name: 'Incoterms',
      sortOrder: null,
      sortFn: (a: OfferListItems, b: OfferListItems) => a.incoterms.localeCompare(b.incoterms),
      listOfFilter: [],
      filterFn: (incoterms: string[], item: OfferListItems) => incoterms.some(incoterms => item.incoterms.indexOf(incoterms) !== -1)
    },
    {
      name: 'Countries-Cities',
      sortOrder: null,
      sortFn: (a: OfferListItems, b: OfferListItems) => a.countriesCities.localeCompare(b.countriesCities),
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Package Type',
      sortOrder: null,
      sortFn: (a: OfferListItems, b: OfferListItems) => a.packageType.localeCompare(b.packageType),
      listOfFilter: [],
      filterFn: (packageType: string, item: OfferListItems) => item.packageType.indexOf(packageType) !== -1
    },
    {
      name: 'Unit-1',
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Unit-2',
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Pallet Count',
      sortOrder: null,
      sortFn: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Currency',
      sortOrder: null,
      sortFn: (a: OfferListItems, b: OfferListItems) => a.currency.localeCompare(b.currency),
      listOfFilter: [],
      filterFn: null
    }
  ];

  resetFilters(): void {
    this.columnGenerator();
  }

  resetSortAndFilters(): void {
    this.listOfColumns.forEach(item => {
      item.sortOrder = null;
    });
    this.resetFilters();
  }

  constructor(private offersService: OffersService
  ) { }

  ngOnInit(): void {
    this.getOffersList();
    this.getOfferItems();
  }
}
