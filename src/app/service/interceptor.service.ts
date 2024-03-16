import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import Swal from "sweetalert2";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private authService: AuthService
  ) {}


  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token')
    const req = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });


    return next.handle(req).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          Swal.fire({
            title: 'Greška',
            text: "Sesija je istekla, molimo ulogujte se ponovo server token error!",
            icon: 'error',
            confirmButtonColor: '#8E4585',
            confirmButtonText: 'U redu',
          })
          this.authService.directLogoutUser()
        }
        return throwError(error);
      })
    )
  }
}
