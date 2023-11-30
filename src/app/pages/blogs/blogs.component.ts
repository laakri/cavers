import { Component, OnInit } from '@angular/core';
import { Blog } from './../../models/blog.model';
import { BlogService } from './../../services/blog.service';
import { UsersService } from './../../services/users.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
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
  rows: number = 10;
  Categorys!: Category[];
  SortByDate!: SortByDate[];
  selectedCategory: Category = { name: 'Default Category', code: '' };
  selectedSortByDate: SortByDate = { name: 'Default Sort', code: 'newest' };
  searchTerm: string = '';

  blogs: Blog[] = [];
  isLoading: boolean = true;
  userRole: string = 'free';
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

      this.first = parseInt(params['page']) || 0;
      this.rows = parseInt(params['limit']) || 10;

      // Set the search term from the query parameter
      this.searchTerm = params['search'] || '';

      // Load blogs with the retrieved options
      this.loadBlogs();
    });
    this.categoriesToShow = this.Categorys.slice(1, 5);
  }
  onSearch() {
    this.first = 0;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: this.selectedCategory.code,
        sort: this.selectedSortByDate.code,
        page: this.first,
        limit: this.rows,
        search: this.searchTerm, // Add the search term to the URL
      },
      queryParamsHandling: 'merge',
    });

    this.loadBlogs();
  }
  onCategoryChange() {
    this.first = 0;
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

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;

    // Update the URL with the selected pagination options
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: this.first, limit: this.rows },
      queryParamsHandling: 'merge',
    });

    this.loadBlogs();
  }

  loadBlogs() {
    this.isLoading = true;
    this.BlogService.getBlogs(
      this.first,
      this.rows,
      this.selectedCategory.code,
      this.selectedSortByDate.code,
      this.searchTerm,
      this.userRole
    ).subscribe((data: any) => {
      this.blogs = data.blogs;
      console.log(this.blogs);
      this.isLoading = false;
    });
  }
  loadTopFreeThreeBlogs() {
    this.isLoading = true;

    this.BlogService.getTopFreeBlogs().subscribe(
      (data) => {
        // Load only the first three blogs initially
        this.topFreeBlogs = data.slice(0, 3);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching top free blogs:', error);
      }
    );
  }

  loadFourthBlog() {
    // Load the fourth blog and set showFourthBlog to true
    this.BlogService.getTopFreeBlogs().subscribe(
      (data) => {
        this.topFreeBlogs.push(data[3]); // Assuming the fourth blog is at index 3
        this.showFourthBlog = true;
      },
      (error) => {
        console.error('Error fetching top free blogs:', error);
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
