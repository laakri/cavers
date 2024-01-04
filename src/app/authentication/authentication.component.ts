import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css'],
})
export class AuthenticationComponent implements OnInit {
  isBrightTheme = false;

  ngOnInit() {
    this.isBrightTheme = localStorage.getItem('mode') === 'light-theme';
  }
  getImgSrc(): string {
    const isBrightTheme = document.body.classList.contains('light-theme');
    return isBrightTheme
      ? '../../../assets/img/logo-dark.png'
      : '../../../assets/img/logo.png';
  }
}
