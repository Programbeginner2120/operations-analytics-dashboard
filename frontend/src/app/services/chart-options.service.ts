import { inject, Injectable } from '@angular/core';
import { ApexTooltip } from 'ng-apexcharts';
import { BarChartOptions, PieChartOptions } from '../interfaces/chart-options.interface';
import { BarChartData, PieChartData } from '../interfaces/data.interface';
import { ThemeService } from './theme.service';

const DARK_FORE_COLOR = '#CBD5E1';
const LIGHT_FORE_COLOR = '#1F2937';
const DARK_TITLE_COLOR = '#F8FAFC';
const LIGHT_TITLE_COLOR = '#1F2937';
const DARK_LABEL_COLOR = '#CBD5E1';
const LIGHT_LABEL_COLOR = '#6B7280';
const DEFAULT_CURRENCY_FORMATTER = (value: number) => '$' + value.toFixed(2);

@Injectable({ providedIn: 'root' })
export class ChartOptionsService {
    private readonly themeService = inject(ThemeService);

    buildBarChartOptions(data: BarChartData): BarChartOptions {
        const isDark = this.themeService.theme() === 'dark';
        const foreColor = isDark ? DARK_FORE_COLOR : LIGHT_FORE_COLOR;
        const labelColor = isDark ? DARK_LABEL_COLOR : LIGHT_LABEL_COLOR;

        return {
            series: [{ name: data.title, data: data.yAxisData }],
            chart: {
                type: 'bar',
                toolbar: { show: false },
                height: 300,
                width: '100%',
                foreColor,
                background: 'transparent',
            },
            theme: { mode: isDark ? 'dark' : 'light' },
            xaxis: {
                categories: data.xAxisData,
                title: {
                    text: data.xAxisLabel,
                    style: { color: foreColor },
                },
                labels: { style: { colors: labelColor } },
            },
            yaxis: {
                title: {
                    text: data.yAxisLabel,
                    style: { color: foreColor },
                },
                labels: { style: { colors: labelColor } },
            },
            title: {
                text: data.title,
                style: { color: isDark ? DARK_TITLE_COLOR : LIGHT_TITLE_COLOR },
            },
            plotOptions: { bar: { horizontal: data.horizontal ?? false } },
            dataLabels: { enabled: false },
            tooltip: this.buildTooltip(isDark, data.formatter),
        };
    }

    buildPieChartOptions(data: PieChartData): PieChartOptions {
        const isDark = this.themeService.theme() === 'dark';
        const labelColor = isDark ? DARK_LABEL_COLOR : LIGHT_LABEL_COLOR;

        return {
            series: data.values,
            chart: {
                type: 'pie',
                height: 315,
                width: '100%',
                foreColor: isDark ? DARK_FORE_COLOR : LIGHT_FORE_COLOR,
                background: 'transparent',
            },
            theme: { mode: isDark ? 'dark' : 'light' },
            labels: data.labels,
            title: {
                text: data.title,
                style: { color: isDark ? DARK_TITLE_COLOR : LIGHT_TITLE_COLOR },
            },
            dataLabels: { enabled: false },
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                labels: { colors: labelColor },
            },
            plotOptions: { pie: { dataLabels: { offset: -5 } } },
            tooltip: this.buildTooltip(isDark, data.formatter),
        };
    }

    private buildTooltip(isDark: boolean, formatter?: (value: number) => string): ApexTooltip {
        return {
            theme: isDark ? 'dark' : 'light',
            style: { fontSize: '12px', fontFamily: undefined },
            y: { formatter: formatter ?? DEFAULT_CURRENCY_FORMATTER },
        };
    }
}
