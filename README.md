# WebEZ - A simple web framework for Typescript (0.3.15)

## Getting Started

WebEZ is a simple to use framework for developing web applications in typescript. WebEZ uses _webpack_ to create a single html and javascript file ready for deployment.

To get started, install the webez command line interface.

```
npm install -g webez-cli
```

Once installed, you can use the `webez` command to create a new web application and to add components to an existing one.

## Creating a new website

Go to the parent directory of where you want your new application and issue the command.

```
webez new <project name>
```

where **project name** is the name you want to use for your new project. WebEZ will set up your project directory and install necessary dependencies. When it completes, you can access the project folder

```
cd <project name>
```

and open your project in your favorite IDE.

## Creating a new component for your website

At the command line, navigate to the src/app folder (or a subfolder if you built more structure) and issue the webez component command

```
webez component <componentName>
```

where **componentName** is the component to create. This will create the following files:

-   component-name.component.ts : A class named ComponentNameComponent
-   component-name.component.html : The html for your component
-   component-name.component.css : The css for your component
-   component-name.component.test.ts : A jest testing stub for you to use

Note: If you include the word **component** at the end of your component name it will be removed (i.e. TestComponent would create test.component.ts)

## Site wide styles

You can find the file `styles.css` in the root of your project. You can add any global styles to this file and they will be applied site wide. You can also find `index.html` in the src folder. You can edit this file to add any additional global css or js files or change your application's title.

> Note: Do not remove the div with id `main-target` as it is critical to the operation of the framework.

## Building your site

The webez framework comes with npm build scripts which you can execute with

```
npm run <command>
```

Where command is one of:

-   build - Builds a development copy of your project in ./dist
-   build:dev - Builds a development copy of your project in ./dist
-   build:prod - Builds a production copy of your project in ./dist
-   start - Builds and runs your project in the deveopment server for testing
-   test - Runs Jest tests on your code
-   coverage - Runs a test coverage report on your code and tests

Additionally, you can look in the generated package.json for more options.

## Designing components

When you first create a site, it contains a single component called MainComponent in the files `main.component.[ts | html | css | test.ts]`. Additionally added components can be found in their respective sub-folders once created. Building components can be accomplished by following these steps.

-   Author the html for your component. For any element (div, span, input, button, etc.) for which you will want to add functionality (i.e. binding to a variable or capturing an event), you should give that element a unique id. in the id property.

```
<input type="text" id="user-name" />
<div id="user-count"></div>
<button id="increment-btn">Click Me</button>
```

-   Write css to style your html

```
#user-count{
	font-weight:bold;
	font-size:20pt;
	color: blue;
	min-height:50px;
}
```

-   Add properties and methods to your class to hold values or handle events

```
export class MainComponent extends EzComponent {
	///will link up to the input element
    userName: string = "";
	//will link up to the div element
    userCount: string = "0";

    constructor() {
        super(html, css);
    }

	// will link up to the button element
    onIncrementBtnClick() {
        let n: number = +this.userCount;
        this.userCount = (n + 1).toString();
    }
}
```

-   Decorate the properties with one of BindInnerHtml, BindValue, BindStyle or BindCSSClass specifying the id of the element you want to bind. Note BindInnerHtml is one way, it will keep the elements value equivalent to the property. BindValue is bi-directional and will keep the property and element in sync. This is suitable for inputs. BindCSSClass will bind the elmements `class` attribute to the property.  It will leave any classes defined in the html alone, they cannot be removed programmatically. Changing the property value changes the css class of the element for dynamic styling. BindStyle will bind the specified element and specific style setting to the variable.  Note BindInnerHtml, BindStyle, and BindCSSClass can be stacked. BindValue can appear only once and must be the last decorator for a given element.

```
export class MainComponent extends EzComponent {
	@BindValue("user-name")
    userName: string = "";

	@BindInnerHtml("user-count")
    userCount: string = "0";

    @BindStyle("user-count","color")
    userCountColor:string=red;
    
    constructor() {
        super(html, css);
    }

	// will link up to the button element
    onIncrementBtnClick() {
        let n: number = +this.userCount;
        this.userCount = (n + 1).toString();
    }
}
```

-   Decorate methods with various event handlers. These include Click, Blur, Change, Input. There is also a generic event handler decorator GenericEvent which takes the id of the element and the name of the event you want in order to allow all html events to be captured.

```
export class MainComponent extends EzComponent {
	@BindValue("user-name")
    userName: string = "";

	@BindInnerHtml("user-count")
    userCount: string = "0";

    constructor() {
        super(html, css);
    }

	@Click("increment-btn")
    onIncrementBtnClick() {
        let n: number = +this.userCount;
        this.userCount = (n + 1).toString();
    }
}
```
## Decorators
### @BindValue(id)
Connects the value property of an html element with id bidirectionally with a member variable of the class.
```
HTML FILE:
<input type='text' id='inp1'/>
```

