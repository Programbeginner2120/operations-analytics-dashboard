import { Component, computed, input, Signal } from "@angular/core";
import { ApexChart, ApexDataLabels, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexTitleSubtitle, NgApexchartsModule } from "ng-apexcharts";
import { PieChartData } from "../../../interfaces/data.interface";

export type PieChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    title: ApexTitleSubtitle;
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
    plotOptions: ApexPlotOptions;
}

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss'],
    imports: [NgApexchartsModule]
})
export class PieChartComponent {
    data = input.required<PieChartData>();

    readonly chartOptions: Signal<PieChartOptions> = computed(() => {
        return {
            series: this.data().values,
            chart: {
                type: 'pie',
                height: 350
            },
            labels: this.data().labels,
            title: {
                text: this.data().title
            },
            dataLabels: {
                enabled: true,
                formatter: this.data().formatter ?? ((value: number) => value),
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        offset: -5
                    }
                }
            }
        };
    });
}