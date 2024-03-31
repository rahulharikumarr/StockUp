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
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Options } from 'highcharts';
import HighchartsIndicators from 'highcharts/indicators/indicators'; // Import the 'highcharts-indicators' module
import HighchartsVbp from 'highcharts/indicators/volume-by-price';
import { XAxisLabelsOptions } from 'highcharts';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


declare var encodeURIComponent: any;


@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.css']
})
export class TabGroupComponent implements OnInit {
  companyData: any;
  companyPeers: string[] = [];
  newsModal: any;
  latestPriceData: any;
  insiderSentimentData: any = {};
  topNews: any[] = [];
  newsItem: any;
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
  companyRecommendationsChartOptions: any;
  companyEarningsChartOptions: any;

  constructor(private stockDataService: StockDataService, private searchResultService: SearchResultService, private route: ActivatedRoute, private modalService: NgbModal) {
    HighchartsStock(Highcharts);
    HighchartsIndicators(Highcharts);
    HighchartsVbp(Highcharts);
  }

  ngOnInit(): void {
    this.lastSearchedTicker = this.searchResultService.getLastSearchedTicker();
  
    // Get stored data
    this.latestPriceData = this.searchResultService.getSearchResults('latestPriceData');
    this.companyData = this.searchResultService.getSearchResults('companyData');
    this.companyPeers = this.searchResultService.getSearchResults('companyPeers');
    const historicalData = this.searchResultService.getSearchResults('historicalData');
  
    // If stored data is not available, fetch it
    if (!this.latestPriceData || !this.companyData || !this.companyPeers || !historicalData) {
      this.fetchData();
    } else {
      // Assign the data to the component's properties
      this.latestPriceData = this.latestPriceData;
      this.companyData = this.companyData;
      this.companyPeers = this.companyPeers;
    }
  
    // Generate the chart
    this.generateChart();
  
    this.generateChartSMAVolumeByPrice().subscribe((chartOptions: Highcharts.Options) => {
      this.chartOptionsSMAVolumeByPrice = chartOptions;
    });
  
    this.fetchInsiderSentimentData();
  
    this.getTopNews(this.lastSearchedTicker);
  
    console.log('Calling generateCompanyRecommendationsChart()'); // Check if the function is called
    this.generateCompanyRecommendationsChart(); // Call the function
  
    console.log('Calling generateCompanyEarningsChart()'); // Check if the function is called
    this.generateCompanyEarningsChart(); // Call the function
  }

  fetchData(): void {
    // Check if the data is already saved
    let companyData = this.searchResultService.getSearchResults('companyData');
    let latestPriceData = this.searchResultService.getSearchResults('latestPriceData');
    let companyPeers = this.searchResultService.getSearchResults('companyPeers');
  
    // If the data is already saved, set the corresponding flags to true
    let companyDataLoaded = !!companyData;
    let latestPriceDataLoaded = !!latestPriceData;
    let companyPeersLoaded = !!companyPeers;
  
    // If the data is not saved, fetch it from the backend
    if (!companyData) {
      this.stockDataService.getCompanyData(this.lastSearchedTicker).subscribe(
        (data: any) => {
          console.log('Company Data:', data);
          this.companyData = data;
          this.searchResultService.storeSearchResults('companyData', data); // Save fetched company data
          companyDataLoaded = true;
          this.checkDataLoaded(companyDataLoaded, latestPriceDataLoaded, companyPeersLoaded);
        },
        (error: any) => {
          console.error('Error fetching company data:', error);
        }
      );
    } else {
      // Data is already saved, set the flag to true and check if all data is loaded
      companyDataLoaded = true;
      this.checkDataLoaded(companyDataLoaded, latestPriceDataLoaded, companyPeersLoaded);
    }
  
    if (!latestPriceData) {
      this.stockDataService.getLatestPrice(this.lastSearchedTicker).subscribe(
        (data: any) => {
          console.log('Fetching Latest Price Data from API:', data);
          this.latestPriceData = data;
          this.searchResultService.storeSearchResults('latestPriceData', data); // Save fetched latest price data
          latestPriceDataLoaded = true;
          this.checkDataLoaded(companyDataLoaded, latestPriceDataLoaded, companyPeersLoaded);
        },
        (error: any) => {
          console.error('Error fetching latest price data:', error);
        }
      );
    } else {
      // Data is already saved, set the flag to true and check if all data is loaded
      latestPriceDataLoaded = true;
      this.checkDataLoaded(companyDataLoaded, latestPriceDataLoaded, companyPeersLoaded);
    }
  
    if (!companyPeers) {
      this.stockDataService.getCompanyPeers(this.lastSearchedTicker).subscribe(
        (data: any[]) => {
          console.log('Company Peers:', data);
          this.fetchPeers(data);
          this.searchResultService.storeSearchResults('companyPeers', data); // Save fetched company peers data
          companyPeersLoaded = true;
          this.checkDataLoaded(companyDataLoaded, latestPriceDataLoaded, companyPeersLoaded);
        },
        (error: any) => {
          console.error('Error fetching company peers:', error);
        }
      );
    } else {
      // Data is already saved, set the flag to true and check if all data is loaded
      companyPeersLoaded = true;
      this.checkDataLoaded(companyDataLoaded, latestPriceDataLoaded, companyPeersLoaded);
    }
  }


