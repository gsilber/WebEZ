import { EzComponent } from "../../../EzComponent";
import {
    BindAttribute,
    BindCSSClass,
    BindStyle,
    BindValue,
} from "../../../bind.decorators";

const html = "<div></div>";
const css = "";

export class BadStyleComponent extends EzComponent {
    @BindStyle("doesNotExist", "color")
    val: string = "red";

    constructor() {
        super(html, css);
    }
}
export class BadCssComponent extends EzComponent {
    @BindCSSClass("doesNotExist")
    val: string = "btn";

    constructor() {
        super(html, css);
    }
}
export class BadValueComponent extends EzComponent {
    @BindValue("doesNotExist")
    val: string = "hello";
    constructor() {
        super(html, css);
    }
}
export class BadAttributeComponent extends EzComponent {
    @BindAttribute("doesNotExist", "disabled")
    val: string = "true";
    constructor() {
        super(html, css);
    }
}
export class NoRootChildComponent extends EzComponent {
    constructor() {
        super("<div></div>", css);
    }
}
export class NoRootParentCompnent extends EzComponent {
    child: NoRootChildComponent = new NoRootChildComponent();
    constructor() {
        super("<div></div>", css);
        this.addComponent(this.child);
    }
}
