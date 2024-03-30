import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WatchlistService } from '../watchlist.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';
import { SearchResultService } from '../search-results.service';
import { StockDataService } from '../search.service';


@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {
  watchlist: any[] = [];

  constructor(private watchlistService: WatchlistService, private router: Router, private stockDataService: StockDataService, private searchResultService: SearchResultService) { }

  ngOnInit(): void {
    this.getWatchlist();
  }

  getWatchlist(): void {
    this.watchlistService.getWatchlist()
      .subscribe(
        data => {
          this.watchlist = data;
          // Fetch latest price data for each stock
          this.watchlist.forEach(item => {
            this.stockDataService.getLatestPrice(item.ticker)
              .subscribe(
                (latestPriceData: any[]) => { 
                  item.latestPriceData = latestPriceData;
                },
                (error: any) => { // Explicitly type error as any
                  console.error(`Error fetching latest price data for ${item.ticker}:`, error);
                }
              );
          });
        },
        error => {
          console.error('Error fetching watchlist:', error);
        }
      );
  }

  removeFromWatchlist(ticker: string): void {
    this.watchlistService.removeFromWatchlist(ticker).subscribe(
      () => {
        console.log('Stock removed from watchlist:', ticker);
        this.watchlist = this.watchlist.filter(item => item.ticker !== ticker);
      },
      error => {
        console.error('Error removing stock from watchlist:', error);
        // Handle error, e.g., show an error message to the user
      }
    );
  }
  

  navigateToDetails(ticker: string): void {
    this.router.navigate(['/details', ticker]);
  }

  getChangeColor(change: number): string {
    if (change > 0) {
      return 'text-success'; // Green color for positive change
    } else if (change < 0) {
      return 'text-danger'; // Red color for negative change
    } else {
      return 'text-black'; // Default black color for no change
    }
  }
}
