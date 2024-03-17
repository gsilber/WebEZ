import { EzComponent } from "../../EzComponent";
import {
    BindInnerHTML,
    BindValue,
    Click,
    GenericEvent,
} from "../../decorators";
import { TestChild1Component } from "./test-child1.component";
import { TestChild2Component } from "./test-child2.component";

const html = `<div id="child1"></div>
<div id="child2"></div>
<div id="child3"></div>
<div id="child4"></div>
<button id="evtButton1"></button>
<button id="evtButton2"></button>
<div id="evtDiv1"></div>
<div id="evtDiv2"></div>
<input type="text" id="evtInput1" />
<input type="text" id="bindInput1" />
<input type="text" id="bindInput2" />
<div id="bindDiv1"></div>
<div id="bindDiv2"></div>
<div id="bindDiv3"></div>
<div id="bindDiv4"></div>
<div id="bindDiv5"></div>
`;
const css = "";

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

    @BindInnerHTML("bindDiv1")
    testbind1: string = "hello";

    @BindValue("bindInput1")
    testbind2: string = "hello";

    @BindInnerHTML("bindDiv2")
    @BindInnerHTML("bindDiv3")
    testbind3: string = "hello";

    @BindInnerHTML("bindDiv4")
    @BindInnerHTML("bindDiv5")
    @BindValue("bindInput2")
    testbind4: string = "hello";

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
