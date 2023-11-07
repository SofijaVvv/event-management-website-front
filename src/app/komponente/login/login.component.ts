import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {ApiPoziviService} from "../../servis/api-pozivi.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  constructor(
    private fb: FormBuilder,
    private poziviServis: ApiPoziviService,
    private router: Router,

  ) { }
  formaLogin = this.fb.group({
    email: ['', Validators.required],
    lozinka: ['', Validators.required],
    otp: ['']
  });
  uIzradi = false
  logovanje(){

    const podaci = JSON.stringify(this.formaLogin.value)
    this.poziviServis.logovanje2(podaci).subscribe((data: any) => {
        console.log("povratno:", data)
        if (data.token) {
          localStorage.setItem('token', data.token);

          this.router.navigate(['/doma'])
        } else {
          if (data.token ){

            Swal.fire({
              title: "Greška",
              html: "Greška u konekciji sa serverom!",
              icon: "error",
              showConfirmButton: false,
              timer: 2000
            })
          } else {

            Swal.fire({
              title: "Greška",
              html: "Neispravno korisnicko ime, lozinka ili otp",
              icon: "warning",
              showConfirmButton: false,
              timer: 2000
            })
          }
        }})
  }
}