```
TS File:
@BindValue("inp1") inputValue:string="";
```
### @BindInnerHTML(id)
Connects the innerHTML property of an html element with id with a member variable of the class.  Updating the variable will update the html element, but not the other way around
```
HTML FILE:
<div id="div1"></div>
```
```TS File:
@BindInnerHTML("div1") divString:string='Hello world!!!';
```
### @BindCSSClass(id)
Connects the css class of an html element with id with a member variable of the class.  This does not effect css classes defined in the html.
```
HTML File:
<div id="div2"></div>
```
```
TS File:
@BindCSSClass("div2") div2Style:string="btn btn-primary"
```
### @BindCssClassEnabled(id,cssClassName)
This decorator connects a boolean property such then when it is true, the cssClassName is applied to the element with id.  This is independent of ```@BindCSSClass``` which binds a string value into the css class list
```
HTML File:
<div id="div1">Hello World!!!</div>
```
```
CSS File:
.hidden{
    display:none;
}
```
```
TS File:
@BindCSSClassEnabled("div1","hidden")
```
### @BindStyle(id,style)
Connects a specific style of an html element with id with a member variable of the class.  If the style you want has a -, the decorator expects in in camel case (i.e. background-color would be backgroundColor)
```
HTML File:
<div id="div3"></div>
```
```
TS File:
@BindStyle('div3','backgroundColor') div3BgColor:string="red";
```
### @BindAttribute(id,attributeName)
Unlike the other binders, this can be bound to either a string or a boolean.  If you bind to a string, it will set the value of the attribute.  If you bind to a boolean it will add or remove the attribute (for attributes like disabled that are active if they exist on the object, even if their value is undefined).
```
HTML File:
<btn id="btn1">
<img id="img1">
```
```
TS File:
@BindAttribute("btn1","disabled")
disableBtn:boolean=false;

@BindAttribute("img1","src")
imgSrc:string="http://my.imagesrc.com/img1";
```
### @GenericEvent(id,event)
This will connect any html event on an html element with id with a member method of the class.  The method must be of the form ```(evt:?Event)=>void.```
```
HTML File:
<button id="btn1"></button>
```
```
TS FIle:
@GenericEvent(btn1,"click")
onBtn1Click(evt:Event){
    console.log(evt);
}
```
### @Click(id)
This will connect the html click event on an html element with id with a member method of the class.  The method must be of the form ```(evt:?Event)=>void.```
```
HTML File:
<button id="btn1"></button>
```
```
TS FIle:
@Click("btn1")
onBtn1Click(evt:Event){
    console.log(evt);
}
```
### @Blur(id)
This will connect the html blur event on an html element with id with a member method of the class.  The method must be of the form ```(evt:?Event)=>void.```
```
HTML File:
<input type="text" id="inp2"/>
```
```
TS FIle:
@Blur("inp2")
onInputBlur(evt:Event){
    console.log(evt);
}
```
### @Change(id)
This will connect the html change event on an html element with id with a member method of the class.  The method must be of the form ```(evt:?Event)=>void.```
```
HTML File:
<input type="text" id="inp2"/>
```
```
TS FIle:
@Change("inp2")
onInputChange(evt:Event){
    console.log(evt);
}
```

### @Input(id)
This will connect the html input event on an html element with id with a member method of the class.  The method must be of the form ```(evt:?Event)=>void.```
```
HTML File:
<input type="text" id="inp2"/>
```
```
TS FIle:
@Blur("inp2")
onInput(evt:Event){
    console.log(evt);
}
```
### @Pipe(pipeFunction)
You can transform the text in a field before it is displayed using the ```@Pipe``` decorator.  These can be stacked and will be applied in the order they appear.  They can and should be stacked with any other ```@Bind``` decorator and will transform the text displayed.
```
HTML File:
<div id="mover" class="small-square-box"></div>
```
```
TS File:
    @Pipe((numStr: string) => numStr + "px")
    @BindStyle("mover", "top")
    private mover: string = "0";
    . . .
    @Click("btn"){
        this.mover=(+this.mover+10).toString();
    }

```
### @AppendPipe(string)
You can append the text to a field before it is displayed.
### @PrependPipe(string)
You can prepend the text to a field before it is displayed.
### @ReplacePipe(search:string|RegExp,replaceWith:string)
YOu can replace the search text with the repaceWith text before it is displayed.
## Stacking Methods
With the exception of the ```@BindValue``` decorator, decorators can be stacked on methods and properties.  The ```@BindValue``` can appear only once and if stacked with other decorators, must be the last one in the list.  Stacked decorators are applied from bottom to top.
```
@BindInnerHTML("div1"}
@BindInnerHTML("div2")
@BindValue("input1")
inputValue:string='';

@Change("inp1")
@Change("inp2")
@Input("inp3")
onValuesChanged(evt:Event){
    console.log(evt);
}
```

