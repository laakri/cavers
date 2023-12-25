import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://localhost:4401/api/contact';

  constructor(private http: HttpClient) {}

  sendEmail(topic: string, gmail: string, content: string): Observable<any> {
    const body = { topic, gmail, content };
    return this.http.post(`${this.apiUrl}/send-email`, body);
  }
}
