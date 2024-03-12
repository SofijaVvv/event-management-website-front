import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import Swal from "sweetalert2";
import {ApiCallsService} from "./api-calls.service";

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
    private apiCalls: ApiCallsService
    ) {
  }

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

  deleteLocalStorageItem(nazivpromjenjive: string) {
    localStorage.removeItem(nazivpromjenjive);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  cleanLocalStorage() {
    localStorage.clear();
  }

  logOut() {
    Swal.fire({
      title: 'Want to log out?',
      text: "login.passwordAre you sure you want to exit program?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8E4585',
      cancelButtonColor: '#4B4B78',
      confirmButtonText: 'Yes, I am sure!',
      cancelButtonText: 'Back to program!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cleanLocalStorage()
        this.router.navigate(['/login'])

      } else {

        return
      }
    })

    return false;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    console.log(route, "PIOIPOIPOIPOIPOIPOIPOIPOIPOIPOIPOIPOIPOIPOIPOIPOI")
    const activeRoute = route.routeConfig?.path;
    // activeRoute vraca 'admin/users' ili 'admin/roles-privileges'
    // nama je ptrrebno samo 'admin' i smjestamo je u activeFolder
    // u ovom slucaju activeFolder ce biti 'admin'
    const activeFolder = activeRoute?.split('/')[0];
    const privileges = this.operaterData!.privileges;

    // ako uopste nema privilegija a to znaci da user i nije ulogovan vracamo error
    if (!privileges) {
    console.log("error nema privilegija")
      void this.router.navigate(['/login']);
      return false;
    }
    // uporedjujemo activeFolder sa rutama aplikacije iz tabele app
    const operaterPrivileges = privileges.find((item: any) => item.route === activeFolder);
    console.log(privileges, operaterPrivileges,activeFolder, "operaterPrivileges")
    // ako korinik nema upisanu privilegiju za rutu koju pokusava da otvori vracamo error
    if (!operaterPrivileges) {
      console.log("error nema operaterPrivileges")
      void this.router.navigate(['/error']);
      return false;
    }


    // uzimamo can_view i can_edit iz za datu rolu
    if (operaterPrivileges) {
      this.appData.application = operaterPrivileges.route;
      this.appData.route = activeRoute!;
      this.appData.can_view = operaterPrivileges.can_view //value.find((item: any) => item.privileges_name === 'can_view').activity;
      this.appData.can_edit = operaterPrivileges.can_edit //value.find((item: any) => item.privileges_name === 'can_edit').activity;
      console.log(this.appData, "this.appData", this.operaterData['userdata']['isadmin'])


      console.log(this.appData.can_view, "this.appData.can_view")

      if (this,this.appData.application === 'admin')
      {
        this.apiCalls.isOpenedMainMenu = false;
      } else {
        this.apiCalls.isOpenedMainMenu = true;
      }

      if (this.appData.can_view) {
         return true;
      } else {
        Swal.fire({
          title: 'Access denied!',
          text: "You don't have access to this route",
          icon: 'error',
          confirmButtonColor: 'rgba(35,101,150,0.86)',
        });
        // void this.router.navigate(['/error']);
        return false;
      }
    }
    else
    {
    // ukoliko nema privilegija za rutu vracamo error
      console.log("error")
      void this.router.navigate(['/error']);
      return false;

    }

    return true;
  }

  logout() {
    Swal.fire({
      title: 'Log out?',
      text: "Do you want to log out?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#8E4585',
      cancelButtonColor: '#4B4B78',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cleanLocalStorage()
        this.router.navigate(['/login'])
      }
    })

  }

  directLogoutUser() {

    this.cleanLocalStorage()
    this.router.navigate(['/login'])

  }

}

