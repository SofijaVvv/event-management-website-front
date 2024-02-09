import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IRoles} from "../../../../interfaces/roles";
import {IPrivilegesRoles} from "../../../../interfaces/privileges_roles";

@Component({
  selector: 'app-roles-privileges-input',
  templateUrl: './roles-privileges-input.component.html',
  styleUrls: ['./roles-privileges-input.component.sass']
})
export class RolesPrivilegesInputComponent {
@Output() closeInput = new EventEmitter<boolean>();
@Input() privilegesForInput:IPrivilegesRoles = {} as IPrivilegesRoles









}
