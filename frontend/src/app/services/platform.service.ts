import { computed, Injectable, signal } from "@angular/core";

export type DevicePlatform = 'phone' | 'tablet' | 'laptop' | 'desktop';

@Injectable({ providedIn: 'root' })
export class PlatformService {

    private readonly phoneQuery = window.matchMedia('(max-width: 767px');
    private readonly tabletQuery = window.matchMedia('(max-width: 768px) and (max-width: 1023px)');
    private readonly laptopQuery = window.matchMedia('(min-width: 1024px) and (max-width: 1439px)');

    private readonly _platform = signal<DevicePlatform>(this.detectPlatform());

    readonly platform = this._platform.asReadonly();

    readonly isPhone = computed(() => this._platform() === 'phone');
    readonly isTablet = computed(() => this._platform() === 'tablet')
    readonly isLaptop = computed(() => this._platform() === 'laptop');
    readonly isDesktop = computed(() => this._platform() === 'desktop');

    readonly isMobile = computed(() => this.isPhone() || this.isTablet());
    readonly isLargeScreen = computed(() => this.isLaptop() || this.isDesktop());

    constructor() {
        const update = () => this._platform.set(this.detectPlatform());
        this.phoneQuery.addEventListener('change', update);
        this.tabletQuery.addEventListener('change', update);
        this.laptopQuery.addEventListener('change', update);
    }

    private detectPlatform(): DevicePlatform {
        if (this.phoneQuery.matches) {
            return 'phone';
        }
        if (this.tabletQuery.matches) {
            return 'tablet';
        }
        if (this.laptopQuery.matches) {
            return 'laptop';
        }
        return 'desktop';
    }

}