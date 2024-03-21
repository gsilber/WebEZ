import { EzComponent } from "../../../EzComponent";
import {
    BindCSSClass,
    BindInnerHTML,
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
export class BadInnerHTMLComponent extends EzComponent {
    @BindInnerHTML("doesNotExist")
    val: string = "hello";
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
export class BadValueComponentStack extends EzComponent {
    @BindValue("exists")
    @BindValue("exists2")
    val: string = "hello";
    constructor() {
        super('<div id="exists"></div><div id="exists2"></div>', css);
    }
}
export class BadValueComponentOrder extends EzComponent {
    @BindValue("exists")
    @BindInnerHTML("exists2")
    val: string = "hello";
    constructor() {
        super('<div id="exists"></div><div id="exists2"></div>', css);
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
