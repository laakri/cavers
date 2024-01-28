import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../../services/blog.service';
import { MessageService } from 'primeng/api';

interface Category {
  name: string;
  code: string;
}

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css'],
  providers: [MessageService],
})
export class AddBlogComponent implements OnInit {
  tags: string[] = [];
  tagForm: FormGroup;
  formGroup: FormGroup;
  selectedCategorys: Category[] = [];
  categorys: Category[] = [];
  selectedMembershipLevels = '';

  blogImageFile: File | null = null;
  blogImageName!: string;
  blogImagePreview!: string;

  chartImageFile: File | null = null;
  chartImageName!: string;
  chartImagePreview!: string;
  text!: string;
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private blogService: BlogService
  ) {
    this.formGroup = this.fb.group({
      title: ['', Validators.required],
      shortDescription: ['', Validators.required],
      text: ['', Validators.required],
      selectedCategorys: [''],
      selectedMembershipLevels: ['', Validators.required],
    });
    this.tagForm = this.fb.group({
      tagInput: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.categorys = [
      { name: 'Cryptocurrency News', code: 'crypto-news' },
      { name: 'Blockchain Technology', code: 'blockchain-tech' },
      { name: 'Crypto Investing', code: 'crypto-investing' },
      { name: 'Altcoins', code: 'altcoins' },
      { name: 'Crypto Regulation', code: 'crypto-regulation' },
    ];
  }
  /*************** initializeQuill  ******************/

  imageHandler() {
    // Custom logic to get the image URL and merge it into the editor
    const url = prompt('Enter the image URL:');
    if (url) {
      this.text += `
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

  addblog() {
    if (this.formGroup.valid) {
      const selectedCategorys = this.formGroup.value.selectedCategorys.map(
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
      formData.append(
        'blogImage',
        this.blogImageFile as Blob,
        this.blogImageName
      );
      formData.append(
        'chartImage',
        this.chartImageFile as Blob,
        this.chartImageName
      );

      this.blogService.createBlog(formData).subscribe(
        (createdBlog) => {
          console.log('Blog created:', createdBlog);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Blog created successfully.',
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
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill out all required fields.',
      });
    }
  }
}
