import {Component, OnDestroy, OnInit} from '@angular/core';
import {CostsDetails, EventCostsDetails} from "../../../interfaces/costs";
import {FormControl, isFormControl} from "@angular/forms";
import {ApiCallsService} from "../../../service/api-calls.service";
import {NgxSpinnerService} from "ngx-spinner";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../../../service/auth.service";
import {Router} from "@angular/router";
import {Details} from "../../../interfaces/events";
import * as moment from "moment/moment";
import {firstValueFrom, Subscription} from "rxjs";
import Swal from "sweetalert2";
@Component({
  selector: 'app-expenses-overview',
  templateUrl: './expenses-overview.component.html',
  styleUrls: ['./expenses-overview.component.sass']
})
export class ExpensesOverviewComponent implements OnInit, OnDestroy{

  filteredEventCostList: EventCostsDetails[] = [];
  searchInput = new FormControl('');
  showInput = false;
  // costEventList: EventCostsDetails[] = [];
  selectedExpenses: EventCostsDetails = {} as EventCostsDetails;
  newCost: boolean = false;

  filteredOtherCostList: CostsDetails[] = [];
  costOtherList: CostsDetails[] = [];
  costType = "other";


  filterOptions = [
    {id: 10, name: this.translate.instant('filter.all')},
    {id: 0, name: this.translate.instant('filter.events.active')},
    {id: 1, name: this.translate.instant('filter.costs.inactive')},
  ]

  selectedFilter= new FormControl({id: -1, name: 'All'})

eventExpensesArray: EventCostsDetails[] = [];



  defaultExpenses: EventCostsDetails = {
    id: 0,
    user: {id: -1, name: ""},
    event_id: 0,
    amount: 0,
    type_of_cost: {id: -1, name: ""},
    client: {id: -1, name: ""},
    description: "",
    date: new Date()
  }


  date = new Date();
  langChangeSubscription: Subscription | undefined;
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
    this.langChangeSubscription = this.translate.onLangChange.subscribe((event: { lang: string }) => {
      // Perform actions on language change here
      console.log('Language changed to:', event.lang);
      this.filterOptions = [
        {id: 10, name: this.translate.instant('filter.all')},
        {id: 0, name: this.translate.instant('filter.events.active')},
        {id: 1, name: this.translate.instant('filter.costs.inactive')},
      ]
      this.selectedFilter.patchValue(
        this.filterOptions[0]
      )
    });
  void this.loadEventCosts(this.currentMonth.start, this.currentMonth.end);
    console.log(this.appData, "APP DATA")
  }

  ngOnDestroy(): void {
    // Clean up the subscription when the component is destroyed
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }


  constructor(
    private apiCalls: ApiCallsService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    public authService: AuthService,
    private router: Router
  ) { }

  appData = this.authService.appData;
  filteredCostSearch() {
    this.filteredEventCostList = this.eventExpensesArray;
    const textForSearch = this.searchInput.value || '';
    if (textForSearch){
      this.filteredEventCostList = this.eventExpensesArray.filter(task =>
        task.description.toLowerCase().includes(textForSearch.toLowerCase())
      )
    }
  }

  async loadEventCosts(fromDate:string, toDate:string) {
    this.eventExpensesArray = [];
    this.spinner.show()
    this.apiCalls.getEventCosts(0, fromDate, toDate).subscribe((data: EventCostsDetails[]) => {
      // this.costEventList = data

      // console.log("event costs", this.costEventList)
      this.eventExpensesArray.push(...data);
      this.loadOtherCosts(fromDate, toDate).then(otherdata => {
        this.eventExpensesArray.push(...otherdata)
        console.log("other data", otherdata)
      });
      console.log("eventExpensesArray", this.eventExpensesArray)
      this.filteredEventCostList = this.eventExpensesArray


      this.spinner.hide()
    })

  }


  loadOtherCosts(fromDate:string, toDate:string): Promise<EventCostsDetails[]> {
    return firstValueFrom(this.apiCalls.getOtherCosts( fromDate, toDate));
  }







  editCost(event: EventCostsDetails) {
    console.log(this.appData, "APP DATA EDIT")
    if (!this.appData.can_edit){
      Swal.fire({
        icon: 'error',
        title: 'Access denied',
        text: 'You do not have permission to edit expenses!',
      })
      return;
    }
    this.newCost = false;
    if (event.event_id){
      this.router.navigate(['/events/input', event.event_id]).then(r => console.log('ok - vracam se doma'));
    } else {
      console.log(event, "edit cost")
    this.selectedExpenses = event;
    this.showInput = true;
    }

  }

  closeExpenses(event : EventCostsDetails){
    console.log(event, "event povratni")
    if (event.id < 0){
      this.showInput = false;
      return;
    }
    this.loadEventCosts(this.currentMonth.start, this.currentMonth.end);
    // if (this.newCost){
    //   this.eventExpensesArray.push(event)
    //   // sort costList by id
    //   this.eventExpensesArray.sort((a, b) => a.id - b.id);
    // } else {
    //   console.log(event, "povracaj update event")
    //   this.eventExpensesArray.findIndex((cost, index) => {
    //     if (cost.id === event.id){
    //       this.eventExpensesArray[index] = event;
    //       console.log("izmjena", this.eventExpensesArray[index])
    //     }
    //   })
    // }
    this.showInput = false;
  }

  addCost() {
    console.log("addCost")
    this.newCost = true;
    this.selectedExpenses = JSON.parse(JSON.stringify(this.defaultExpenses));

    this.showInput = true;
  }

  filterCosts() {
    this.filteredEventCostList = this.eventExpensesArray;
    const filter:Details = this.selectedFilter.value!;
    if (filter.id === 1){
      this.filteredEventCostList = this.eventExpensesArray.filter(cost => cost.event_id === null);
    } else if (filter.id === 0){
      this.filteredEventCostList = this.eventExpensesArray.filter(cost => cost.event_id != null);
    } else {
      this.filteredEventCostList = this.eventExpensesArray;
    }
  }
  loadWeekEvents() {
    this.selectedPeriod.start = moment(this.currentWeek.start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(this.currentWeek.end).format("DD.MM.YYYY");

    this.loadEventCosts(this.currentWeek.start, this.currentWeek.end);
  }

  loadMonthEvents() {
    this.selectedPeriod.start = moment(this.currentMonth.start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(this.currentMonth.end).format("DD.MM.YYYY");
    this.loadEventCosts(this.currentMonth.start, this.currentMonth.end);
  }

  loadLast14DaysEvents() {
    this.selectedPeriod.start = moment(this.last14Days.start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(this.last14Days.end).format("DD.MM.YYYY");
    this.loadEventCosts(this.last14Days.start, this.last14Days.end);
  }

  loadSelectedMonthEvents(month: number) {
    const start = moment().month(month).startOf('month').format('YYYY-MM-DD');
    const end = moment().month(month).endOf('month').format('YYYY-MM-DD');
    this.selectedPeriod.start = moment(start).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(end).format("DD.MM.YYYY");
    console.log(start, end, "start, end")
    this.loadEventCosts(start, end);
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
