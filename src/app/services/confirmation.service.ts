import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private apiUrl = 'http://localhost:4401/api/confirm';

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
    return this.http.post<any>(this.apiUrl + '/confirm-email', body);
  }
}
