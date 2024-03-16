import { NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {LoginComponent} from "./components/login/login.component";
import {UserOverviewComponent} from "./admin/user/user-overview/user-overview.component";
import {RolesPrivilegesOverviewComponent} from "./admin/roles-privileges/roles-privileges-overview/roles-privileges-overview.component";
import {AuthService} from "./service/auth.service";
import {ErrorComponent} from "./error/error.component";
import {EventOverviewComponent} from "./components/events/event-overview/event-overview.component";
import {EventInputComponent} from "./components/events/event-input/event-input.component";
import {TaskOverviewComponent} from "./components/tasks/task-overview/task-overview.component";
import {ScheduleOverviewComponent} from "./components/schedule/schedule-overview/schedule-overview.component";
import {ClientOverviewComponent} from "./components/clients/client-overview/client-overview.component";
import {ExpensesOverviewComponent} from "./components/expenses/expenses-overview/expenses-overview.component";
import {AnalysisComponent} from "./components/analysis/analysis.component";
import {SharedOverviewComponent} from "./components/shared/shared-overview/shared-overview.component";




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
    path:'events/list/:fromDate/:toDate',
    component: EventOverviewComponent,
    canActivate: [AuthService],
  },
  {
    path:'events/input/:id',
    component: EventInputComponent,
    canActivate: [AuthService],
  },
  {
    path:'assignments/overview',
    component: TaskOverviewComponent,
    canActivate: [AuthService],
  },
  {
    path:'schedule/overview',
    component: ScheduleOverviewComponent,
    canActivate: [AuthService],
  },
  {
    path:'client/overview',
    component: ClientOverviewComponent,
    canActivate: [AuthService],
  },
  {
    path:'cost/overview',
    component: ExpensesOverviewComponent,
    canActivate: [AuthService],
  },
  {
    path: 'analisys',
    component: AnalysisComponent,
    canActivate: [AuthService],
  },
  {
    path: 'shared/overview',
    component: SharedOverviewComponent
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
