import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**********  Component Pages *************** */
import { BlogsComponent } from './pages/blogs/blogs.component';
import { BlogPageComponent } from './pages/blog-page/blog-page.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { PricingPageComponent } from './pages/pricing-page/pricing-page.component';

/**********  Component Dashboard *************** */
import { AddBlogComponent } from './dashboard/add-blog/add-blog.component';
import { EditBlogComponent } from './dashboard/edit-blog/edit-blog.component';
import { UsersListComponent } from './dashboard/users-list/users-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent },
  { path: 'Pricing', component: PricingPageComponent },
  { path: 'Blogs', component: BlogsComponent },
  { path: 'BlogPage/:id', component: BlogPageComponent },

  { path: 'AddBlog', component: AddBlogComponent },
  { path: 'home', component: EditBlogComponent },
  { path: 'Users', component: UsersListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
