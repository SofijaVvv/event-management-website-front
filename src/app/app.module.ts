import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {InterceptorService} from "./servis/interceptor.service";
import {LoginComponent} from "./komponente/login/login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DomaComponent } from './komponente/doma/doma.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import { PregledZadatakaComponent } from './komponente/zadaci/pregled-zadataka/pregled-zadataka.component';
import { UnosZadatakaComponent } from './komponente/zadaci/unos-zadataka/unos-zadataka.component';
import { PregledRasporedaComponent } from './komponente/rasporedi/pregled-rasporeda/pregled-rasporeda.component';
import { UnosRasporedaComponent } from './komponente/rasporedi/unos-rasporeda/unos-rasporeda.component';
import { UnosKomitenataComponent } from './komponente/komitenti/unos-komitenata/unos-komitenata.component';
import { PregledKomitenataComponent } from './komponente/komitenti/pregled-komitenata/pregled-komitenata.component';
import { PregledDogadjajaComponent } from './komponente/dogadjaji/pregled-dogadjaja/pregled-dogadjaja.component';
import { UnosDogadjajaComponent } from './komponente/dogadjaji/unos-dogadjaja/unos-dogadjaja.component';
import { GlavniMeniComponent } from './komponente/glavni-meni/glavni-meni.component';
import {MatNativeDateModule} from "@angular/material/core";
import {NgSelectModule} from "@ng-select/ng-select";
import { JwtModule } from "@auth0/angular-jwt";




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DomaComponent,
    PregledZadatakaComponent,
    UnosZadatakaComponent,
    PregledRasporedaComponent,
    UnosRasporedaComponent,
    UnosKomitenataComponent,
    PregledKomitenataComponent,
    PregledDogadjajaComponent,
    UnosDogadjajaComponent,
    GlavniMeniComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    NgSelectModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() {
          return     localStorage.getItem('token');
        }
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
