import { EzComponent } from "../../EzComponent";
import {
    BindCSSClass,
    BindInnerHTML,
    BindStyle,
    BindValue,
} from "../../bind.decorators";
import {
    Click,
    GenericEvent,
    Blur,
    Change,
    Input,
} from "../../event.decorators";
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
<div id="bindDiv6"></div>
<div id="bindDiv7"></div>
<div id="bindDiv8"></div>
<div id="styleDiv1"></div>
<div id="styleDiv2"></div>
<div id="styleDiv3"></div>
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

    @BindStyle("styleDiv1", "color")
    testStyle1: string = "red";

    @BindStyle("styleDiv2", "color")
    @BindStyle("styleDiv3", "color")
    testStyle2: string = "blue";

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

    @BindCSSClass("bindDiv6")
    testbind5: string = "hello";
    @BindCSSClass("bindDiv7")
    @BindCSSClass("bindDiv8")
    testbind6: string = "hello";

    constructor() {
        super(html, css);
        this.addComponent(this.child1, "child1");
        this.addComponent(this.child2, "child2");
        this.addComponent(this.child3, "child3");
        this.addComponent(this.child4, "child4", true);
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
    @Blur("evtInput1")
    @Change("evtInput1")
    @Input("evtInput1")
    evtInput1Change(event: Event) {
        this.testVal4 = (event.target as HTMLInputElement).value;
    }
}