## Utility Methods
### @Timer(milliseconds)
There is a special decorator ```@Timer(milliseconds)``` which will call the decorated method every interval until the supplied cancel function is called.
```
@Timer(1000)
onTimer(cancel: CancelFunction){
    this.count++;
    console.log(this.count);
    if (this.count>=15) cancel();
}
```
This example will be called once per second.  It will print a counter from 0 to 15, and will stop the timer permenantly after 15 is printed.
### @WindowEvent(event)
There is another decorator ```@WindowEvent(event)``` which captures events on the entire window.  Useful for picking up keystrokes, mouse events, or resize events.
```
@WindowEvent("resize")
onMainWindowResize(sz:SizeInfo){
    console.log("The whole window is "+sz.windowWidth+" pixels wide.");
}
```
### focus(htmlElementId)
Set the focus to an element on the current component by id
```
this.setfocus('input1');
```
### click(htmlElementId)
Click the element on the current component by id.  This is useful for testing.
```
this.click('button1')
```
### ajax\<T>(url,method,headers,data):EventSubject\<T>
This allows you to make an asyncronous call and will return an EventSubject<T> for you to subscribe.  The eventsource will fire the subscription when the request is complete.
```
this.ajax<UserRecord>("https://www.udel.edu",HttpMethod.GET)
    .subscribe((result:UserRecord)=>{
        console.log(result);
    });
const request=this.ajax<boolean>("http://api.test.com",HttpMethod.POST,[],userRecord);
    request.subscribe((result:boolean)=>{
        console.log(result)
    });
    request.error((err:Error)=>{
        console.error(err);
    });
```
## Other types of components
### EzDialog
This EzComponent derived class allows you to create popup dialogs just like other components.  Your component just shows up in the middle of the dialog.  You can hide or show your dialog with ```this.show(true|false)```.  There is also a utility static method ```popup``` that you can use for a quick alert or confirm message.  It returns an EventSubject whose subscription is called when the dialog closes with the value of the button pressed (i.e. the text on the button).
```
webez dialog editor
```
will create an editor (works similar to component) dialog.  This can be modified and used:
```
const dlg:EditorDialog=new EditorDialog();
this.addComponent(dlg);
dlg.show();
```
an alert box can be shown simply by using:
```
    EzDialog.popup(this, "Message to display").subscribe(
    (value: string) => {
        console.log(value); //will be Ok
    },
);
```
A confirmation box can be shown by using:
```
        EzDialog.popup(this, "Message to display", "Window title", [
            "Yes",
            "No",
            "Cancel","btn btn-primary"
        ]).subscribe((value: string) => {
            if (value === "Yes") {
                console.log("Yes");
            } else if (value === "No") {
                console.log("No");
            } else {
                console.log("Cancel");
            }
        });
```
We are specifying the title, the buttons to display, and a class for the buttons to style them.  It will return a subscription that will evaluate to the button name passed into the method.
## Utility Classes
### EventSubject
The ```EventSubject``` class can be used to handle asynchronous code. You can either ```subscribe``` to it or convert it to a promise with the ```toPromise``` method.  Many functions in ```WebEZ``` return an ```EventSubject``` that you can subscribe to.
```
event:EventSubject<boolean> = new EventSubject<boolean>();
event.subscribe((result:boolean)=>{
    console.log(result);
},(err:Error)=>{
    console.log(err);
}
```
or
```
event:EventSubject<boolean> = new EventSubject<boolean>();
let result:boolean = await event.toPromise();
```

## Working example program
A fully working example can be found here: 
[https://gsilber.github.io/WebEZ/example](https://gsilber.github.io/WebEZ/example)

Another here:
[https://gsilber.github.io/WebEZ/webpong](https://gsilber.github.io/WebEZ/webpong)

And my personal favorite:
[https://gsilber.github.io/WebEZ/lander](https://gsilber.github.io/WebEZ/lander)

And one more showing api usage:
[https://gsilber.github.io/WebEZ/movies](https://gsilber.github.io/WebEZ/movies)

All of these were created with WebEZ without accessing any DOM elements directly.

## Full Technical Documenation

Full technical documentation is available [https://gsilber.github.io/WebEZ/](https://gsilber.github.io/WebEZ/)
