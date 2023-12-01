import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-page',
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.css'],
})
export class BlogPageComponent implements OnInit {
  blog: any;
  blogId: string = '';
  trustedText!: SafeHtml;
  isLoading: boolean = true;
  constructor(
    private route: ActivatedRoute,
    private blogService: BlogService,
    private sanitizer: DomSanitizer
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
