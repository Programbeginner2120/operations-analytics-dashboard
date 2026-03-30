import { Component, computed, inject, input, Signal } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BarChartOptions } from '../../../interfaces/chart-options.interface';
import { StackedBarChartData } from '../../../interfaces/data.interface';
import { ChartOptionsService } from '../../../services/chart-options.service';

@Component({
    selector: 'app-stacked-bar-chart',
    templateUrl: './stacked-bar-chart.component.html',
    styleUrls: ['./stacked-bar-chart.component.scss'],
    imports: [NgApexchartsModule],
})
export class StackedBarChartComponent {
    data = input.required<StackedBarChartData>();
    private readonly chartOptionsService = inject(ChartOptionsService);

    readonly chartOptions: Signal<BarChartOptions> = computed(() =>
        this.chartOptionsService.buildStackedBarChartOptions(this.data())
    );
}
