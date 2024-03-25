import { EzComponent } from "@gsilber/webez";

export abstract class ObjectBaseComponent extends EzComponent {
    constructor(html: string, css: string) {
        super(html, css);
    }
}
