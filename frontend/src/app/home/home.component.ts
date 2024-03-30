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

  constructor(private stockDataService: StockDataService) { }

  performSearch() {
    if (this.query.trim() !== '') {
      this.stockDataService.setSearchQuery(this.query);
      this.stockDataService.search(this.query).subscribe(
        results => {
          if (results.length === 0) {
            alert('No data found. Please enter a valid ticker');
          } else {
            this.searchResults = results;
          }
        },
        error => {
          alert('No data found. Please enter a valid ticker');
        }
      );
    }
  }

  
}
