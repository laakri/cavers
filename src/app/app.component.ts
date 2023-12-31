import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'cavers';
  isAuth = false;
  isAdmin = false;
  isBrightTheme: any;

  private isAuthListenerSubs!: Subscription;
  private authAdminStatusListener!: Subscription;

  constructor(private UsersService: UsersService) {}

  ngOnInit(): void {
    this.isBrightTheme = document.body.classList.contains('light-theme');
    const savedTheme = localStorage.getItem('mode');
    if (savedTheme) {
      document.body.classList.add(savedTheme);
    }
    this.isAuth = this.UsersService.getIsAuth();
    this.isAuthListenerSubs =
      this.UsersService.getAuthStatusListener().subscribe((isAuthenticated) => {
        this.isAuth = isAuthenticated;
      });
    this.isAdmin = this.UsersService.getAdminIsAuth();
    this.authAdminStatusListener =
      this.UsersService.getAuthAdminStatusListener().subscribe((isAdmin) => {
        this.isAdmin = isAdmin;
      });
    this.UsersService.autoAuthUser();
  }
}
