// tab-group.component.ts
import { Component, OnInit } from '@angular/core';
import { StockDataService } from '../search.service';
import { SearchResultService } from '../search-results.service';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsStock from 'highcharts/modules/stock';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsAccessibility from 'highcharts/modules/accessibility';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Options } from 'highcharts';
import HighchartsIndicators from 'highcharts/indicators/indicators'; // Import the 'highcharts-indicators' module
import HighchartsVbp from 'highcharts/indicators/volume-by-price';

// ...






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
  chartOptionsSMAVolumeByPrice: Highcharts.Options = {};

  constructor(private stockDataService: StockDataService, private searchResultService: SearchResultService) {
    HighchartsStock(Highcharts);
    HighchartsIndicators(Highcharts);
    HighchartsVbp(Highcharts);
  }

  ngOnInit(): void {
    this.lastSearchedTicker = this.searchResultService.getLastSearchedTicker();
    console.log('Last Searched Ticker:', this.lastSearchedTicker); // Debugging
    this.fetchData();
    this.generateChartSMAVolumeByPrice().subscribe((chartOptions: Highcharts.Options) => {
      this.chartOptionsSMAVolumeByPrice = chartOptions;
    });
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

      },
      (error: any) => {
        console.error('Error fetching historical data:', error);
      }
    );
  }

  generateChartSMAVolumeByPrice(): Observable<Options> {
    return this.stockDataService.getCompanyHistoricalDataLastTwoYears(this.lastSearchedTicker).pipe(
        map((response: any) => {
            const ohlcData = response.results.map((entry: any) => [
                entry.t, // timestamp
                entry.o, // open
                entry.h, // high
                entry.l, // low
                entry.c  // close
            ]);

            const volumeData = response.results.map((entry: any) => [
                entry.t, // timestamp
                entry.v  // volume
            ]);

            const options: Options = {
              chart: {
                    height: 600 // Increase the height to 600 pixels
                },
                rangeSelector: {
                    enabled: true,
                    selected: 2,
                    buttons: [{
                        type: 'month',
                        count: 1,
                        text: '1M'
                    }, {
                        type: 'month',
                        count: 3,
                        text: '3M'
                    }, {
                        type: 'month',
                        count: 6,
                        text: '6M'
                    }, {
                        type: 'ytd',
                        text: 'YTD'
                    }, {
                        type: 'day',
                        count: 1,
                        text: '1D'
                    }, {
                        type: 'all',
                        text: 'All'
                    }]
                },
                navigator: {
                    enabled: true
                },
                title: {
                    text: `${this.lastSearchedTicker} Historical`
                },
                subtitle: {
                    text: 'With SMA and Volume by Price technical indicators'
                },
                yAxis: [{
                    startOnTick: false,
                    endOnTick: false,
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    title: {
                        text: 'OHLC'
                    },
                    height: '60%',
                    lineWidth: 2,
                    resize: {
                        enabled: true
                    }
                }, {
                    labels: {
                        align: 'right',
                        x: -3
                    },
                    title: {
                        text: 'Volume'
                    },
                    top: '65%',
                    height: '35%',
                    offset: 0,
                    lineWidth: 2
                }],
                tooltip: {
                    split: true
                },
                plotOptions: {
                    series: {
                        dataGrouping: {
                            units: [
                                ['week', [1]],
                                ['month', [1, 2, 3, 4, 6]]
                            ]
                        }
                    }
                },
                series: [{
                    type: 'candlestick',
                    name: `${this.lastSearchedTicker}`,
                    id: 'aapl',
                    zIndex: 2,
                    data: ohlcData
                }, {
                    type: 'column',
                    name: 'Volume',
                    id: 'volume',
                    data: volumeData,
                    yAxis: 1
                }, {
                    type: 'vbp',
                    linkedTo: 'aapl',
                    params: {
                        volumeSeriesID: 'volume'
                    },
                    dataLabels: {
                        enabled: false
                    },
                    zoneLines: {
                        enabled: false
                    }
                }, {
                    type: 'sma',
                    linkedTo: 'aapl',
                    zIndex: 1,
                    marker: {
                        enabled: false
                    }
                }]
            };

            return options;
        })
    );
}







  }
