import { EzComponent } from "../EzComponent";

export class TestModuleRoot extends EzComponent {
    p_html: string;
    p_css: string;
    constructor(html: string = "<html><body></body></html>", css: string = "") {
        super(html, css);
        this.p_html = html;
        this.p_css = css;
    }
}
