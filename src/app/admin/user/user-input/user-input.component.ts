import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {IUser} from "../../../interfaces/user";
import {ApiCallsService} from "../../../service/api-calls.service";
import {FormBuilder, Validators} from "@angular/forms";
import {IRoles} from "../../../interfaces/roles";
import Swal from "sweetalert2";
import {NgxSpinnerService} from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.sass']
})
export class UserInputComponent implements OnChanges{
  @Output() closeInput =   new EventEmitter<boolean>();
  @Input() userForInput: IUser   = {} as IUser


  constructor(
    private spinner: NgxSpinnerService,
    private serviceCalls: ApiCallsService,
    private fb: FormBuilder,
    private translate: TranslateService,

  ) { }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['userForInput']) {
      console.log(this.userForInput);
      this.loadRoleList()
    }
  }


roleList: IRoles[] = []
companyList: IUser[] = []




  userForm = this.fb.group({
    name: [''],
    email: ['', Validators.required],
    telephone: ['', Validators.required],
    roles_id: [0, Validators.required],
    company_id: [1],
    roles_combo: [{id:-1, name:""}, Validators.required],
    activity: [true],
    id: [0]
  });


loadRoleList() {
  this.serviceCalls.roleList().subscribe((data: IRoles[]) => {
    this.roleList = data

    // if (this.userForInput.id > 0) {
      this.userForm.patchValue(this.userForInput)
      // this.userForm.patchValue({roles_combo: this.getRoleDetails(this.userForInput.roles_id || 0)})
      this.userForm.patchValue({roles_combo: this.getRoleDetails(this.userForInput.roles_id || 0)})
    // }
    console.log(data)
  })
}

loadCompanyList() {
  this.serviceCalls.userList().subscribe((data: IUser[]) => {
    this.companyList = data
    console.log(data)
  })
}

resetPassword() {
  Swal.fire({
    title: this.translate.instant('users.resetpass'),
    text: this.translate.instant('users.passresetquestion'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#894CB2',
    cancelButtonColor: '#4B4B78',
    confirmButtonText: this.translate.instant('users.passresetyes'),
    cancelButtonText: this.translate.instant('users.passresetno')
  }).then((result) => {
    if (result.isConfirmed) {
      void this.spinner.show()
      this.serviceCalls.resetPassword(this.userForInput.email).subscribe(
        (odgovor: any) => {
          console.log(odgovor, 'odgovor')
          void this.spinner.hide()
          if (odgovor.error === true) {
            Swal.fire({
              title: this.translate.instant('error'),
              text: this.translate.instant('reset.passwerror'),
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: '#894CB2',
              cancelButtonColor: '#',
              confirmButtonText: this.translate.instant('back'),
            })
          } else {
            Swal.fire({
              title: this.translate.instant('success'),
              text: this.translate.instant('reset.passwsuccess'),
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#894CB2',
              cancelButtonColor: '#',
              confirmButtonText: this.translate.instant('back'),
            })
          }
        }
      )
    }
  })
}


  closeUserInput() {
    this.closeInput.emit(false)
  }



  onSubmit() {
  console.log(this.userForm.value)
    Swal.fire({
      title: this.translate.instant('users.insertuser'),
      text: this.translate.instant('save.changes'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#894CB2',
      cancelButtonColor: '#',
      confirmButtonText: this.translate.instant('users.insertuseryes'),
      cancelButtonText: this.translate.instant('back')
    }).then((result) => {
      if (result.isConfirmed) {
        void this.spinner.show()
        let user_data = (this.userForm.value)
        user_data.roles_id = user_data.roles_combo?.id || 0
        delete user_data.roles_combo
        if (this.userForInput.id == 0) {
          this.serviceCalls.createUser(JSON.stringify(user_data)).subscribe(
            (odgovor: any) => {
              console.log(odgovor, 'odgovor')
              void this.spinner.hide()
              if (odgovor.error === true) {
                Swal.fire({
                  title: this.translate.instant('error'),
                  text: odgovor.message,
                  icon: 'error',
                  showCancelButton: false,
                  confirmButtonColor: '#894CB2',
                  cancelButtonColor: '#',
                  confirmButtonText: this.translate.instant('back'),
                })
              } else {
                this.closeInput.emit(true)
                Swal.fire({
                  title: this.translate.instant('success'),
                  text: this.translate.instant('users.insertusersuccess'),
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#894CB2',
                  cancelButtonColor: '#',
                  confirmButtonText: this.translate.instant('back'),
                })
              }


            }
          )
        } else {
          delete user_data.email
          this.serviceCalls.editUser(JSON.stringify(user_data)).subscribe(
            (odgovor: any) => {
              console.log(odgovor, 'odgovor')
              void this.spinner.hide()
              if (odgovor.error === true) {
                Swal.fire({
                  title: this.translate.instant('error'),
                  text: this.translate.instant('users.editusererror'),
                  icon: 'error',
                  showCancelButton: false,
                  confirmButtonColor: '#894CB2',
                  cancelButtonColor: '#',
                  confirmButtonText: this.translate.instant('back'),
                })
              } else {
                this.closeInput.emit(true)
                Swal.fire({
                  title: this.translate.instant('success'),
                  text: this.translate.instant('users.editusersuccess'),
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#894CB2',
                  cancelButtonColor: '#',
                  confirmButtonText: this.translate.instant('back'),
                })
              }


            })


        }
      }
    })
  }
  getRoleDetails(id: number) {
    const mujo = this.roleList.find((role: IRoles) => role.id === id)
      console.log(mujo, "mujo")
      return mujo

    }

    goBack() {
      Swal.fire({
        title: this.translate.instant('users.newuser'),
        text: this.translate.instant('users.canceluserinput'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#8E4585',
        cancelButtonColor: '#4B4B78',
        confirmButtonText: this.translate.instant('users.canceluserinputyes'),
        cancelButtonText: this.translate.instant('back')
      }).then((result) => {
        if (result.isConfirmed) {
          this.closeInput.emit(false)
        } else {

          return
        }
      })
    }
}
