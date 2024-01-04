import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendEmail(topic: string, gmail: string, content: string): Observable<any> {
    const body = { topic, gmail, content };
    return this.http.post(`${this.apiUrl}/api/contact/send-email`, body);
  }
}
