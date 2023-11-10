import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import Swal from "sweetalert2";
import {ApiPoziviService} from "./api-pozivi.service";

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor(
    private poziviServis: ApiPoziviService
  ) { }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    // return next.handle(req)
    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          Swal.fire({
            title: 'Greška',
            text: "Sesija je istekla, molimo ulogujte se ponovo!",
            icon: 'error',
            confirmButtonColor: '#8E4585',
            confirmButtonText: 'U redu',
          })
          this.poziviServis.direktnaOdjavaOperatera()
        }
        return throwError(error);
      })
    )
  }
}
