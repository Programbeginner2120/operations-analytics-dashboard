import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexLegend,
    ApexNonAxisChartSeries,
    ApexPlotOptions,
    ApexTheme,
    ApexTitleSubtitle,
    ApexTooltip,
    ApexXAxis,
    ApexYAxis,
} from 'ng-apexcharts';

export type BarChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    theme: ApexTheme;
    tooltip: ApexTooltip;
};

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
};
