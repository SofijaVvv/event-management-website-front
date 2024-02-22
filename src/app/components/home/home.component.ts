import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {ApiCallsService} from "../../service/api-calls.service";

@Component({
  selector: 'app-doma',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit{


  constructor(
    private authService: AuthService,
    public apiCalls: ApiCallsService
  ) {
  }

  eventCalendarData = [];


  ngOnInit() {

    const date = new Date();
    console.log(date.getMonth(), date.getFullYear());
  this.getCalendar(date.getMonth()+1,date.getFullYear(),1);
  }

  logout() {
    this.authService.logOut();
  }

  getCalendar(month: number, year: number, status:number) {
    this.apiCalls.getCalendar(month, year, status).subscribe (data => {
      console.log(data)
      this.eventCalendarData = data.calendar;
    });
  }

}
