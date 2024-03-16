const html = `<div id="child1"></div>
<div id="child2"></div>
<div id="child3"></div>
<div id="child4"></div>
`;
const css = "";
import { EzComponent } from "../../EzComponent";
import { TestChild1Component } from "./test-child1.component";
import { TestChild2Component } from "./test-child2.component";

export class TestComponent extends EzComponent {
    child1: TestChild1Component = new TestChild1Component();
    child2: TestChild1Component = new TestChild1Component();
    child3: TestChild1Component = new TestChild1Component();
    child4: TestChild2Component = new TestChild2Component();

    constructor() {
        super(html, css);
        this.addComponent(this.child1, "child1");
        this.addComponent(this.child2, "child2");
        this.addComponent(this.child3, "child3");
        this.addComponent(this.child4, "child4");
    }
}
