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
import { LoginComponent } from './komponente/login/login.component';
import { HomeComponent } from './komponente/home/home.component';
import {TranslateModule, TranslateLoader} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import { UserInputComponent } from './admin/user/user-input/user-input.component';
import { UserOverviewComponent } from './admin/user/user-overview/user-overview.component';
import {NgxSpinnerModule} from "ngx-spinner";
import { AdminPageComponent } from './admin/admin-page/admin-page.component';
import { RolesPrivilegesOverviewComponent } from './admin/roles-privileges/roles/roles-privileges-overview/roles-privileges-overview.component';
import { RolesPrivilegesInputComponent } from './admin/roles-privileges/roles/roles-privileges-input/roles-privileges-input.component';


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
    AdminPageComponent,
    RolesPrivilegesOverviewComponent,
    RolesPrivilegesInputComponent,
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
    NgChartsModule
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
