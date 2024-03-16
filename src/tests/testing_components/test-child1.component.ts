import { EzComponent } from "../../EzComponent";
import { TestGrandchildComponent } from "./test-grandchild.component";

const html = `<p>TestChild1 Component</p>
<div id="baby1"></div>
<div id="baby2"></div>
`;
const css = "";

export class TestChild1Component extends EzComponent {
    baby1: TestGrandchildComponent = new TestGrandchildComponent();
    baby2: TestGrandchildComponent = new TestGrandchildComponent();

    constructor() {
        super(html, css);
        this.addComponent(this.baby1, "baby1");
        this.addComponent(this.baby2, "baby2");
    }
}
