import { Component, computed, inject, input, Signal } from "@angular/core";
import { ApexChart, ApexDataLabels, ApexLegend, ApexNonAxisChartSeries, ApexPlotOptions, ApexTitleSubtitle, NgApexchartsModule, ApexTheme, ApexTooltip } from "ng-apexcharts";
import { PieChartData } from "../../../interfaces/data.interface";
import { ThemeService } from "../../../services/theme.service";

export type PieChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    labels: string[];
    title: ApexTitleSubtitle;
    legend: ApexLegend;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    theme: ApexTheme;
    tooltip: ApexTooltip;
}

@Component({
    selector: 'app-pie-chart',
    templateUrl: './pie-chart.component.html',
    styleUrls: ['./pie-chart.component.scss'],
    imports: [NgApexchartsModule]
})
export class PieChartComponent {
    data = input.required<PieChartData>();
    private themeService = inject(ThemeService);

    readonly chartOptions: Signal<PieChartOptions> = computed(() => {
        const isDark = this.themeService.theme() === 'dark';
        
        return {
            series: this.data().values,
            chart: {
                type: 'pie',
                height: 315,
                width: '100%',
                foreColor: isDark ? '#CBD5E1' : '#1F2937',
                background: 'transparent'
            },
            theme: {
                mode: isDark ? 'dark' : 'light',
            },
            labels: this.data().labels,
            title: {
                text: this.data().title,
                style: {
                    color: isDark ? '#F8FAFC' : '#1F2937'
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                labels: {
                    colors: isDark ? '#CBD5E1' : '#6B7280'
                }
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        offset: -5
                    }
                }
            },
            tooltip: {
                theme: isDark ? 'light' : 'light',
                style: {
                    fontSize: '12px',
                    fontFamily: undefined
                },
                y: {
                    formatter: (value: number) => "$" + value.toFixed(2)
                }
            }
        };
    });
}