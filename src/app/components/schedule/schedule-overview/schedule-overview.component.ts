import {Component, OnInit} from '@angular/core';
import {ScheduleDetails} from "../../../interfaces/schedule";
import {ApiCallsService} from "../../../service/api-calls.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl} from "@angular/forms";
import * as moment from "moment";
import {AuthService} from "../../../service/auth.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-schedule-overview',
  templateUrl: './schedule-overview.component.html',
  styleUrls: ['./schedule-overview.component.sass']
})
export class ScheduleOverviewComponent implements OnInit{

  filteredScheduleList: ScheduleDetails[] = [];
  searchInput = new FormControl('')
  receivedFromDate = this.activate_route.snapshot.paramMap.get('fromDate') || '';
  receivedToDate = this.activate_route.snapshot.paramMap.get('toDate') || '';
  constructor(
    public apiCalls: ApiCallsService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private authService: AuthService,
    private router: Router,
   private activate_route: ActivatedRoute,
  ) { }

appData = this.authService.appData;

  date = new Date();
  // give data range for current week
  currentWeek = {
    start: moment().startOf('week').format('YYYY-MM-DD'),
    end: moment().endOf('week').format('YYYY-MM-DD')
  }
  currentMonth = {
    start: moment().startOf('month').format('YYYY-MM-DD'),
    end: moment().endOf('month').format('YYYY-MM-DD')
  }
  last14Days = {
    start: moment().subtract(14, 'days').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD')
  }

  selectedPeriod = {
    start: moment(this.currentMonth.start).format("DD.MM.YYYY"),
    end: moment(this.currentMonth.end).format("DD.MM.YYYY")
  }

  monthList = this.apiCalls.translateMonths[this.translate.currentLang || 'en'];


  ngOnInit(): void {
    this.loadSchedules(this.currentMonth.start, this.currentMonth.end)

  }

  async loadSchedules(fromDate: string, toDate: string) {
    void this.spinner.show()
    this.apiCalls.getSchedules(0, fromDate, toDate).subscribe((data: ScheduleDetails[]) => {
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
    if (!this.appData.can_edit){
      Swal.fire({
        icon: 'error',
        title: 'Nemate pravo pristupa',
        text: 'Nemate pravo ispravke rasporeda!',
      })
      return;
    }
    this.router.navigate(['/events/input', event.event_id]).then(r => console.log('ok - vracam se doma'));

  }

  loadWeekEvents() {
    this.selectedPeriod.start = moment(this.currentWeek.start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(this.currentWeek.end).format("DD.MM.YYYY");

    this.loadSchedules(this.currentWeek.start, this.currentWeek.end);
  }

  loadMonthEvents() {
    this.selectedPeriod.start = moment(this.currentMonth.start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(this.currentMonth.end).format("DD.MM.YYYY");
    this.loadSchedules(this.currentMonth.start, this.currentMonth.end);
  }

  loadLast14DaysEvents() {
    this.selectedPeriod.start = moment(this.last14Days.start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(this.last14Days.end).format("DD.MM.YYYY");
    this.loadSchedules(this.last14Days.start, this.last14Days.end);
  }

  loadSelectedMonthEvents(month: number) {
    const start = moment().month(month).startOf('month').format('YYYY-MM-DD');
    const end = moment().month(month).endOf('month').format('YYYY-MM-DD');
    this.selectedPeriod.start = moment(start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(end).format("DD.MM.YYYY");
    console.log(start, end, "start, end")
    this.loadSchedules(start, end);
  }

  downloadExcel() {
    Swal.fire({
      title: 'Odjava',
      text: "Da kreiram Excel izvjestaj??",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Da, kreiraj!',
      cancelButtonText: 'Exit'
    }).then((result: any ) => {
      if (result.isConfirmed) {
        const fromDate = moment(this.selectedPeriod.start, 'DD.MM.YYYY').format('YYYY-MM-DD');
        const toDate = moment(this.selectedPeriod.end, 'DD.MM.YYYY').format('YYYY-MM-DD');
        this.apiCalls.downloadExcelFile(this.appData.application,0, fromDate, toDate, 'eng').subscribe((data: any) => {
          console.log(data, "data")
          const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Events_${fromDate}_${toDate}.xlsx`;
          link.click();
          window.URL.revokeObjectURL(url);

        })

      }
    })



  }

}
