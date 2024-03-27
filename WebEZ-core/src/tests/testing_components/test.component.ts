import { EzComponent } from "../../EzComponent";
import {
    AppendPipe,
    BindAttribute,
    BindCSSClass,
    BindInnerHTML,
    BindStyle,
    BindValue,
    Pipe,
    PrependPipe,
    ReplacePipe,
} from "../../bind.decorators";
import {
    Click,
    GenericEvent,
    Blur,
    Change,
    Input,
    Timer,
    WindowEvent,
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
<div id="bindDiv9"></div>
<div id="bindDiv10"></div>
<div id="bindDiv11"></div>
<div id="bindDiv12"></div>
<div id="bindDiv13"></div>
<div id="styleDiv1"></div>
<div id="styleDiv2"></div>
<div id="styleDiv3"></div>
<button id="attribBtn1"></button>
<button id="attribBtn2"></button>
<button id="attribBtn3"></button>
<button id="attribBtn4"></button>
<img id="attribImg1" />
<img id="attribImg2" />
<div id="attribDiv1"></div>
<div id="attribDiv2"></div>
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

    @BindInnerHTML("bindDiv9")
    @ReplacePipe("world", "World")
    @PrependPipe("$$$")
    @AppendPipe("!!!")
    @Pipe((val: string) => val + " world")
    @BindInnerHTML("bindDiv10")
    testbind7: string = "hello";

    @BindCSSClass("bindDiv11")
    @BindCSSClass("bindDiv12")
    testcss1: string = "btn";

    @BindCSSClass("bindDiv13")
    testcss2: string = "btn";

    @BindAttribute("attribBtn1", "disabled")
    testAttrib1: boolean = false;

    @BindAttribute("attribBtn2", "disabled")
    testAttrib3: boolean = true;

    @BindAttribute("attribBtn4", "disabled")
    @BindAttribute("attribBtn3", "disabled")
    testAttrib5: boolean = true;

    @BindAttribute("attribImg1", "src")
    @BindInnerHTML("attribDiv1")
    testAttrib2: string = "https://www.google.com";

    @BindInnerHTML("attribDiv1")
    @BindAttribute("attribImg1", "src")
    testAttrib6: string = "https://www.google.com";

    timerTest1: number = 0;
    constructor() {
        super(html, css);
        this.addComponent(this.child1, "child1");
        this.addComponent(this.child2, "child2");
        this.addComponent(this.child3, "child3");
        this.addComponent(this.child4, "child4", true);
    }

    fn: () => void = () => {};
    @Timer(1000)
    testTimer(kill: () => void) {
        this.fn();
        this.timerTest1++;
        if (this.timerTest1 >= 5) kill();
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

    @WindowEvent("resize")
    windowResize(event: UIEvent) {
        event.preventDefault();
    }
}
