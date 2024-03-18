# WebEZ - A simple web framework for Typescript

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

-   Decorate the properties with one of BindInnerHtml, BindValue, BindStyle or BindCSSClass specifying the id of the element you want to bind. Note BindInnerHtml is one way, it will keep the elements value equivalent to the property. BindValue is bi-directional and will keep the property and element in sync. This is suitable for inputs. BindCSSClass will bind the elmements `class` attribute to the property. Changing the property value changes the css class of the element for dynamic styling. BindStyle will bind the specified element and specific style setting to the variable.  Note BindInnerHtml, BindStyle, and BindCSSClass can be stacked. BindValue can appear only once and must be the last decorator for a given element.

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
## Working example program
A fully working example can be found here: 
[https://gsilber.github.io/WebEZ/example](https://gsilber.github.io/WebEZ/example)

## Full Technical Documenation

Full technical documentation is available [https://gsilber.github.io/WebEZ/](https://gsilber.github.io/WebEZ/)
