import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StockDataService } from '../search.service';
import { SearchResultService } from '../search-results.service';
import { WatchlistService } from '../watchlist.service';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioService } from '../portfolio.service';
import { BuyModalComponent } from '../buy-modal/buy-modal.component';
import { SellModalComponent } from '../sell-modal/sell-modal.component';
import { UserService } from '../user.service';



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
  successMessage: string = '';
  removedMessage: string = '';
  showSuccessAlert: boolean = false;
  showRemovedAlert: boolean = false;
  walletBalance: number = 0;
  userStocksQuantity: number = 0;


  @ViewChild('successAlert', { static: false }) successAlert!: NgbAlert;
  @ViewChild('removedAlert', { static: false }) removedAlert!: NgbAlert;

  constructor(
    private route: ActivatedRoute,
    private stockDataService: StockDataService,
    private searchResultService: SearchResultService,
    private watchlistService: WatchlistService,
    private modalService: NgbModal,
    private portfolioService: PortfolioService,
    private userService: UserService
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
      this.fetchWalletBalance();
      this.fetchUserStocksQuantity();
    });

    // Check market status when component initializes
    this.checkMarketStatus();

    this.watchlistService.getWatchlist().subscribe(watchlist => {
      const found = watchlist.find(item => item.ticker === this.ticker);
      this.isStarFilled = !!found;
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
    
    // Hide any existing alert
    this.showSuccessAlert = false;
    this.showRemovedAlert = false;

    if (this.isStarFilled) {
        // Add the stock to the watchlist
        this.watchlistService.addToWatchlist({
            ticker: this.companyData?.ticker,
            companyName: this.companyData?.name,
            exchange: this.companyData?.exchange
        }).subscribe(
            response => {
                console.log('Stock added to watchlist:', response);
                this.successMessage = 'Stock added to watchlist';
                // Set flag to show success alert
                this.showSuccessAlert = true;
                // Hide success alert after 5 seconds
                setTimeout(() => {
                    this.showSuccessAlert = false;
                }, 5000);
            },
            error => {
                console.error('Error adding stock to watchlist:', error);
                // Handle error, e.g., show an error message to the user
            }
        );
    } else {
        // Remove the stock from the watchlist using the ticker
        this.watchlistService.removeFromWatchlist(this.companyData?.ticker).subscribe(
            response => {
                console.log('Stock removed from watchlist:', response);
                this.removedMessage = 'Stock removed from watchlist';
                // Set flag to show removed alert
                this.showRemovedAlert = true;
                // Hide removed alert after 5 seconds
                setTimeout(() => {
                    this.showRemovedAlert = false;
                }, 5000);
            },
            error => {
                console.error('Error removing stock from watchlist:', error);
                // Handle error, e.g., show an error message to the user
            }
        );
    }
}

fetchWalletBalance(): void {
  this.userService.getWalletBalance().subscribe(
    (response: any) => { // Cast response as any to handle potential changes in API response structure
      this.walletBalance = response.balance; // Extract balance from the response
    },
    error => {
      console.error('Error fetching wallet balance:', error);
    }
  );
}

openBuyModal(): void {
  // Fetch wallet balance from the user service
  this.userService.getWalletBalance().subscribe(walletBalance => {
    const modalRef = this.modalService.open(BuyModalComponent);
    modalRef.componentInstance.ticker = this.ticker;
    modalRef.componentInstance.companyName = this.companyData.name;
    modalRef.componentInstance.currentPrice = this.latestPriceData.pc;
    modalRef.componentInstance.walletBalance = walletBalance; // Pass the wallet balance

    modalRef.result.then((result) => {
      // Handle modal result
      console.log('Modal result:', result);
    }).catch((error) => {
      // Handle modal dismissal or error
      console.log('Buy modal dismissed or error:', error);
    });
  });
}


fetchUserStocksQuantity(): void {
  // Call a method in the UserService or PortfolioService to get the user's stock quantity
  // For example, assuming UserService has a method getUserStocksQuantity
  this.userService.getUserStocksQuantity(this.ticker).subscribe(
    (quantity: number) => {
      this.userStocksQuantity = quantity;
    },
    error => {
      console.error('Error fetching user stocks quantity:', error);
    }
  );
}

openSellModal(): void {
  const modalRef = this.modalService.open(SellModalComponent);
  modalRef.componentInstance.ticker = this.ticker;
  modalRef.componentInstance.companyName = this.companyData.name;
  modalRef.componentInstance.currentPrice = this.latestPriceData.pc;
  modalRef.componentInstance.userStocksQuantity = this.userStocksQuantity; // Pass the user's stock quantity
  modalRef.componentInstance.walletBalance = this.walletBalance; // Pass the user's wallet balance
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
