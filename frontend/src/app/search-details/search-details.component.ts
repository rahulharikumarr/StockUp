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
  isStarFilled: boolean = false;
  isMarketOpen: boolean = false;
  marketClosingTime: string = '';

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

    // Check market status when component initializes
    this.checkMarketStatus();
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
    if (!date) {
      return 'Unknown'; // Return a default value for null or undefined dates
    }
  
    // Convert the provided timestamp to a Date object
    const formattedDate = new Date(date);
  
    // Extract year, month, and day components
    const year = formattedDate.getFullYear();
    const month = ('0' + (formattedDate.getMonth() + 1)).slice(-2);
    const day = ('0' + formattedDate.getDate()).slice(-2);
  
    // Return the formatted date
    return `${year}-${month}-${day} 13:00:00`; // Market always closes at 1:00 PM
  }

  formatTimestamp(timestamp: any): string {
    if (!timestamp) {
      return 'Unknown'; // Return a default value for null or undefined timestamps
    }
  
    // Convert the provided timestamp to a JavaScript Date object
    const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
  
    // Extract year, month, day, hours, minutes, and seconds components
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
  
    // Return the formatted date and time
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  

  toggleStar(): void {
    this.isStarFilled = !this.isStarFilled;
  }
  
  checkMarketStatus(): void {
    const now = new Date(); // Current date and time
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
  
    // Convert current time to minutes
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;
  
    // Market open 6:30AM PST, market close 1PM PST
    const marketOpenTime = 6 * 60 + 30; // 6:30 AM converted to minutes
    const marketCloseTime = 13 * 60; // 1:00 PM converted to minutes
  
    if (currentTimeInMinutes >= marketOpenTime && currentTimeInMinutes <= marketCloseTime) {
      // Market is open
      this.isMarketOpen = true;
    } else {
      // Market is closed
      // Calculate the timestamp for the last market close date (yesterday)
      const lastCloseDate = new Date(now); // Create a copy of the current date and time
      if (currentTimeInMinutes < marketOpenTime) {
        // If the current time is before the opening time, consider the previous day's closing time
        lastCloseDate.setDate(now.getDate() - 1); // Set the date to the previous day
      }
      lastCloseDate.setHours(13, 0, 0); // Set hours and minutes to 1:00 PM
  
      // Assign the last close date to marketStatus.closingTime
      this.marketClosingTime = this.formatDate(lastCloseDate);
    }
  }
}
