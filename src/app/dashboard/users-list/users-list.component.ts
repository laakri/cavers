import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ConfirmationService, MessageService } from 'primeng/api';

interface SortByDate {
  name: string;
  code: string;
}
interface Role {
  name: string;
  code: string;
}
@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class UsersListComponent implements OnInit {
  users: any[] = [];
  search: string = '';
  first: number = 0;
  totalUsers: number = 0;
  page: number = 10;
  rows: number = 10;
  visible: boolean = false;
  roles!: Role[];
  selectedRole: Role = { name: 'free', code: 'free' };
  UserId!: string;
  SortByDate!: SortByDate[];
  selectedSortByDate: SortByDate = { name: 'Newest', code: 'newest' };
  UserEmail!: string;
  cols: any[] = [
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' },
    // Add more columns as needed
  ];

  constructor(
    private confirmationService: ConfirmationService,
    private UsersService: UsersService,
    private messageService: MessageService
  ) {}
  ngOnInit(): void {
    this.roles = [
      { name: 'free', code: 'free' },
      { name: 'silver', code: 'silver' },
      { name: 'plat', code: 'plat' },
    ];
    this.SortByDate = [
      { name: 'Newest', code: 'newest' },
      { name: 'Oldest', code: 'oldest' },
    ];
    this.loadUsers();
  }
  showDialog(role: string, email: string, UserId: string) {
    this.UserEmail = email;
    this.UserId = UserId;
    this.selectedRole = { name: role, code: role };
    this.visible = true;
  }
  searchUsers() {
    this.first = 0;
    this.loadUsers();
  }

  sortUsers() {
    this.selectedSortByDate.code;
    this.loadUsers();
  }

  onPageChange(event: any) {
    this.page = event.page;
    this.first = event.first;
    this.rows = event.rows;
    this.loadUsers();
  }

  ChangeRole() {
    this.UsersService.changeUserRole(
      this.UserId,
      this.selectedRole.code
    ).subscribe(
      () => {
        this.visible = false;
        this.loadUsers();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User Role Changed',
        });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          detail: 'Eror In Changing Role',
        });
      }
    );
  }
  confirmDelete(event: Event, UserId: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.DeleteUser(UserId);
        this.loadUsers();
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You canceled the action',
        });
      },
    });
  }
  DeleteUser(UserId: string) {
    this.UsersService.deleteUser(UserId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User Deleted',
        });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          detail: 'Eror Deleting User',
        });
      }
    );
  }
  loadUsers() {
    this.UsersService.getUsers(
      this.first,
      this.page,
      this.rows,
      this.search,
      this.selectedSortByDate.code
    ).subscribe((data: any) => {
      this.users = data.users;
      this.totalUsers = data.totalUsers;
    });
  }
}
