import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.css'],
  providers: [MessageService],
})
export class BlogPageComponent implements OnInit {
  blog: any;
  blogId: string = '';
  trustedText!: SafeHtml;
  isLoading: boolean = true;
  items: MenuItem[] | null = [];

  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private sanitizer: DomSanitizer,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.route.params.subscribe((params) => {
      this.blogId = params['id'];
      this.blogService.getBlogById(this.blogId).subscribe((data: any) => {
        this.blog = data;
        console.log(this.blog);
        this.trustedText = this.sanitizer.bypassSecurityTrustHtml(
          this.blog.text
        );
        this.incrementViews();
        this.isLoading = false;
      });
    });
    this.items = [
      {
        icon: 'pi pi-pencil',
        routerLink: ['/EditBlog/', this.blogId],
      },

      {
        icon: 'pi pi-trash',
        command: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Delete',
            detail: 'Data Deleted',
          });
        },
      },
    ];
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
