import { Component, OnInit } from '@angular/core';
import { Blogs } from './../../models/blog.model';
import { BlogService } from './../../services/blog.service';
import { UsersService } from './../../services/users.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

interface Category {
  name: string;
  code: string;
}
interface SortByDate {
  name: string;
  code: string;
}
@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css'],
})
export class BlogsComponent implements OnInit {
  list = [1, 2, 3];
  first: number = 0;
  page: number = 0;
  rows: number = 10;
  Categorys!: Category[];
  SortByDate!: SortByDate[];
  selectedCategory: Category = { name: 'Default Category', code: '' };
  selectedSortByDate: SortByDate = { name: 'Default Sort', code: 'newest' };
  searchTerm: string = '';

  blogs: Blogs[] = [];
  isLoading: boolean = true;
  isTopBlogsLoading: boolean = true;
  userRole: any = 'free';
  isAuth: boolean = false;
  topFreeBlogs: any[] = [];
  showFourthBlog: boolean = false;
  showAllCategories: boolean = false;
  categoriesToShow: any[] = [];

  private userRoleListenerSubs!: Subscription;

  constructor(
    private BlogService: BlogService,
    private UsersService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit() {
    this.userRole = this.UsersService.getUserRole();
    this.userRoleListenerSubs =
      this.UsersService.getAuthStatusListener().subscribe((userRole) => {
        this.userRole = userRole;
        this.loadBlogs();
      });
    this.isAuth = this.UsersService.getIsAuth();
    this.userRoleListenerSubs =
      this.UsersService.getAuthStatusListener().subscribe((isAuth) => {
        this.isAuth = isAuth;
        this.loadBlogs();
      });
    this.SortByDate = [
      { name: 'Newest', code: 'newest' },
      { name: 'Oldest', code: 'oldest' },
    ];
    this.Categorys = [
      { name: 'Chose Category', code: '' },
      { name: 'Cryptocurrency News', code: 'crypto-news' },
      { name: 'Blockchain Technology', code: 'blockchain-tech' },
      { name: 'Crypto Investing', code: 'crypto-investing' },
      { name: 'Altcoins', code: 'altcoins' },
      { name: 'Crypto Regulation', code: 'crypto-regulation' },
    ];

    this.route.queryParams.subscribe((params) => {
      // Retrieve and set the selected category, sort, and pagination options
      const categoryCode = params['category'];
      const sortCode = params['sort'];

      this.selectedCategory =
        this.Categorys.find((category) => category.code === categoryCode) ||
        this.Categorys[0]; // Set a default category if not found

      this.selectedSortByDate =
        this.SortByDate.find((sort) => sort.code === sortCode) ||
        this.SortByDate[0]; // Set a default sort if not found

      this.page = parseInt(params['page']) || 0;
      this.first = parseInt(params['first']) || 0;
      this.rows = parseInt(params['rows']) || 10;

      // Set the search term from the query parameter
      this.searchTerm = params['search'] || '';

      // Load blogs with the retrieved options
      this.loadBlogs();
      this.loadTopFreeThreeBlogs();
    });
    this.categoriesToShow = this.Categorys.slice(1, 5);
  }
  getButtonLabel(blog: any): string {
    const isUserSilver = this.userRole === 'silver';
    const isUserPlat = this.userRole === 'plat';
    if (isUserPlat) {
      return 'Access Now';
    } else if (isUserSilver && blog.selectedMembershipLevels !== 'plat') {
      return 'Access Now';
    } else if (
      !this.userRole ||
      (this.userRole === 'free' && blog.selectedMembershipLevels == 'free')
    ) {
      return 'Access Now';
    } else {
      return 'Join to Unlock';
    }
  }
  getButtonIcon(blog: any): string {
    const isUserSilver = this.userRole === 'silver';
    const isUserPlat = this.userRole === 'plat';

    if (isUserPlat) {
      return '';
    } else if (isUserSilver && blog.selectedMembershipLevels !== 'plat') {
      return '';
    } else if (
      !this.userRole ||
      (this.userRole === 'free' && blog.selectedMembershipLevels == 'free')
    ) {
      return '';
    } else {
      return 'pi pi-lock';
    }
  }

  getButtonStyle(blog: any): object {
    const isUserSilver = this.userRole === 'silver';
    const isUserPlat = this.userRole === 'plat';
    if (isUserPlat) {
      return { background: '#cfe7de', color: '#116042', border: 'none' };
    } else if (isUserSilver && blog.selectedMembershipLevels !== 'plat') {
      return { background: '#cfe7de', color: '#116042', border: 'none' };
    } else if (
      !this.userRole ||
      (this.userRole === 'free' && blog.selectedMembershipLevels == 'free')
    ) {
      return { background: '#cfe7de', color: '#116042', border: 'none' };
    } else {
      return { background: 'gray', color: 'white', border: 'none' };
    }
  }

  onButtonClick(blog: any): void {
    const isUserSilver = this.userRole === 'silver';
    const isUserPlat = this.userRole === 'plat';
    if (isUserPlat) {
      this.router.navigate(['/BlogPage/', blog._id]);
    } else if (isUserSilver && blog.selectedMembershipLevels !== 'plat') {
      this.router.navigate(['/BlogPage/', blog._id]);
    } else if (
      !this.userRole ||
      (this.userRole === 'free' && blog.selectedMembershipLevels == 'free')
    ) {
      this.router.navigate(['/BlogPage/', blog._id]);
    } else {
      this.router.navigate(['/Pricing']);
    }
  }

  onSearch() {
    this.first = 0;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: this.selectedCategory.code,
        sort: this.selectedSortByDate.code,
        page: this.page,
        first: this.first,
        rows: this.rows,
        search: this.searchTerm,
      },
      queryParamsHandling: 'merge',
    });

    this.loadBlogs();
  }
  onCategoryChange() {
    this.first = 0;
    this.page = 0;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: this.selectedCategory.code },
      queryParamsHandling: 'merge',
    });

    this.loadBlogs();
  }

  onSortByDateChange() {
    // Update the URL with the selected sort option
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort: this.selectedSortByDate.code },
      queryParamsHandling: 'merge',
    });

    this.loadBlogs();
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.page = event.page;
    this.rows = event.rows;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.page, first: this.first, rows: this.rows },
      queryParamsHandling: 'merge',
    });

    this.loadBlogs();
  }

  loadBlogs() {
    this.isLoading = true;

    this.BlogService.getBlogs(
      this.first,
      this.page,
      this.rows,
      this.selectedCategory.code,
      this.selectedSortByDate.code,
      this.searchTerm
    ).subscribe((data: any) => {
      this.blogs = data.blogs;
      this.isLoading = false;
    });
  }
  loadTopFreeThreeBlogs() {
    this.isTopBlogsLoading = true;
    this.BlogService.getTopFreeBlogs().subscribe(
      (data) => {
        this.topFreeBlogs = data.slice(0, 3);
        this.isTopBlogsLoading = false;
      },
      (error) => {
        console.error('Error fetching top free blogs:', error);
        this.isTopBlogsLoading = false;
      }
    );
  }

  loadFourthBlog() {
    // Load the fourth blog and set showFourthBlog to true
    this.isTopBlogsLoading = true;
    this.BlogService.getTopFreeBlogs().subscribe(
      (data) => {
        this.topFreeBlogs = data;
        this.showFourthBlog = true;
        this.isTopBlogsLoading = false;
        console.log(this.isTopBlogsLoading);
      },
      (error) => {
        console.error('Error fetching top free blogs:', error);
        this.isTopBlogsLoading = false;
        console.log(this.isTopBlogsLoading);
      }
    );
  }
  showMoreCategories() {
    // Show all categories excluding the first one when the button is clicked
    this.categoriesToShow = this.Categorys.slice(1);
    this.showAllCategories = true;
  }

  navigateToCategory(categoryCode: string) {
    // Navigate to the specified route when a category is clicked
    this.router.navigate(['/Blogs'], {
      queryParams: { category: categoryCode },
    });
  }
}
