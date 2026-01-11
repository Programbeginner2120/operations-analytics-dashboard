import { Component } from "@angular/core";
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexTitleSubtitle, NgApexchartsModule } from "ng-apexcharts"

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    title: ApexTitleSubtitle;
}

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss'],
    imports: [NgApexchartsModule]
})
export class BarChartComponent {
    public chartOptions: ChartOptions;
    
    constructor() {
        this.chartOptions = {
          series: [
            {
              name: "Sales",
              data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
            }
          ],
          chart: {
            type: "bar",
            height: 350
          },
          xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
          },
          title: {
            text: "Monthly Sales"
          }
        };
      }

    }