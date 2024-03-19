import { Click, EzComponent, EzDialog } from "@gsilber/webez";
import html from "./dialog.component.html";
import css from "./dialog.component.css";

export class DialogComponent extends EzDialog {
    constructor() {
        super(html, css);
    }

    @Click("okBtn")
    private onOk() {
        this.show(false);
    }
}
