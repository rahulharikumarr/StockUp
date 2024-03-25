// tab-group.component.ts

import { Component, OnInit } from '@angular/core';
import { StockDataService } from '../search.service';
import { SearchResultService } from '../search-results.service';

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.css']
})
export class TabGroupComponent implements OnInit {
  companyData: any;
  companyPeers: string[] = [];
  latestPriceData: any;
  isDataLoaded: boolean = false;

  constructor(private stockDataService: StockDataService, private searchResultService: SearchResultService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const symbol = this.stockDataService.getSearchQuery();

    this.stockDataService.getCompanyData(symbol).subscribe(
      (companyData: any) => {
        console.log('Company Data:', companyData);
        this.companyData = companyData;
        this.checkDataLoaded();
      },
      (error: any) => {
        console.error('Error fetching company data:', error);
      }
    );

    this.stockDataService.getLatestPrice(symbol).subscribe(
      (latestPriceData: any) => {
        console.log('Latest Price Data:', latestPriceData);
        this.latestPriceData = latestPriceData;
        this.checkDataLoaded();
      },
      (error: any) => {
        console.error('Error fetching latest price data:', error);
      }
    );

    this.stockDataService.getCompanyPeers(symbol).subscribe(
      (companyPeers: any) => {
        console.log('Company Peers:', companyPeers);
        this.companyPeers = companyPeers;
        this.checkDataLoaded();
      },
      (error: any) => {
        console.error('Error fetching company peers:', error);
      }
    );
  }

  checkDataLoaded(): void {
    if (this.companyData && this.latestPriceData && this.companyPeers.length > 0) {
      this.isDataLoaded = true;
    }
  }
}
