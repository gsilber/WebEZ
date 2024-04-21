import { EzComponent } from "./EzComponent";

export interface Route {
    path: string;
    component: EzComponent;
}
export class EzRouter {
    private currentComponent: EzComponent | null = null;
    constructor(
        private container: EzComponent,
        private routes: Route[],
        private id: string,
    ) {}

    route(path: string) {
        const route = this.routes.find((r) => r.path === path);
        if (route) {
            if (this.currentComponent)
                this.container["removeComponent"](this.currentComponent);
            this.currentComponent = route.component;
            if (this.id === "root") {
                this.container.addComponent(route.component);
            } else {
                this.container.addComponent(route.component, this.id);
            }
        }
    }
}
