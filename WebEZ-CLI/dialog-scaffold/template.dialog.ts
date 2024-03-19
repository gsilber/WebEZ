import { EzDialog, Click } from "@gsilber/webez";
import html from "./########.dialog.html";
import css from "./########.dialog.css";

export class $$$$$$$$Dialog extends EzDialog {
    constructor() {
        super(html, css);
    }
    @Click("okBtn")
    private onOk() {
        this.show(false);
    }
}
