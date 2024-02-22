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

  async setOperator(data: any) {
      this.authServis.setOperatorData(data).then((result: any) => {
        console.log("ja sam iz setOperator", data)
        if (data.userdata.isadmin) {
          this.router.navigate(['/admin'])
        } else {
          this.router.navigate(['/home'])

        }
     }
    )

  }

 login (){
  const loginInfo = JSON.stringify(this.formLogin.value)
  console.log("prije podatake", loginInfo)

  this.apiPoziviServis.login(loginInfo).subscribe((data: any) => {
console.log("povratno:", data)
    if (data.token) {
      console.log("ja sam iz login", data)
      this.authServis.saveToLocalStorage('token', data.token)
      this.authServis.saveToLocalStorage('user', JSON.stringify(data))
      const putanja =  this.setOperator(data)

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
