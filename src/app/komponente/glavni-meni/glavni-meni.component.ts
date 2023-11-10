import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../servis/auth.service";
import {Router} from "@angular/router";
import {ApiPoziviService} from "../../servis/api-pozivi.service";

@Component({
  selector: 'app-glavni-meni',
  templateUrl: './glavni-meni.component.html',
  styleUrls: ['./glavni-meni.component.sass']
})
export class GlavniMeniComponent implements OnInit{
  @Output () zatvoriPregled = new EventEmitter<boolean>();
  constructor(
      private _authServis: AuthService,
      private router: Router,
      public poziviServis: ApiPoziviService,
  ) { }

  koji_meni = "doma"

  ngOnInit(): void {
    this.koji_meni = this._authServis.citajLokalniStoridz('koji_meni') || "doma"
  }

  promjenaMenija(kojimeni: string) {
    this.koji_meni = kojimeni
    this._authServis.upisLokalniStoridz('koji_meni', kojimeni)
    void this.router.navigate([kojimeni])
    this.zatvoriPregled.emit(true);
  }
}
