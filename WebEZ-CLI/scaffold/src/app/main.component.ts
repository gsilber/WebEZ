import html from "./main.component.html";
import css from "./main.component.css";
import { EzComponent } from '@gsilber/webez';

export class MainComponent extends EzComponent {

    constructor() {
        super(html, css);
    }
}
