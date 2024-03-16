import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import Swal from "sweetalert2";
import {ApiCallsService} from "./api-calls.service";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  operaterData: any;
  appData = {
    "application": "",
    "route": "",
    "can_view": 0,
    "can_edit": 0
  }


  constructor(
    private router: Router,
    private apiCalls: ApiCallsService,
    private translate: TranslateService
    ) {}

  async setOperatorData(data: any) {
    this.operaterData = data;
    return true
  }


  saveToLocalStorage(nazivpromjenjive: string, podaci: string) {
    localStorage.setItem(nazivpromjenjive, podaci);
  }

  readLocalStorage(nazivpromjenjive: string) {
    return localStorage.getItem(nazivpromjenjive);
  }


  getToken() {
    return localStorage.getItem('token');
  }

  cleanLocalStorage() {
    localStorage.clear();
  }

  logOut() {
    Swal.fire({
      title: this.translate.instant('wanttologout'),
      text: this.translate.instant('areyousureyouwanttologout'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8E4585',
      cancelButtonColor: '#4B4B78',
      confirmButtonText: this.translate.instant('yesiamsurebutton'),
      cancelButtonText: this.translate.instant('cancel.button')
    }).then((result) => {
      if (result.isConfirmed) {
        this.cleanLocalStorage()
        void this.router.navigate(['/login'])
      } else {
        return
      }
    })
    return false;
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const activeRoute = route.routeConfig?.path;
    const activeFolder = activeRoute?.split('/')[0];
    const privileges = this.operaterData!.privileges;

    console.log(activeRoute, activeFolder, "ROUTE")

    if (!privileges) {
      void this.router.navigate(['/login']);
      return false;
    }
    const operaterPrivileges = privileges.find((item: any) => item.route === activeFolder);
    if (!operaterPrivileges) {
      void this.router.navigate(['/error']);
      return false;
    }

    if (operaterPrivileges) {
      this.appData.application = operaterPrivileges.route;
      this.appData.route = activeRoute!;
      this.appData.can_view = operaterPrivileges.can_view
      this.appData.can_edit = operaterPrivileges.can_edit
      this.apiCalls.isOpenedMainMenu = !(this.appData.application === 'admin');

      if (this.appData.can_view) {
         return true;
      } else {
       void Swal.fire({
          title: "Access denied",
          text: "You don't have access to this route!",
          icon: 'error',
          confirmButtonColor: 'rgba(35,101,150,0.86)',
        });
        void this.router.navigate(['/login']);
        return false;
      }
    }
    else {
      void this.router.navigate(['/error']);
      return false;
    }
  }


  directLogoutUser() {
    this.cleanLocalStorage()
    void this.router.navigate(['/login'])
  }


}

