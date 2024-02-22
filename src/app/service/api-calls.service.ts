import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, finalize, Observable, of} from "rxjs";

import Swal from "sweetalert2";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";
import {IUser} from "../interfaces/user";
import {IRoles} from "../interfaces/roles";
import {IPrivilegesRoles} from "../interfaces/privileges_roles";
import {AssignmentsDetails} from "../interfaces/assignments";
import {Details, EventDetails} from "../interfaces/events";
import {ScheduleDetails} from "../interfaces/schedule";
import {RevenuesDetails} from "../interfaces/revenues";
import {CostsDetails} from "../interfaces/costs";
import {IClient} from "../interfaces/client";

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  constructor(
    private http: HttpClient,
    private _authServis: AuthService,
    private router: Router,
  ) { }

  // API_SERVIS = 'http://localhost:3000'
  API_SERVIS = 'http://192.168.31.96:3000'




  isTextNumber(text: string | null | undefined){
    if (text == null){
      return false
    }
    return /^\d+(\.\d+)?$/.test(text);
  }
  isOpenedMainMenu = true
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



  // ADIMIN PART
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
    return this.http.get<IUser>(this.API_SERVIS + '/admin/user/list')

      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));
  }

  createUser(userInfo:string): Observable<any>{
    const url = this.API_SERVIS + '/admin/user/create'
    return this.http.post<IUser>(url,userInfo,{headers: this.headers})

      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));
  }

  editUser(userInfo:string): Observable<any>{
    const url = this.API_SERVIS + "/admin/user/edit"
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
    return this.http.get<IRoles>(this.API_SERVIS + '/admin/roles')
      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));

  }

  addRole(role:string):Observable<any>{
    const url = this.API_SERVIS + "/admin/roles/add"
    return this.http.post<IRoles>(url, role, {headers: this.headers})
      .pipe(catchError((e:any):Observable<any> => {
          return of(e);
        }),
        finalize(() => {

        }))
  }

  editRole(role:string):Observable<any>{
    const url = this.API_SERVIS + "/admin/roles/edit"
    return this.http.post<IRoles>(url,role, {headers: this.headers})
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

  rolesPrivilagesList(roles_id:number):Observable<any>{
    const url = `${this.API_SERVIS}/admin/roles_privileges/${roles_id}`
    console.log(url,"url")
    return this.http.get<any>(url)
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

  updatePrivilege(privilege:string):Observable<any>{
    const url = this.API_SERVIS + "/admin/privileges/edit"
    return this.http.post<IRoles>(url,privilege, {headers: this.headers})
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }


  resetPassword(userEmail:string):Observable<any>{
    const userData = {email: userEmail}
    const url = this.API_SERVIS + "/admin/user/reset"
    return this.http.post<any>(url,userData, {headers: this.headers})
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

  ////////////////////////////////////////////////
  //////////////////SHARED/////////////////////
  getSharedUsers():Observable<any>{
    const url = `${this.API_SERVIS}/shared/users`
    console.log(url,"url")
    return this.http.get<any>(url)
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }
  getSharedLocations():Observable<any>{
    const url = `${this.API_SERVIS}/shared/locations`
    console.log(url,"url")
    return this.http.get<any>(url)
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

  getSharedEventTypes():Observable<any>{
    const url = `${this.API_SERVIS}/shared/event_types`
    console.log(url,"url")
    return this.http.get<any>(url)
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

  getSharedEventStatuses():Observable<any>{
    const url = `${this.API_SERVIS}/shared/event_statuses`
    console.log(url,"url")
    return this.http.get<any>(url)
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

  getSharedClients():Observable<any>{
    const url = `${this.API_SERVIS}/shared/clients`
    console.log(url,"url")
    return this.http.get<any>(url)
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

  getSharedRevenuesTypes():Observable<any>{
    const url = `${this.API_SERVIS}/shared/revenue_types`
    console.log(url,"url")
    return this.http.get<any>(url)
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }


  getUnits():Observable<any>{
    const url = `${this.API_SERVIS}/shared/units`
    console.log(url,"url")
    return this.http.get<any>(url)
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

  ////////////////////////////////////////////////
  //////////////////ASSIGNMENTS/////////////////////
  getAssignments(event_id: number = 0):Observable<any>{
    const url = `${this.API_SERVIS}/assignments/list/${event_id}`
    console.log(url,"url")
    return this.http.get<AssignmentsDetails[]>(url)
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

////////////////////////////////////////////////
  //////////////////SHEDULE/////////////////////
  getSchedules(event_id: number = 0):Observable<any>{
    const url = `${this.API_SERVIS}/schedule/list/${event_id}`
    console.log(url,"url")
    return this.http.get<any>(url)
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

  ////////////////////////////////////////////////
  //////////////////REVENUES/////////////////////
  getRevenues(event_id: number = 0):Observable<any>{
    const url = `${this.API_SERVIS}/revenue/list/${event_id}`
    console.log(url,"url")
    return this.http.get<any>(url)
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }


  ////////////////////////////////////////////////
  //////////////////COSTS/////////////////////
  getCosts(event_id: number = 0):Observable<any>{
    const url = `${this.API_SERVIS}/cost/list/${event_id}`
    console.log(url,"url")
    return this.http.get<any>(url)
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }



  ///////////////////////EVENTS////////////////////////

  getCalendar(month:number, year:number, status:number):Observable<any>{
    const url = `${this.API_SERVIS}/events/calendar/${month}/${year}/${status}`
    console.log(url,"url")
    return this.http.get<any>(url)
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

  eventList(event_id: number = 0):Observable<any>{
    const url = this.API_SERVIS + `/events/list/${event_id}`
    console.log(url,"url")
    return this.http.get<any>(url)
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

  addEvent(podaci: string):Observable<any>{
    const url = this.API_SERVIS + "/events/add"
    return this.http.post<EventDetails>(url,podaci, {headers: this.headers})
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

  addAssignment(podaci: string):Observable<any>{
    const url = this.API_SERVIS + "/assignments/add"
    return this.http.post<AssignmentsDetails>(url,podaci, {headers: this.headers})
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

  addSchedule(podaci: string):Observable<any>{
    const url = this.API_SERVIS + "/schedule/add"
    return this.http.post<ScheduleDetails>(url,podaci, {headers: this.headers})
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }
  addRevenue(podaci: string):Observable<any>{
    const url = this.API_SERVIS + "/revenue/add"
    return this.http.post<RevenuesDetails>(url,podaci, {headers: this.headers})
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

  getPriorities():Observable<any>{
    return this.http.get<Details[]>(this.API_SERVIS + '/assignments/priorities')

      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));
  }

  getCostTypes():Observable<any>{
    return this.http.get<Details[]>(this.API_SERVIS + '/shared/costs_types')
      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));
  }

  getClientTypes():Observable<any>{
    return this.http.get<Details[]>(this.API_SERVIS + '/shared/type_of_client')
      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));
  }



  addCosts(podaci: string):Observable<any>{
    const url = this.API_SERVIS + "/cost/add"
    return this.http.post<CostsDetails>(url,podaci, {headers: this.headers})
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }
  addClient(podaci: string):Observable<any>{
    const url = this.API_SERVIS + "/client/add"
    return this.http.post<IClient>(url,podaci, {headers: this.headers})
      .pipe(catchError((e:any):Observable<any> => {
          return of(e)
        }),
        finalize(() => {

        }))
  }

  getClients(client_id:number = 0):Observable<any>{
    return this.http.get<IClient[]>(this.API_SERVIS + `/client/${client_id}`)
      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));
  }

  getAnalisysData(fromDate:string, toDate:string):Observable<any>{
    return this.http.get<any>(this.API_SERVIS + `/analisys/${fromDate}/${toDate}`)
      .pipe(catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {
        }));
  }


}
