import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from '../models/blog.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Create a new blog
  createBlog(blogData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/blogs/add-blog`, blogData);
  }
  updateBlog(blogId: string, formData: FormData): Observable<Blog> {
    const headers = new HttpHeaders();
    return this.http.post<Blog>(
      `${this.apiUrl}/update-blog/${blogId}`,
      formData,
      { headers }
    );
  }
  getBlogById(blogId: string) {
    return this.http.get(`${this.apiUrl}/api/blogs/GetBlog/${blogId}`);
  }
  incrementViews(blogId: string) {
    const url = `${this.apiUrl}/api/blogs/increment-views/${blogId}`;
    return this.http.post(url, {});
  }
  getBlogs(
    first: number,
    page: number,
    limit: number,
    category: string | null,
    sortByDate: string,
    search: string
  ): Observable<any> {
    const url = `${this.apiUrl}/api/blogs/GetBlogs?first=${first}&page=${page}&limit=${limit}&category=${category}&sortByDate=${sortByDate}&search=${search}`;
    return this.http.get(url);
  }
  getSearchBlogs(search: string, userId: string): Observable<any> {
    const url = `${this.apiUrl}/api/blogs/GetBlogs?limit=5&search=${search}&userId=${userId}`;
    return this.http.get(url);
  }
  getTopFreeBlogs(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/blogs/top-free-blogs`);
  }
  getBlogsHomePage(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/blogs/blogs-for-homepage`);
  }
  deleteBlog(blogId: string): Observable<{ message: string }> {
    const url = `${this.apiUrl}/api/blogs/delete-blog/${blogId}`;
    return this.http.delete<{ message: string }>(url);
  }
}
