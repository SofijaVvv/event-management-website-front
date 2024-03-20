import { Component, OnDestroy, OnInit } from '@angular/core';
import { CostsDetails, EventCostsDetails } from '../../../interfaces/costs';
import { FormControl, isFormControl } from '@angular/forms';
import { ApiCallsService } from '../../../service/api-calls.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../service/auth.service';
import { Router } from '@angular/router';
import { Details } from '../../../interfaces/events';
import * as moment from 'moment/moment';
import { firstValueFrom, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-expenses-overview',
  templateUrl: './expenses-overview.component.html',
  styleUrls: ['./expenses-overview.component.sass'],
})
export class ExpensesOverviewComponent implements OnInit, OnDestroy {
  filteredEventCostList: EventCostsDetails[] = [];
  searchInput = new FormControl('');
  showInput = false;
  selectedExpenses: EventCostsDetails = {} as EventCostsDetails;
  newCost: boolean = false;
  costType = 'other';
  appData = this.authService.appData;

  filterOptions = [
    { id: 10, name: this.translate.instant('filter.all') },
    { id: 0, name: this.translate.instant('filter.events.active') },
    { id: 1, name: this.translate.instant('filter.costs.inactive') },
  ];

  selectedFilter = new FormControl({ id: -1, name: 'All' });
  eventExpensesArray: EventCostsDetails[] = [];

  defaultExpenses: EventCostsDetails = {
    id: 0,
    user: { id: -1, name: '' },
    event_id: 0,
    amount: 0,
    type_of_cost: { id: -1, name: '' },
    client: { id: -1, name: '' },
    description: '',
    date: new Date(),
  };
  date = new Date();
  langChangeSubscription: Subscription | undefined;
  monthList = this.apiCalls.translateMonths[this.translate.currentLang || 'en'];

  currentWeek = {
    start: moment().startOf('week').format('YYYY-MM-DD'),
    end: moment().endOf('week').format('YYYY-MM-DD'),
  };

  currentMonth = {
    start: moment().startOf('month').format('YYYY-MM-DD'),
    end: moment().endOf('month').format('YYYY-MM-DD'),
  };

  last14Days = {
    start: moment().subtract(14, 'days').format('YYYY-MM-DD'),
    end: moment().format('YYYY-MM-DD'),
  };

  selectedPeriod = {
    start: moment(this.currentMonth.start).format('DD.MM.YYYY'),
    end: moment(this.currentMonth.end).format('DD.MM.YYYY'),
  };

  ngOnInit(): void {
    this.langChangeSubscription = this.translate.onLangChange.subscribe(
      (event: { lang: string }) => {
        this.filterOptions = [
          { id: 10, name: this.translate.instant('filter.all') },
          { id: 0, name: this.translate.instant('filter.events.active') },
          { id: 1, name: this.translate.instant('filter.costs.inactive') },
        ];
        this.selectedFilter.patchValue(this.filterOptions[0]);
      },
    );
    let savedPeriod = this.authService.readLocalStorage('period');
    let startPeriod = {
      start: this.currentMonth.start,
      end: this.currentMonth.end,
    };
    if (savedPeriod !== undefined) {
      startPeriod = JSON.parse(savedPeriod || '');
      this.selectedPeriod.start = moment(startPeriod.start).format(
        'DD.MM.YYYY',
      );
      this.selectedPeriod.end = moment(startPeriod.end).format('DD.MM.YYYY');
    } else {
      this.selectedPeriod.start = moment(this.currentMonth.start).format(
        'DD.MM.YYYY',
      );
      this.selectedPeriod.end = moment(this.currentMonth.end).format(
        'DD.MM.YYYY',
      );
    }
    void this.loadEventCosts(startPeriod.start, startPeriod.end);
  }

  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  constructor(
    private apiCalls: ApiCallsService,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    public authService: AuthService,
    private router: Router,
  ) {}

  filteredCostSearch() {
    this.filteredEventCostList = this.eventExpensesArray;
    const textForSearch = this.searchInput.value || '';
    if (textForSearch) {
      this.filteredEventCostList = this.eventExpensesArray.filter((task) =>
        task.description.toLowerCase().includes(textForSearch.toLowerCase()),
      );
    }
  }

