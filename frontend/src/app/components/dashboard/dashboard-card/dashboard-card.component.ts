import { Component, ComponentRef, computed, effect, inject, input, signal, viewChild, ViewContainerRef } from "@angular/core";
import { DashboardCard, DashboardVisualizationType, DashboardDataSourceType } from "../../../interfaces/dashboard.interface";
import { LucideAngularModule, Save, X, Type, Ellipsis } from "lucide-angular";
import { BarChartComponent } from "../../charts/bar-chart/bar-chart.component";
import { StackedBarChartComponent } from "../../charts/stacked-bar-chart/stacked-bar-chart.component";
import { DashboardService } from "../../../services/dashboard.service";
import { PieChartComponent } from "../../charts/pie-chart/pie-chart.component";
import { ModalComponent } from "../../../shared/components/modal/modal.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { InputComponent } from "../../../shared/components/input/input.component";
import { SelectComponent } from "../../../shared/components/select/select.component";
import { SelectOption } from "../../../shared/interfaces/select.interface";
import { BarChartData, PieChartData, StackedBarChartData } from "../../../interfaces/data.interface";
import { DataSourceRegistryService } from "../../../services/data-source-registry.service";
import { DataSourceConfigComponent, DataSourceConfigSelections } from "../../../interfaces/data-source.interface";

@Component({
    selector: 'app-dashboard-card',
    templateUrl: './dashboard-card.component.html',
    styleUrls: ['./dashboard-card.component.scss'],
    imports: [LucideAngularModule, BarChartComponent, StackedBarChartComponent, PieChartComponent, ModalComponent, ButtonComponent, InputComponent, SelectComponent]
})
export class DashboardCardComponent {
    readonly saveIcon = Save;
    readonly cancelIcon = X;
    readonly typeIcon = Type;
    readonly ellipsisIcon = Ellipsis;

    readonly DashboardVisualizationType = DashboardVisualizationType;

    card = input.required<DashboardCard>();
    readonly dashboardService = inject(DashboardService);
    private readonly registry = inject(DataSourceRegistryService);

    // Local editable state for the config modal
    readonly editableTitle = signal<string>('');
    readonly editableDataSourceType = signal<DashboardDataSourceType | null>(null);
    readonly editableVisualizationType = signal<DashboardVisualizationType | null>(null);

    // Modal open state
    readonly isModalOpen = signal<boolean>(false);

    // Draft config emitted by the dynamically loaded data-source config sub-component
    readonly draftConfig = signal<DataSourceConfigSelections | null>(null);

    // Reference to the host for the dynamically loaded config component
    readonly configContainer = viewChild('configContainer', { read: ViewContainerRef });

    // Mutable reference to the active config component — not reactive state
    private activeConfigRef: ComponentRef<DataSourceConfigComponent> | null = null;

    // Select options
    readonly dataSourceOptions: SelectOption[] = [
        { value: DashboardDataSourceType.PLAID, label: 'Plaid API' }
    ];

    readonly visualizationOptions: SelectOption[] = [
        { value: DashboardVisualizationType.BAR_CHART, label: 'Bar Chart' },
        { value: DashboardVisualizationType.STACKED_BAR_CHART, label: 'Stacked Bar Chart' },
        { value: DashboardVisualizationType.PIE_CHART, label: 'Pie Chart' }
    ];

    /**
     * Bar chart data - only returns data when visualization type is BAR_CHART
     */
    readonly barChartData = computed(() => {
        if (this.card().visualizationType === DashboardVisualizationType.BAR_CHART) {
            return this.card().transformedData as BarChartData | undefined;
        }
        return undefined;
    });

    readonly stackedBarChartData = computed(() => {
        if (this.card().visualizationType === DashboardVisualizationType.STACKED_BAR_CHART) {
            return this.card().transformedData as StackedBarChartData | undefined;
        }
        return undefined;
    });

    /**
     * Pie chart data - only returns data when visualization type is PIE_CHART
     */
    readonly pieChartData = computed(() => {
        if (this.card().visualizationType === DashboardVisualizationType.PIE_CHART) {
            return this.card().transformedData as PieChartData | undefined;
        }
        return undefined;
    });

    constructor() {
        // Dynamically load the data-source config sub-component when the modal opens.
        // The effect tracks isModalOpen(), configContainer(), and editableVisualizationType()
        // so it re-runs whenever any of them change.
        effect(() => {
            if (!this.isModalOpen()) {
                this.activeConfigRef?.destroy();
                this.activeConfigRef = null;
                return;
            }

            const vcr = this.configContainer();
            if (!vcr) return;

            // If the component is already loaded, keep it in sync with the viz type selector.
            if (this.activeConfigRef) {
                const vizType = this.editableVisualizationType();
                if (vizType) {
                    this.activeConfigRef.setInput('visualizationType', vizType);
                }
                return;
            }

            // First open: create the config sub-component for the card's data source type.
            vcr.clear();
            const card = this.card();
            const strategy = this.registry.getStrategy(card.dataSourceType);
            const componentRef = vcr.createComponent(strategy.getConfigComponent());

            componentRef.setInput('queryConfig', card.queryConfig);
            componentRef.setInput('transformConfig', card.transformConfig);
            componentRef.setInput('connectedSources', this.dashboardService.connectedDataSources().filter(s => s.sourceType === card.dataSourceType));

            componentRef.instance.configChange.subscribe(cfg => {
                this.draftConfig.set(cfg);
            });

            this.activeConfigRef = componentRef;
        });
    }

    /**
     * Opens the configuration modal and initializes editable fields
     */
    openConfigModal(): void {
        this.editableTitle.set(this.card().title);
        this.editableDataSourceType.set(this.card().dataSourceType);
        this.editableVisualizationType.set(this.card().visualizationType);
        // Seed draftConfig with the card's current config so saveConfig() is safe
        // even if the user makes no changes inside the sub-component.
        this.draftConfig.set(this.registry.getStrategy(this.card().dataSourceType).extractSelections(this.card()));
        this.isModalOpen.set(true);
    }

    /**
     * Saves the card configuration.
     * Generic fields (title, source type, viz type) come from local signals.
     * Data-source-specific config (queryConfig, transformConfig) comes from draftConfig,
     * which is kept up to date by the dynamically loaded config sub-component.
     */
    saveConfig(): void {
        const updates: Partial<DashboardCard> = {
            title: this.editableTitle(),
            dataSourceType: this.editableDataSourceType() ?? undefined,
            visualizationType: this.editableVisualizationType() ?? undefined,
            ...(this.draftConfig() ? this.registry.getStrategy(this.card().dataSourceType).resolveConfig(this.draftConfig()!) : {})
        };

        this.dashboardService.updateCard(this.card().id, updates as DashboardCard);
        this.closeModal();
    }

    /**
     * Closes the modal without saving changes
     */
    closeModal(): void {
        this.isModalOpen.set(false);
    }

    /**
     * Removes the card from the dashboard
     */
    removeCard(): void {
        this.dashboardService.removeCard(this.card().id);
        this.closeModal();
    }
}