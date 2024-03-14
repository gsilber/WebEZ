const html = "<div></div>";
const css = "";
import { EzComponent } from "../../EzComponent";
import { TestChild1Component } from "./test-child1.component";
import { TestChild2Component } from "./test-child2.component";

export class TestComponent extends EzComponent {
    child1: TestChild1Component = new TestChild1Component();
    child2: TestChild2Component = new TestChild2Component();
    child2b: TestChild2Component = new TestChild2Component();
    constructor() {
        super(html, css);
        //child1 in child1 and 2 child 2's connected directly to outer.
        this.addComponent(this.child1, "child1");
        this.addComponent(this.child2, "child2");
        this.addComponent(this.child2);
    }
}
