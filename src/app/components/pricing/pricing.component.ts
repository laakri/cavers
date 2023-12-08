import { Subscription } from 'rxjs';
import { UsersService } from './../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.css'],
})
export class PricingComponent implements OnInit {
  isAuth: boolean = false;
  private isAuthListenerSubs!: Subscription;
  showPaymentDialog: boolean = false;
  selectedPrice: number = 0;

  constructor(private UsersService: UsersService, private router: Router) {}

  ngOnInit() {
    this.isAuth = this.UsersService.getIsAuth();
    this.isAuthListenerSubs =
      this.UsersService.getAuthStatusListener().subscribe((isAuthenticated) => {
        this.isAuth = isAuthenticated;
      });
  }

  handleButtonClick(price: number) {
    if (!this.isAuth) {
      localStorage.setItem('redirectRoute', '/Pricing');
      this.router.navigate(['/auth/signup']);
    } else {
      this.selectedPrice = price;
      this.showPaymentDialog = true;
    }
  }

  confirmPayment(isConfirmed: boolean) {
    if (isConfirmed) {
      // User confirmed, redirect to the payment link
      if (this.selectedPrice === 20) {
        window.location.href = 'https://link.depay.com/3XmmaBQCS96i4SuFqh9iz7';
      } else if (this.selectedPrice === 40) {
        window.location.href = 'https://link.depay.com/3XmmaBQCS96i4SuFqh9iz7';
      }
    }
    this.showPaymentDialog = false;
  }
}
