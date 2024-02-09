import {Component, OnInit} from '@angular/core';
import {IUser} from "../../../interfaces/user";
import {ApiCallsService} from "../../../service/api-calls.service";
import {animate, style, transition, trigger} from "@angular/animations";
import {NgxSpinnerService} from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-pregled-korisnika',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.sass'],
  animations: [
    trigger('input', [
      transition(':enter', [
        style({transform: 'translateY(100%)'}),
        animate('300ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({transform: 'translateY(100%)'}))
      ])
    ])
  ]
})
export class UserOverviewComponent implements OnInit{
userList: IUser[] = []
fileteredUserList: IUser[] = []
  selectedUser: IUser = {} as IUser
  showInput = false;
  defaultUser: IUser = {
    id: 0,
    roles_combo: {id: -1, name: ""},
    email: "",
    key: "",
    activity: false,
    name: "",
    telephone: "",
    roles_id: 0,
    company_id: 1
  }
  search_input = ""
  constructor(
    private apiCalls: ApiCallsService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    void this.loadUsers()
  }

  async loadUsers() {
    void this.spinner.show()
    console.log("loadUsers")
   this.apiCalls.userList().subscribe((data: IUser[]) => {
          this.userList = data
          this.fileteredUserList = data
     if (this.userList.length > 0){
       this.selectedUser = this.userList[0]
       this.showInput = true;
     }
          this.spinner.hide()
      console.log(data)
    })
    this.fileteredUserList = this.userList
  }

  newUser() {
    console.log("noviOperater")
    this.selectedUser = JSON.parse(JSON.stringify(this.defaultUser))
  }
getListOfUsers() {
    this.apiCalls.userList().subscribe((data: IUser[]) => {
      this.userList = data
      this.fileteredUserList = data

      console.log(data)
    })
    this.fileteredUserList = this.userList
  }


closeUserInput(event:any) {
    if (event === true){
      this.getListOfUsers()
    }
    this.showInput = false;
}

editUser(user: IUser) {
    // this.selectedUser = JSON.parse(JSON.stringify(user))
    this.selectedUser = user
    // this.showInput = true;
  }

  changeLanguage(jezik: string) {
    this.translate.use(jezik);

  }



  filterUsers() {
    this.fileteredUserList = this.userList.filter((user: IUser) => {
      return user.name.toLowerCase().includes(this.search_input.toLowerCase()) || user.email.toLowerCase().includes(this.search_input.toLowerCase())
    })
  }

}
