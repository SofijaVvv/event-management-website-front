import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {Router} from "@angular/router";
import {ApiCallsService} from "../../service/api-calls.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.sass']
})
export class MainMenuComponent implements OnInit{
  @Output () zatvoriPregled = new EventEmitter<boolean>();
  constructor(
    public _authServis: AuthService,
    private router: Router,
    public apiCalls: ApiCallsService,
    private translate: TranslateService
  ) { }

  activeMenu = this._authServis.appData.route;
  currentOperator = this._authServis.operaterData
  currentLanguage = this._authServis.readLocalStorage('lang') || 'en'

  ngOnInit() {
    const language  =  this._authServis.readLocalStorage('lang') || 'en'
    this.translate.use(language);
    console.log("jezik : ", language)
    this.activeMenu = this._authServis.readLocalStorage('active_menu') || this._authServis.appData.route
    console.log(this.activeMenu, "active menu")
  }

  canShowRoute(route: string): boolean {
    if (this._authServis.operaterData === undefined) {
      return false
    }
    const hasRoute = this._authServis.operaterData.privileges.find((privilege: any) => privilege.route === route)
    if (hasRoute) {
      if (hasRoute.route == 'shared'){
        return hasRoute.can_edit
      }
      return hasRoute.can_view
    }
    return false

  }


  changeMenu(whichMenu: string) {
    this.activeMenu = whichMenu
    this._authServis.saveToLocalStorage('active_menu', whichMenu)
    void this.router.navigate([whichMenu])
    // this.zatvoriPregled.emit(true);
    console.log(this._authServis.operaterData.userdata, "operater data")
  }

  changeLanguage(lang: string) {

    this._authServis.saveToLocalStorage('lang', lang)
    this.currentLanguage = lang
    this.translate.use(lang);
  }

}
