import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, finalize, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiPoziviService {

  constructor(
    private http: HttpClient
  ) { }
  API_SERVIS_LOGOVANJE = 'http://192.168.31.55:9000'
  headers = new HttpHeaders({'Content-Type':'application/json; charset=utf-8'});

  statusTokena() : Observable<any>{
    return this.http.get<string>('http://localhost:9000/users/me')
      .pipe(catchError((e: any): Observable<any> => {
        return of(e);
      }),
        finalize(() => {
      }));
  }

  logovanje2( payload : string) : Observable<any>{
    let podaciForme = JSON.parse(payload)
    const formData = new FormData();
    formData.append('username', podaciForme.email);
    formData.append('password', podaciForme.lozinka);
    formData.append('client_secret', podaciForme.otp);
    return this.http.post(this.API_SERVIS_LOGOVANJE + '/token', formData)
      .pipe(catchError((e: any): Observable<any> => {
        return of(e);
      }), finalize(() => {
      }));
  }
}
