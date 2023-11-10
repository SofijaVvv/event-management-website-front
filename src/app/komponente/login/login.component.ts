import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import Swal from "sweetalert2";
import {ApiPoziviService} from "../../servis/api-pozivi.service";
import {Router} from "@angular/router";
import {AuthService} from "../../servis/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit{
  constructor(
    private fb: FormBuilder,
    private poziviServis: ApiPoziviService,
    private router: Router,
    private _authServis: AuthService

  ) { }
  formaLogin = this.fb.group({
    email: ['', Validators.required],
    lozinka: ['', Validators.required],
    otp: ['']
  });
  uIzradi = false

  ngOnInit(): void {
    // this._authServis.ocistiLokalniStoridz()
  }


  logovanje(){

    const podaci = JSON.stringify(this.formaLogin.value)
    this.poziviServis.logovanje2(podaci).subscribe((data: any) => {
        console.log("povratno:", data)
        if (data.token) {
          localStorage.setItem('token', data.token);

          this.router.navigate(['/doma']).then(r => console.log(r))
        } else {
          if (data.token ){

            void Swal.fire({
              title: "Greška",
              html: "Greška u konekciji sa serverom!",
              icon: "error",
              showConfirmButton: false,
              timer: 2000
            })
          } else {

            void Swal.fire({
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
