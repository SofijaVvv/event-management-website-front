import {Component, OnInit, ViewChild} from '@angular/core';
import {Chart , ChartConfiguration, ChartData, ChartType} from "chart.js";
import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import {ApiCallsService} from "../../service/api-calls.service";
import {BaseChartDirective} from "ng2-charts";
@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.sass']
})
export class AnalysisComponent implements OnInit{
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  analysisData: any = [];

  constructor(
    public apiCalls: ApiCallsService,
  ) { }


  ngOnInit(): void {
    this.getAnalysisData();
  }


  public barChartOptions: ChartConfiguration['options'] = {
    aspectRatio: 3,
    // responsive: true,
    // indexAxis: 'y',
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {}
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'center',
        align: 'end',
        color: 'black',
        formatter: function(value: any, context: any) {
          if (value == 0){
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
    // labels: [''],
    datasets: [

    ]
  };



  public barChartoptions2: ChartConfiguration['options'] = {
        responsive: true,
    aspectRatio: 2,
        plugins: {
          legend: {
            position: 'top',
          },
          datalabels: {
            anchor: 'end',
            align: 'end',
            display: 'auto',
            color: 'black',
            font: {
              weight: 'bold'
            },
            formatter: (value, ctx) => {
              const total = 26;
              let percentage = (value * 100 / total).toFixed(2) + "%";
              return percentage //+ '(' + value + ')';
            },
          },
          title: {
            display: true,
          }
        }
  }
  public BarChartType2: ChartType = 'pie';
  public barChartPlugin2 = [DataLabelsPlugin];

  public barChartData2: ChartData<'pie'> = {

    labels: ['1', '2'],
    datasets: [
      {
        label: 'Fully Rounded',
        data: [12,14],
        borderColor: 'rgb(255,255,255)',
        backgroundColor: ['rgba(140,222,255)', 'rgb(109,171,250)'],
        borderWidth: 2,

      },

      // {
      //   label: 'Small Radius',
      //   data:[12,13,15],
      //   borderColor: 'rgb(255, 99, 132)',
      //   backgroundColor:'rgb(0, 99, 132)',
      //   borderWidth: 2,
      //   borderRadius: 5,
      //   // borderSkipped: false,
      // }
    ]
  };

getAnalysisData() {
  this.apiCalls.getAnalisysData('2024-03-01', '2024-03-31').subscribe((data: any) => {
        this.analysisData = data.message;
        console.log(data);
        this.barChartData.datasets = []
        this.barChartData.labels = this.analysisData.dates;
        this.barChartData.datasets.push({data: this.analysisData.totalRevenues, label: 'Revenues', backgroundColor:'rgb(109,171,250)' })
        this.barChartData.datasets.push({data: this.analysisData.totalCosts, label: 'Costs', backgroundColor: 'rgba(140,222,255,0.4 )'})
    this.chart?.update();


  })

}

}
