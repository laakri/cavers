import { UsersService } from '../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  isBrightTheme = false;
  banner: boolean = true;
  bannerClass!: string;
  isAuth: boolean = false;
  userName: any;
  firstLetter!: string;
  private isAuthListenerSubs!: Subscription;
  private userNameListenerSubs!: Subscription;

  constructor(private UsersService: UsersService) {}

  ngOnInit() {
    this.isAuth = this.UsersService.getIsAuth();
    this.isAuthListenerSubs =
      this.UsersService.getAuthStatusListener().subscribe((isAuthenticated) => {
        this.isAuth = isAuthenticated;
      });

    this.userName = this.UsersService.getUserName();
    this.userNameListenerSubs =
      this.UsersService.getUserNameListener().subscribe((userNames) => {
        this.userName = userNames;
      });

    this.isBrightTheme = localStorage.getItem('mode') === 'bright-theme';
  }

  isBanner(): void {
    this.banner = false;
    // Add the slide-up class to trigger the animation
    setTimeout(() => {
      this.bannerClass = 'slide-up';
    }, 0);
  }

  change_theme(): void {
    this.isBrightTheme = !this.isBrightTheme;
    const body = document.body;
    if (!this.isBrightTheme) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }
}
