import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./komponente/login/login.component";
import {DomaComponent} from "./komponente/doma/doma.component";
import {PregledZadatakaComponent} from "./komponente/zadaci/pregled-zadataka/pregled-zadataka.component";
import {PregledRasporedaComponent} from "./komponente/rasporedi/pregled-rasporeda/pregled-rasporeda.component";
import {PregledKomitenataComponent} from "./komponente/komitenti/pregled-komitenata/pregled-komitenata.component";
import {PregledDogadjajaComponent} from "./komponente/dogadjaji/pregled-dogadjaja/pregled-dogadjaja.component";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'doma',
    component: DomaComponent
  },
  {
    path: 'pregled-zadataka',
    component: PregledZadatakaComponent
  },
  {
    path: 'pregled-rasporeda',
    component: PregledRasporedaComponent
  },
  {
    path: 'pregled-komitenata',
    component: PregledKomitenataComponent
  },
  {
    path: 'pregled-dogadjaja',
    component: PregledDogadjajaComponent
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
