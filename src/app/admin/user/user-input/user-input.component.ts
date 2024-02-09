import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {IUser} from "../../../interfaces/user";
import {ApiCallsService} from "../../../service/api-calls.service";
import {FormBuilder, Validators} from "@angular/forms";
import {IRoles} from "../../../interfaces/roles";
import Swal from "sweetalert2";
import {NgxSpinnerService} from "ngx-spinner";

interface ngOnChanges {
}

@Component({
  selector: 'app-user-input',
  templateUrl: './user-input.component.html',
  styleUrls: ['./user-input.component.sass']
})
export class UserInputComponent implements ngOnChanges{
  @Output() closeInput =   new EventEmitter<boolean>();
  @Input() userForInput: IUser   = {} as IUser

  constructor(
    private spinner: NgxSpinnerService,
    private serviceCalls: ApiCallsService,
    private fb: FormBuilder,

  ) { }



  ngOnChanges(changes: SimpleChanges) {
    if (changes['userForInput']) {
      console.log(this.userForInput);
      this.loadRoleList()
    }
  }
  // ngOnInit(): void {
  //   this.loadRoleList()
  //   console.log(this.userForInput, "userForInput")
  //
  //
  //
  // }


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




  closeUserInput() {
    this.closeInput.emit(false)
  }



  onSubmit() {
  console.log(this.userForm.value)
    Swal.fire({
      title: 'Upis komitenta',
      text: "Da upišem komitenta?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#894CB2',
      cancelButtonColor: '#',
      confirmButtonText: 'Da,upiši!',
      cancelButtonText: 'Nazad na program'
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
                  title: 'Greška',
                  text: odgovor.message,
                  icon: 'error',
                  showCancelButton: false,
                  confirmButtonColor: '#894CB2',
                  cancelButtonColor: '#',
                  confirmButtonText: 'Nazad na program',
                })
              } else {
                this.closeInput.emit(true)
                Swal.fire({
                  title: 'Uspešno',
                  text: odgovor.message,
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#894CB2',
                  cancelButtonColor: '#',
                  confirmButtonText: 'Nazad na program',
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
                  title: 'Greška',
                  text: odgovor.message,
                  icon: 'error',
                  showCancelButton: false,
                  confirmButtonColor: '#894CB2',
                  cancelButtonColor: '#',
                  confirmButtonText: 'Nazad na program',
                })
              } else {
                this.closeInput.emit(true)
                Swal.fire({
                  title: 'Uspešno',
                  text: odgovor.message,
                  icon: 'success',
                  showCancelButton: false,
                  confirmButtonColor: '#894CB2',
                  cancelButtonColor: '#',
                  confirmButtonText: 'Nazad na program',
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
}
