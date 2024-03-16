const html = `<div id="child1"></div>
<div id="child2"></div>
<div id="child3"></div>
<div id="child4"></div>
<button id="evtButton1"></button>
<button id="evtButton2"></button>
<div id="evtDiv1"></div>
<div id="evtDiv2"></div>
<input type="text" id="evtInput1" />
`;
const css = "";
import { EzComponent } from "../../EzComponent";
import { Click, GenericEvent } from "../../decorators";
import { TestChild1Component } from "./test-child1.component";
import { TestChild2Component } from "./test-child2.component";

export class TestComponent extends EzComponent {
    child1: TestChild1Component = new TestChild1Component();
    child2: TestChild1Component = new TestChild1Component();
    child3: TestChild1Component = new TestChild1Component();
    child4: TestChild2Component = new TestChild2Component();
    //events
    testVal: boolean = false;
    testVal2: boolean = false;
    testVal3: number = 0;
    testVal4: string = "";

    constructor() {
        super(html, css);
        this.addComponent(this.child1, "child1");
        this.addComponent(this.child2, "child2");
        this.addComponent(this.child3, "child3");
        this.addComponent(this.child4, "child4");
    }
    @Click("evtButton2")
    @Click("evtDiv2")
    evtDiv2Click() {
        this.testVal3++;
    }
    @Click("evtDiv1")
    evtDiv1Click() {
        this.testVal2 = !this.testVal2;
    }
    @Click("evtButton1")
    evtbutton1Click() {
        this.testVal = !this.testVal;
    }
    @GenericEvent("evtInput1", "change")
    evtInput1Change(event: Event) {
        this.testVal4 = (event.target as HTMLInputElement).value;
    }
}
