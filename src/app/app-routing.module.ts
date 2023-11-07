import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./komponente/login/login.component";
import {DomaComponent} from "./komponente/doma/doma.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'doma',
    component: DomaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
