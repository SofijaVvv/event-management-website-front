import {Component, OnChanges, OnDestroy, OnInit, SimpleChange} from '@angular/core';
import {AuthService} from "../../service/auth.service";
import {ApiCallsService} from "../../service/api-calls.service";
import {Details, EventDetails} from "../../interfaces/events";
import {Router} from "@angular/router";
import * as moment from "moment/moment";
import {ScheduleDetails} from "../../interfaces/schedule";
import {AssignmentsDetails} from "../../interfaces/assignments";
import {TranslateService} from "@ngx-translate/core";
import {Decimation} from "chart.js";
import {Subscription} from "rxjs";
@Component({
  selector: 'app-doma',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit, OnDestroy{


upcomingEventsList: EventDetails[] = [];
monthEventList: EventDetails[] = [];


monthTaskList: AssignmentsDetails[] = [];
monthScheduleList: ScheduleDetails[] = [];


  constructor(
    private authService: AuthService,
    private apiCalls: ApiCallsService,
    public translate:   TranslateService,
    private router: Router
  ) {
  }
  langChangeSubscription: Subscription | undefined;
  eventCalendarData = [];
  date = new Date();
  activeMonth: Details = this.apiCalls.months[this.date.getMonth()];
  selectedMonth = this.activeMonth;
  selectedDay = this.date.getDate();
  selectedYear: Details = {id: this.date.getFullYear(), name: this.date.getFullYear().toString()};
  monthNames: Details[] = []
  yearNames: Details[] = this.apiCalls.years;

  // @ts-ignore

  ngOnInit() {

    this.langChangeSubscription = this.translate.onLangChange.subscribe((event: { lang: string }) => {
      // Perform actions on language change here
      console.log('Language changed to:', event.lang);
      this.monthNames = this.apiCalls.translateMonths[event.lang || 'en'];
      this.selectedMonth = this.monthNames[this.selectedMonth.id - 1];
    });
    this.monthNames = this.apiCalls.translateMonths[this.translate.currentLang || 'en'];
    this.selectedMonth = this.monthNames[this.selectedMonth.id - 1];

    console.log(this.translate.currentLang,"curren Language"); //this.authService.readLocalStorage('lang') || 'en');
    const date = new Date();
  this.getCalendar(date.getMonth()+1,date.getFullYear(),1);
    this.getMonthEvents();
    this.getMonthTasks();
    this.getMonthSchedule();
  }
  ngOnDestroy(): void {
    // Clean up the subscription when the component is destroyed
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  logout() {
    this.authService.logOut();
  }

  getCalendar(month: number, year: number, status:number) {
    this.apiCalls.getCalendar(month, year, status).subscribe (data => {
      this.eventCalendarData = data.calendar;
    });
  }

  dateSelect(day: number) {
    if (day) {
      this.selectedDay = day;
      const fromDate = moment().set({
        year: this.selectedYear.id,
        month: this.selectedMonth.id - 1,
        date: day
      }).format('YYYY-MM-DD');
      const toDate = moment().set({
        year: this.selectedYear.id,
        month: this.selectedMonth.id - 1,
        date: day
      }).format('YYYY-MM-DD');
      this.router.navigate(['events/list', fromDate, toDate]);

    }
    // this.selectedDay = day;
  }

  calendarChange(){
    this.selectedDay = 0;
    this.activeMonth = this.selectedMonth;
    this.getCalendar(this.activeMonth.id, this.selectedYear.id, 1);
    this.getMonthEvents();
    this.getMonthTasks();
    this.getMonthSchedule();
  }

  changeMonth(direction: number) {
    if (direction === 1) {
      if (this.activeMonth.id === 12) {
        this.selectedYear.id++;
        this.activeMonth = this.apiCalls.months[0];
      } else {
        this.activeMonth = this.apiCalls.months[this.activeMonth.id];
      }
    } else {
      if (this.activeMonth.id === 1) {
        this.selectedYear.id--;
        this.activeMonth = this.apiCalls.months[11];
      } else {
        this.activeMonth = this.apiCalls.months[this.activeMonth.id - 2];
      }
    }
    this.selectedMonth = this.activeMonth;
    this.getCalendar(this.activeMonth.id, this.selectedYear.id, 1);
    this.getMonthEvents();
    this.getMonthTasks();
    this.getMonthSchedule();


  }

getMonthEvents(){
  const start = moment().month(this.activeMonth.id -1).startOf('month').format('YYYY-MM-DD');
  const end = moment().month(this.activeMonth.id -1).endOf('month').format('YYYY-MM-DD');
  this.apiCalls.getEventListById(0, start, end).subscribe((data: EventDetails[]) => {
    this.monthEventList = data;
  }
  );
}

getMonthTasks() {
  const start = moment().month(this.activeMonth.id -1).startOf('month').format('YYYY-MM-DD');
  const end = moment().month(this.activeMonth.id -1).endOf('month').format('YYYY-MM-DD');
  this.apiCalls.getAssignments(0, start, end).subscribe((data: AssignmentsDetails[]) => {
   this.monthTaskList = data
  })
}

getMonthSchedule(){
  const start = moment().month(this.activeMonth.id -1).startOf('month').format('YYYY-MM-DD');
  const end = moment().month(this.activeMonth.id -1).endOf('month').format('YYYY-MM-DD');
  this.apiCalls.getSchedules(0, start, end).subscribe((data: ScheduleDetails[]) => {
    this.monthScheduleList = data
  })
}


}
