import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ChartConfiguration, ChartData, ChartType} from "chart.js";
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {ApiCallsService} from "../../service/api-calls.service";
import {BaseChartDirective} from "ng2-charts";
import * as moment from "moment";
import {EventDetails} from "../../interfaces/events";
import {CostsDetails, EventCostsDetails} from "../../interfaces/costs";
import {RevenuesAnalisysDetails} from "../../interfaces/revenues";
import {TranslateService} from "@ngx-translate/core";
import {Subscription} from "rxjs";
@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.sass']
})
export class AnalysisComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  analysisData: any = [];
tabEventData: EventDetails[] = [];
tabCostData: CostsDetails[] = [];
tabEventCostData: EventCostsDetails[] = [];
tabRevenueData: RevenuesAnalisysDetails[] = [];
  activeTab = 0;
  monthList = this.apiCalls.translateMonths[this.translate.currentLang || 'en'];


  constructor(
    public translate: TranslateService,
    public apiCalls: ApiCallsService,

  ) {
  }
  ngOnDestroy(): void {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

finalAnalisysData = {
    revenuePerPerticipant: 0,
    costPerPerticipant: 0,
    revenuePerEvent: 0,
    costPerEvent: 0,
  participantsPerEvent: 0,
}

  private langChangeSubscription: Subscription | undefined;
  analisysDataTotals = {
    number_of_events : 0,
    number_of_participants : 0,
    total_revenue : 0,
    total_events_cost : 0,
    total_cost : 0,
  };

  date = new Date();
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
    start: moment(this.currentWeek.start).format("DD.MM.YYYY"),
    end: moment(this.currentWeek.end).format("DD.MM.YYYY")
  }
  ngOnInit(): void {
    this.getAnalysisData(this.currentWeek.start, this.currentWeek.end);
    this.analyseWeekTotals();

    this.loadTabData( this.currentWeek.start, this.currentWeek.end);

    this.langChangeSubscription = this.translate.onLangChange.subscribe((event: { lang: string }) => {
      this.chart!.options!.plugins!.title!.text = this.translate.instant('event.diagram');
      this.chart!.options = this.barChartOptions;
      this.chart!.update();
      this.chart!.render();
    });
  }


  public barChartOptions: ChartConfiguration['options'] = {
    aspectRatio: 2,

    scales: {
      x: {},
      y: {}
    },
    plugins: {
      title:{
        display: true,
        text: 'Event Revenues and Expenses'
      },
      legend: {
        display: true,
        position: 'bottom',
      },
      datalabels: {
        anchor: 'center',
        align: 'end',
        color: 'black',
        formatter: function (value: any, context: any) {
          if (value == 0) {
            return ''
          }
          return value.toLocaleString('en-US');
        }
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [
    DataLabelsPlugin
  ];
  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };


  getAnalysisData(fromDate: string, toDate: string) {

    this.selectedPeriod.start = moment(fromDate).format("DD.MM.YYYY");
    this.selectedPeriod.end = moment(toDate).format("DD.MM.YYYY");

    this.apiCalls.getAnalisysData(fromDate, toDate).subscribe((data: any) => {
      this.analysisData = data.message;
      this.barChartData.datasets = []
      this.barChartData.labels = this.analysisData.dates;
      this.barChartData.datasets.push({
        data: this.analysisData.totalRevenues,
        label: this.translate.instant('revenues'),
        backgroundColor: 'rgb(109,171,250)'
      })
      this.barChartData.datasets.push({
        data: this.analysisData.totalCosts,
        label: this.translate.instant('expenses'),
        backgroundColor: 'rgba(140,222,255,0.4 )'
      })

      this.sumAnalysisData();
      this.chart!.options!.plugins!.title!.text = this.translate.instant('event.diagram');
      this.chart?.update();
      this.chart!.render();
    });
  }


  sumAnalysisData() {
    const totalRevenue = this.analysisData.totalRevenues.reduce((a: number, b: number) => a + b, 0);
    const totalCost = this.analysisData.totalCosts.reduce((a: number, b: number) => a + b, 0);
    return {totalRevenue, totalCost}
  }


  analyseWeek() {
    this.getAnalysisData(this.currentWeek.start, this.currentWeek.end);
    this.analyseWeekTotals();
    this.loadTabData( this.currentWeek.start, this.currentWeek.end);
  }


  analyseMonth() {
    this.getAnalysisData(this.currentMonth.start, this.currentMonth.end);
    this.analyseMonthTotals();
    this.loadTabData( this.currentMonth.start, this.currentMonth.end);
  }


  analyseLast14Days() {
    this.getAnalysisData(this.last14Days.start, this.last14Days.end);
    this.analyseLast14DaysTotals();
    this.loadTabData( this.last14Days.start, this.last14Days.end);
  }


  analyseCustom(month: number) {
    const start = moment().month(month).startOf('month').format('YYYY-MM-DD');
    const end = moment().month(month).endOf('month').format('YYYY-MM-DD');
    this.getAnalysisData(start, end);
    this.analyseCustomTotals(month);
    this.loadTabData( start, end);
  }

  getAnalysisDataTotal(fromDate: string, toDate: string) {
    this.apiCalls.getAnalisysDataTotals(fromDate, toDate).subscribe((data: any) => {
      this.analisysDataTotals = data.message;
      this.sumPerParticipans();
    });
  }


    analyseWeekTotals() {
      this.getAnalysisDataTotal(this.currentWeek.start, this.currentWeek.end);
    }

    analyseMonthTotals() {
      this.getAnalysisDataTotal(this.currentMonth.start, this.currentMonth.end);
    }

    analyseLast14DaysTotals() {
      this.getAnalysisDataTotal(this.last14Days.start, this.last14Days.end);
    }

    analyseCustomTotals(month: number) {
      const start = moment().month(month).startOf('month').format('YYYY-MM-DD');
      const end = moment().month(month).endOf('month').format('YYYY-MM-DD');

      this.getAnalysisDataTotal(start, end);
    }


loadTabData(startDate:string, endDate:string) {
  this.apiCalls.getEventListById(0, startDate, endDate).subscribe((data: EventDetails[]) => {
    this.tabEventData = data;
  });
  this.apiCalls.getEventCosts(0, startDate, endDate).subscribe((data: EventCostsDetails[]) => {
    this.tabEventCostData = data;
  });
  this.apiCalls.getOtherCosts(startDate, endDate).subscribe((data: CostsDetails[]) => {
    this.tabCostData = data;
  });
  this.apiCalls.getAnalisysRevenueData(startDate, endDate).subscribe((data: RevenuesAnalisysDetails[]) => {
        this.tabRevenueData = data;
      });
}


sumPerParticipans() {
  this.finalAnalisysData.revenuePerPerticipant = this.analisysDataTotals.total_revenue / 0 ? 1 : this.analisysDataTotals.number_of_participants ;
  this.finalAnalisysData.costPerPerticipant = this.analisysDataTotals.total_events_cost / 0 ? 1 : this.analisysDataTotals.number_of_participants ;
  this.finalAnalisysData.revenuePerEvent = this.analisysDataTotals.total_revenue / 0 ? 1 : this.analisysDataTotals.number_of_events ;
  this.finalAnalisysData.costPerEvent = this.analisysDataTotals.total_events_cost / 0 ? 1 : this.analisysDataTotals.number_of_events ;
  this.finalAnalisysData.participantsPerEvent = Math.round(this.analisysDataTotals.number_of_participants / 0 ? 1 : this.analisysDataTotals.number_of_events);
  }



}


