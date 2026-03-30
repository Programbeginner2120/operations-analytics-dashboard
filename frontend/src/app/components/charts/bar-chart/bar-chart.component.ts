import { Component, computed, inject, input, Signal } from "@angular/core";
import { NgApexchartsModule } from "ng-apexcharts";
import { BarChartOptions } from "../../../interfaces/chart-options.interface";
import { BarChartData } from "../../../interfaces/data.interface";
import { ChartOptionsService } from "../../../services/chart-options.service";

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss'],
    imports: [NgApexchartsModule]
})
export class BarChartComponent {
    data = input.required<BarChartData>();
    private readonly chartOptionsService = inject(ChartOptionsService);

    readonly chartOptions: Signal<BarChartOptions> = computed(() =>
        this.chartOptionsService.buildBarChartOptions(this.data())
    );
}