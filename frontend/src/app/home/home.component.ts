import { Component } from '@angular/core';
import { StockDataService } from '../search.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  query: string = '';
  searchResults: any[] = [];
  validTicker: boolean = true;
  showAlert = true; 

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

  handleClearClick() {
    this.validTicker = true;
  }

  handleValidTicker(isValid: boolean) {
    this.validTicker = isValid;
  }
}