import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ApiCallsService} from "../../service/api-calls.service";
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import Swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements AfterViewInit {
@ViewChild('password') password!: ElementRef ;

constructor
(
  private fb: FormBuilder,
  private apiPoziviServis: ApiCallsService,
  private router: Router,
  private authServis: AuthService,
  public translate: TranslateService
) {}

  formLogin = this.fb.group({
  email: [''],
  password: [''],
    orm: ['']
});

ngAfterViewInit() {
  this.password.nativeElement.focus();
}

  onEmailEnter() {
    this.password.nativeElement.focus();
  }

login(){
  const loginInfo = JSON.stringify(this.formLogin.value)
  console.log("prije podatake", loginInfo)

  this.apiPoziviServis.login(loginInfo).subscribe((data: any) => {
console.log("povratno:", data)
    if (data.token) {
      this.authServis.upisLokalniStoridz('token', data.token)
      this.router.navigate(['/admin']).then(r => console.log(r))
    } else {
      void Swal.fire({
          title: this.translate.instant('error'),
          html: this.translate.instant('login.error'),
          icon: "warning",
          showConfirmButton: false,
          timer: 2000
        })
    }



  })
}




  onKeyUp() {
      this.login();
  }

changeLanguage(jezik: string) {
  this.translate.use(jezik);

}

}
