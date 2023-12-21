import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { UsersService } from '../../services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class BlogPageComponent implements OnInit {
  blog: any;
  blogId: string = '';
  trustedText!: SafeHtml;
  isLoading: boolean = true;
  items: MenuItem[] | null = [];
  isAuthAdmin: boolean = false;
  private isAuthAdminListenerSubs!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService,
    private usersService: UsersService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isAuthAdmin = this.usersService.isAdminUser();
    this.isAuthAdminListenerSubs = this.usersService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuthAdmin = isAuthenticated;
      });
    // Check user role
    const userRole = this.usersService.getUserRole();

    this.route.params.subscribe((params) => {
      this.blogId = params['id'];
      this.blogService.getBlogById(this.blogId).subscribe(
        (data: any) => {
          this.blog = data;

          // Check if the user can access the blog
          if (
            this.canAccessBlog(userRole, this.blog.selectedMembershipLevels)
          ) {
            this.trustedText = this.sanitizer.bypassSecurityTrustHtml(
              this.blog.text
            );
            this.incrementViews();
            this.isLoading = false;
          } else {
            // Redirect to pricing page
            this.router.navigate(['/Pricing']);
          }
        },
        (error) => {
          console.error('Error getting blog:', error);
          this.isLoading = false;
        }
      );
    });

    this.items = [
      {
        icon: 'pi pi-pencil',
        routerLink: ['/EditBlog/', this.blogId],
      },
      {
        icon: 'pi pi-trash',
        command: () => this.confirmDelete(),
      },
    ];
  }
  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this blog?',
      closeOnEscape: false,
      accept: () => {
        this.deleteBlog();
      },
    });
  }

  deleteBlog() {
    this.blogService.deleteBlog(this.blogId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Blog deleted successfully!',
        });
        this.router.navigate(['/Blogs']);
      },
      (error) => {
        console.error('Error deleting blog:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'An error occurred while deleting the blog.',
        });
      }
    );
  }
  canAccessBlog(userRole: string, blogMembershipLevel: string): boolean {
    const isUserPlat = userRole === 'plat';
    const isUserSilver = userRole === 'silver';

    if (isUserPlat) {
      return true;
    } else if (isUserSilver && blogMembershipLevel !== 'plat') {
      return true;
    } else if (
      !userRole ||
      (userRole === 'free' && blogMembershipLevel === 'free')
    ) {
      return true;
    } else {
      return false;
    }
  }

  incrementViews() {
    this.blogService.incrementViews(this.blogId).subscribe(
      () => {
        console.log('Views incremented successfully');
      },
      (error) => {
        console.error('Error incrementing views:', error);
      }
    );
  }
}