  fetchPeers(peers: string[]): void {
    // Remove duplicates
    const uniquePeers = peers.filter((peer, index, self) => self.indexOf(peer) === index);
    this.companyPeers = uniquePeers.filter(peer => !peer.includes('.'));
  }

  fetchInsiderSentimentData(): void {
    const symbol = this.searchResultService.getLastSearchedTicker(); // Get the last searched ticker symbol
    
    // Check if earnings data is already saved
    let earningsData = this.searchResultService.getSearchResults('earningsData');
    if (earningsData) {
      console.log('Retrieved earnings data from cache:', earningsData);
      // Process the fetched earnings data as needed
    } else {
      // Fetch earnings data from the backend
      this.stockDataService.getEarnings(symbol).subscribe(
        (data: any) => {
          console.log('Earnings Data checking if it is there:', data);
          // Process the fetched earnings data as needed
          this.searchResultService.storeSearchResults('earningsData', data);
        },
        (error: any) => {
          console.error('Error fetching earnings data:', error);
        }
      );
    }
  
    // Similarly check and fetch recommendation trends data
    // Check if recommendation trends data is already saved
    let recommendationTrendsData = this.searchResultService.getSearchResults('recommendationTrendsData');
    if (recommendationTrendsData) {
      console.log('Retrieved recommendation trends data from cache:', recommendationTrendsData);
      // Process the fetched recommendation trends data as needed
    } else {
      // Fetch recommendation trends data from the backend
      this.stockDataService.getRecommendationTrends(symbol).subscribe(
        (data: any) => {
          console.log('Recommendation Trends Data:', data);
          // Process the fetched recommendation trends data as needed
          this.searchResultService.storeSearchResults('recommendationTrendsData', data);
        },
        (error: any) => {
          console.error('Error fetching recommendation trends data:', error);
        }
      );
    }
  
    // Finally, fetch insider sentiment data
    // Check if insider sentiment data is already saved
    let insiderSentimentData = this.searchResultService.getSearchResults('insiderSentimentData');
    if (insiderSentimentData) {
      console.log('Retrieved insider sentiment data from cache:', insiderSentimentData);
      // Assign fetched data to insiderSentimentData object
      this.insiderSentimentData = insiderSentimentData;
    } else {
      // Fetch insider sentiment data from the backend
      this.stockDataService.getInsiderSentiment(symbol).subscribe(
        (data: any) => {
          console.log('Insider Sentiment Data:', data);
          // Assign fetched data to insiderSentimentData object
          this.insiderSentimentData = data;
          this.searchResultService.storeSearchResults('insiderSentimentData', data);
        },
        (error: any) => {
          console.error('Error fetching insider sentiment data:', error);
        }
      );
    }
  }
  

// note, to be used in the insights tab
  calculateTotal(key: string): number {
    return this.insiderSentimentData.data.reduce((total: number, entry: any) => total + entry[key], 0);
  }

  calculatePositive(key: string): number {
    return this.insiderSentimentData.data.filter((entry: any) => entry[key] > 0).reduce((total: number, entry: any) => total + entry[key], 0);
  }

  calculateNegative(key: string): number {
    return this.insiderSentimentData.data.filter((entry: any) => entry[key] < 0).reduce((total: number, entry: any) => total + entry[key], 0);
  }

