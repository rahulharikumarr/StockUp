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
    // Determine if the market is open
    const now = new Date();
    const isMarketOpen = now.getDay() >= 1 && now.getDay() <= 5 && (now.getHours() > 6 || (now.getHours() === 6 && now.getMinutes() >= 30)) && now.getHours() < 13;
  
    // Fetch historical data for the last working day
    this.stockDataService.getCompanyHistoricalDataLastWorkingDay(this.lastSearchedTicker).subscribe(
      (response: any) => {
        console.log('Historical Data:', response);
        
        // Extract results array from response
        const historicalData = response.results;
        
        // Extract necessary data for chart
        const timeLabels = historicalData.map((entry: any) => {
          // Parse timestamp to get hour in the day
          const date = new Date(entry.t);
          const hour = date.getHours();
          const minutes = date.getMinutes();
          const formattedHour = `${hour < 10 ? '0' + hour : hour}:${minutes < 10 ? '0' + minutes : minutes}`;
          return formattedHour;
        });
        const stockPrices = historicalData.map((entry: any) => entry.c); // Assuming 'close' prices are used
        
        console.log('Time Labels:', timeLabels);
        console.log('Stock Prices:', stockPrices);
  
        // Determine line color based on market open/close status
        const lineColor = isMarketOpen ? 'green' : 'red';
  
        // Update chart options with actual data
        this.chartOptions = {
          chart: {
            type: 'line',
            scrollablePlotArea: {
              minWidth: 6* 250,
              scrollPositionX: 1
            }
          },
          title: {
            text: `${this.lastSearchedTicker} Hourly Price Variation`
          },
          xAxis: {
            categories: timeLabels,
            title: {
              text: 'Time'
            },
          },
          yAxis: {
            title: {
              text: ''
            },
            opposite: true 
          },
          series: [{
            type: 'line',
            name: `${this.lastSearchedTicker}`,
            color: lineColor,
            data: stockPrices,
            marker: {
                enabled: false
            }
        }]
        };
  
        console.log('Chart Options:', this.chartOptions); // Log chart options
      },
      (error: any) => {
        console.error('Error fetching historical data:', error);
      }
    );
  }

}
