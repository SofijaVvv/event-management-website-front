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
  jeliDarkMode = false
   handleColorSchemeChange (e: any)  {
    // Check if switched to light mode
     const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
     this.jeliDarkMode = darkModeQuery.matches
     window.location.reload();
     if (!e.matches) {
       console.log('Switched to light mode!', this.jeliDarkMode);

    }
  }

  ngOnInit(): void {
    this.koji_meni = this._authServis.citajLokalniStoridz('koji_meni') || "doma"
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.jeliDarkMode = darkModeQuery.matches;
    // Listen for changes
    darkModeQuery.addEventListener('change', this.handleColorSchemeChange);


  }

  promjenaMenija(kojimeni: string) {
    this.koji_meni = kojimeni
    this._authServis.upisLokalniStoridz('koji_meni', kojimeni)
    void this.router.navigate([kojimeni])
    this.zatvoriPregled.emit(true);
  }
}
