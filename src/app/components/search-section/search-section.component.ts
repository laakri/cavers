import { Component, OnInit } from '@angular/core';
import { UsersService } from './../../services/users.service';
import { Subscription } from 'rxjs';
import { BlogService } from './../../services/blog.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';
import { PrimeIcons } from 'primeng/api';

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

  visible: boolean = true;
  Search: string = '';
  position: any = 'top';
  defaultBlog: any[] = [];
  table = [1, 2, 3, 1, 2];
  userId: any = '';
  private userIdListenerSubs!: Subscription;
  noBlogsFound: boolean = false;
  isLoading: boolean = false;
  isDefault: boolean = false;
  userRole: any = 'free';
  private userRoleListenerSubs!: Subscription;

  ngOnInit() {
    this.isLoading = true;
    this.userRole = this.usersService.getUserRole();
    console.log(this.userRole);
    this.userRoleListenerSubs = this.usersService
      .getAuthStatusListener()
      .subscribe((userRole) => {
        this.userRole = userRole;
        this.getDefault();
      });
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
  getBlogColor(blog: any): string {
    const membershipLevel = blog.selectedMembershipLevels || 'free';
    switch (membershipLevel) {
      case 'silver':
        return 'silver-color';
      case 'plat':
        return 'gold-color';
      default:
        return '';
    }
  }

  onRowSelect(blog: any) {
    const isUserSilver = this.userRole === 'silver';
    const isUserPlat = this.userRole === 'plat';
    if (
      blog.selectedMembershipLevels == undefined ||
      blog.selectedMembershipLevels == ''
    ) {
      blog.selectedMembershipLevels = 'free';
    }

    if (isUserPlat) {
      this.navigateToBlog(blog._id);
    } else if (isUserSilver && blog.selectedMembershipLevels !== 'plat') {
      this.navigateToBlog(blog._id);
    } else if (
      !this.userRole ||
      (this.userRole === 'free' && blog.selectedMembershipLevels === 'free')
    ) {
      this.navigateToBlog(blog._id);
    } else {
      this.navigateToPricingPage();
    }
  }
  closeSearch() {
    this.ref.close();
  }

  private navigateToBlog(id: string) {
    this.router.navigate(['BlogPage/', id]);
  }
  private navigateToPricingPage() {
    this.ref.close();
    this.router.navigate(['Pricing']);
  }

  private checkForNoBlogs() {
    this.noBlogsFound = this.defaultBlog.length === 0;
  }
}
