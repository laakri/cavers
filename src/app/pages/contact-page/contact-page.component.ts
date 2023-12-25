// contact-page.component.ts
import { Component } from '@angular/core';
import { ContactService } from 'src/app/services/contact.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css'],
  providers: [MessageService],
})
export class ContactPageComponent {
  selectedTopic!: string;
  userEmail!: string;
  userProblem!: string;
  loading = false; // Track loading state

  constructor(
    private contactService: ContactService,
    private messageService: MessageService
  ) {}

  selectTopic(topic: string): void {
    this.selectedTopic = topic;
  }

  submitForm(): void {
    if (
      !this.selectedTopic ||
      !this.userEmail ||
      !this.userProblem ||
      this.loading
    ) {
      // Handle validation error or if the form is already being submitted
      return;
    }

    this.loading = true;

    this.contactService
      .sendEmail(this.selectedTopic, this.userEmail, this.userProblem)
      .subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Email sent successfully',
          });
          this.userEmail = '';
          this.userProblem = '';
          this.selectedTopic = '';
        },
        (error) => {
          console.error('Error sending email:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to send email. Please try again.',
          });
        }
      )
      .add(() => {
        this.loading = false;
      });
  }
}
