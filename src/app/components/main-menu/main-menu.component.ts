import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { ApiCallsService } from '../../service/api-calls.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.sass'],
})
export class MainMenuComponent implements OnInit {
  @Output() zatvoriPregled = new EventEmitter<boolean>();

  activeMenu = this._authServis.appData.route;
  currentOperator = this._authServis.operaterData;
  currentLanguage = this._authServis.readLocalStorage('lang') || 'en';

  constructor(
    public _authServis: AuthService,
    private router: Router,
    public apiCalls: ApiCallsService,
    private translate: TranslateService,
  ) {}

  ngOnInit() {
    const language = this._authServis.readLocalStorage('lang') || 'en';
    this.translate.use(language);
    this.apiCalls.activeMainMenu =
      this._authServis.readLocalStorage('active_menu') ||
      this._authServis.appData.route;
  }

  canShowRoute(route: string): boolean {
    if (this._authServis.operaterData === undefined) {
      return false;
    }
    const hasRoute = this._authServis.operaterData.privileges.find(
      (privilege: any) => privilege.route === route,
    );
    if (hasRoute) {
      if (hasRoute.route == 'shared') {
        return hasRoute.can_edit;
      }
      return hasRoute.can_view;
    }
    return false;
  }

  changeMenu(whichLink: string, whichMenu: string) {
    const currentMonth = {
      start: moment().startOf('month').format('YYYY-MM-DD'),
      end: moment().endOf('month').format('YYYY-MM-DD'),
    };


       if (whichMenu === 'events') {
         const savedPeriod = this._authServis.readLocalStorage('period');
         console.log(savedPeriod, 'savedPeriod')
         const period = JSON.parse(savedPeriod || '');
        if (period) {
          whichLink = `/events/list/${period.start}/${period.end}`;
        } else {
          whichLink = `/events/list/${currentMonth.start}/${currentMonth.end}`;
        }
    }


       this.apiCalls.activeMainMenu = whichMenu;
       console.log(whichMenu, 'selektovani meni')
    this._authServis.saveToLocalStorage('active_menu', whichMenu);
    void this.router.navigate([whichLink]);
  }

  changeLanguage(language: string) {
    this._authServis.saveToLocalStorage('lang', language);
    this.currentLanguage = language;
    this.translate.use(language);
  }
}
