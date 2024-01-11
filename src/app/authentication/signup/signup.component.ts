import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  signupForm!: FormGroup;

  constructor(private UsersService: UsersService) {}

  signUp(signUpForm: any) {
    if (signUpForm.invalid) {
      console.log('Invalid form');
      return;
    }
    this.UsersService.SignUp(
      signUpForm.value.username,
      signUpForm.value.gmailname,
      signUpForm.value.password
    );
  }
}