  async loadEventCosts(fromDate: string, toDate: string) {
    this.eventExpensesArray = [];
    this.spinner.show();
    this.apiCalls
      .getEventCosts(0, fromDate, toDate)
      .subscribe((data: EventCostsDetails[]) => {
        this.eventExpensesArray.push(...data);
        this.loadOtherCosts(fromDate, toDate).then((otherdata) => {
          this.eventExpensesArray.push(...otherdata);
        });
        this.filteredEventCostList = this.eventExpensesArray;
        this.spinner.hide();
      });
    this.authService.saveToLocalStorage(
      'period',
      JSON.stringify({ start: fromDate, end: toDate }),
    );
  }

  loadOtherCosts(
    fromDate: string,
    toDate: string,
  ): Promise<EventCostsDetails[]> {
    return firstValueFrom(this.apiCalls.getOtherCosts(fromDate, toDate));
  }

  editCost(event: EventCostsDetails) {
    if (!this.appData.can_edit) {
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('accessdenied'),
        text: this.translate.instant('youhavenopermission'),
      });
      return;
    }
    this.newCost = false;
    if (event.event_id) {
      this.router
        .navigate(['/events/input', event.event_id])
        .then((r) => console.log('ok - vracam se doma'));
    } else {
      this.selectedExpenses = event;
      this.showInput = true;
    }
  }

  closeExpenses(event: EventCostsDetails) {
    if (event.id < 0) {
      this.showInput = false;
      return;
    }
    this.loadEventCosts(this.currentMonth.start, this.currentMonth.end);
    this.showInput = false;
  }

  addCost() {
    this.newCost = true;
    this.selectedExpenses = JSON.parse(JSON.stringify(this.defaultExpenses));
    this.showInput = true;
  }

  filterCosts() {
    this.filteredEventCostList = this.eventExpensesArray;
    const filter: Details = this.selectedFilter.value!;
    if (filter.id === 1) {
      this.filteredEventCostList = this.eventExpensesArray.filter(
        (cost) => cost.event_id === null,
      );
    } else if (filter.id === 0) {
      this.filteredEventCostList = this.eventExpensesArray.filter(
        (cost) => cost.event_id != null,
      );
    } else {
      this.filteredEventCostList = this.eventExpensesArray;
    }
  }

  loadWeekEvents() {
    this.selectedPeriod.start = moment(this.currentWeek.start).format(
      'DD.MM.YYYY',
    );
    this.selectedPeriod.end = moment(this.currentWeek.end).format('DD.MM.YYYY');
    this.loadEventCosts(this.currentWeek.start, this.currentWeek.end);
  }

  loadMonthEvents() {
    this.selectedPeriod.start = moment(this.currentMonth.start).format(
      'DD.MM.YYYY',
    );
    this.selectedPeriod.end = moment(this.currentMonth.end).format(
      'DD.MM.YYYY',
    );
    this.loadEventCosts(this.currentMonth.start, this.currentMonth.end);
  }

  loadLast14DaysEvents() {
    this.selectedPeriod.start = moment(this.last14Days.start).format(
      'DD.MM.YYYY',
    );
    this.selectedPeriod.end = moment(this.last14Days.end).format('DD.MM.YYYY');
    this.loadEventCosts(this.last14Days.start, this.last14Days.end);
  }

  loadSelectedMonthEvents(month: number) {
    const start = moment().month(month).startOf('month').format('YYYY-MM-DD');
    const end = moment().month(month).endOf('month').format('YYYY-MM-DD');
    this.selectedPeriod.start = moment(start).format('DD.MM.YYYY');
    this.selectedPeriod.end = moment(end).format('DD.MM.YYYY');
    console.log(start, end, 'start, end');
    this.loadEventCosts(start, end);
  }

  downloadExcel() {
    Swal.fire({
      title: this.translate.instant('download.base'),
      text: this.translate.instant('create'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.translate.instant('accept.yes'),
      cancelButtonText: this.translate.instant('cancel.button'),
    }).then((result: any) => {
      if (result.isConfirmed) {
        const fromDate = moment(this.selectedPeriod.start, 'DD.MM.YYYY').format(
          'YYYY-MM-DD',
        );
        const toDate = moment(this.selectedPeriod.end, 'DD.MM.YYYY').format(
          'YYYY-MM-DD',
        );
        this.apiCalls
          .downloadExcelFile(
            this.appData.application,
            0,
            fromDate,
            toDate,
            'eng',
          )
          .subscribe((data: any) => {
            const blob = new Blob([data], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Events_${fromDate}_${toDate}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);
          });
      }
    });
  }
}
