import { Component } from '@angular/core';
import { StockDataService } from '../search.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  query: string = '';
  searchResults: any[] = [];
  validTicker: boolean = true;

  constructor(private stockDataService: StockDataService) { }

  performSearch() {
    if (this.query.trim() !== '') {
      this.stockDataService.setSearchQuery(this.query);
      this.stockDataService.search(this.query).subscribe(
        results => {
          if (results.length === 0) {
            this.validTicker = false;
          } else {
            this.searchResults = results;
            this.validTicker = true;
          }
        },
        error => {
          this.validTicker = false;
        }
      );
    }
  }

  handleValidTicker(isValid: boolean) {
    this.validTicker = isValid;
  }
}