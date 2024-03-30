import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user.service';

@Component({
  selector: 'app-buy-modal',
  templateUrl: './buy-modal.component.html'
})
export class BuyModalComponent {
  @Input() ticker: string = '';
  @Input() companyName: string = '';
  @Input() currentPrice: number = 0;
  @Input() walletBalance: number = 0;
  quantity: number = 0;
  total: number = 0;

  constructor(public activeModal: NgbActiveModal, private userService: UserService) { }

  buy() {
    // Call API to perform buy operation
    this.userService.buyStock(this.ticker, this.quantity, this.currentPrice).subscribe(
      (response) => {
        console.log('Buy operation successful:', response);
        // Update total cost after purchase
        this.total = this.currentPrice * this.quantity;
        this.activeModal.close('Buy');
      },
      (error) => {
        console.error('Error during buy operation:', error);
        alert('An error occurred during the buy operation. Please try again later.');
      }
    );
  }
  

  dismissModal(): void {
    this.activeModal.dismiss('Dismissed by user');
  }

  updateTotal(): void {
    this.total = this.currentPrice * this.quantity;
  }
}
