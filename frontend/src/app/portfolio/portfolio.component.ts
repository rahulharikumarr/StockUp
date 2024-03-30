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

  constructor(private portfolioService: PortfolioService, private modalService: NgbModal, private userService: UserService, private stockDataService: StockDataService) {}

  ngOnInit(): void {
    this.fetchPortfolio();
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

  openBuyModal(stock: any): void {
    const modalRef = this.modalService.open(BuyModalComponent);
    modalRef.componentInstance.ticker = stock.ticker;
    modalRef.componentInstance.currentPrice = stock.currentPrice;
  }

  openSellModal(stock: any): void {
    const modalRef = this.modalService.open(SellModalComponent);
    modalRef.componentInstance.ticker = stock.ticker;
    modalRef.componentInstance.currentPrice = stock.currentPrice;
    modalRef.componentInstance.userStocksQuantity = stock.quantity;
  }

  calculateValues(portfolio: any[]): void {
    // Iterate over each stock in the portfolio and calculate required values
    portfolio.forEach(stock => {
      // Fetch the latest price asynchronously
      this.stockDataService.getLatestPrice(stock.ticker).subscribe(
        latestPrice => {
          // Use the latest price to calculate other values
          stock.currentPrice = latestPrice.c;

          // Calculate total cost
          stock.totalCost = stock.quantity * stock.price;

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
