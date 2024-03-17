import {
    BindInnerHTML,
    BindCSSClass,
    Click,
    EzComponent,
} from "@gsilber/webez";
import html from "./alert.component.html";
import css from "./alert.component.css";

export class AlertComponent extends EzComponent {
    @BindInnerHTML("alert-message") private alert: string = "";
    @BindInnerHTML("title") private title: string = "";
    @BindCSSClass("popup") modalCSS: string = "hidden";
    @BindCSSClass("okTarget") okTargetCSS: string = "hidden";
    @BindCSSClass("okcancelTarget") okcancelTargetCSS: string = "hidden";
    private resolution?: (value: boolean | PromiseLike<boolean>) => void;

    constructor() {
        super(html, css);
    }

    @Click("cancelBtn")
    private onCancel() {
        this.modalCSS = "hidden";
        this.okcancelTargetCSS = "hidden";
        this.okTargetCSS = "hidden";
        if (this.resolution) {
            this.resolution(false);
        }
    }
    @Click("alertBtn")
    private onAlertClose() {
        this.modalCSS = "hidden";
        this.okTargetCSS = "hidden";
        this.okcancelTargetCSS = "hidden";
        if (this.resolution) {
            this.resolution(false);
        }
    }
    @Click("okBtn")
    private onOk() {
        this.modalCSS = "hidden";
        this.okTargetCSS = "hidden";
        this.okcancelTargetCSS = "hidden";
        if (this.resolution) {
            this.resolution(true);
        }
    }
    alertMessage(message: string, title: string = "Message"): Promise<boolean> {
        return new Promise((resolve) => {
            this.alert = message;
            this.title = title;
            this.modalCSS = "visible";
            this.okTargetCSS = "visible";
            this.okcancelTargetCSS = "hidden";
            this.resolution = resolve;
        });
    }
    async confirmMessage(
        message: string,
        title: string = "Confirm",
    ): Promise<boolean> {
        return new Promise((resolve) => {
            this.alert = message;
            this.title = title;
            this.modalCSS = "visible";
            this.okcancelTargetCSS = "visible";
            this.okTargetCSS = "hidden";
            this.resolution = resolve;
        });
    }
}
