import { Component, OnInit } from '@angular/core';
import { UsersService } from './../../services/users.service';
import { Subscription } from 'rxjs';
import { BlogService } from './../../services/blog.service';

@Component({
  selector: 'app-search-section',
  templateUrl: './search-section.component.html',
  styleUrls: ['./search-section.component.css'],
})
export class SearchSectionComponent implements OnInit {
  constructor(
    private blogService: BlogService,
    private usersService: UsersService
  ) {}

  visible: boolean = false;
  Search: string = '';
  position: any = 'top';
  defaultBlog: any[] = [];
  table = [1, 2, 3, 1, 2];
  userId: any = '';
  private userIdListenerSubs!: Subscription;
  noBlogsFound: boolean = false;
  isLoading: boolean = false;
  isDefault: boolean = false;

  ngOnInit() {
    this.isLoading = true;
    this.userId = this.usersService.getUserId();
    this.userIdListenerSubs = this.usersService
      .getAuthStatusListener()
      .subscribe((userId) => {
        this.userId = userId;
      });
    this.getDefault();
    this.isLoading = false;
  }

  getDefault() {
    this.isDefault = true;
    this.blogService.getTopFreeBlogs().subscribe(
      (data) => {
        this.defaultBlog = data;
        this.checkForNoBlogs();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getSearchBlogs() {
    this.isDefault = false;
    this.isLoading = true;
    if (this.Search.trim() === '') {
      this.getDefault();
      this.isLoading = false;
    } else {
      this.blogService.getSearchBlogs(this.Search, this.userId).subscribe(
        (data) => {
          this.defaultBlog = data.blogs;
          this.checkForNoBlogs();
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      );
    }
  }

  private checkForNoBlogs() {
    this.noBlogsFound = this.defaultBlog.length === 0;
  }
}
