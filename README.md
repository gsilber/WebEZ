# WebEZ - A simple web framework for Typescript (0.4.3)

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

	@BindValue("user-count",(v:number)=>v.toString())
    userCount: number = 0;

    @BindStyle("user-count","color")
    userCountColor:string="red";
    
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

	@BindValue("user-count",(v:number)=>v.toString())
    userCount: number = 0;

    @BindStyle("user-count","color")
    userCountColor:string="red";
    
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
## Bind Decorators
### @BindValue(id)
> Binds to string, or must have a transform that returns a string 

Connects the value property of an html element with id.  Optionally takes a transform method.
```
HTML FILE:
<input type='text' id='inp1'/>
<input type='text' id='inp2'/>
```

```
TS File:
@BindValue("inp1") inputValue:string="";
@BindValue("inp2",(v:number)=>v.toString())  inputValue2:number=0;


```
### @BindCSSClass(id)
> Binds to string or must have a transform that returns a string.

Connects the css class of an html element with id with a member variable of the class.  This does not effect css classes defined in the html.
```
HTML File:
<div id="div2"></div>
<div id="div3"></div>
```
```
TS File:
@BindCSSClass("div2") div2Class:string="btn btn-primary";
@BindCSSClass("div3",(v:boolean)=>v?"hidden":"") hidden:boolean=true;
```
### @BindStyle(id,style)
> Binds to string or must have a transform that returns a string.

Connects a specific style of an html element with id with a member variable of the class.  If the style you want has a -, the decorator expects in in camel case (i.e. background-color would be backgroundColor)
```
HTML File:
<div id="div2"></div>
<div id="div3"></div>
```
```
TS File:
@BindStyle('div2','backgroundColor') div3BgColor:string="red";
@BindStyle('div2','display',(v:boolean)=>v?"none":"block") hidden:boolean=true;
```
### @BindAttribute(id,attributeName)
> Binds to string or must have a transform that returns a string.

Connects an attribute of an html element with id with a member variable of the class.  If the value is the empty string, the attribute is deleted from the element.
```
HTML File:
<btn id="btn1">
<img id="img1">
```
```
TS File:
@BindAttribute("btn1","disabled",(v:boolean)=>v?"disabled":"")
disableBtn:boolean=false;

@BindAttribute("img1","src")
imgSrc:string="http://my.imagesrc.com/img1";
```

### @BindCSSClassToBoolean(id,className)
> Binds to a boolean

Connects className to the element with id if the value is true.  Removes it otherwise.
```
HTML File:
<div id="div1"></div>
```
```
TS File:
@BindCSSClassToBoolean('div1','size-huge') makeItBig:boolean=true;

```

### BindDisabledToBoolean(id)
> Binds to a boolean

Disables the element with id when true.  Enables it otherwise
```
HTML File:
<div id="div1"></div>
```
```
TS File:
@BindDisabledToBoolean('div1') disabled:boolean=false;

```
### BindVisibleToBoolean
>Binds to a boolean

Shows or hides an element based on the value of the boolean.
```
HTML File:
<div id="div1"></div>
```
```
TS File:
@BindVisibleToBoolean('div1') visible:boolean=true;

```


### BindStyleToNumberAppendPx
>Binds to a number

Binds a numeric property to the element with id and appends "px" to the end of the string.
```
HTML File:
<div id="div1"></div>
```
```
TS File:
@BindStyleToNumberAppendPx("div1","width") width:number=200;

```


## Event Decorators
### @GenericEvent(id,event)
> Binds to {(evt:?Event)=>void} 

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
> Binds to {(evt:?Event)=>void} 

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
> Binds to {(evt:?Event)=>void} 

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
> Binds to {(evt:?Event)=>void} 

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
> Binds to {(evt:?Event)=>void} 

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
### Bind Transforms

Unless otherwise specified, bind decorators can take an extra argument to convert the member you are binding's value to a string before sending it to the decorator.  These transform methods must return the appropriate type for the element and type of decorator.
```
HTML File:
<div id="mover" class="small-square-box"></div>
```
If our property is a string, we don't have to do anything.
```
TS File:
@BindStyle('mover','top') value:string="100px";
```
If our propety is a number, then we can still bind it like this
```
@BindStyle('mover','top',(v:number)=>v.toString()+"px") value:number=100;
```
Note that the method we pass in converts our property type (number) to a string.

There are also some simple wrappers available to help you as documented above.  In the case of our last example, we could use a wrapper like this:
```
@BindStyleToNumberAppendPx("div1") value:number=100;
```
## Stacking Methods

All decorators can be stacked on methods and properties.  Stacked decorators are applied from bottom to top.
```
@BindValue("div1"}
@BindValue("div2")
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
> Binds to {TimerCancelFunction} ()=>void

There is a special decorator ```@Timer(milliseconds)``` which will call the decorated method every interval until the supplied cancel function is called.
```
@Timer(1000)
onTimer(cancel: TimerCancelFunction){
    this.count++;
    console.log(this.count);
    if (this.count>=15) cancel();
}
```
This example will be called once per second.  It will print a counter from 0 to 15, and will stop the timer permenantly after 15 is printed.
### @WindowEvent(event)
> Binds to {e:Event)=>void}

There is another decorator ```@WindowEvent(event)``` which captures events on the entire window.  Useful for picking up keystrokes, mouse events, or resize events.
```
@WindowEvent("resize")

onMainWindowResize(evt:Event){
    console.log("The whole window is "+sz.windowWidth+" pixels wide.");
}
```
### focus(htmlElementId)
Set the focus to an element on the current component by id
```
this.setfocus('input1');
```
### getValue(htmlElementId)
Get the value of the elment on the current component by id.  If the element does not exist or does not have a value this method return ```undefined```.
```
let val:string=this.getValue("input1");
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
