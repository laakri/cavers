import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**********  Component Pages *************** */
import { BlogsComponent } from './pages/blogs/blogs.component';
import { BlogPageComponent } from './pages/blog-page/blog-page.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { PricingPageComponent } from './pages/pricing-page/pricing-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { UnauthorizedErrorComponent } from './components/unauthorized-error/unauthorized-error.component';
import { ContactPageComponent } from './pages/contact-page/contact-page.component';

/**********  Authentication Dashboard *************** */
import { AuthenticationComponent } from './authentication/authentication.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { LoginComponent } from './authentication/login/login.component';

/**********  Component Dashboard *************** */
import { AddBlogComponent } from './dashboard/add-blog/add-blog.component';
import { EditBlogComponent } from './dashboard/edit-blog/edit-blog.component';
import { UsersListComponent } from './dashboard/users-list/users-list.component';

/**********  AdminAuthGuard *************** */
import { AdminAuthGuard } from './admin-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'Pricing', component: PricingPageComponent },
  { path: 'Blogs', component: BlogsComponent },
  { path: 'BlogPage/:id', component: BlogPageComponent },
  { path: 'AboutUs', component: AboutPageComponent },
  { path: 'ContactUs', component: ContactPageComponent },
  {
    path: 'auth',
    component: AuthenticationComponent,
    children: [
      { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
    ],
  },
  {
    path: 'AddBlog',
    component: AddBlogComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'EditBlog/:id',
    component: EditBlogComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'Users',
    component: UsersListComponent,
    canActivate: [AdminAuthGuard],
  },
  { path: 'unauthorized', component: UnauthorizedErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
