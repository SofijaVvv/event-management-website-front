import { Component } from '@angular/core';
import {ApiPoziviService} from "./servis/api-pozivi.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'gland';
  constructor(
    private poziviServis: ApiPoziviService
  ){}


}
