import { Component, computed, inject, input, Signal } from "@angular/core";
import { NgApexchartsModule } from "ng-apexcharts";
import { PieChartOptions } from "../../../interfaces/chart-options.interface";
import { PieChartData } from "../../../interfaces/data.interface";
import { ChartOptionsService } from "../../../services/chart-options.service";

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss'],
    imports: [NgApexchartsModule]
})
export class PieChartComponent {
    data = input.required<PieChartData>();
    private readonly chartOptionsService = inject(ChartOptionsService);

    readonly chartOptions: Signal<PieChartOptions> = computed(() =>
        this.chartOptionsService.buildPieChartOptions(this.data())
    );
}