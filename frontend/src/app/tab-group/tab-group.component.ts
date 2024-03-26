// tab-group.component.ts

import { Component, OnInit } from '@angular/core';
import { StockDataService } from '../search.service';
import { SearchResultService } from '../search-results.service';
import * as Highcharts from 'highcharts';

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
  lastSearchedTicker: string = '';
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {  }; // required
  chartCallback: any;
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false

  constructor(private stockDataService: StockDataService, private searchResultService: SearchResultService) { }

  ngOnInit(): void {
    this.lastSearchedTicker = this.searchResultService.getLastSearchedTicker();
    console.log('Last Searched Ticker:', this.lastSearchedTicker); // Debugging
    this.fetchData();
  }

  fetchData(): void {
    let companyDataLoaded = false;
    let latestPriceDataLoaded = false;
    let companyPeersLoaded = false;

    this.stockDataService.getCompanyData(this.lastSearchedTicker).subscribe(
      (companyData: any) => {
        console.log('Company Data:', companyData);
        this.companyData = companyData;
        companyDataLoaded = true;
        this.checkDataLoaded(companyDataLoaded, latestPriceDataLoaded, companyPeersLoaded);
      },
      (error: any) => {
        console.error('Error fetching company data:', error);
      }
    );

    this.stockDataService.getLatestPrice(this.lastSearchedTicker).subscribe(
      (latestPriceData: any) => {
        console.log('Latest Price Data:', latestPriceData);
        this.latestPriceData = latestPriceData;
        latestPriceDataLoaded = true;
        this.checkDataLoaded(companyDataLoaded, latestPriceDataLoaded, companyPeersLoaded);
      },
      (error: any) => {
        console.error('Error fetching latest price data:', error);
      }
    );

    this.stockDataService.getCompanyPeers(this.lastSearchedTicker).subscribe(
      (companyPeers: any[]) => {
        console.log('Company Peers:', companyPeers);
        this.fetchPeers(companyPeers);
        companyPeersLoaded = true;
        this.checkDataLoaded(companyDataLoaded, latestPriceDataLoaded, companyPeersLoaded);
      },
      (error: any) => {
        console.error('Error fetching company peers:', error);
      }
    );
  }

  fetchPeers(peers: string[]): void {
    // Remove duplicates
    const uniquePeers = peers.filter((peer, index, self) => self.indexOf(peer) === index);
    this.companyPeers = uniquePeers.filter(peer => !peer.includes('.'));
  }

  checkDataLoaded(companyDataLoaded: boolean, latestPriceDataLoaded: boolean, companyPeersLoaded: boolean): void {
    if (companyDataLoaded && latestPriceDataLoaded && companyPeersLoaded) {
      console.log('All data loaded. Generating chart...');
      this.isDataLoaded = true;
      this.generateChart(); // Generate chart when all data is loaded
    } else {
      console.log('Not all data is loaded yet.');
    }
  }

  generateChart(): void {
    const seriesData = [10, 20, 30, 40, 50]; // Sample data, replace with actual data
    this.chartOptions = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Sample Stock Price History' // Update title
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] // Update categories
      },
      yAxis: {
        title: {
          text: 'Price (USD)' // Update y-axis title
        }
      },
      series: [{
        type: 'line',
        name: 'Stock Price',
        data: seriesData
      }]
    };
  }
}
