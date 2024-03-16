import {Component, HostListener, OnInit} from '@angular/core';
import {ApiCallsService} from "./service/api-calls.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {AuthService} from "./service/auth.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
    animations: [
        trigger('uletiUnos', [
            transition(':enter', [
                style({transform: 'translateX(-100%)'}),
                animate('300ms ease-in', style({transform: 'translateX(0%)'}))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({transform: 'translateX(-100%)'}))
            ])
        ])
    ]
})
export class AppComponent implements OnInit{
  title = 'LgProject';
  constructor(
    public apiCalls: ApiCallsService,
    public _authServis: AuthService,
    public translate: TranslateService

  ){
    translate.addLangs(['en', 'bs', 'sq']);
    translate.setDefaultLang('en');
  }


 ngOnInit()  {
    const userData =  this._authServis.readLocalStorage('user');
    this.apiCalls.isOpenedMainMenu = true
    console.log(userData);
    if (userData) {
      this._authServis.setOperatorData(JSON.parse(userData)).then((data: any) => {
        console.log("ja sam iz app.component", this._authServis.operaterData)

      })
    }
  }


  closeMainMenu(event: any){
    this.apiCalls.isOpenedMainMenu = false
  }
}
