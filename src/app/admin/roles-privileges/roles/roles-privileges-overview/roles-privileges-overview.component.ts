import {Component, OnInit} from '@angular/core';
import {animate, style, transition, trigger} from "@angular/animations";
import {ApiCallsService} from "../../../../service/api-calls.service";
import {IRoles} from "../../../../interfaces/roles";
import Swal from "sweetalert2";
import {IPrivilegesResponse, IPrivilegesRoles} from "../../../../interfaces/privileges_roles";
import {IUser} from "../../../../interfaces/user";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-roles-privileges-overview',
  templateUrl: './roles-privileges-overview.component.html',
  styleUrls: ['./roles-privileges-overview.component.sass'],
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


export class RolesPrivilegesOverviewComponent implements OnInit{
rolesList: IRoles[] = []
filteredRoleList: IRoles[] = []
selectedRole: IRoles = {} as IRoles
  showInput = false;
  privileges: IPrivilegesResponse[] = []
  changedPrivileges: IPrivilegesRoles[] = []
  search_input = ""

defaultRole: IRoles = {
  id: 0,
  name: "",
  // privileges: []
}

  constructor(
    private apiCalls: ApiCallsService,
    public translate: TranslateService

  ) {}
  cant_edit = true
  ComponentName: boolean = false;


  ngOnInit(): void {
     void this.loadRoles()
     // void this.loadPrivileges(7)
  }

  loadRoles() {
    this.apiCalls.roleList().subscribe((data: IRoles[]) => {
      this.rolesList = data
      this.filteredRoleList = data
      if (this.rolesList.length){
        this.selectedRole = this.rolesList[0]
        this.loadPrivileges(this.selectedRole.id)
      }
      console.log(data)
    })
  }
  changeLanguage(jezik: string) {
    this.translate.use(jezik);

  }


  async addRole() {
  console.log("addRole")
    this.selectedRole = JSON.parse(JSON.stringify(this.defaultRole))
    this.showInput = true
    const {value: roleName} = await Swal.fire({
      title: 'Unos vrste troška',
      input: 'text',
      inputValue: "",
      inputLabel: 'Naziv vrste troška',
      inputPlaceholder: '',
      showCancelButton: true,
      confirmButtonColor: '#894CB2',
      cancelButtonColor: '#',
      confirmButtonText: 'Upis',
      cancelButtonText: 'Nazad na program'
    })
    if (!roleName) {
      return;
    } else {
      const roleData = {id: 0, name: roleName}
      this.apiCalls.addRole(JSON.stringify(roleData)).subscribe(
        (odgovor) => {
          console.log(odgovor)
          if (odgovor.error === true){
            Swal.fire(`Greška kod upisa!`)
            return
          }
          this.loadRoles()
          Swal.fire(`Podatak je upisan!`)
        })
    }
  }

selectRole(role: IRoles) {
    this.selectedRole = role
    this.loadPrivileges(this.selectedRole.id)
}


  private loadPrivileges(role_id: number) {
    this.apiCalls.rolesPrivilagesList(role_id).subscribe((data: IPrivilegesResponse[]) => {
      this.privileges = data as IPrivilegesResponse[];
      // this.filteredPrivilegesList = data
      console.log('data')
      console.log( this.privileges)
      // console.log('data[0]')
      // console.log(data[0])
    })
  }

  savePrivileges() {
  if (!this.changedPrivileges.length){
    Swal.fire(`No privileges are changed!`)
    return
  }
    Swal.fire({
      title: 'Role',
      text: "Do you want to save privileges for this role?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#894CB2',
      cancelButtonColor: '#',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
if (result.isConfirmed) {

  for (let i = 0; i < this.changedPrivileges.length; i++) {

   const data = JSON.parse(JSON.stringify(this.changedPrivileges[i]))
    delete data.privileges_name
    console.log(data)
    void this.apiCalls.updatePrivilege(JSON.stringify(data)).subscribe(
      (odgovor) => {
        console.log(odgovor)
        if (odgovor.error === true) {
          Swal.fire(`Error while saving privileges!`)
          return
        }
        Swal.fire(`Privileges are saved!`)
      })

  }
}

    })


  }

  privilegesChange(event:any, privilege: IPrivilegesRoles) {
  console.log(event.target.checked)
privilege.activity = event.target.checked
    this.changedPrivileges.push(privilege)
  console.log(this.changedPrivileges)
  }

  filterUsers() {
    this.filteredRoleList = this.rolesList.filter((role: IRoles) => {
      return role.name.toLowerCase().includes(this.search_input.toLowerCase())
    })
  }
}
