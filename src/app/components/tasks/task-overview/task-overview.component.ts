import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiCallsService} from "../../../service/api-calls.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../../service/auth.service";
import {Router} from "@angular/router";
import {AssignmentsDetails} from "../../../interfaces/assignments";
import {FormControl} from "@angular/forms";
import * as moment from "moment";
import Swal from "sweetalert2";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-task-overview',
  templateUrl: './task-overview.component.html',
  styleUrls: ['./task-overview.component.sass']
})
export class TaskOverviewComponent implements OnInit , OnDestroy {

  private langChangeSubscription: Subscription | undefined;
  filteredTaskList: AssignmentsDetails[] = []
  taskList: AssignmentsDetails[] = []
  searchInput = new FormControl('')
  appData = this.authServis.appData;
  date = new Date();

  filterOptions = [
    {id: 10, name: this.translate.instant('filter.all')},
    {id: 0, name: this.translate.instant('filter.active')},
    {id: 1, name: this.translate.instant('filter.inactive')},
  ]
  selectedFilter= new FormControl({id: -1, name: 'All'})
  monthList = this.apiCalls.translateMonths[this.translate.currentLang || 'en'];


  constructor(
    private apiCalls: ApiCallsService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private router: Router,
    private authServis: AuthService
  ) {}


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


  ngOnInit(): void {
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event: { lang: string }) => {
      this.filterOptions = [
        {id: 10, name: this.translate.instant('filter.all')},
        {id: 0, name: this.translate.instant('filter.active')},
        {id: 1, name: this.translate.instant('filter.inactive')},
      ]
      this.selectedFilter.patchValue(
        this.filterOptions[0]
      )
    });
   this.loadTasks(this.currentMonth.start, this.currentMonth.end)
  }


  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }


  loadTasks(fromDate: string , toDate: string ) {
    void this.spinner.show()
    this.apiCalls.getAssignments(0, fromDate, toDate).subscribe((data: AssignmentsDetails[]) => {
      this.taskList = data
      this.filteredTaskList = data
      void this.spinner.hide()
    })
  }


  filterEventsByStatus() {
    this.filteredTaskList = this.taskList;
      if (this.selectedFilter.value?.id! < 10 ) {
        this.filteredTaskList = this.taskList.filter(task => task.status === this.selectedFilter.value?.id!)
      }
  }


  filterEventsByKeyword(){
    const textForSearch = this.searchInput.value
    this.filteredTaskList = this.taskList;
    if (textForSearch){
      this.filteredTaskList = this.taskList.filter(task => task.description.toLowerCase().includes(textForSearch.toLowerCase()))
    }
  }


  navigateToEvent(event: AssignmentsDetails){
    if (!this.appData.can_edit){
      Swal.fire({
        icon: 'error',
        title: 'Access denied',
        text: 'You do not have access to edit tasks!',
      });
      return;
  }
    this.router.navigate(['/events/input', event.event_id]).then(r => console.log('ok - vracam se doma'));
  }


  loadWeekEvents() {
    this.selectedPeriod.start = moment(this.currentWeek.start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(this.currentWeek.end).format("DD.MM.YYYY");
    this.loadTasks(this.currentWeek.start, this.currentWeek.end);
  }


  loadMonthEvents() {
    this.selectedPeriod.start = moment(this.currentMonth.start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(this.currentMonth.end).format("DD.MM.YYYY");
    this.loadTasks(this.currentMonth.start, this.currentMonth.end);
  }


  loadLast14DaysEvents() {
    this.selectedPeriod.start = moment(this.last14Days.start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(this.last14Days.end).format("DD.MM.YYYY");
    this.loadTasks(this.last14Days.start, this.last14Days.end);
  }


  loadSelectedMonthEvents(month: number) {
    const start = moment().month(month).startOf('month').format('YYYY-MM-DD');
    const end = moment().month(month).endOf('month').format('YYYY-MM-DD');
    this.selectedPeriod.start = moment(start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(end).format("DD.MM.YYYY");
    this.loadTasks(start, end);
  }


  downloadExcel() {
    Swal.fire({
      title: this.translate.instant('download'),
      text: this.translate.instant('create'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('accept.yes'),
      cancelButtonText: this.translate.instant('cancel.button')
    }).then((result: any ) => {
      if (result.isConfirmed) {
        const fromDate = moment(this.selectedPeriod.start, 'DD.MM.YYYY').format('YYYY-MM-DD');
        const toDate = moment(this.selectedPeriod.end, 'DD.MM.YYYY').format('YYYY-MM-DD');
        this.apiCalls.downloadExcelFile(this.appData.application,0, fromDate, toDate, 'eng').subscribe((data: any) => {
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
