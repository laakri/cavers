import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BlogService } from '../../services/blog.service';
import { DomSanitizer } from '@angular/platform-browser';
interface Category {
  name: string;
  code: string;
}

@Component({
  selector: 'app-edit-blog',
  templateUrl: './edit-blog.component.html',
  styleUrls: ['./edit-blog.component.css'],
})
export class EditBlogComponent implements OnInit {
  formGroup: FormGroup;
  tags: string[] = [];
  tagForm: FormGroup;
  blogId: string = '';
  selectedMembershipLevels = '';
  importImgUrl: string = '';
  selectedCategorys: Category[] = [];
  categorys: Category[] = [];

  blogImageFile: File | null = null;
  blogImageName!: string;
  blogImagePreview!: string;

  chartImageFile: File | null = null;
  chartImageName!: string;
  chartImagePreview!: string;
  isLoading: boolean = false;
  isUpdatingLoading: boolean = false;
  notFound: boolean = false;
  trustedText: any;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private blogService: BlogService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute
  ) {
    this.formGroup = this.fb.group({
      title: ['', Validators.required],
      shortDescription: ['', Validators.required],
      text: ['', Validators.required],
      selectedCategorys: [''],
      selectedMembershipLevels: ['', Validators.required],
      // Add other form controls based on your requirements...
    });

    this.tagForm = this.fb.group({
      tagInput: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.isLoading = true;

    this.categorys = [
      { name: 'Chose Category', code: '' },
      { name: 'Trading Ideas', code: 'trading-ideas' },
      { name: 'Investment Ideas', code: 'investment-ideas' },
      { name: 'Take Profit', code: 'take-profit' },
      { name: 'Videos', code: 'videos' },
    ];

    this.route.params.subscribe((params) => {
      this.blogId = params['id'];

      this.blogService.getBlogById(this.blogId).subscribe(
        (blog: any) => {
          this.formGroup.patchValue({
            title: blog.title,
            shortDescription: blog.shortDescription,
            text: blog.text,
            selectedCategorys: blog.selectedCategorys,
            selectedMembershipLevels: blog.selectedMembershipLevels,
          });
          this.trustedText = blog.text;

          console.log(this.trustedText);
          this.tags = blog.tags;
          this.blogImagePreview = blog.blogImage;
          this.chartImagePreview = blog.chartImage;

          this.selectedCategorys = blog.selectedCategorys.map(
            (code: string) => {
              const category = this.categorys.find(
                (c) => c.code === code.trim()
              ); // Trim to remove extra spaces

              if (category) {
                return { name: category.name, code: category.code };
              } else {
                console.error(`Category with code ${code} not found.`);
                return { name: 'Unknown', code: 'unknown' }; // Default values or handle as needed
              }
            }
          );
          this.selectedMembershipLevels = blog.selectedMembershipLevels;
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          this.notFound = true;
          console.log(error);
        }
      );
    });
  }
  /*************** initializeQuill  ******************/

  imageHandler() {
    // Custom logic to get the image URL and merge it into the editor
    const url = prompt('Enter the image URL:');
    if (url) {
      this.trustedText += `
      <img src="${url}" alt="data" max-width="450px" max-height="100%" >`;
    }
  }
  /*************** Image Thumbnail  ******************/

  onBlogImagePicked(event: Event) {
    const file = ((event.target as HTMLInputElement).files as FileList)[0];
    if (this.formGroup !== undefined) {
      this.formGroup.patchValue({ filePath: file });
      this.formGroup.get('filePath') as any;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.blogImagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.blogImageFile = file;
    this.blogImageName = file.name;
  }

  /*************** Image Chart Image  ******************/

  onBlogChartPicked(event: Event) {
    const file = ((event.target as HTMLInputElement).files as FileList)[0];
    if (this.formGroup !== undefined) {
      this.formGroup.patchValue({ filePath: file });
      this.formGroup.get('filePath') as any;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.chartImagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
    this.chartImageFile = file;
    this.chartImageName = file.name;
  }
  /***********************************/

  addTag() {
    const tagInputControl = this.tagForm.get('tagInput');
    if (tagInputControl) {
      const newTag = tagInputControl.value;
      if (newTag) {
        this.tags.push(newTag);
        tagInputControl.reset();
      }
    }
  }

  /***********************************/

  removeTag(tag: string) {
    const index = this.tags.indexOf(tag);
    if (index !== -1) {
      this.tags.splice(index, 1);
    }
  }
  /***********************************/
  updateBlog() {
    this.isUpdatingLoading = true;
    if (this.formGroup.valid) {
      const selectedCategorys = this.selectedCategorys.map(
        (category: any) => category.code
      );

      const formData = new FormData();
      formData.append('title', this.formGroup.value.title);
      formData.append(
        'shortDescription',
        this.formGroup.value.shortDescription
      );
      formData.append('text', this.formGroup.value.text);

      for (const element of selectedCategorys) {
        formData.append('selectedCategorys[]', element);
      }
      formData.append(
        'selectedMembershipLevels',
        this.formGroup.value.selectedMembershipLevels
      );
      for (const element of this.tags) {
        formData.append('tags[]', element);
      }
      if (this.blogImageFile) {
        formData.append(
          'blogImage',
          this.blogImageFile as Blob,
          this.blogImageName
        );
      }

      // Check if chartImageFile is not null before appending
      if (this.chartImageFile) {
        formData.append(
          'chartImage',
          this.chartImageFile as Blob,
          this.chartImageName
        );
      }

      this.blogService.updateBlog(this.blogId, formData).subscribe(
        (updateBlog) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Blog update successfully.',
          });
        },
        (error) => {
          console.error('Error creating blog:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error creating the blog. Please try again later.',
          });
        }
      );
      this.isUpdatingLoading = false;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill out all required fields.',
      });
    }
  }
}
