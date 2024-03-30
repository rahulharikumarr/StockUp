import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sell-modal',
  templateUrl: './sell-modal.component.html'
})
export class SellModalComponent implements OnInit {
  @Input() ticker: string = '';
  @Input() companyName: string = '';
  @Input() currentPrice: number = 0;
  @Input() userStocksQuantity: number = 0;
  @Input() walletBalance: number = 0;
  
  quantity: number = 0;
  total: number = 0;
  sellError: string = '';
  
  constructor(public activeModal: NgbActiveModal, private userService: UserService) { }

  ngOnInit(): void {
    // Fetch wallet balance when the component initializes
    this.fetchWalletBalance();
  }

  fetchWalletBalance(): void {
    this.userService.getWalletBalance().subscribe(
      (balance: number) => {
        this.walletBalance = balance;
      },
      (error) => {
        console.error('Error fetching wallet balance:', error);
        // Handle error
      }
    );
  }

  sell() {
    if (this.quantity > this.userStocksQuantity) {
      this.sellError = "You cannot sell more stocks than you have!";
      return;
    }
    
    // Call API to perform sell operation
    this.userService.sellStock(this.ticker, this.quantity, this.currentPrice).subscribe(
      (response) => {
        console.log('Sell operation successful:', response);
        this.activeModal.close('Sell');
      },
      (error) => {
        console.error('Error during sell operation:', error);
        alert('An error occurred during the sell operation. Please try again later.');
      }
    );
  }
  

  dismissModal(): void {
    this.activeModal.dismiss('Dismissed by user');
  }

  updateTotal(): void {
    this.total = this.currentPrice * this.quantity;
    this.sellError = ''; // Reset sell error message when quantity changes
  }
}
