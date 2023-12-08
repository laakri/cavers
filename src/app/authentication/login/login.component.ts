import { Component } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from '../../services/confirmation.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService],
})
export class LoginComponent {
  loginForm!: FormGroup;
  confirmCodeForm!: FormGroup;
  visible: boolean = false;
  UpdatePassvisible: boolean = false;
  UserEmail: string = '';
  confirmedEmail: string = '';
  loadingLogin: boolean = false;
  loadingSendingConfirm: boolean = false;
  loadingConfirm: boolean = false;
  loadingUpdating: boolean = false;

  constructor(
    private Router: Router,
    private UsersService: UsersService,
    private messageService: MessageService,
    private ConfirmationService: ConfirmationService
  ) {}

  login(loginForm: any) {
    this.loadingLogin = true;
    if (loginForm.invalid) {
      console.log('Invalid form');
      this.loadingLogin = false;

      return;
    }
    this.UsersService.login(
      loginForm.value.gmailname,
      loginForm.value.password
    );
    this.loadingLogin = false;
  }
  maskedEmail(email: string): string {
    if (!email) {
      return 'Gmail@Gmail.com';
    }
    const [username, domain] = email.split('@');
    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 1);
    return `${maskedUsername}@${domain}`;
  }

  sendCodeVerification(loginForm: NgForm): void {
    this.loadingSendingConfirm = true;

    const email = loginForm.value.gmailname.trim();

    if (!loginForm.controls['gmailname'].valid) {
      this.loadingSendingConfirm = false;
      this.messageService.add({
        severity: 'error',
        detail: 'Please enter your email.',
      });
      return;
    }

    this.ConfirmationService.sendConfirmationCode(email).subscribe(
      (data) => {
        this.loadingSendingConfirm = false;

        console.log('data returned =', data);
        this.visible = true;
        this.UserEmail = email;
        console.log('Email Sended Successfully ');
      },
      (error) => {
        this.loadingSendingConfirm = false;

        console.log('Error', error);
      }
    );
  }
  ConfirmCode(confirmCodeForm: any) {
    this.loadingConfirm = true;

    if (confirmCodeForm.invalid || !this.UserEmail) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Invalid form or missing email. Please check your inputs.',
      });
      this.loadingConfirm = false;

      return;
    }

    this.ConfirmationService.confirmEmail(
      this.UserEmail,
      confirmCodeForm.value.code
    ).subscribe(
      (data) => {
        this.loadingConfirm = false;

        this.confirmedEmail = this.UserEmail;
        this.visible = false;
        this.UpdatePassvisible = true;

        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Email Confirmed Successfully.',
        });
      },
      (error) => {
        this.loadingConfirm = false;

        console.log(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Wrong Confirmation Code. Please try again.',
        });
      }
    );
  }
  confirmAndUpdatePassword(confirmAndUpdatePasswordForm: NgForm) {
    this.loadingUpdating = true;

    if (confirmAndUpdatePasswordForm.invalid) {
      this.loadingUpdating = false;

      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Invalid form. Please check your inputs.',
      });
      return;
    }

    const newPassword = confirmAndUpdatePasswordForm.value.Firtstpassword;
    const confirmPassword = confirmAndUpdatePasswordForm.value.confirmPassword;

    if (newPassword !== confirmPassword) {
      this.loadingUpdating = false;

      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Passwords do not match. Please enter matching passwords.',
      });
      return;
    }

    // Call your service method to update the password
    this.UsersService.changePassword(
      this.confirmedEmail,
      newPassword
    ).subscribe(
      () => {
        this.loadingUpdating = false;

        this.UpdatePassvisible = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail:
            'Password updated successfully. You will be redirected to the login page.',
        });

        // Redirect to the login page after a short delay (e.g., 2 seconds)
        setTimeout(() => {
          this.Router.navigate(['/auth/login']);
        }, 2000);
      },
      (error) => {
        this.loadingUpdating = false;

        console.log('Error updating password:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update password. Please try again later.',
        });
      }
    );
  }
}
