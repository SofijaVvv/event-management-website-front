import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./komponente/home/home.component";
import {LoginComponent} from "./komponente/login/login.component";
import {UserOverviewComponent} from "./admin/user/user-overview/user-overview.component";
import {AdminPageComponent} from "./admin/admin-page/admin-page.component";
import {
  RolesPrivilegesOverviewComponent
} from "./admin/roles-privileges/roles/roles-privileges-overview/roles-privileges-overview.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: UserOverviewComponent,
  },
  {
  path: 'admin-user',
    component: UserOverviewComponent,
  },
  {
    path: 'roles-privileges',
    component: RolesPrivilegesOverviewComponent
  }







];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
