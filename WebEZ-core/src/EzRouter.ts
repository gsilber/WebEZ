import { EzComponent } from "./EzComponent";

declare const window: Window;

/**
 * @description: A route
 * @export
 * @interface Route
 * @group Routing
 * path - the path of the route
 * component - the component to render (instance of EzComponent)
 */
export interface Route {
    path: string;
    component: EzComponent;
}
declare const URLHREF: string;

export class EzRouter {
    private baseRoute: string = URLHREF || "/";
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
            window.history.pushState({}, "", this.baseRoute + path);
        }
    }
}
