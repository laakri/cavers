import { UsersService } from '../../services/users.service';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SearchSectionComponent } from '../search-section/search-section.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [DialogService],
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  isBrightTheme = false;
  banner: boolean = false;
  bannerClass!: string;
  isAuth: boolean = false;
  userName: any;
  firstLetter!: string;
  Search: string = '';
  private isAuthListenerSubs!: Subscription;
  private userNameListenerSubs!: Subscription;
  ref: DynamicDialogRef | undefined;

  constructor(
    private UsersService: UsersService,
    private dialogService: DialogService
  ) {}

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

  showDialog() {
    const ref = this.dialogService.open(SearchSectionComponent, {
      header: 'Search Section',
      showHeader: false,
      modal: true,
      draggable: false,
      resizable: false,
      position: 'top',
      closable: true,
      dismissableMask: true,
      styleClass: 'dialogSearch',
    });
  }

  isBanner(): void {
    this.banner = false;
    // Add the slide-up class to trigger the animation
    setTimeout(() => {
      this.bannerClass = 'slide-up';
    }, 0);
  }
  Logout() {
    this.UsersService.logout();
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
