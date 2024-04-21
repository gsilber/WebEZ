import { EzComponent } from "./EzComponent";

export interface Route {
    path: string;
    component: EzComponent;
}
export class EzRouter {
    constructor(private routes: Route[]) {}
}
