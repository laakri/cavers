import { User } from '../models/users.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private isAuthenticated = false;
  private isAdminAuthenticated = false;
  private userId: any;
  private userName: any;
  private userRole: any;
  private token: any;
  private tokenTimer: any;
  private users: User[] = [];
  private usernameListener = new Subject<any>();
  private authStatusListener = new Subject<boolean>();
  private authAdminStatusListener = new Subject<boolean>();

  apiURL = 'http://localhost:4401';

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {}

  SignUp(name: string, email: string, password: string) {
    const userData: User = {
      name: name,
      email: email,
      password: password,
      userId: '',
      role: '',
      createdAt: '',
      updatedAt: '',
      isAdmin: false,
    };

    this.http
      .post<{ message: string }>(this.apiURL + '/api/users/signup', userData)
      .subscribe(
        () => {
          console.log('SignUp Successf !');
          const successMessage = 'SignUp Successf !';
          this.messageService.add({
            severity: 'success',
            summary: 'Success Message',
            detail: successMessage,
          });
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getUserName() {
    return this.userName;
  }
  getUserRole() {
    return this.userRole;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }
  getAdminIsAuth() {
    return this.isAdminAuthenticated;
  }

  getUserNameListener() {
    return this.usernameListener.asObservable();
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAuthAdminStatusListener() {
    return this.authAdminStatusListener.asObservable();
  }

  login(email: string, password: string) {
    const user: User = {
      email: email,
      password: password,
      userId: '',
      name: '',
      isAdmin: false,
      role: '',
      createdAt: '',
      updatedAt: '',
    };
    this.http
      .post<{
        token: string;
        expiresIn: number;
        userId: string;
        userName: string;
        userRole: string;
      }>(this.apiURL + '/api/users/login', user)
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.userName = response.userName;
            this.userRole = response.userRole;
            if (this.userRole == 'admin') {
              this.isAdminAuthenticated = true;
              this.authAdminStatusListener.next(true);
            }
            this.authStatusListener.next(true);
            this.usernameListener.next(this.userName);

            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(
              token,
              expirationDate,
              this.userId,
              this.userName,
              this.userRole
            );
            const successMessage = 'Login Successfuly !';
            this.messageService.add({
              severity: 'success',
              summary: 'Success Message',
              detail: successMessage,
            });

            this.router.navigate(['/Blogs']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
          this.usernameListener.next('');

          this.authAdminStatusListener.next(false);
        }
      );
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.userName = authInformation.userName;
      this.userRole = authInformation.userRole;

      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
      this.usernameListener.next(this.userName);

      if (this.userRole == 'admin') {
        this.isAdminAuthenticated = true;
        this.authAdminStatusListener.next(true);
      }
    }
  }
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.isAdminAuthenticated = false;
    this.usernameListener.next('');

    this.authStatusListener.next(false);
    this.authAdminStatusListener.next(false);
    this.userId = null;
    this.userName = null;
    this.userRole = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    console.log('Logout runs seccesfully!');
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration + ' Secends');
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    userId: string,
    userName: string,
    userRole: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('userName', userName);
    localStorage.setItem('userRole', userRole);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userPicture');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const userPicture = localStorage.getItem('userPicture');

    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      userName: userName,
      userRole: userRole,
      userPicture: userPicture,
    };
  }
  /*************************************************/

  getUsers(
    first: number,
    page: number,
    limit: number,
    search: string,
    sortBy: string
  ) {
    const url = `${this.apiURL}/api/users/users/?first=${first}&page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}`;
    return this.http.get(url);
  }
  /*************************************************/
  changeUserRole(userId: string, newRole: string) {
    return this.http.put(`${this.apiURL}/api/users/changeUserRole/${userId}`, {
      role: newRole,
    });
  }
  /*************************************************/

  changePassword(email: string, newPassword: string): Observable<any> {
    const body = {
      email,
      newPassword,
    };
    return this.http.post<any>(
      this.apiURL + '/api/users/change-password',
      body
    );
  }
  /*************************************************/

  deleteUser(userId: string) {
    return this.http.delete(`${this.apiURL}/api/users/delete/${userId}`);
  }
}
