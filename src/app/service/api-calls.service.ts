import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { IUser } from '../interfaces/user';
import { IRoles } from '../interfaces/roles';
import { AssignmentsDetails } from '../interfaces/assignments';
import { Details, EventDetails } from '../interfaces/events';
import { ScheduleDetails } from '../interfaces/schedule';
import { RevenuesDetails } from '../interfaces/revenues';
import { CostsDetails, EventCostsDetails } from '../interfaces/costs';
import { IClient } from '../interfaces/client';

@Injectable({
  providedIn: 'root',
})
export class ApiCallsService {
  // API_SERVIS = 'http://192.168.64.12:3000'
  // API_SERVIS = 'http://localhost:3000';
  API_SERVIS = 'http://192.168.64.12:3000';
  isOpenedMainMenu = true;
  headers = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  });

  constructor(private http: HttpClient) {}
activeMainMenu = 'home'
  isTextNumber(text: string | null | undefined) {
    if (text == null) {
      return false;
    }
    return /^\d+(\.\d+)?$/.test(text);
  }

  public months: Details[] = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'Jun' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' },
  ];

  public translateMonths: any = {
    en: [
      { id: 1, name: 'January' },
      { id: 2, name: 'February' },
      { id: 3, name: 'March' },
      { id: 4, name: 'April' },
      { id: 5, name: 'May' },
      { id: 6, name: 'Jun' },
      { id: 7, name: 'July' },
      { id: 8, name: 'August' },
      { id: 9, name: 'September' },
      { id: 10, name: 'October' },
      { id: 11, name: 'November' },
      { id: 12, name: 'December' },
    ],
    bs: [
      { id: 1, name: 'Januar' },
      { id: 2, name: 'Februar' },
      { id: 3, name: 'Mart' },
      { id: 4, name: 'April' },
      { id: 5, name: 'Maj' },
      { id: 6, name: 'Jun' },
      { id: 7, name: 'Jul' },
      { id: 8, name: 'Avgust' },
      { id: 9, name: 'Septembar' },
      { id: 10, name: 'Oktobar' },
      { id: 11, name: 'Novembar' },
      { id: 12, name: 'Decembar' },
    ],
  };

  public years = [
    { id: 2023, name: '2023' },
    { id: 2024, name: '2024' },
    { id: 2025, name: '2025' },
    { id: 2026, name: '2026' },
    { id: 2027, name: '2027' },
  ];

  public timelist = [
    { id: 600, name: '06:00' },
    { id: 615, name: '06:15' },
    { id: 630, name: '06:30' },
    {id: 645, name: '06:45' },
    { id: 700, name: '07:00' },
    { id: 715, name: '07:15' },
    { id: 730, name: '07:30' },
    {id: 745, name: '07:45' },
    { id: 800, name: '08:00' },
    { id: 815, name: '08:15' },
    { id: 830, name: '08:30' },
    {id: 845, name: '08:45' },
    { id: 900, name: '09:00' },
    { id: 915, name: '09:15' },
    { id: 930, name: '09:30' },
    {id: 945, name: '09:45' },
    { id: 1000, name: '10:00' },
    { id: 1015, name: '10:15' },
    { id: 1030, name: '10:30' },
    {id: 1045, name: '10:45' },
    { id: 1100, name: '11:00' },
    { id: 1115, name: '11:15' },
    { id: 1130, name: '11:30' },
    {id: 1145, name: '11:45' },
    { id: 1200, name: '12:00' },
    { id: 1215, name: '12:15' },
    { id: 1230, name: '12:30' },
    {id: 1245, name: '12:45' },
    { id: 1300, name: '13:00' },
    { id: 1315, name: '13:15' },
    { id: 1330, name: '13:30' },
    {id: 1345, name: '13:45' },
    { id: 1400, name: '14:00' },
    { id: 1415, name: '14:15' },
    { id: 1430, name: '14:30' },
    {id: 1445, name: '14:45' },
    { id: 1500, name: '15:00' },
    { id: 1515, name: '15:15' },
    { id: 1530, name: '15:30' },
    {id: 1545, name: '15:45' },
    { id: 1600, name: '16:00' },
    { id: 1615, name: '16:15' },
    { id: 1630, name: '16:30' },
    {id: 1645, name: '16:45' },
    { id: 1700, name: '17:00' },
    { id: 1715, name: '17:15' },
    { id: 1730, name: '17:30' },
    {id: 1745, name: '17:45' },
    { id: 1800, name: '18:00' },
    { id: 1815, name: '18:15' },
    { id: 1830, name: '18:30' },
    {id: 1845, name: '18:45' },
    { id: 1900, name: '19:00' },
    { id: 1915, name: '19:15' },
    { id: 1930, name: '19:30' },
    {id: 1945, name: '19:45' },
    { id: 2000, name: '20:00' },
    { id: 2015, name: '20:15' },
    { id: 2030, name: '20:30' },
    {id: 2045, name: '20:45' },
    { id: 2100, name: '21:00' },
    { id: 2115, name: '21:15' },
    { id: 2130, name: '21:30' },
    {id: 2145, name: '21:45' },
    { id: 2200, name: '22:00' },
    { id: 2215, name: '22:15' },
    { id: 2230, name: '22:30' },
    {id: 2245, name: '22:45' },
    { id: 2300, name: '23:00' },
    { id: 2315, name: '23:15' },
    { id: 2330, name: '23:30' },
    {id: 2345, name: '23:45' },
    { id: 2400, name: '00:00' }
  ];

  login(loginInfo: string): Observable<any> {
    const url = this.API_SERVIS + '/login';
    return this.http.post<any>(url, loginInfo, { headers: this.headers }).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  userList(): Observable<any> {
    return this.http
      .get<IUser>(this.API_SERVIS + '/admin/user/list')

      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  createUser(userInfo: string): Observable<any> {
    const url = this.API_SERVIS + '/admin/user/create';
    return this.http
      .post<IUser>(url, userInfo, { headers: this.headers })

      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  editUser(userInfo: string): Observable<any> {
    const url = this.API_SERVIS + '/admin/user/edit';
    return this.http
      .post<IUser>(url, userInfo, { headers: this.headers })

      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  roleList(): Observable<any> {
    return this.http.get<IRoles>(this.API_SERVIS + '/admin/roles').pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  addRole(role: string): Observable<any> {
    const url = this.API_SERVIS + '/admin/roles/add';
    return this.http.post<IRoles>(url, role, { headers: this.headers }).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  rolesPrivilagesList(roles_id: number): Observable<any> {
    const url = `${this.API_SERVIS}/admin/roles_privileges/${roles_id}`;
    return this.http.get<any>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  updatePrivilege(privilege: string): Observable<any> {
    const url = this.API_SERVIS + '/admin/privileges/edit';
    return this.http
      .post<IRoles>(url, privilege, { headers: this.headers })
      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  resetPassword(userEmail: string): Observable<any> {
    const userData = { email: userEmail };
    const url = this.API_SERVIS + '/admin/user/reset';
    return this.http.post<any>(url, userData, { headers: this.headers }).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getSharedLocations(): Observable<any> {
    const url = `${this.API_SERVIS}/shared/locations`;
    return this.http.get<any>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getSharedEventTypes(): Observable<any> {
    const url = `${this.API_SERVIS}/shared/event_types`;
    return this.http.get<any>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getSharedEventStatuses(): Observable<any> {
    const url = `${this.API_SERVIS}/shared/event_statuses`;
    return this.http.get<any>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getSharedClients(): Observable<any> {
    const url = `${this.API_SERVIS}/shared/clients`;
    return this.http.get<any>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getSharedRevenuesTypes(): Observable<any> {
    const url = `${this.API_SERVIS}/shared/revenue_types`;
    return this.http.get<any>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getUnits(): Observable<any> {
    const url = `${this.API_SERVIS}/shared/units`;
    return this.http.get<any>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getUsers(): Observable<any> {
    const url = `${this.API_SERVIS}/shared/users`;
    return this.http.get<any>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getAssignments(
    event_id = 0,
    fromDate: string,
    toDate: string,
  ): Observable<any> {
    const url = `${this.API_SERVIS}/assignments/list/${event_id}/${fromDate}/${toDate}`;
    return this.http.get<AssignmentsDetails[]>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getAssignmentList(
    event_id = 0,
    fromDate: string,
    toDate: string,
  ): Observable<any> {
    const url = `${this.API_SERVIS}/assignments/list_events/${event_id}/${fromDate}/${toDate}`;
    return this.http.get<AssignmentsDetails[]>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getSchedules(
    event_id = 0,
    fromDate: string,
    toDate: string,
  ): Observable<any> {
    const url = `${this.API_SERVIS}/schedule/list/${event_id}/${fromDate}/${toDate}`;
    return this.http.get<any>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getScheduleList(
    event_id = 0,
    fromDate: string,
    toDate: string,
  ): Observable<any> {
    const url = `${this.API_SERVIS}/schedule/list_events/${event_id}/${fromDate}/${toDate}`;
    return this.http.get<AssignmentsDetails[]>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getRevenues(
    event_id = 0,
    fromDate: string,
    toDate: string,
  ): Observable<any> {
    const url = `${this.API_SERVIS}/revenue/list/${event_id}/${fromDate}/${toDate}`;
    return this.http.get<any>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getEventCosts(
    event_id = 0,
    fromDate: string,
    toDate: string,
  ): Observable<any> {
    const url = `${this.API_SERVIS}/cost/events/${event_id}/${fromDate}/${toDate}`;
    return this.http.get<any>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getOtherCosts(fromDate: string, toDate: string): Observable<any> {
    const url = `${this.API_SERVIS}/cost/other/${fromDate}/${toDate}`;
    return this.http.get<any>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getCalendar(month: number, year: number, status: number): Observable<any> {
    const url = `${this.API_SERVIS}/events/calendar/${month}/${year}/${status}`;
    return this.http.get<any>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getEventListById(
    event_id = 0,
    fromDate: string,
    toDate: string,
  ): Observable<any> {
    const url =
      this.API_SERVIS + `/events/list/${event_id}/${fromDate}/${toDate}`;
    return this.http.get<any>(url).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  addEvent(podaci: string): Observable<any> {
    const url = this.API_SERVIS + '/events/add';
    return this.http
      .post<EventDetails>(url, podaci, { headers: this.headers })
      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  addAssignment(podaci: string): Observable<any> {
    const url = this.API_SERVIS + '/assignments/add';
    return this.http
      .post<AssignmentsDetails>(url, podaci, { headers: this.headers })
      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  addSchedule(podaci: string): Observable<any> {
    const url = this.API_SERVIS + '/schedule/add';
    return this.http
      .post<ScheduleDetails>(url, podaci, { headers: this.headers })
      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  addRevenue(podaci: string): Observable<any> {
    const url = this.API_SERVIS + '/revenue/add';
    return this.http
      .post<RevenuesDetails>(url, podaci, { headers: this.headers })
      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  getPriorities(): Observable<any> {
    return this.http
      .get<Details[]>(this.API_SERVIS + '/assignments/priorities')

      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  getCostTypes(): Observable<any> {
    return this.http
      .get<Details[]>(this.API_SERVIS + '/shared/costs_types')
      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  getClientTypes(): Observable<any> {
    return this.http
      .get<Details[]>(this.API_SERVIS + '/shared/type_of_client')
      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  addOtherCosts(podaci: string): Observable<any> {
    const url = this.API_SERVIS + '/cost/other/add';
    return this.http
      .post<CostsDetails>(url, podaci, { headers: this.headers })
      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  addEventCosts(podaci: string): Observable<any> {
    const url = this.API_SERVIS + '/cost/events/add';
    return this.http
      .post<CostsDetails>(url, podaci, { headers: this.headers })
      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  addClient(podaci: string): Observable<any> {
    const url = this.API_SERVIS + '/client/add';
    return this.http.post<IClient>(url, podaci, { headers: this.headers }).pipe(
      catchError((e: any): Observable<any> => {
        return of(e);
      }),
      finalize(() => {}),
    );
  }

  getClients(client_id = 0): Observable<any> {
    return this.http
      .get<IClient[]>(this.API_SERVIS + `/client/${client_id}`)
      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  getAnalisysData(fromDate: string, toDate: string): Observable<any> {
    return this.http
      .get<any>(this.API_SERVIS + `/analisys/${fromDate}/${toDate}`)
      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  getAnalisysDataTotals(fromDate: string, toDate: string): Observable<any> {
    return this.http
      .get<any>(this.API_SERVIS + `/analisys/total/${fromDate}/${toDate}`)
      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  getAnalisysRevenueData(fromDate: string, toDate: string): Observable<any> {
    return this.http
      .get<any>(
        this.API_SERVIS + `/analisys/revenues/total/${fromDate}/${toDate}`,
      )
      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }

  downloadExcelFile(
    app: string,
    event_id = 0,
    fromDate: string,
    toDate: string,
    language: string,
  ): Observable<Blob> {
    const url =
      this.API_SERVIS +
      `/${app}/excel/${event_id}/${fromDate}/${toDate}/${language}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  sharedUpdate(podaci: string): Observable<any> {
    const url = this.API_SERVIS + '/shared/update';
    return this.http
      .post<AssignmentsDetails>(url, podaci, { headers: this.headers })
      .pipe(
        catchError((e: any): Observable<any> => {
          return of(e);
        }),
        finalize(() => {}),
      );
  }
}
