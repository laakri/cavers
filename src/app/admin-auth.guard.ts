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
  isAdmin = false;
  private getAuthAdminStatusListener!: Subscription;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    this.isAdmin = this.userService.getAdminIsAuth();
    this.getAuthAdminStatusListener = this.userService
      .getAuthAdminStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAdmin = isAuthenticated;
      });
    console.log('check one');
    if (this.isAdmin == true) {
      console.log('check two', this.isAdmin);

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
