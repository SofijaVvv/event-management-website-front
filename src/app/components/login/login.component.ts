import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ApiCallsService } from '../../service/api-calls.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements  OnInit {
  @ViewChild('email') email!: ElementRef;
  @ViewChild('otp') otp!: ElementRef;
  @ViewChild('password') password!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private apiPoziviServis: ApiCallsService,
    private router: Router,
    private authServis: AuthService,
    public translate: TranslateService,
  ) {}

  formLogin = this.fb.group({
    email: [''],
    password: [''],
    otp: [''],
  });

  ngOnInit() {
    this.authServis.directLogoutUser();
  }



  onEmailEnter() {
    this.password.nativeElement.focus();
  }

  onPasswordEnter() {
    this.otp.nativeElement.focus();
  }

  async setOperator(data: any) {
    this.authServis.setOperatorData(data).then((result: any) => {
      if (data.userdata.isadmin) {
        this.router.navigate(['/admin']);
      } else {
        const canEvents = this.authServis.operaterData.privileges.find(
          (privilege: any) => privilege.route === 'events',
        );
        if (!canEvents.can_view) {
          this.router.navigate(['/assignments/overview']);
        } else this.router.navigate(['/home']);
      }
    });
  }

  login() {
    const loginInfo = JSON.stringify(this.formLogin.value);
    this.apiPoziviServis.login(loginInfo).subscribe((data: any) => {
      if (data.token) {
        const currentMonth = {
          start: moment().startOf('month').format('YYYY-MM-DD'),
          end: moment().endOf('month').format('YYYY-MM-DD'),
        };
        this.authServis.saveToLocalStorage('active_menu', 'home');
        this.authServis.saveToLocalStorage('period', JSON.stringify(currentMonth));
        this.authServis.saveToLocalStorage('token', data.token);
        this.authServis.saveToLocalStorage('user', JSON.stringify(data));
        void this.setOperator(data);
      } else {
        void Swal.fire({
          title: this.translate.instant('error'),
          html: this.translate.instant('login.error'),
          icon: 'warning',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  }

  onKeyUp() {
    this.login();
  }

  changeLanguage(language: string) {
    localStorage.setItem('lang', language);
    this.translate.use(language);
  }
}
