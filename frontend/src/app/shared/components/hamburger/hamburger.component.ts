import { Component, signal } from "@angular/core";
import { LucideAngularModule, Menu, X } from "lucide-angular";
import { ɵEmptyOutletComponent } from "@angular/router";

@Component({
    selector: 'app-hamburger-menu',
    templateUrl: './hamburger.component.html',
    styleUrls: ['./hamburger.component.scss'],
    imports: [LucideAngularModule]
})
export class HamburgerMenuComponent {

    readonly menu = Menu;
    readonly x = X;

    readonly isMenuOpen = signal<boolean>(false);

    toggleMenu(): void {
        this.isMenuOpen.update(open => !open);
    }

    close(): void {
        this.isMenuOpen.set(false)
    }

}