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

  ngOnInit(): void {
    this.poziviServis.statusTokena().subscribe((data: any) => {
      if (data.status === 0){
        console.log('status 0')
      } else {
        console.log('status 1', data, data.status)
      }
    })
  }
}
