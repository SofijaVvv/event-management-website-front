import {CUSTOM_ELEMENTS_SCHEMA, importProvidersFrom, NgModule} from '@angular/core';
import {BrowserModule, HammerModule} from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from "@angular/common/http";
import {InterceptorService} from "./service/interceptor.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatNativeDateModule} from "@angular/material/core";
import {NgSelectModule} from "@ng-select/ng-select";
import { JwtModule } from "@auth0/angular-jwt";
import {MatInputModule} from "@angular/material/input";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import { TouchEventsDirective } from './directives/touch-events.directive';
import {NgChartsModule} from "ng2-charts";
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { UserInputComponent } from './admin/user/user-input/user-input.component';
import { UserOverviewComponent } from './admin/user/user-overview/user-overview.component';
import {NgxSpinnerModule} from "ngx-spinner";
import { RolesPrivilegesOverviewComponent } from './admin/roles-privileges/roles-privileges-overview/roles-privileges-overview.component';
import { ErrorComponent } from './error/error.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { EventOverviewComponent } from './components/events/event-overview/event-overview.component';
import { EventInputComponent } from './components/events/event-input/event-input.component';
import { TaskInputComponent } from './components/tasks/task-input/task-input.component';
import { ScheduleInputComponent } from './components/schedule/schedule-input/schedule-input.component';
import { RevenueInputComponent } from './components/revenue/revenue-input/revenue-input.component';
import { ExpensesInputComponent } from './components/expenses/expenses-input/expenses-input.component';
import { TaskOverviewComponent } from './components/tasks/task-overview/task-overview.component';
import { ScheduleOverviewComponent } from './components/schedule/schedule-overview/schedule-overview.component';
import { ClientInputComponent } from './components/clients/client-input/client-input.component';
import { ClientOverviewComponent } from './components/clients/client-overview/client-overview.component';
import { ExpensesOverviewComponent } from './components/expenses/expenses-overview/expenses-overview.component';
import { AnalysisComponent } from './components/analysis/analysis.component';
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import { SharedOverviewComponent } from './components/shared/shared-overview/shared-overview.component';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    TouchEventsDirective,
    LoginComponent,
    HomeComponent,
    UserInputComponent,
    UserOverviewComponent,
    RolesPrivilegesOverviewComponent,
    ErrorComponent,
    MainMenuComponent,
    EventOverviewComponent,
    EventInputComponent,
    TaskInputComponent,
    ScheduleInputComponent,
    RevenueInputComponent,
    ExpensesInputComponent,
    TaskOverviewComponent,
    ScheduleOverviewComponent,
    ClientInputComponent,
    ClientOverviewComponent,
    ExpensesOverviewComponent,
    AnalysisComponent,
    SharedOverviewComponent,
  ],
    imports: [
        BrowserModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatSlideToggleModule,
        MatNativeDateModule,
        NgSelectModule,
        HammerModule,
        NgxSpinnerModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: function tokenGetter() {
                    return localStorage.getItem('token');
                }
            }
        }),
        MatInputModule,
        MatDatepickerModule,
        MatMenuModule,
        MatIconModule,
        NgChartsModule,
        MatListModule,
        MatButtonModule,
        MatTabsModule
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    importProvidersFrom(HammerModule)

  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
