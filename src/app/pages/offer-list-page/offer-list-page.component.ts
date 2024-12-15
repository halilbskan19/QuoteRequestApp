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
  name: string;  // The column name
  sortOrder: NzTableSortOrder | null;  // The sort order (ascending/descending or null)
  sortFn: NzTableSortFn<OfferListItems> | null;  // Function for sorting the data
  listOfFilter: NzTableFilterList;  // The list of filters for the column
  filterFn: NzTableFilterFn<OfferListItems> | null;  // Function to filter data based on the selected filters
}

@Component({
  selector: 'app-offer-list-page',
  standalone: true,
  imports: [NzButtonModule, NzTableModule, InchToCmConverterComponent],  // Import necessary modules
  templateUrl: './offer-list-page.component.html',
  styleUrls: ['./offer-list-page.component.scss']
})
export class OfferListPageComponent {
  listOfData: OfferListItems[] = [];  // Array to hold the list of offers data
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

  /**
   * This method is used to generate the columns' filter list dynamically 
   * based on the data fetched from the service (offerItems).
   */
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

  /**
   * Fetches the list of offers from the service.
   */
  getOffersList(): void {
    this.offersService.getOffersList().subscribe(
      (response) => {
        this.listOfData = response;  // Assign the fetched data to listOfData
      },
      (error) => {
        console.error('Error fetching offers:', error);  // Log any errors during the fetch
      }
    );
  }

  /**
   * Fetches the offer items data from the service and generates the column filters
   * after the data is fetched.
   */
  getOfferItems(): void {
    this.offersService.getOfferItems().subscribe(
      (response: OfferItems) => {
        this.offerItems = response;  // Assign fetched offerItems to the component
        this.columnGenerator();  // Generate the column filters based on the fetched data
      },
      (error) => {
        console.error('Error fetching offer items:', error);  // Log any errors during the fetch
      }
    );
  }

  // Array defining the structure of each column in the table
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

  /**
   * Resets the filters for all columns by regenerating them based on the current offer items.
   */
  resetFilters(): void {
    this.columnGenerator();  // Call columnGenerator to reset the filters
  }

  /**
   * Resets both sorting and filters for all columns.
   */
  resetSortAndFilters(): void {
    this.listOfColumns.forEach(item => {
      item.sortOrder = null;  // Reset sort order to null
    });
    this.resetFilters();  // Reset filters by calling columnGenerator
  }

  constructor(private offersService: OffersService) { }

  /**
   * Angular lifecycle hook that is triggered when the component is initialized.
   * This method fetches the offers list and the offer items when the component is created.
   */
  ngOnInit(): void {
    this.getOffersList();  // Fetch offers data
    this.getOfferItems();  // Fetch offer items data
  }
}
