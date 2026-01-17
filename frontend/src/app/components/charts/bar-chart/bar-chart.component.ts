import { Component, computed, input, Signal } from "@angular/core";
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexXAxis, ApexTitleSubtitle, ApexYAxis, NgApexchartsModule } from "ng-apexcharts"
import { BarChartData } from "../../../interfaces/data.interface";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle;
    dataLabels: ApexDataLabels;
}

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss'],
    imports: [NgApexchartsModule]
})
export class BarChartComponent {
    data = input.required<BarChartData>();
    
    readonly chartOptions: Signal<ChartOptions> = computed(() => {
      return {
        series: [
          {
            name: this.data().title,
            data: this.data().yAxisData
          }
        ],
        chart: {
          type: "bar",
          height: 350
        },
        xaxis: {
          categories: this.data().xAxisData,
          title: {
            text: this.data().xAxisLabel
          }
        },
        yaxis: {
          title: {
            text: this.data().yAxisLabel
          }
        },
        title: {
          text: this.data().title
        },
        dataLabels: {
          enabled: true,
          formatter: this.data().formatter ?? ((value: number) => value),
          style: {
            fontSize: '8px',
            fontWeight: 'bold',
            colors: ['#333']
          },
          offsetY: -20,
          background: {
            enabled: true,
            foreColor: '#fff',
            padding: 2,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: '#ccc'
          }
        }
      };
    });
  }