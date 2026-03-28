import { Component, computed, inject, input, Signal } from "@angular/core";
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexXAxis, ApexTitleSubtitle, ApexYAxis, NgApexchartsModule, ApexTheme, ApexTooltip } from "ng-apexcharts"
import { BarChartData } from "../../../interfaces/data.interface";
import { ThemeService } from "../../../services/theme.service";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    title: ApexTitleSubtitle;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    theme: ApexTheme;
    tooltip: ApexTooltip
}

@Component({
    selector: 'app-bar-chart',
    templateUrl: './bar-chart.component.html',
    styleUrls: ['./bar-chart.component.scss'],
    imports: [NgApexchartsModule]
})
export class BarChartComponent {
    data = input.required<BarChartData>();
    private themeService = inject(ThemeService);
    
    readonly chartOptions: Signal<ChartOptions> = computed(() => {
      const isDark = this.themeService.theme() === 'dark';
      
      return {
        series: [
          {
            name: this.data().title,
            data: this.data().yAxisData
          }
        ],
        chart: {
          type: "bar",
          height: 300,
          width: '100%',
          foreColor: isDark ? '#CBD5E1' : '#1F2937',
          background: 'transparent'
        },
        theme: {
          mode: isDark ? 'dark' : 'light',
        },
        xaxis: {
          categories: this.data().xAxisData,
          title: {
            text: this.data().xAxisLabel,
            style: {
              color: isDark ? '#CBD5E1' : '#1F2937'
            }
          },
          labels: {
            style: {
              colors: isDark ? '#CBD5E1' : '#6B7280'
            }
          }
        },
        yaxis: {
          title: {
            text: this.data().yAxisLabel,
            style: {
              color: isDark ? '#CBD5E1' : '#1F2937'
            }
          },
          labels: {
            style: {
              colors: isDark ? '#CBD5E1' : '#6B7280'
            }
          }
        },
        title: {
          text: this.data().title,
          style: {
            color: isDark ? '#F8FAFC' : '#1F2937'
          }
        },
        plotOptions: {
          bar: {
            horizontal: this.data().horizontal ?? false
          }
        },
        dataLabels: {
          enabled: true,
          formatter: this.data().formatter ?? ((value: number) => value),
          style: {
            fontSize: '8px',
            fontWeight: 'bold',
            colors: [isDark ? '#F8FAFC' : '#1F2937']
          },
          offsetY: this.data().horizontal ? 0 : -20,
          background: {
            enabled: true,
            foreColor: isDark ? '#1E293B' : '#FFFFFF',
            padding: 2,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: isDark ? '#475569' : '#E5E7EB'
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