  getTopNews(symbol: string): void {
    this.stockDataService.getCompanyNews(symbol).subscribe(
      (data: any[]) => {
        const filteredNews = data.filter(newsItem => {
          return newsItem.image && newsItem.headline && newsItem.url && newsItem.datetime && newsItem.summary && newsItem.source;
        });
  
        // Convert the datetime values to the desired format
        filteredNews.forEach(newsItem => {
          const date = new Date(newsItem.datetime * 1000);
          const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
          newsItem.datetime = date.toLocaleDateString(undefined, options);
        });
  
        this.topNews = filteredNews.slice(0, 20);
      },
      (error: any) => {
        console.error('Error fetching top news:', error);
      }
    );
  }
  
  openModal(content: any, newsItem: any): void {
    // Open modal and pass the news item data
    const modalRef = this.modalService.open(content, { size: 'lg' });
    this.newsItem = newsItem; // Set the newsItem property
  }
  
  shareOnTwitter(newsItem: any): void {
    const tweetContent = `${newsItem.headline}\n${newsItem.url}`;
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetContent)}`;
    window.open(tweetUrl, '_blank');
  }
  
  shareOnFacebook(newsItem: any): void {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(newsItem.url)}`;
    window.open(facebookUrl, '_blank')
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
  
    // Check if historical data is already stored
    const historicalData = this.searchResultService.getSearchResults('historicalData');
  
    // If historical data is not stored or if it's outdated, fetch it from the backend
    if (!historicalData) {
      this.stockDataService.getCompanyHistoricalDataLastWorkingDay(this.lastSearchedTicker).subscribe(
        (response: any) => {
          // Extract results array from response
          const historicalDataFromAPI = response.results;
          this.updateChartWithData(historicalDataFromAPI, isMarketOpen);
          // Store fetched historical data
          this.searchResultService.storeSearchResults('historicalData', historicalDataFromAPI);
        },
        (error: any) => {
          console.error('Error fetching historical data:', error);
        }
      );
    } else {
      console.log('Using existing data for chart');
      this.updateChartWithData(historicalData, isMarketOpen);
    }
  }
  
  updateChartWithData(historicalData: any[], isMarketOpen: boolean): void {
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
        backgroundColor: '#fafafa',
        scrollablePlotArea: {
          minWidth: 6 * 250,
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
  }



  generateChartSMAVolumeByPrice(): Observable<Options> {
    const historicalData = this.searchResultService.getSearchResults('historicalData');

    if (!historicalData) {
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
            rangeSelector: {
              selected: 2,
              enabled: true
            },
            navigator: {
              enabled: true
            },
            title: {
              text: 'AAPL Historical'
            },
            subtitle: {
              text: 'With SMA and Volume by Price technical indicators'
            },
            yAxis: [{
              title: {
                text: 'OHLC'
              },
              opposite: true,
              startOnTick: false,
              endOnTick: false,
              labels: {
                align: 'right',
                x: -3
              },
              height: '60%',
              lineWidth: 2,
              resize: {
                enabled: true
              }
            }, {
              title: {
                text: 'Volume'
              },
              opposite: true,
              top: '65%',
              height: '35%',
              offset: 0,
              lineWidth: 2,
              labels: {
                formatter: function () {
                  return (Number(this.value) / 1000000).toFixed(0) + 'M';
                }
              }
            }],
            xAxis: {
              type: 'datetime',
              labels: {
                formatter: function () {
                  return Highcharts.dateFormat('%e %b', Number(this.value));
                },
                dateTimeLabelFormats: {
                  month: '%e %b',
                  year: '%b',
                  all: '%b \'%y'
                }
              } as Highcharts.XAxisLabelsOptions // Add the type assertion here
            },
            series: [{
              type: 'candlestick',
              name: this.lastSearchedTicker,
              id: 'aapl',
              zIndex: 2,
              data: ohlcData,
              yAxis: 0
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

          this.searchResultService.storeSearchResults('historicalData', response.results);
          return options;
        })
      );
    } else {
      console.log('using existing data for chart 2')
      const ohlcData = historicalData.map((entry: any) => [
        entry.t, // timestamp
        entry.o, // open
        entry.h, // high
        entry.l, // low
        entry.c  // close
      ]);

      const volumeData = historicalData.map((entry: any) => [
        entry.t, // timestamp
        entry.v  // volume
      ]);

      const options: Options = {
        rangeSelector: {
          selected: 2,
          enabled: true
        },
        navigator: {
          enabled: true
        },
        title: {
          text: 'AAPL Historical'
        },
        subtitle: {
          text: 'With SMA and Volume by Price technical indicators'
        },
        yAxis: [{
          title: {
            text: 'OHLC'
          },
          opposite: true,
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true
          }
        }, {
          title: {
            text: 'Volume'
          },
          opposite: true,
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
          labels: {
            formatter: function () {
              return (Number(this.value) / 1000000).toFixed(0) + 'M';
            }
          }
        }],
        xAxis: {
          type: 'datetime',
          labels: {
            formatter: function () {
              return Highcharts.dateFormat('%e %b', Number(this.value));
            },
            dateTimeLabelFormats: {
              month: '%e %b',
              year: '%b',
              all: '%b \'%y'
            }
          } as Highcharts.XAxisLabelsOptions // Add the type assertion here
        },
        series: [{
          type: 'candlestick',
          name: this.lastSearchedTicker,
          id: 'aapl',
          zIndex: 2,
          data: ohlcData,
          yAxis: 0
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

      return of(options);
    }
  }

  generateCompanyRecommendationsChart(): void {
    let recommendationData = this.searchResultService.getSearchResults('recommendationTrendsData');

    if (!recommendationData || recommendationData.length === 0) {
        const symbol = this.searchResultService.getLastSearchedTicker();
        this.stockDataService.getRecommendationTrends(symbol).subscribe(
            (data: any) => {
                recommendationData = data;
                this.searchResultService.storeSearchResults('recommendationTrendsData', recommendationData);
                this.renderRecommendationsChart(recommendationData);
            },
            (error: any) => {
                console.error('Error fetching recommendation trends data:', error);
            }
        );
    } else {
        this.renderRecommendationsChart(recommendationData);
    }
}

private renderRecommendationsChart(data: any[]): void {
  // Generate chart options
  this.companyRecommendationsChartOptions = {
    chart: {
      type: 'column'
    },
    title: {
      text: 'Company Recommendations'
    },
    xAxis: {
      categories: data.map((item: any) => item.period)
    },
    yAxis: {
      title: {
        text: '#Analysis'
      },
      stackLabels: {
        enabled: true
      }
    },
    tooltip: {
      headerFormat: '<b>{point.x}</b><br/>',
      pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        },
        colors: ['#5c071e', '#c94b6c', '#91893a', '#60d173', '#103817']
      }
    },
    series: [
      { name: 'Strong Buy', data: data.map(item => item.strongBuy), color: '#103817' },
      { name: 'Buy', data: data.map(item => item.buy), color: '#60d173' },
      { name: 'Hold', data: data.map(item => item.hold), color: '#91893a' },
      { name: 'Sell', data: data.map(item => item.sell), color: '#c94b6c' },
      { name: 'Strong Sell', data: data.map(item => item.strongSell), color: '#5c071e' }
    
      
    ]
  };
}

generateCompanyEarningsChart(): void {
  let earningsData = this.searchResultService.getSearchResults('earningsData');

  if (!earningsData || earningsData.length === 0) {
      const symbol = this.searchResultService.getLastSearchedTicker();
      this.stockDataService.getEarnings(symbol).subscribe(
          (data: any) => {
              earningsData = data;
              this.searchResultService.storeSearchResults('earningsData', earningsData);
              this.renderEarningsChart(earningsData);
          },
          (error: any) => {
              console.error('Error fetching earnings data:', error);
          }
      );
  } else {
      this.renderEarningsChart(earningsData);
  }
}

private renderEarningsChart(data: any[]): void {
    this.companyEarningsChartOptions = {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Company Earnings'
        },
        xAxis: {
            categories: data.map((item: any) => item.period),
            title: {
                text: 'Period'
            }
        },
        yAxis: {
            title: {
                text: 'Value'
            }
        },
        series: [{
            name: 'Actual',
            data: data.map((item: any) => item.actual)
        }, {
            name: 'Estimate',
            data: data.map((item: any) => item.estimate)
        }]
    };
}
}