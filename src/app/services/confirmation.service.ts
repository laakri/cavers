import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendConfirmationCode(email: string): Observable<any> {
    const body = { email: email };
    return this.http.post<any>(this.apiUrl + '/send-confirmation-email', body);
  }
  confirmEmail(email: string, confirmationCode: string): Observable<any> {
    const body = {
      email,
      confirmationCode,
    };
    return this.http.post<any>(
      this.apiUrl + '/api/confirm/confirm-email',
      body
    );
  }
}
