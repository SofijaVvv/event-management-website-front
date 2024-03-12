import {Component, HostListener, OnInit} from '@angular/core';
import {ApiCallsService} from "./service/api-calls.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {AuthService} from "./service/auth.service";
import Swal from "sweetalert2";
import {Router} from "@angular/router";
import {JwtHelperService} from "@auth0/angular-jwt";
import {TranslateModule, TranslateService} from "@ngx-translate/core";

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
  title = 'gland';
  constructor(
    public apiCalls: ApiCallsService,
    public _authServis: AuthService,
    private router: Router,
    public jwtHelper: JwtHelperService,
    public translate: TranslateService

  ){
    translate.addLangs(['en', 'bs', 'sq']);
    translate.setDefaultLang('en');
    // translate.use('bs');
  }
  //
  // @HostListener('window:beforeunload', ['$event'])
  // unloadNotification($event: any): void {
  //     var confirmationMessage = "Jeste sigurni da želite napustiti stranicu?";
  //     $event.returnValue = confirmationMessage;
  //     console.log(confirmationMessage);
  //
  // }
  //
  // @HostListener('window:unload', ['$event'])
  // unloadHandler($event: any) {
  //     console.log('unload event');
  //     this.apiCalls.directLogoutUser();
  //
  // }

 ngOnInit()  {
    const userData =  this._authServis.readLocalStorage('user');
    this.apiCalls.isOpenedMainMenu = true
    console.log(userData);
    if (userData) {
      this._authServis.setOperatorData(JSON.parse(userData)).then((data: any) => {
        console.log("ja sam iz app.component", this._authServis.operaterData)

      })
    }

    // console.log(this.jwtHelper.isTokenExpired(), "isTokenExpired");
    // console.log(this.jwtHelper.getTokenExpirationDate(), "getTokenExpirationDate");
    // const token = localStorage.getItem('token') || '';
    // console.log(this.jwtHelper.decodeToken(token), "decodeToken");

  }

  closeMainMenu(event: any){
    this.apiCalls.isOpenedMainMenu = false
  }
}
