import {Component, OnInit} from '@angular/core';
import {ApiPoziviService} from "../../servis/api-pozivi.service";
import {DateAdapter} from "@angular/material/core";

@Component({
  selector: 'app-doma',
  templateUrl: './doma.component.html',
  styleUrls: ['./doma.component.sass']
})
export class DomaComponent implements OnInit{
  constructor(
      public poziviServis: ApiPoziviService,
      private _adapter: DateAdapter<any>,
  ) {

  }
  datum = new Date();
  aktivnimjesec = this.poziviServis.mjeseci[this.datum.getMonth()];
  selektovanaGodina = 2023;
  selektovaniMjesec = this.aktivnimjesec;

  ngOnInit(): void {
    this._adapter.setLocale('sr-latn');
    this.kreirajKalendar(2023, this.aktivnimjesec.id)
  }
  kalendar  = []

  kreirajKalendar(godina: number, mjesec: number){
    this.poziviServis.kalendar(mjesec, godina).subscribe(
        (data: any) => {
          console.log(data)

          this.kalendar = data.tabela
        });
  }

  promjenaKalendara(){
    console.log(this.selektovaniMjesec, "mjesec")
    this.kreirajKalendar(this.selektovanaGodina, this.selektovaniMjesec.id)
  }



}
