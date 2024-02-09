import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, finalize, Observable, of} from "rxjs";

import Swal from "sweetalert2";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {IUser} from "../interfaces/user";
import {IRoles} from "../interfaces/roles";
import {IPrivilegesRoles} from "../interfaces/privileges_roles";

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  constructor(
    private http: HttpClient,
    private _authServis: AuthService,
    private router: Router,
  ) { }

  API_SERVIS = 'http://192.168.31.96:3000'
  // API_SERVIS = 'http://localhost:3000'
  headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});
  public months = [
    {id: 1, name: 'January'},
    {id: 2, name: 'February'},
    {id: 3, name: 'March'},
    {id: 4, name: 'April'},
    {id: 5, name: 'May'},
    {id: 6, name: 'Jun'},
    {id: 7, name: 'July'},
    {id: 8, name: 'August'},
    {id: 9, name: 'September'},
    {id: 10, name: 'October'},
    {id: 11, name: 'November'},
    {id: 12, name: 'December'}
  ]
  public years = [
    {id: 2023, name: '2023'},
    {id: 2024, name: '2024'},

  ]

    public timelist = [
        {id: 6, name: '06:00'},        {id: 7, name: '07:00'},
        {id: 8, name: '08:00'},        {id: 9, name: '09:00'},
        {id: 10, name: '10:00'},        {id: 11, name: '11:00'},
        {id: 12, name: '12:00'},        {id: 13, name: '13:00'},
        {id: 14, name: '14:00'},        {id: 15, name: '15:00'},
        {id: 16, name: '16:00'},        {id: 17, name: '17:00'},
        {id: 18, name: '18:00'},        {id: 19, name: '19:00'},
        {id: 20, name: '20:00'},        {id: 21, name: '21:00'},
        {id: 22, name: '22:00'},        {id: 23, name: '23:00'},
        {id: 24, name: '00:00'}, ]

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
        this._authServis.cleanLocalStorage()
        this.router.navigate(['/login'])
      }
    })

  }

  directLogoutUser() {
    this._authServis.cleanLocalStorage()
    this.router.navigate(['/login'])
  }

  login(loginInfo:string): Observable<any>{
    const url = this.API_SERVIS + '/login'
    return this.http.post<any>(url,loginInfo,{headers: this.headers})
      .pipe(catchError((e: any): Observable<any> => {
        console.log(e,"error")
          return of(e);
        }),
        finalize(() => {
          console.log("zavrseno logovanje")
        }));
  }

  //////////////////USER/////////////////////

  userList():Observable<any>{
    return this.http.get<IUser>(this.API_SERVIS + '/user/list')

      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));
      }

createUser(userInfo:string): Observable<any>{
    const url = this.API_SERVIS + '/user/create'
  return this.http.post<IUser>(url,userInfo,{headers: this.headers})

    .pipe(catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {
      }));
}

editUser(userInfo:string): Observable<any>{
    const url = this.API_SERVIS + "/user/edit"
  return this.http.post<IUser>(url,userInfo,{headers: this.headers})

    .pipe(catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {
      }));
}

  ////////////////////////////////////////////////


  //////////////////ROLES/////////////////////

  roleList():Observable<any>{
    return this.http.get<IRoles>(this.API_SERVIS + '/roles')
      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));

  }

  addRole(role:string):Observable<any>{
    const url = this.API_SERVIS + "/roles/add"
    return this.http.post<IRoles>(url, role, {headers: this.headers})
      .pipe(catchError((e:any):Observable<any> => {
        return of(e);
      }),
      finalize(() => {

      }))
  }

editRole(role:string):Observable<any>{
    const url = this.API_SERVIS + "/roles/edit"
  return this.http.post<IRoles>(url,role, {headers: this.headers})
    .pipe(catchError((e:any):Observable<any> => {
      return of(e)
    }),
      finalize(() => {

      }))
}

rolesPrivilagesList(roles_id:number):Observable<any>{
    const url = `${this.API_SERVIS}/roles_privileges/${roles_id}`
  console.log(url,"url")
  return this.http.get<any>(url)
    .pipe(catchError((e:any):Observable<any> => {
      return of(e)
    }),
      finalize(() => {

      }))
}

  updatePrivilege(privilege:string):Observable<any>{
    const url = this.API_SERVIS + "/privileges/edit"
    return this.http.post<IRoles>(url,privilege, {headers: this.headers})
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }















}
