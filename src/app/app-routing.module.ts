import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {UserOverviewComponent} from "./admin/user/user-overview/user-overview.component";


import {RolesPrivilegesOverviewComponent} from "./admin/roles-privileges/roles/roles-privileges-overview/roles-privileges-overview.component";

import {AuthService} from "./service/auth.service";
import {ErrorComponent} from "./error/error.component";
import {EventOverviewComponent} from "./components/events/event-overview/event-overview.component";
import {EventInputComponent} from "./components/events/event-input/event-input.component";
import {TaskOverviewComponent} from "./components/tasks/task-overview/task-overview.component";
import {ScheduleOverviewComponent} from "./components/schedule/schedule-overview/schedule-overview.component";
import {ClientOverviewComponent} from "./components/clients/client-overview/client-overview.component";
import {ExpensesOverviewComponent} from "./components/expenses/expenses-overview/expenses-overview.component";
import {AnalysisComponent} from "./components/analysis/analysis.component";



const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: UserOverviewComponent,
    canActivate: [AuthService]
  },
  {
  path: 'admin/user',
    component: UserOverviewComponent,
    canActivate: [AuthService]
  },
  {
    path: 'admin/roles-privileges',
    component: RolesPrivilegesOverviewComponent,
    canActivate: [AuthService]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthService],
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path:'events/list',
    component: EventOverviewComponent,
  },
  {
    path:'events/input/:id',
    component: EventInputComponent,
  },
  {
    path:'task/overview',
    component: TaskOverviewComponent,
  },
  {
    path:'schedule/overview',
    component: ScheduleOverviewComponent,
  },
  {
    path:'clients/overview',
    component: ClientOverviewComponent,
  },
  {
    path:'costs/overview',
    component: ExpensesOverviewComponent,
  },
  {
    path: 'analisys',
    component: AnalysisComponent,
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
