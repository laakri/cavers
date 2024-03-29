import { Component, HostListener, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { SearchSectionComponent } from '../search-section/search-section.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  providers: [DialogService],
})
export class NavbarComponent implements OnInit {
  items: MenuItem[] | undefined;
  isBrightTheme = false;
  banner: boolean = false;
  bannerClass!: string;
  isAuth: boolean = false;
  isAuthAdmin: boolean = false;
  private isAuthListenerSubs!: Subscription;
  private authAdminStatusListener!: Subscription;
  private userNameListenerSubs!: Subscription;
  userName: any;
  firstLetter!: string;
  Search: string = '';
  ref: DynamicDialogRef | undefined;
  menuItems: MenuItem[] = [];
  isNavbarTransparent = true;
  isSmallScreen = false;
  isMenuOpen = false;

  constructor(
    private UsersService: UsersService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.isAuthAdmin = this.UsersService.getAdminIsAuth();
    this.authAdminStatusListener =
      this.UsersService.getAuthAdminStatusListener().subscribe((isAdmin) => {
        this.isAuthAdmin = isAdmin;
        this.menuItems = [
          {
            label: 'Blogs',
            routerLink: ['Blogs'],
          },
          {
            label: 'Pricing',
            routerLink: ['Pricing'],
          },
          {
            label: 'About',
            routerLink: ['AboutUs'],
          },
          {
            label: 'Contact',
            routerLink: ['ContactUs'],
          },
          {
            label: 'Add Blog',
            routerLink: ['AddBlog'],
            visible: this.isAuthAdmin,
          },
          {
            label: 'Users',
            routerLink: ['Users'],
            visible: this.isAuthAdmin,
          },
          {
            label: 'Login',
            routerLink: ['auth/login'],
            visible: this.isAuth === false,
          },
          {
            label: 'Sign up',
            routerLink: ['auth/signup'],
            visible: this.isAuth === false,
          },
        ];
      });

    if (this.isAuthAdmin == true) {
      this.isAuthAdmin = true;
    } else {
      this.isAuthAdmin = false;
    }

    this.isAuth = this.UsersService.getIsAuth();
    this.isAuthListenerSubs =
      this.UsersService.getAuthStatusListener().subscribe((isAuthenticated) => {
        this.isAuth = isAuthenticated;
        this.menuItems = [
          {
            label: 'Blogs',
            routerLink: ['Blogs'],
          },
          {
            label: 'Pricing',
            routerLink: ['Pricing'],
          },
          {
            label: 'About',
            routerLink: ['AboutUs'],
          },
          {
            label: 'Contact',
            routerLink: ['ContactUs'],
          },
          {
            label: 'Add Blog',
            routerLink: ['AddBlog'],
            visible: this.isAuthAdmin,
          },
          {
            label: 'Users',
            routerLink: ['Users'],
            visible: this.isAuthAdmin,
          },
          {
            label: 'Login',
            routerLink: ['auth/login'],
            visible: this.isAuth === false,
          },
          {
            label: 'Sign up',
            routerLink: ['auth/signup'],
            visible: this.isAuth === false,
          },
        ];
      });

    this.userName = this.UsersService.getUserName();
    this.userNameListenerSubs =
      this.UsersService.getUserNameListener().subscribe((userNames) => {
        this.userName = userNames;
      });

    this.isBrightTheme = localStorage.getItem('mode') === 'light-theme';
    this.checkScreenSize();
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
    this.menuItems = [
      {
        label: 'Blogs',
        routerLink: ['Blogs'],
      },
      {
        label: 'Pricing',
        routerLink: ['Pricing'],
      },
      {
        label: 'About',
        routerLink: ['AboutUs'],
      },
      {
        label: 'Contact',
        routerLink: ['ContactUs'],
      },
      {
        label: 'Add Blog',
        routerLink: ['AddBlog'],
        visible: this.isAuthAdmin,
      },
      {
        label: 'Users',
        routerLink: ['Users'],
        visible: this.isAuthAdmin,
      },
      {
        label: 'Login',
        routerLink: ['auth/login'],
        visible: this.isAuth === false,
      },
      {
        label: 'Sign up',
        routerLink: ['auth/signup'],
        visible: this.isAuth === false,
      },
    ];
  }

  /*************** Global ************** */
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset > 0) {
      this.isNavbarTransparent = false;
    } else {
      this.isNavbarTransparent = true;
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth < 1100;
  }
  checkScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 1100;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  showDialog() {
    this.ref = this.dialogService.open(SearchSectionComponent, {
      showHeader: false,
      closable: true,
      dismissableMask: true,
      modal: true,
      draggable: false,
      resizable: false,
      position: 'top',
      styleClass: 'dialogSearch',
      width: '1300px',
      contentStyle: { overflow: 'auto' },
    });
    console.log(this.ref);
    this.ref.onClose.subscribe(() => {});
  }

  isBanner(): void {
    this.banner = false;
    // Add the slide-up class to trigger the animation
    setTimeout(() => {
      this.bannerClass = 'slide-up';
    }, 0);
  }
  Logout() {
    this.UsersService.logout();
  }
  /*************** LOGO SWITCHER ************** */
  getImgSrc(): string {
    const isBrightTheme = document.body.classList.contains('light-theme');
    return isBrightTheme
      ? '../../../assets/img/logo-dark.png'
      : '../../../assets/img/logo.png';
  }
  /*************** change_theme ************** */
  change_theme(): void {
    this.isBrightTheme = !this.isBrightTheme;
    const body = document.body;
    if (!this.isBrightTheme) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
      localStorage.setItem('mode', 'dark-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
      localStorage.setItem('mode', 'light-theme');
    }
  }
}
