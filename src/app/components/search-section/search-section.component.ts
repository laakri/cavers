import { Component, OnInit } from '@angular/core';
import { UsersService } from './../../services/users.service';
import { Subscription } from 'rxjs';
import { BlogService } from './../../services/blog.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-section',
  templateUrl: './search-section.component.html',
  styleUrls: ['./search-section.component.css'],
})
export class SearchSectionComponent implements OnInit {
  constructor(
    private blogService: BlogService,
    private usersService: UsersService,
    private router: Router,
    private ref: DynamicDialogRef
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
    this.isLoading = true;
    this.isDefault = true;
    this.blogService.getTopFreeBlogs().subscribe(
      (data) => {
        this.isLoading = false;
        this.defaultBlog = data;
        this.checkForNoBlogs();
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  getSearchBlogs() {
    this.isLoading = true;
    this.isDefault = false;

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
  onRowSelect(id: string) {
    this.ref.close();
    this.router.navigate(['BlogPage/', id]);
  }

  private checkForNoBlogs() {
    this.noBlogsFound = this.defaultBlog.length === 0;
  }
}
