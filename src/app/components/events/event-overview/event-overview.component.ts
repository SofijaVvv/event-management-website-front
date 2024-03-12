import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../service/auth.service";
import {TranslateService} from "@ngx-translate/core";
import {NgxSpinnerService} from "ngx-spinner";
import {ApiCallsService} from "../../../service/api-calls.service";
import {EventDetails} from "../../../interfaces/events";
import {animate, style, transition, trigger} from "@angular/animations";
import {AssignmentsDetails} from "../../../interfaces/assignments";
import {FormControl} from "@angular/forms";
import * as moment from "moment/moment";
import Swal from "sweetalert2";




@Component({
  selector: 'app-event-overview',
  templateUrl: './event-overview.component.html',
  styleUrls: ['./event-overview.component.sass'],
  animations: [
    trigger('enter', [
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
export class EventOverviewComponent implements OnInit{

  receivedFromDate = this.activate_route.snapshot.paramMap.get('fromDate') || '';
  receivedToDate = this.activate_route.snapshot.paramMap.get('toDate') || '';

eventList: EventDetails[] = []
filteredEventlist: EventDetails[] = []
  selectedEvent: EventDetails = {} as EventDetails;
searchInput = new FormControl('')
filterDate = new FormControl('')


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
  showEvents = true;
  showInput = true;

  constructor(
    private activate_route: ActivatedRoute,
    private apiCalls: ApiCallsService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    public authService: AuthService,
    private router: Router
  ) { }

  appData = this.authService.appData;

ngOnInit(): void {
  console.log("receivedFromDate", this.receivedFromDate, "receivedToDate", this.receivedToDate)
  if (this.receivedFromDate !== 'x' && this.receivedToDate !== 'x'){
    this.selectedPeriod.start = moment(this.receivedFromDate).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(this.receivedToDate).format("DD.MM.YYYY");
    void this.loadEvents(this.receivedFromDate, this.receivedToDate)
  } else {
    this.selectedPeriod.start = moment(this.currentMonth.start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(this.currentMonth.end).format("DD.MM.YYYY");
    void this.loadEvents(this.currentMonth.start, this.currentMonth.end)

  }
}

  async loadEvents(fromDate: string, toDate: string) {
    void this.spinner.show()
    console.log("loadUsers")
    this.apiCalls.getEventListById(0,fromDate, toDate).subscribe((data: EventDetails[]) => {
      this.eventList = data
      this.filteredEventlist = data
      if (this.eventList.length > 0){
        this.selectedEvent = this.eventList[0]
        this.showInput = true;
      }
      this.spinner.hide()
      console.log(data)
    })
    this.filteredEventlist = this.eventList
  }

  onClickEvent(event: EventDetails){
    this.selectedEvent = event
    console.log(event)
    this.router.navigate(['/events/input', event.id]).then(r => console.log('ok - vracam se doma'));
  }

  addEvent(){
this.router.navigate(['/events/input', 0]).then(r => console.log('ok - vracam se doma'));

  }


  filterEventSearch() {
    this.filteredEventlist = this.eventList;
    const textForSearch = this.searchInput.value || '';
    if (textForSearch){
      this.filteredEventlist = this.eventList.filter(task =>
        task.client.name.toLowerCase().includes(textForSearch.toLowerCase())
      )
    }
  }

  filterEventDate() {
    this.filteredEventlist = this.eventList;
    const dateForDearch = this.filterDate.value || '';
    if (dateForDearch){
      this.filteredEventlist = this.eventList.filter(event =>
       event.date.getDay().toString().includes(dateForDearch) ||
        event.date.getMonth().toString().includes(dateForDearch) ||
        event.date.getFullYear().toString().includes(dateForDearch)
      )
    }
  }

  loadWeekEvents() {
    this.selectedPeriod.start = moment(this.currentWeek.start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(this.currentWeek.end).format("DD.MM.YYYY");

    this.loadEvents(this.currentWeek.start, this.currentWeek.end);
  }

  loadMonthEvents() {
    this.selectedPeriod.start = moment(this.currentMonth.start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(this.currentMonth.end).format("DD.MM.YYYY");
    this.loadEvents(this.currentMonth.start, this.currentMonth.end);
  }

  loadLast14DaysEvents() {
    this.selectedPeriod.start = moment(this.last14Days.start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(this.last14Days.end).format("DD.MM.YYYY");
    this.loadEvents(this.last14Days.start, this.last14Days.end);
  }

  loadSelectedMonthEvents(month: number) {
    const start = moment().month(month).startOf('month').format('YYYY-MM-DD');
    const end = moment().month(month).endOf('month').format('YYYY-MM-DD');
    this.selectedPeriod.start = moment(start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(end).format("DD.MM.YYYY");
    console.log(start, end, "start, end")
    this.loadEvents(start, end);
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
