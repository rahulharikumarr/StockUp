import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockDataService } from '../search.service';
import { SearchResultService } from '../search-results.service';


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
    private stockDataService: StockDataService,
    private searchResultService: SearchResultService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ticker = params['ticker'];
      this.searchQuery = this.stockDataService.getSearchQuery();
      this.searchResultService.setLastSearchedTicker(this.ticker);
      
      const storedData = this.searchResultService.getSearchResults(this.ticker);
      if (storedData) {
        this.companyData = storedData.companyData;
        this.marketStatus = storedData.marketStatus;
        this.latestPriceData = storedData.latestPriceData;
      } else {
        this.loadData();
        console.log('fetched from the backend lol');
      }
    });
  }

  loadData(): void {
    this.stockDataService.getCompanyData(this.ticker).subscribe(companyData => {
      this.companyData = companyData;
      this.stockDataService.getMarketStatus().subscribe(marketStatus => {
        this.marketStatus = marketStatus;
        this.stockDataService.getLatestPrice(this.ticker).subscribe(latestPriceData => {
          this.latestPriceData = latestPriceData;
          this.searchResultService.storeSearchResults(this.ticker, {
            companyData: this.companyData,
            marketStatus: this.marketStatus,
            latestPriceData: this.latestPriceData
          });
        });
      });
    });
  }

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
