// admin-auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { UsersService } from './services/users.service';
import { Observable, Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class AdminAuthGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private router: Router,
    private messageService: MessageService
  ) {}
  isAuth = false;
  private isAuthListenerSubs!: Subscription;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.isAuth = this.userService.isAdminUser();
    this.isAuthListenerSubs = this.userService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuth = isAuthenticated;
      });
    if (this.isAuth) {
      return true;
    } else {
      // Display PrimeNG Message Toast for unauthorized access
      this.messageService.add({
        severity: 'error',
        summary: 'Unauthorized Access',
        detail: 'You do not have permission to access this page.',
      });

      // Navigate to unauthorized page (optional)
      this.router.navigate(['/unauthorized']);
      return false;
    }
  }
}
