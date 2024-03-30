import { Component, OnInit } from '@angular/core';
import { PortfolioService } from '../portfolio.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BuyModalComponent } from '../buy-modal/buy-modal.component';
import { SellModalComponent } from '../sell-modal/sell-modal.component';
import { NgModule } from '@angular/core';
import { UserService } from '../user.service';
import { StockDataService } from '../search.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {
  portfolio: any[] = [];
  isLoading: boolean = true;
  walletAmount: number = 0;
  showBuySuccessAlert: boolean = false;
  showSellSuccessAlert: boolean = false;
  purchasedStock: string = '';
  soldStock: string = '';
  

  constructor(private portfolioService: PortfolioService, private modalService: NgbModal, private userService: UserService, private stockDataService: StockDataService) {}

  ngOnInit(): void {
    this.fetchPortfolio();
    this.fetchWalletBalance();
  }

  fetchPortfolio(): void {
    this.userService.getPortfolio().subscribe(
      portfolio => {
        this.portfolio = portfolio;
        this.isLoading = false;
        console.log('Portfolio:', this.portfolio);
  
        // Call calculateValues to calculate additional values for each stock
        this.calculateValues(this.portfolio);
      },
      error => {
        console.error('Error fetching portfolio:', error);
        this.isLoading = false;
      }
    );
  }

  fetchWalletBalance(): void {
    this.userService.getWalletBalance().subscribe(
      balance => {
        this.walletAmount = balance; // Assign the balance to walletAmount variable
      },
      error => {
        console.error('Error fetching wallet balance:', error);
      }
    );
  }

  openBuyModal(stock: any): void {
    const modalRef = this.modalService.open(BuyModalComponent);
    modalRef.componentInstance.ticker = stock.ticker;
    modalRef.componentInstance.currentPrice = stock.currentPrice;
    modalRef.componentInstance.walletBalance = this.walletAmount;
    modalRef.result.then((result) => {
      if (result === 'Buy') {
        this.showBuySuccessAlert = true;
        this.purchasedStock = stock.ticker;
        setTimeout(() => {
          this.showBuySuccessAlert = false;
          this.purchasedStock = '';
        }, 5000);
        this.fetchPortfolio(); // Fetch updated portfolio
      }
    }).catch((error) => {
      console.log('Buy modal dismissed or error:', error);
    });
  }
  
  openSellModal(stock: any): void {
    const modalRef = this.modalService.open(SellModalComponent);
    modalRef.componentInstance.ticker = stock.ticker;
    modalRef.componentInstance.currentPrice = stock.currentPrice;
    modalRef.componentInstance.userStocksQuantity = stock.quantity;
    modalRef.componentInstance.walletBalance = this.walletAmount;
    modalRef.result.then((result) => {
      if (result === 'Sell') {
        this.showSellSuccessAlert = true;
        this.soldStock = stock.ticker;
        setTimeout(() => {
          this.showSellSuccessAlert = false;
          this.soldStock = '';
        }, 5000);
        this.fetchPortfolio(); // Fetch updated portfolio
      }
    }).catch((error) => {
      console.log('Sell modal dismissed or error:', error);
    });
  }

  getTotalCostFromPortfolio(ticker: string, portfolio: any[]): number | undefined {
    // Find the stock in the portfolio
    const stock = portfolio.find(item => item.ticker === ticker);
    
    // If the stock is found, return its total cost
    if (stock) {
      return stock.totalCost;
    }
    
    // If the stock is not found, return undefined
    return undefined;
  }

  calculateValues(portfolio: any[]): void {
  // Iterate over each stock in the portfolio and calculate required values
  portfolio.forEach(stock => {
    // Fetch the latest price asynchronously
    this.stockDataService.getLatestPrice(stock.ticker).subscribe(
      latestPrice => {
        // Use the latest price to calculate other values
        stock.currentPrice = latestPrice.c;

        // Use the portfolio data to get the total cost
        const totalCost = this.getTotalCostFromPortfolio(stock.ticker, portfolio);

        // Set the total cost for the stock
        stock.totalCost = totalCost !== undefined ? totalCost : 0;
        
        // Calculate average cost per share
        stock.avgCost = stock.totalCost / stock.quantity;

        // Calculate change in price
        stock.change = stock.currentPrice - stock.avgCost;

        // Calculate market value
        stock.marketValue = stock.currentPrice * stock.quantity;
      },
      error => {
        console.error(`Error fetching latest price for ${stock.ticker}:`, error);
      }
    );
  });
}

}
