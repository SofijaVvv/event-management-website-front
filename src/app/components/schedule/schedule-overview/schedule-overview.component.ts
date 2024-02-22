import {Component, OnInit} from '@angular/core';
import {ScheduleDetails} from "../../../interfaces/schedule";
import {ApiCallsService} from "../../../service/api-calls.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import {AssignmentsDetails} from "../../../interfaces/assignments";
import {scheduled} from "rxjs";

@Component({
  selector: 'app-schedule-overview',
  templateUrl: './schedule-overview.component.html',
  styleUrls: ['./schedule-overview.component.sass']
})
export class ScheduleOverviewComponent implements OnInit{

  filteredScheduleList: ScheduleDetails[] = [];
  searchInput = new FormControl('')

  constructor(
    public apiCalls: ApiCallsService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.loadSchedules()
  }

  loadSchedules() {
    void this.spinner.show()
    this.apiCalls.getSchedules().subscribe((data: ScheduleDetails[]) => {
      this.filteredScheduleList = data
      console.log(this.filteredScheduleList,"ZZZZZZZZZZZZZZZZZZZ")
      void this.spinner.hide()
    })
  }

  filterEventsByKeyword() {
    this.filteredScheduleList = this.filteredScheduleList.filter(schedule => {
      return schedule.description.toLowerCase().includes(this.searchInput.value!.toLowerCase())
    })
  }

  navigateToEvent(event: ScheduleDetails){
    console.log(event, "event")
    this.router.navigate(['/events/input', event.event_id]).then(r => console.log('ok - vracam se doma'));

  }


}
