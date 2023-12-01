import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from '../models/blog.model';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrl = 'http://localhost:4401/api/blogs';

  constructor(private http: HttpClient) {}

  // Create a new blog
  createBlog(blogData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-blog`, blogData);
  }
  getBlogById(blogId: string) {
    return this.http.get(`${this.apiUrl}/GetBlog/${blogId}`);
  }
  incrementViews(blogId: string) {
    const url = `${this.apiUrl}/increment-views/${blogId}`;
    return this.http.post(url, {});
  }
  getBlogs(
    page: number,
    limit: number,
    category: string | null,
    sortByDate: string,
    search: string,
    userRole: string
  ): Observable<any> {
    const url = `${this.apiUrl}/GetBlogs?page=${page}&limit=${limit}&category=${category}&sortByDate=${sortByDate}&search=${search}&userRole=${userRole}`;
    return this.http.get(url);
  }
  getTopFreeBlogs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/top-free-blogs`);
  }
}
