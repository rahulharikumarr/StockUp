import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockDataService } from '../search.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search-details',
  templateUrl: './search-details.component.html',
  styleUrls: ['./search-details.component.css']
})
export class SearchDetailsComponent implements OnInit {
  ticker: string = '';
  companyData: any;
  marketStatus: any;
  searchQuery: string = ''; // Ensure searchQuery is initialized properly

  constructor(private route: ActivatedRoute, private stockDataService: StockDataService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ticker = params['ticker'];
      this.searchQuery = this.stockDataService.getSearchQuery(); // Get the search query
      this.loadCompanyData();
      this.loadMarketStatus();
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

  // Function to format date
  formatDate(date: any): string {
    return new Date(date * 1000).toISOString(); // Convert timestamp to ISO string
  }
}
