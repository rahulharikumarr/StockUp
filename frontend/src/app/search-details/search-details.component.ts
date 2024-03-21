import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockDataService } from '../search.service';

@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrls: ['./search-details.component.css']
})
export class SearchDetailsComponent implements OnInit {
  ticker: string = '';
  companyData: any;
  marketStatus: any;
  latestPriceData: any;
  searchQuery: string = '';

  constructor(
    private route: ActivatedRoute,
    private stockDataService: StockDataService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ticker = params['ticker'];
      this.searchQuery = this.stockDataService.getSearchQuery(); // Get the search query
      this.loadCompanyData();
      this.loadMarketStatus();
      this.loadLatestPrice();
    });
  }

  loadCompanyData(): void {
    this.stockDataService.getCompanyData(this.ticker).subscribe(data => {
      this.companyData = data;
    });
  }

  loadMarketStatus(): void {
    this.stockDataService.getMarketStatus().subscribe(data => {
      this.marketStatus = data;
    });
  }

  loadLatestPrice(): void {
    this.stockDataService.getLatestPrice(this.ticker).subscribe(data => {
      this.latestPriceData = data;
    });
  }

  // Function to format date
  formatDate(date: any): string {
    const formattedDate = new Date(date * 1000);
    const year = formattedDate.getFullYear();
    const month = ('0' + (formattedDate.getMonth() + 1)).slice(-2);
    const day = ('0' + formattedDate.getDate()).slice(-2);
    const hours = ('0' + formattedDate.getHours()).slice(-2);
    const minutes = ('0' + formattedDate.getMinutes()).slice(-2);
    const seconds = ('0' + formattedDate.getSeconds()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
}
