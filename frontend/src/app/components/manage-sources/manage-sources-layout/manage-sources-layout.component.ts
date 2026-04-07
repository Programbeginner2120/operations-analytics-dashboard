import { Component, computed, inject, Signal } from "@angular/core";
import { HeaderComponent } from "../../header/header.component";
import { ManageSourcesService, Source } from "../../../services/manage-sources.service";
import { ArrowRight, LucideAngularModule } from "lucide-angular";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { PlatformService } from "../../../services/platform.service";

@Component({
    selector: 'app-manage-sources-layout',
    templateUrl: './manage-sources-layout.component.html',
    styleUrls: ['./manage-sources-layout.component.scss'],
    imports: [HeaderComponent, LucideAngularModule, ButtonComponent]
})
export class ManageSourcesLayoutComponent {

    readonly manageSourcesService = inject(ManageSourcesService);
    readonly platformService = inject(PlatformService);

    readonly rightArrow = ArrowRight;

    readonly sources: Signal<Source[]> = computed(() => this.manageSourcesService.sources());

}