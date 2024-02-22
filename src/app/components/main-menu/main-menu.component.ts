import {Component, EventEmitter, Output} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {ApiCallsService} from "../../service/api-calls.service";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.sass']
})
export class MainMenuComponent {
  @Output () zatvoriPregled = new EventEmitter<boolean>();
  constructor(
    private _authServis: AuthService,
    private router: Router,
    public apiCalls: ApiCallsService,
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
    this.koji_meni = this._authServis.readLocalStorage('koji_meni') || "doma"
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.jeliDarkMode = darkModeQuery.matches;
    // Listen for changes
    darkModeQuery.addEventListener('change', this.handleColorSchemeChange);


  }

  promjenaMenija(kojimeni: string) {
    this.koji_meni = kojimeni
    this._authServis.saveToLocalStorage('koji_meni', kojimeni)
    void this.router.navigate([kojimeni])
    this.zatvoriPregled.emit(true);
  }

  izlaz(){
    this.apiCalls.isOpenedMainMenu = false
  }
}
