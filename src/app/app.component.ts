import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Galaxia';
  isAuth = false;
  isBrightTheme: boolean = false;
  isLoading = true; // Add this line
  private isAuthListenerSubs!: Subscription;
  private userIdListenerSubs!: Subscription;

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.isBrightTheme = document.body.classList.contains('light-theme');
    const savedTheme = localStorage.getItem('mode');
    if (savedTheme) {
      document.body.classList.add(savedTheme);
      this.isBrightTheme = savedTheme === 'light-theme'; // Update isBrightTheme based on the stored theme
    }

    this.userService.autoAuthUser();
    const userId = this.userService.getUserId();
    if (userId) {
      this.userService.getUserAdminStatus(userId).subscribe(
        (result) => {
          const isAdmin = result.isAdmin;
          this.userService.authAdminStatusListener.next(isAdmin);
          this.userService.isAdmin = isAdmin;
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching user admin status:', error);
          this.isLoading = false; // Handle errors and set loading to false
        }
      );
    } else {
      this.isLoading = false; // Set loading to false if there is no user ID
    }

    this.isAuth = this.userService.getIsAuth();
    this.isAuthListenerSubs = this.userService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuth = isAuthenticated;
      });
  }
}
