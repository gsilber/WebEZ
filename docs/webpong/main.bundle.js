/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@gsilber/webez/EzComponent.js":
/*!****************************************************!*\
  !*** ./node_modules/@gsilber/webez/EzComponent.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EzComponent = exports.HttpMethod = void 0;
const eventsubject_1 = __webpack_require__(/*! ./eventsubject */ "./node_modules/@gsilber/webez/eventsubject.js");
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["DELETE"] = "DELETE";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["OPTIONS"] = "OPTIONS";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
/**
 * @description A base class for creating web components
 * @export
 * @abstract
 * @class EzComponent
 * @example class MyComponent extends EzComponent {
 *   constructor() {
 *     super("<h1>Hello World</h1>", "h1{color:red;}");
 *   }
 * }
 */
class EzComponent {
    /**
     * @description An event that fires when the window is resized
     * @readonly
     * @type {EventSubject<SizeInfo>}
     * @memberof EzComponent
     * @example this.onResizeEvent.subscribe((sizeInfo) => {
     *  console.log(sizeInfo.windowWidth);
     *  console.log(sizeInfo.windowHeight);
     * });
     */
    get onResizeEvent() {
        return EzComponent.resizeEvent;
    }
    /**
     * @description Creates an instance of EzComponent.
     * @param {string} [html=""] The html as a string to be used as the body of this component
     * @param {string} [css=""] The css as a string to be used as the style of this component
     * @memberof EzComponent
     * @public
     * @constructor
     */
    constructor(html, css) {
        this.html = html;
        this.css = css;
        this.htmlElement = window.document.createElement("div");
        this.shadow = this.htmlElement.attachShadow({ mode: "open" });
        this.template = window.document.createElement("template");
        this.template.innerHTML = this.html;
        for (let style of window.document.styleSheets) {
            /* Jest does not populate the ownerNode member, so this can't be tested*/
            /* istanbul ignore next */
            if (style.ownerNode)
                this.shadow.appendChild(style.ownerNode.cloneNode(true));
        }
        this.styles = window.document.createElement("style");
        this.styles.innerHTML = this.css;
        this.shadow.appendChild(this.styles);
        const innerDiv = window.document.createElement("div");
        innerDiv.id = "rootTemplate";
        innerDiv.appendChild(this.template.content);
        this.template.content.appendChild(innerDiv);
        this.shadow.appendChild(innerDiv);
        this.shadow.appendChild(this.template.content.cloneNode(true));
        if (!window.onresize) {
            window.onresize = () => {
                EzComponent.resizeEvent.next({
                    windowWidth: window.innerWidth,
                    windowHeight: window.innerHeight,
                });
            };
        }
    }
    /**
     * @description Add a component to the dom
     * @param component The component to add
     * @param id The id of the element to append the component to (optional)
     * @returns void
     * @memberof EzComponent
     * @example
     *   component.addComponent(childComponent);
     *   component.addComponent(childComponent, "myDiv");
     */
    addComponent(component, id = "root", front = false) {
        if (front) {
            if (id === "root") {
                if (this.shadow.firstChild)
                    this.shadow.insertBefore(component.htmlElement, this.shadow.firstChild);
            }
            else {
                let el = this.shadow.getElementById(id);
                if (el) {
                    if (el.firstChild)
                        el.insertBefore(component.htmlElement, el.firstChild);
                    else
                        el.appendChild(component.htmlElement);
                }
            }
        }
        else {
            if (id === "root") {
                this.shadow.appendChild(component.htmlElement);
            }
            else {
                let el = this.shadow.getElementById(id);
                if (el) {
                    el.appendChild(component.htmlElement);
                }
            }
        }
    }
    /**
     * @description Remove a component from the dom
     * @param component
     * @returns EzComponent
     * @memberof EzComponent
     * @example
     * component.addComponent(childComponent);
     * component.removeComponent(childComponent);
     */
    removeComponent(component) {
        component.htmlElement.remove();
        return component;
    }
    /**
     * @description Append the component to a dom element
     * @param domElement
     * @returns void
     * @memberof EzComponent
     * @example component.appendToDomElement(document.getElementById("myDiv"));
     */
    appendToDomElement(domElement) {
        domElement.appendChild(this.htmlElement);
    }
    /**
     * @description Makes an AJAX call
     * @param {string} url The URL to make the AJAX call to
     * @param {HttpMethod} method The HTTP method to use (GET or POST)
     * @param {Headers} headers The headers to send with the request (optional)
     * @param {T} data The data to send in the request body (optional)
     * @returns {Promise<T>} A promise that resolves with the response data
     * @memberof EzComponent
     * @example myComponent.ajax("https://some.api.url.com/posts", HttpMethod.GET)
     *  .subscribe((data) => {
     *   console.log(data);
     * }, (error) => {
     *   console.error(error);
     * });
     */
    ajax(url, method, headers = [], data) {
        const evt = new eventsubject_1.EventSubject();
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        for (let header of headers) {
            Object.keys(header).forEach((key) => {
                if (header[key])
                    xhr.setRequestHeader(key, header[key]);
            });
        }
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                evt.next(JSON.parse(xhr.responseText));
            }
            else {
                evt.error(new Error(xhr.statusText));
            }
        };
        xhr.onerror = () => {
            evt.error(new Error("Network error"));
        };
        xhr.send(JSON.stringify(data));
        return evt;
    }
    /**
     * @description Get the size of the window
     * @returns {SizeInfo} The size of the window
     * @memberof EzComponent
     * @example const sizeInfo: SizeInfo = myComponent.getWindowSize();
     */
    getWindowSize() {
        return {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        };
    }
    /**
     * @description Set focus to an element on this component
     * @param {string} elementId The id of the element to focus
     * @returns void
     */
    focus(elementId) {
        let el = this.shadow.getElementById(elementId);
        if (el)
            el.focus();
    }
    /**
     * @description Click an element on this component
     * @param {string} elementId The id of the element to click
     * @returns void
     */
    click(elementId) {
        let el = this.shadow.getElementById(elementId);
        if (el)
            el.click();
    }
}
exports.EzComponent = EzComponent;
EzComponent.resizeEvent = new eventsubject_1.EventSubject();


/***/ }),

/***/ "./node_modules/@gsilber/webez/EzDialog.js":
/*!*************************************************!*\
  !*** ./node_modules/@gsilber/webez/EzDialog.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EzDialog = exports.popupDialog = void 0;
const EzComponent_1 = __webpack_require__(/*! ./EzComponent */ "./node_modules/@gsilber/webez/EzComponent.js");
const eventsubject_1 = __webpack_require__(/*! ./eventsubject */ "./node_modules/@gsilber/webez/eventsubject.js");
/** @hidden */
exports.popupDialog = undefined;
const alertDialogTempalte = `
<div style="width: 600px; margin: -10px">
    <div
        id="title"
        style="
            background: silver;
            padding: 10px;
            font-size: 20pt;
            font-weight: bold;
            overflow: hidden;
        "
    >
        My Dialog
    </div>
    <div
        style="
            display: flex;
            min-height: 100px;
            margin: 10px;
            font-size: 20px;
            text-align: center;
            align-items: center;
            justify-items: center;
            line-height: 20px;
        "
    >
        <div
            id="content"
            style="display: block; width: 100%; text-align: center"
        >
            Question goes here
        </div>
    </div>
    <div id="buttonDiv" style="margin: 10px; text-align: right; justify-content: center">
    </div>
</div>`;
const backgroundTemplate = `
.dialog-background {
    display: none;
    position: absolute;
    text-align:center;
    z-index: 1050;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    outline: 0;
    background-color: rgb(0, 0, 0, 0.5);

}`;
const popupTemplate = `
.dialog-popup {
    position: relative;
    top:50%;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    transform: translateY(-50%);
    margin:auto;
    box-shadow: 4px 8px 8px 4px rgba(0, 0, 0, 0.2);
	display:inline-block;
	overflow:hidden;
}`;
/**
 * @description A dialog component that can be used to create a popup dialog
 * @export
 * @class EzDialog
 * @extends {EzComponent}
 * @example const dialog = new EzDialog("<h1>Hello World</h1>", "h1{color:red;}");
 */
class EzDialog extends EzComponent_1.EzComponent {
    /**
     * @description Creates an instance of EzComponent.
     * @param {string} [html=""] The html as a string to be used as the body of this component
     * @param {string} [css=""] The css as a string to be used as the style of this component
     * @memberof EzComponent
     * @public
     * @constructor
     * @example const dlg = new EzDialog("<h1>Hello World</h1>", "h1{color:red;}");
     */
    constructor(html = "", css = "") {
        super(html, css);
        this.closeEvent = new eventsubject_1.EventSubject();
        const styleEl = window.document.createElement("style");
        styleEl.innerHTML = backgroundTemplate + popupTemplate;
        this["shadow"].appendChild(styleEl);
        //now add 2 more divs
        this.background = window.document.createElement("div");
        this.background.className = "dialog-background";
        this.background.id = "background-root";
        this.background.style.display = "none";
        this.popup = window.document.createElement("div");
        this.popup.className = "dialog-popup";
        this.background.appendChild(this.popup);
        this["shadow"].appendChild(this.background);
        const outside = this["shadow"].getElementById("rootTemplate");
        if (outside)
            this.popup.appendChild(outside);
    }
    /**
     * @description Show or hide the dialog
     * @param {boolean} [show=true] Show or hide the dialog
     * @returns void
     * @memberof EzDialog
     * @example
     * const dialog = new MyDialog();
     * dialog.show();
     * dialog.closeEvent.subscribe((value) => {
     *    console.log(value);
     *    dialog.show(false);
     * });
     */
    show(show = true) {
        if (show) {
            this.background.style.display = "inline-block";
        }
        else {
            this.background.style.display = "none";
        }
    }
    /**
     * @description Show a popup dialog
     * @static
     * @param {EzComponent} attachTo The component to attach the dialog to
     * @param {string} message The message to display
     * @param {string} [title="Alert"] The title of the dialog
     * @param {string[]} [buttons=["Ok"]] The buttons to display
     * @param {string} [btnClass=""] The class to apply to the buttons
     * @returns {EventSubject<string>} The event subject that is triggered when the dialog is closed
     * @memberof EzDialog
     * @example
     * EzDialog.popup("Hello World", "Alert", ["Ok","Cancel"], "btn btn-primary")
     *    .subscribe((value:string) => {
     *       if (value === "Ok") console.log("Ok was clicked");
     *       else console.log("Cancel was clicked");
     *   });
     *
     *
     */
    static popup(attachTo, message, title = "Alert", buttons = ["Ok"], btnClass = "") {
        const dialog = new EzDialog(alertDialogTempalte);
        exports.popupDialog = dialog;
        let titleEl = dialog["shadow"].getElementById("title");
        if (titleEl)
            titleEl.innerHTML = title;
        let contentEl = dialog["shadow"].getElementById("content");
        if (contentEl)
            contentEl.innerHTML = message;
        //add buttons
        const buttonDiv = dialog["shadow"].getElementById("buttonDiv");
        if (buttonDiv) {
            for (let btn of buttons) {
                let button = window.document.createElement("button");
                button.innerHTML = btn;
                button.value = btn;
                button.id = "btn_" + btn;
                button.className = btnClass;
                button.style.marginLeft = "10px";
                button.addEventListener("click", () => {
                    dialog.show(false);
                    dialog.closeEvent.next(button.value);
                });
                buttonDiv.appendChild(button);
            }
        }
        attachTo.addComponent(dialog);
        dialog.show();
        dialog.closeEvent.subscribe(() => {
            attachTo["removeComponent"](dialog);
        });
        return dialog.closeEvent;
    }
}
exports.EzDialog = EzDialog;


/***/ }),

/***/ "./node_modules/@gsilber/webez/bind.decorators.js":
/*!********************************************************!*\
  !*** ./node_modules/@gsilber/webez/bind.decorators.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReplacePipe = exports.PrependPipe = exports.AppendPipe = exports.Pipe = exports.BindValue = exports.BindInnerHTML = exports.BindCSSClass = exports.BindStyle = void 0;
/**
 * @description Gets the public key of the field name
 * @param name the name of the field
 * @returns the public key
 */
function getPublicKey(name) {
    return String(name);
}
/**
 * @description Gets the private key of the field name
 * @param name the name of the field
 * @returns the private key
 */
function getPrivateKey(name) {
    return `__${String(name)}`;
}
/**
 * @description Gets the pipe key of the field name
 * @param name the name of the field
 * @returns the pipe key
 */
function getPipeKey(name) {
    return `__${String(name)}_pipe`;
}
/**
 * @description computes a piped value
 * @param target the class to decorate
 * @param name the name of the field
 * @returns The field with the pipe applied if it has not already been applied
 */
function computePipe(target, name, value) {
    const pipeKey = getPipeKey(name);
    let newValue = value;
    if (target[pipeKey]) {
        newValue = target[pipeKey](newValue);
    }
    return newValue;
}
/**
 * @description replaces a property with a new setter and the default getter.  The new setter can call the original setter.
 * @param target the class to replace the setter in
 * @param name the property to replace the setter for
 * @param value the initial value of the property
 * @param setter the new setter to replace the original setter with, this does not need to update the hidden private property.
 */
function hookProperty(target, name, value, setter) {
    const publicKey = getPublicKey(name);
    const privateKey = getPrivateKey(name);
    Object.defineProperty(target, privateKey, {
        value,
        writable: true,
        enumerable: false,
        configurable: true,
    });
    Object.defineProperty(target, publicKey, {
        get() {
            return this[privateKey];
        },
        set(value) {
            this[privateKey] = value;
            setter(value);
        },
        enumerable: true,
        configurable: true,
    });
}
/**
 * @description Replace setter and getter with the ones provided.  These may call the original setter and getter.
 * @param target the class to replace the setter and getter in
 * @param name the property to replace the setter and getter for
 * @param origDescriptor the original property descriptor
 * @param setter the new setter to replace the original setter with, this does not need to update the hidden private property.
 */
function hookPropertySetter(target, name, origDescriptor, setter) {
    const publicKey = getPublicKey(name);
    Object.defineProperty(target, publicKey, {
        get: origDescriptor.get, // Leave the get accessor as it was
        set(value) {
            if (origDescriptor.set) {
                origDescriptor.set.call(target, value); // Call the original set accessor with the provided value
            }
            setter(value);
        },
        enumerable: origDescriptor.enumerable,
        configurable: origDescriptor.configurable,
    });
}
/**
 * @description Returns a property descriptor for a property in this class
 * @param target the class to get the property descriptor from
 * @param key the property to get the descriptor for
 * @returns PropertyDescriptor
 */
function getPropertyDescriptor(target, key) {
    let origDescriptor = Object.getOwnPropertyDescriptor(target, key);
    /* this can't happen.  Just here for type safety checking*/
    /* istanbul ignore next */
    if (!origDescriptor) {
        throw new Error(`can not find setter with name: ${key}`);
    }
    return origDescriptor;
}
/**
 * @description Decorator to bind a specific style to an element
 * @param id the element to bind the property to
 * @param style the style to bind (i.e. background-color, left, top, etc.)
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will set the background color of the div with id myDiv to the value in backgroundColor
 * @BindStyle("myDiv", "backgroundColor")
 * public backgroundColor: string = "red";
 */
function BindStyle(id, style) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            //replace the style tag with the new value
            element.style[style] = computePipe(this, context.name, value);
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, (value) => {
                    element.style[style] = computePipe(this, context.name, value);
                });
            }
            else {
                hookProperty(this, context.name, value, (value) => {
                    element.style[style] = computePipe(this, context.name, value);
                });
            }
        });
    };
}
exports.BindStyle = BindStyle;
/**
 * @description Decorator to bind the className property to an element.  Only effects BindStyle and BindInnerHtml decorators
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will set the CSS class of the div with id myDiv to the value in cssClass
 * @BindCSSClass("myDiv")
 * public cssClass: string = "myCSSClass";
 */
function BindCSSClass(id) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const origValue = element.className;
            const value = context.access.get(this);
            element.className = origValue + " " + value;
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, (value) => {
                    element["className"] = origValue + " " + value;
                });
            }
            else {
                hookProperty(this, context.name, value, (value) => {
                    element["className"] = origValue + " " + value;
                });
            }
        });
    };
}
exports.BindCSSClass = BindCSSClass;
/**
 * @description Decorator to bind the innerHtml property to an element.
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will display Hello World in the div with id myDiv
 * @BindInnerHTML("myDiv")
 * public hello: string = "Hello World";
 */
function BindInnerHTML(id) {
    return function (_target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            element.innerHTML = computePipe(this, context.name, value);
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, (value) => {
                    element["innerHTML"] = computePipe(this, context.name, value);
                });
            }
            else {
                hookProperty(this, context.name, value, (value) => {
                    element["innerHTML"] = computePipe(this, context.name, value);
                });
            }
        });
    };
}
exports.BindInnerHTML = BindInnerHTML;
/**
 * @description Decorator to bind the Value property to an element.  Should be input elements
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @note This decorator should be last in the list of decorators for a property and can only appear once.
 * @export
 * @example
 * //This will bind the value of the input element with id myInput to the value property of the class
 * @BindValue("myInput")
 * public value: string = "Hello";
 */
function BindValue(id) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            element.value = value;
            //hook both getter and setter to value
            if (origDescriptor.set) {
                throw new Error("Cannot stack multiple value decorators.  If stacking with InnerHtml decorator, the value decorator must be last in the list.");
            }
            else {
                hookProperty(this, context.name, value, (value) => {
                    element["value"] = value;
                });
                element.addEventListener("input", () => {
                    this[publicKey] = element.value;
                });
            }
        });
    };
}
exports.BindValue = BindValue;
/**
 * @description Decorator to transform the value of a property before it is set on the html element.
 * @param fn {PipeFunction} the function to transform the value
 * @returns DecoratorCallback
 * @example
 * //This will display Hello World in the div with id myDiv
 * @Pipe((v: string) => v + " World")
 * @BindInnerHTML("myDiv")
 * public hello: string = "Hello";
 * @export
 */
function Pipe(fn) {
    return function (target, context) {
        context.addInitializer(function () {
            const privateKey = getPipeKey(context.name);
            //get method descriptor for publicKey in This
            if (this[privateKey]) {
                //overwrite it and call the original first
                const origMethod = this[privateKey];
                this[privateKey] = (value) => {
                    return fn(origMethod(value));
                };
                context.access.set(this, context.access.get(this));
            }
            else {
                this[privateKey] = fn;
                context.access.set(this, context.access.get(this));
            }
        });
    };
}
exports.Pipe = Pipe;
/**
 * @description Decorator to append to the value of a property before it is set on the html element.
 * @param val string to append
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will display Hello World in the div with id myDiv
 * @AppendPipe(" World")
 * @BindInnerHTML("myDiv")
 * public hello: string = "Hello";
 */
function AppendPipe(val) {
    return Pipe((v) => v + val);
}
exports.AppendPipe = AppendPipe;
/**
 * @description Decorator to prepend the value of a property before it is set on the html element.
 * @param val The string to prepend
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will display Hello World in the div with id myDiv
 * @PrependPipe("Hello ")
 * @BindInnerHTML("myDiv")
 * public hello: string = "World";
 */
function PrependPipe(val) {
    return Pipe((v) => val + v);
}
exports.PrependPipe = PrependPipe;
/**
 * @description Decorator to replace the value of a property before it is set on the html element.
 * @param search {string | RegExp} The string to replace
 * @param  replaceWith The string to replace in the current string
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will display Hello World in the div with id myDiv
 * @ReplacePipe("planet", "World")
 * @BindInnerHTML("myDiv")
 * public hello: string = "Hello planet";
 */
function ReplacePipe(search, replaceWith) {
    return Pipe((v) => v.replace(search, replaceWith));
}
exports.ReplacePipe = ReplacePipe;


/***/ }),

/***/ "./node_modules/@gsilber/webez/bootstrap.js":
/*!**************************************************!*\
  !*** ./node_modules/@gsilber/webez/bootstrap.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bootstrap = void 0;
/** @hidden */
function bootstrap(target, testModeHTML = "") {
    if (testModeHTML.length > 0) {
        window.document.body.innerHTML = testModeHTML;
    }
    let obj = Object.assign(new target());
    const element = window.document.getElementById("main-target");
    if (element)
        obj.appendToDomElement(element);
    else
        obj.appendToDomElement(window.document.body);
    return obj;
}
exports.bootstrap = bootstrap;


/***/ }),

/***/ "./node_modules/@gsilber/webez/event.decorators.js":
/*!*********************************************************!*\
  !*** ./node_modules/@gsilber/webez/event.decorators.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Timer = exports.Input = exports.Change = exports.Blur = exports.Click = exports.WindowEvent = exports.GenericEvent = void 0;
/**
 * @description Decorator to bind a generic event to an element
 * @param htmlElementID the element to bind the event to
 * @param type the event to bind
 * @returns DecoratorCallback
 * @export
 * @example
 * @GenericEvent("myButton", "click")
 * myButtonClick(e: MouseEvent) {
 *    console.log("Button was clicked");
 * }
 */
function GenericEvent(htmlElementID, type) {
    return function (target, context) {
        context.addInitializer(function () {
            let element = this["shadow"].getElementById(htmlElementID);
            if (element) {
                element.addEventListener(type, (e) => {
                    target.call(this, e);
                });
            }
        });
    };
}
exports.GenericEvent = GenericEvent;
/**
 * @description Decorator to bind a window event to the window
 * @param type the event to bind
 * @returns DecoratorCallback
 * @export
 * @example
 * @WindowEvent("resize")
 * onResize(e: WindowEvent) {
 *   console.log("Window was resized");
 * }
 */
function WindowEvent(type) {
    return function (target, context) {
        context.addInitializer(function () {
            window.addEventListener(type, (e) => {
                target.call(this, e);
            });
        });
    };
}
exports.WindowEvent = WindowEvent;
/**
 * @description Decorator to bind a click event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @example
 * @Click("myButton")
 * myButtonClick(e: MouseEvent) {
 *   console.log("Button was clicked");
 * }
 */
function Click(htmlElementID) {
    return GenericEvent(htmlElementID, "click");
}
exports.Click = Click;
/**
 * @description Decorator to bind a blur event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @example
 * @Blur("myInput")
 * myInputBlur(e: FocusEvent) {
 *  console.log("Input lost focus");
 * }
 */
function Blur(htmlElementID) {
    return GenericEvent(htmlElementID, "blur");
}
exports.Blur = Blur;
/**
 * @description Decorator to bind a change event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @example
 * @Change("myInput")
 * myInputChange(e: ChangeEvent) {
 *   console.log("Input changed");
 */
function Change(htmlElementID) {
    return GenericEvent(htmlElementID, "change");
}
exports.Change = Change;
/**
 * @description Decorator to bind an input event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 * @example
 * @Input("myInput")
 * myInputChange(e: InputEvent) {
 *  console.log("Input changed");
 * }
 */
function Input(htmlElementID) {
    return GenericEvent(htmlElementID, "input");
}
exports.Input = Input;
/**
 * @description Decorator to call a method periodically with a timer
 * @param intervalMS the interval in milliseconds to call the method
 * @returns DecoratorCallback
 * @note This executes repeatedly.  The decorated function is passed a cancel function that can be called to stop the timer.
 * @export
 * @example
 * let counter=0;
 * @Timer(1000)
 * myTimerMethod(cancel: TimerCancelMethod) {
 *   console.log("Timer method called once per second");
 *   if (counter++ > 5) cancel();
 */
function Timer(intervalMS) {
    return function (target, context) {
        context.addInitializer(function () {
            const intervalID = setInterval(() => {
                target.call(this, () => {
                    clearInterval(intervalID);
                });
            }, intervalMS);
        });
    };
}
exports.Timer = Timer;


/***/ }),

/***/ "./node_modules/@gsilber/webez/eventsubject.js":
/*!*****************************************************!*\
  !*** ./node_modules/@gsilber/webez/eventsubject.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventSubject = void 0;
class EventSubject {
    constructor() {
        this.refCount = 0;
        this.callbacks = [];
        this.errorFns = [];
    }
    /**
     * Subscribe to the event subject
     * @param callback The callback to call when the event is triggered
     * @param error The callback to call when an error is triggered
     * @returns The id of the subscription
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value:number) => {
     *  console.log(value);
     * });
     * subject.next(1);
     * subject.unsubscribe(id);
     */
    subscribe(callback, error) {
        this.callbacks.push({ id: this.refCount, fn: callback });
        if (error)
            this.errorFns.push({ id: this.refCount, fn: error });
        return this.refCount++;
    }
    /**
     * Unsubscribe from the event subject
     * @param id The id of the subscription to remove
     * @returns void
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value:number) => {
     *   console.log(value);
     * });
     * subject.next(1);
     * subject.unsubscribe(id);
     */
    unsubscribe(id) {
        this.callbacks = this.callbacks.filter((cb) => cb.id !== id);
        this.errorFns = this.errorFns.filter((cb) => cb.id !== id);
    }
    /**
     * Trigger the event subject
     * @param value The value to pass to the callback
     * @returns void
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value:number) => {
     *   console.log(value);
     * });
     * subject.next(1);
     * subject.unsubscribe(id);
     */
    next(value) {
        for (const callback of this.callbacks)
            callback.fn(value);
    }
    /**
     * Trigger the error event subject
     * @param value The value to pass to the callback
     * @returns void
     * @example
     * const subject = new EventSubject<number>();
     * const id = subject.subscribe((value:number) => {
     *   console.log(value);
     * }, (error) => {
     *  console.error(error);
     * });
     * subject.error(new Error("It doesnt't work!"));
     * subject.unsubscribe(id);
     */
    error(value) {
        for (const errorFn of this.errorFns)
            errorFn.fn(value);
    }
    /**
     * Convert the event subject to a promise
     * @description Convert the event subject to a promise.
     * This is useful for the async/await style async pattern.
     * @param none
     * @returns Promise<T>
     * @example
     * async myFunction() {
     *   const result=await EzDialog.popup(
     *     "Hello World",
     *     "Alert", ["Ok","Cancel"]).toPromise();
     *   console.log(result);
     * }
     */
    toPromise() {
        return new Promise((resolve, reject) => {
            this.subscribe((value) => {
                resolve(value);
            }, (error) => {
                reject(error);
            });
        });
    }
}
exports.EventSubject = EventSubject;


/***/ }),

/***/ "./node_modules/@gsilber/webez/index.js":
/*!**********************************************!*\
  !*** ./node_modules/@gsilber/webez/index.js ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./bind.decorators */ "./node_modules/@gsilber/webez/bind.decorators.js"), exports);
__exportStar(__webpack_require__(/*! ./event.decorators */ "./node_modules/@gsilber/webez/event.decorators.js"), exports);
__exportStar(__webpack_require__(/*! ./EzComponent */ "./node_modules/@gsilber/webez/EzComponent.js"), exports);
__exportStar(__webpack_require__(/*! ./EzDialog */ "./node_modules/@gsilber/webez/EzDialog.js"), exports);
__exportStar(__webpack_require__(/*! ./eventsubject */ "./node_modules/@gsilber/webez/eventsubject.js"), exports);
__exportStar(__webpack_require__(/*! ./bootstrap */ "./node_modules/@gsilber/webez/bootstrap.js"), exports);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./styles.css":
/*!**********************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./styles.css ***!
  \**********************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/*Put your global styles here.  
* Individual components can be styled locatlly
*/

/* Add your global styles here */
/* Note you cannot use url's in this file, you must put those in the component's css file 
* or put a new css file in the assets directory and add it to the head element
* of the index.html file if you need them to be global.
*/
`, "",{"version":3,"sources":["webpack://./styles.css"],"names":[],"mappings":"AAAA;;CAEC;;AAED,gCAAgC;AAChC;;;CAGC","sourcesContent":["/*Put your global styles here.  \n* Individual components can be styled locatlly\n*/\n\n/* Add your global styles here */\n/* Note you cannot use url's in this file, you must put those in the component's css file \n* or put a new css file in the assets directory and add it to the head element\n* of the index.html file if you need them to be global.\n*/\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/app/ball/ball.component.css":
/*!*****************************************!*\
  !*** ./src/app/ball/ball.component.css ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".ball-holder {\n    position: relative;\n    width: 100%;\n    flex: 1;\n}\n#ball {\n    position: absolute;\n    border-radius: 50%;\n}\n");

/***/ }),

/***/ "./src/app/main.component.css":
/*!************************************!*\
  !*** ./src/app/main.component.css ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".full-page {\n    position: absolute;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    overflow: hidden;\n}\n.header {\n    background-color: #333;\n    height: 100px;\n    position: relative;\n    display: flex;\n    flex-direction: row;\n    padding: 10px;\n    box-shadow: 5px 5px 1px 1px #888888;\n}\n\n.header-left {\n    position: relative;\n    flex: 1;\n    font-size: 30px;\n    font-style: italic;\n    color: aliceblue;\n    background: #333;\n    text-shadow: 2px 2px 4px rgba(255, 255, 255, 0.5);\n}\n.header-middle {\n    font-size: 30px;\n    margin: 2px 50px 10px 10px;\n    padding: 0 10px;\n    color: aliceblue;\n    line-height: 30px;\n    overflow: hidden;\n    height: 35px;\n    background-color: black;\n}\n.header-right {\n    padding-right: 10px;\n}\n.content-body {\n    position: absolute;\n    top: 60px;\n    bottom: 0;\n    left: 0px;\n    background: rgb(2, 0, 36);\n    background: linear-gradient(\n        90deg,\n        rgba(2, 0, 36, 1) 0%,\n        rgba(9, 9, 121, 1) 7%,\n        rgba(0, 212, 255, 1) 26%\n    );\n    right: 0px;\n    overflow: auto;\n    display: flex;\n}\n#game-board {\n    position: realtive;\n    margin: auto;\n    background-image: url(\"assets/tennis.png\");\n    background-size: cover;\n    display: flex;\n    flex-direction: column;\n    border-radius: 10px;\n    overflow: hidden;\n}\n\n#timer {\n    color: yellow;\n}\n\n.instructions {\n    position: absolute;\n    padding: 20px;\n    width: 500px;\n    transform: translateX(-50%);\n    left: 50%;\n    top: 15px;\n    display: inline-block;\n    background: white;\n    border-radius: 10px;\n    box-shadow: 2px 2px 1px 1px #888888;\n}\n");

/***/ }),

/***/ "./src/app/paddle/paddle.component.css":
/*!*********************************************!*\
  !*** ./src/app/paddle/paddle.component.css ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".paddle-holder {\n    position: relative;\n    width: 100%;\n    flex: 1;\n}\n#paddle {\n    position: absolute;\n}\n");

/***/ }),

/***/ "./src/app/ball/ball.component.html":
/*!******************************************!*\
  !*** ./src/app/ball/ball.component.html ***!
  \******************************************/
/***/ ((module) => {

module.exports = "<div class=\"ball-holder\" id=\"parent\">\n    <div id=\"ball\"></div>\n</div>\n";

/***/ }),

/***/ "./src/app/main.component.html":
/*!*************************************!*\
  !*** ./src/app/main.component.html ***!
  \*************************************/
/***/ ((module) => {

module.exports = "<div class=\"full-page\" id=\"parent\">\n    <div class=\"header\">\n        <div class=\"header-left\">Web Pong</div>\n        <div class=\"header-middle\">\n            <div class=\"score\">Time: <span id=\"timer\">0:00</span></div>\n        </div>\n        <div class=\"header-right\">\n            <button class=\"btn btn-primary\" id=\"go\">Start Game</button>\n        </div>\n    </div>\n    <div class=\"content-body\">\n        <div class=\"instructions\">\n            <h2>Instructions</h2>\n            <p>\n                Use the a and z keys to move the paddle up and down. Try to hit\n                the ball with the paddle to keep it in play.\n            </p>\n        </div>\n        <div id=\"game-board\"></div>\n    </div>\n</div>\n";

/***/ }),

/***/ "./src/app/paddle/paddle.component.html":
/*!**********************************************!*\
  !*** ./src/app/paddle/paddle.component.html ***!
  \**********************************************/
/***/ ((module) => {

module.exports = "<div class=\"paddle-holder\" id=\"parent\">\n    <div id=\"paddle\"></div>\n</div>\n";

/***/ }),

/***/ "./styles.css":
/*!********************!*\
  !*** ./styles.css ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !./node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!./node_modules/css-loader/dist/cjs.js!./styles.css */ "./node_modules/css-loader/dist/cjs.js!./styles.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./src/app/ball/ball.component.ts":
/*!****************************************!*\
  !*** ./src/app/ball/ball.component.ts ***!
  \****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BallComponent = void 0;
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const ball_component_html_1 = __importDefault(__webpack_require__(/*! ./ball.component.html */ "./src/app/ball/ball.component.html"));
const ball_component_css_1 = __importDefault(__webpack_require__(/*! ./ball.component.css */ "./src/app/ball/ball.component.css"));
const globals_1 = __webpack_require__(/*! ../globals */ "./src/app/globals.ts");
const paddle_component_1 = __webpack_require__(/*! ../paddle/paddle.component */ "./src/app/paddle/paddle.component.ts");
/**
 * @description The ball component
 * @export
 * @class BallComponent
 * @extends {EzComponent}
 * @method restart : Restart the ball
 * @method increaseSpeed : Increase the speed of the ball
 * @method moveBall : Move the ball
 */
let BallComponent = (() => {
    var _a;
    let _classSuper = webez_1.EzComponent;
    let _instanceExtraInitializers = [];
    let __ball_width_decorators;
    let __ball_width_initializers = [];
    let __ball_width_extraInitializers = [];
    let __ball_height_decorators;
    let __ball_height_initializers = [];
    let __ball_height_extraInitializers = [];
    let __ball_x_decorators;
    let __ball_x_initializers = [];
    let __ball_x_extraInitializers = [];
    let __ball_y_decorators;
    let __ball_y_initializers = [];
    let __ball_y_extraInitializers = [];
    let _ball_color_decorators;
    let _ball_color_initializers = [];
    let _ball_color_extraInitializers = [];
    let _increaseSpeed_decorators;
    let _moveBall_decorators;
    return _a = class BallComponent extends _classSuper {
            get ball_width() {
                return parseInt(this._ball_width);
            }
            set ball_width(value) {
                this._ball_width = value.toString();
            }
            get ball_height() {
                return parseInt(this._ball_height);
            }
            set ball_height(value) {
                this._ball_height = value.toString();
            }
            get ball_x() {
                return parseInt(this._ball_x);
            }
            set ball_x(value) {
                this._ball_x = value.toString();
            }
            get ball_y() {
                return parseInt(this._ball_y);
            }
            set ball_y(value) {
                this._ball_y = value.toString();
            }
            /**
             * @description The constructor for the ball component
             * @param {PaddleComponent} [paddle=new PaddleComponent()] - The paddle component
             * @memberof BallComponent
             * @summary Creates an instance of BallComponent.
             */
            constructor(paddle = new paddle_component_1.PaddleComponent()) {
                super(ball_component_html_1.default, ball_component_css_1.default);
                this.paddle = (__runInitializers(this, _instanceExtraInitializers), paddle);
                /**
                 * @description The width of the ball
                 * @private
                 * @type {string}
                 * @memberof BallComponent
                 * @summary Binds to ball style.width
                 * @summary Appends px to the value
                 */
                this._ball_width = __runInitializers(this, __ball_width_initializers, globals_1.Globals.BALL_DIMENSION.toString());
                /**
                 * @description The height of the ball
                 * @private
                 * @type {string}
                 * @memberof BallComponent
                 * @summary Binds to ball style.height
                 * @summary Appends px to the value
                 */
                this._ball_height = (__runInitializers(this, __ball_width_extraInitializers), __runInitializers(this, __ball_height_initializers, globals_1.Globals.BALL_DIMENSION.toString()));
                /**
                 * @description The x coordinate of the ball
                 * @private
                 * @type {string}
                 * @memberof BallComponent
                 * @summary Binds to ball style.left
                 * @summary Appends px to the value
                 */
                this._ball_x = (__runInitializers(this, __ball_height_extraInitializers), __runInitializers(this, __ball_x_initializers, ((globals_1.Globals.BOARD_WIDTH - this.ball_width) /
                    2).toString()));
                /**
                 * @description The y coordinate of the ball
                 * @private
                 * @type {string}
                 * @memberof BallComponent
                 * @summary Binds to ball style.top
                 * @summary Appends px to the value
                 */
                this._ball_y = (__runInitializers(this, __ball_x_extraInitializers), __runInitializers(this, __ball_y_initializers, ((globals_1.Globals.BOARD_HEIGHT - this.ball_height) /
                    2).toString()));
                /**
                 * @description Whether the ball is currently running
                 * @private
                 * @type {boolean}
                 */
                this.running = (__runInitializers(this, __ball_y_extraInitializers), false);
                /**
                 * @description holds the current timer kill function
                 */
                this.killTimer = () => { };
                /**
                 * @description The color of the ball
                 * @private
                 * @type {string}
                 * @memberof BallComponent
                 * @summary Binds to ball style.backgroundColor
                 */
                this.ball_color = __runInitializers(this, _ball_color_initializers, globals_1.Globals.BALL_COLOR);
                /**
                 * @description The speed of the ball
                 * @private
                 * @type {number}
                 * @memberof BallComponent
                 */
                this.ball_speed = (__runInitializers(this, _ball_color_extraInitializers), globals_1.Globals.BALL_SPEED);
                /**
                 * @description The direction vector of the ball
                 * @private
                 * @type {number[]}
                 * @memberof BallComponent
                 */
                this.ball_direction = [-1, -1];
                /**
                 * @description The maximum x coordinate of the ball
                 * @private
                 * @type {number}
                 * @memberof BallComponent
                 */
                this.maxX = globals_1.Globals.BOARD_WIDTH - this.ball_width;
                /**
                 * @description The maximum y coordinate of the ball
                 * @private
                 * @type {number}
                 * @memberof BallComponent
                 */
                this.maxY = globals_1.Globals.BOARD_HEIGHT - this.ball_height;
                /**
                 * @description The event subject for game over
                 * @public
                 * @type {EventSubject<void>}
                 * @memberof BallComponent
                 */
                this.gameOver = new webez_1.EventSubject();
            }
            /**
             * @description Restarts the ball
             * @public
             * @memberof BallComponent
             */
            restart() {
                this.ball_x = (globals_1.Globals.BOARD_WIDTH - this.ball_width) / 2;
                this.ball_y = (globals_1.Globals.BOARD_HEIGHT - this.ball_height) / 2;
                this.ball_direction = [-1, -1];
                this.ball_speed = globals_1.Globals.BALL_SPEED;
                this.running = true;
            }
            /**
             * @description Increases the speed of the ball every 10 seconds
             * @private
             * @memberof BallComponent
             * @summary Increases the speed of the ball
             * @summary Binds to the timer event
             */
            increaseSpeed() {
                if (this.running)
                    this.ball_speed += globals_1.Globals.BALL_SPEED_INCREMENT;
            }
            /**
             * @description Checks if two rectangles are colliding
             * @private
             * @param {Rectangle} r1 - The first rectangle
             * @param {Rectangle} r2 - The second rectangle
             * @returns {boolean} - Whether the rectangles are colliding
             * @memberof BallComponent
             */
            hitTest(r1, r2) {
                return (r1.x < r2.x + r2.width &&
                    r1.x + r1.width > r2.x &&
                    r1.y < r2.y + r2.height &&
                    r1.y + r1.height > r2.y);
            }
            /**
             * @description Main game loop for the ball
             * @private
             * @param {() => void} kill - The kill function for the timer
             * @memberof BallComponent
             * @summary Moves the ball
             * @summary Binds to the timer event every 50 milliseconds
             */
            moveBall(kill) {
                this.killTimer = kill;
                if (this.running) {
                    let newX = this.ball_x + this.ball_speed * this.ball_direction[0];
                    let newY = this.ball_y + this.ball_speed * this.ball_direction[1];
                    if (this.hitTest(this.getBallRect(), this.paddle.getPaddleRect())) {
                        this.ball_direction[0] = 1;
                        newX = this.paddle.getPaddleRect().x + globals_1.Globals.PADDLE_WIDTH;
                        this.ball_x = newX;
                        this.ball_y = newY;
                        return;
                    }
                    if (newX < 0) {
                        this.ball_direction[0] = 1;
                        this.ball_x = -50;
                        this.gameOver.next();
                        this.running = false;
                    }
                    if (newX > this.maxX) {
                        this.ball_direction[0] = -1;
                        newX = this.maxX;
                    }
                    if (newY < 0) {
                        this.ball_direction[1] = 1;
                        newY = 0;
                    }
                    if (newY > this.maxY) {
                        this.ball_direction[1] = -1;
                        newY = this.maxY;
                    }
                    this.ball_x = newX;
                    this.ball_y = newY;
                }
            }
            /**
             * @description Stops the ball
             * @public
             * @memberof BallComponent
             */
            getBallRect() {
                return {
                    x: this.ball_x,
                    y: this.ball_y,
                    width: this.ball_width,
                    height: this.ball_height,
                };
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            __ball_width_decorators = [(0, webez_1.BindStyle)("ball", "width"), (0, webez_1.AppendPipe)("px")];
            __ball_height_decorators = [(0, webez_1.BindStyle)("ball", "height"), (0, webez_1.AppendPipe)("px")];
            __ball_x_decorators = [(0, webez_1.BindStyle)("ball", "left"), (0, webez_1.AppendPipe)("px")];
            __ball_y_decorators = [(0, webez_1.BindStyle)("ball", "top"), (0, webez_1.AppendPipe)("px")];
            _ball_color_decorators = [(0, webez_1.BindStyle)("ball", "backgroundColor")];
            _increaseSpeed_decorators = [(0, webez_1.Timer)(10000)];
            _moveBall_decorators = [(0, webez_1.Timer)(50)];
            __esDecorate(_a, null, _increaseSpeed_decorators, { kind: "method", name: "increaseSpeed", static: false, private: false, access: { has: obj => "increaseSpeed" in obj, get: obj => obj.increaseSpeed }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _moveBall_decorators, { kind: "method", name: "moveBall", static: false, private: false, access: { has: obj => "moveBall" in obj, get: obj => obj.moveBall }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, __ball_width_decorators, { kind: "field", name: "_ball_width", static: false, private: false, access: { has: obj => "_ball_width" in obj, get: obj => obj._ball_width, set: (obj, value) => { obj._ball_width = value; } }, metadata: _metadata }, __ball_width_initializers, __ball_width_extraInitializers);
            __esDecorate(null, null, __ball_height_decorators, { kind: "field", name: "_ball_height", static: false, private: false, access: { has: obj => "_ball_height" in obj, get: obj => obj._ball_height, set: (obj, value) => { obj._ball_height = value; } }, metadata: _metadata }, __ball_height_initializers, __ball_height_extraInitializers);
            __esDecorate(null, null, __ball_x_decorators, { kind: "field", name: "_ball_x", static: false, private: false, access: { has: obj => "_ball_x" in obj, get: obj => obj._ball_x, set: (obj, value) => { obj._ball_x = value; } }, metadata: _metadata }, __ball_x_initializers, __ball_x_extraInitializers);
            __esDecorate(null, null, __ball_y_decorators, { kind: "field", name: "_ball_y", static: false, private: false, access: { has: obj => "_ball_y" in obj, get: obj => obj._ball_y, set: (obj, value) => { obj._ball_y = value; } }, metadata: _metadata }, __ball_y_initializers, __ball_y_extraInitializers);
            __esDecorate(null, null, _ball_color_decorators, { kind: "field", name: "ball_color", static: false, private: false, access: { has: obj => "ball_color" in obj, get: obj => obj.ball_color, set: (obj, value) => { obj.ball_color = value; } }, metadata: _metadata }, _ball_color_initializers, _ball_color_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.BallComponent = BallComponent;


/***/ }),

/***/ "./src/app/globals.ts":
/*!****************************!*\
  !*** ./src/app/globals.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Globals = void 0;
/** @description Global values to set up game
 * @summary These values are used to set up the game board, paddle, and ball
 */
exports.Globals = {
    BOARD_WIDTH: 600,
    BOARD_HEIGHT: 400,
    PADDLE_WIDTH: 15,
    PADDLE_HEIGHT: 75,
    PADDLE_COLOR: "blue",
    PADDLE_SPEED: 10,
    PADDLE_INDENT: 10,
    BALL_DIMENSION: 15,
    BALL_COLOR: "yellow",
    BALL_SPEED: 5,
    BALL_MAXSPEED: 40,
    BALL_SPEED_INCREMENT: 5,
};


/***/ }),

/***/ "./src/app/main.component.ts":
/*!***********************************!*\
  !*** ./src/app/main.component.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MainComponent = void 0;
const main_component_html_1 = __importDefault(__webpack_require__(/*! ./main.component.html */ "./src/app/main.component.html"));
const main_component_css_1 = __importDefault(__webpack_require__(/*! ./main.component.css */ "./src/app/main.component.css"));
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const paddle_component_1 = __webpack_require__(/*! ./paddle/paddle.component */ "./src/app/paddle/paddle.component.ts");
const globals_1 = __webpack_require__(/*! ./globals */ "./src/app/globals.ts");
const ball_component_1 = __webpack_require__(/*! ./ball/ball.component */ "./src/app/ball/ball.component.ts");
/**
 * @description The main component of the game
 * @export
 * @class MainComponent
 * @extends {EzComponent}
 * @method startGame : event handler for start button
 * @method updateTimer : Main game loop timer
 * @method start : Reset and start a new game
 * @method stop : Stop the game
 */
let MainComponent = (() => {
    var _a;
    let _classSuper = webez_1.EzComponent;
    let _instanceExtraInitializers = [];
    let _boardWidth_decorators;
    let _boardWidth_initializers = [];
    let _boardWidth_extraInitializers = [];
    let _boardHeight_decorators;
    let _boardHeight_initializers = [];
    let _boardHeight_extraInitializers = [];
    let _time_decorators;
    let _time_initializers = [];
    let _time_extraInitializers = [];
    let _startGame_decorators;
    let _updateTimer_decorators;
    return _a = class MainComponent extends _classSuper {
            /**
             * @description Creates an instance of MainComponent.
             * @memberof MainComponent
             * @summary Initializes the game board and components
             * @summary Subscribes to the ball's gameOver event to handle game over
             */
            constructor() {
                super(main_component_html_1.default, main_component_css_1.default);
                /**
                 * @description The width of the game board
                 * @private
                 * @type {string}
                 * @memberof MainComponent
                 * @summary Binds to game-board style.width
                 */
                this.boardWidth = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, _boardWidth_initializers, globals_1.Globals.BOARD_WIDTH.toString()));
                /**
                 * @description The height of the game board
                 * @private
                 * @type {string}
                 * @memberof MainComponent
                 * @summary Binds to game-board style.height
                 */
                this.boardHeight = (__runInitializers(this, _boardWidth_extraInitializers), __runInitializers(this, _boardHeight_initializers, globals_1.Globals.BOARD_HEIGHT.toString()));
                /**
                 * @description The paddle component
                 * @private
                 * @type {PaddleComponent}
                 * @memberof MainComponent
                 */
                this.paddle = (__runInitializers(this, _boardHeight_extraInitializers), new paddle_component_1.PaddleComponent());
                /**
                 * @description The start time of the game
                 * @private
                 * @type {Date}
                 * @memberof MainComponent
                 * @summary Used to calculate the elapsed time
                 */
                this.startTime = new Date();
                /**
                 * @description Whether the game is currently playing
                 * @private
                 * @type {boolean}
                 * @memberof MainComponent
                 */
                this.playing = false;
                /**
                 * @description The time elapsed in the game
                 * @private
                 * @type {string}
                 * @memberof MainComponent
                 * @summary Binds to timer innerHTML
                 */
                this.time = __runInitializers(this, _time_initializers, "00:00");
                __runInitializers(this, _time_extraInitializers);
                this.ball = new ball_component_1.BallComponent(this.paddle);
                this.addComponent(this.paddle, "game-board");
                this.addComponent(this.ball, "game-board");
                this.ball.gameOver.subscribe(() => {
                    this.stop();
                    webez_1.EzDialog.popup(this, "Would you like to play again?", "Game Over", ["Yes", "No"], "btn btn-primary").subscribe((result) => {
                        if (result === "Yes") {
                            this.start();
                        }
                    });
                });
            }
            /**
             * @description Start a new game
             * @memberof MainComponent
             * @summary Resets the game timer and ball
             * @summary Starts the game loop
             */
            start() {
                this.time = "00:00";
                this.startTime = new Date();
                this.playing = true;
                this.ball.restart();
            }
            /**
             * @description Stop the game
             * @memberof MainComponent
             * @summary Stops the game loop
             */
            stop() {
                this.playing = false;
            }
            /**
             * @description Event handler for the start button
             * @memberof MainComponent
             * @summary Starts the game
             * @summary Binds to the go button click event
             */
            startGame() {
                this.start();
            }
            /**
             * @description Main game loop timer
             * @memberof MainComponent
             * @summary Updates the game timer every second
             */
            updateTimer() {
                if (this.playing) {
                    const elapsed = (new Date().valueOf() - this.startTime.valueOf()) / 1000;
                    let minutes = Math.floor(elapsed / 60);
                    let seconds = Math.floor(elapsed % 60);
                    this.time =
                        minutes.toString().padStart(2, "0") +
                            ":" +
                            seconds.toString().padStart(2, "0");
                }
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _boardWidth_decorators = [(0, webez_1.BindStyle)("game-board", "width"), (0, webez_1.AppendPipe)("px")];
            _boardHeight_decorators = [(0, webez_1.BindStyle)("game-board", "height"), (0, webez_1.AppendPipe)("px")];
            _time_decorators = [(0, webez_1.BindInnerHTML)("timer")];
            _startGame_decorators = [(0, webez_1.Click)("go")];
            _updateTimer_decorators = [(0, webez_1.Timer)(1000)];
            __esDecorate(_a, null, _startGame_decorators, { kind: "method", name: "startGame", static: false, private: false, access: { has: obj => "startGame" in obj, get: obj => obj.startGame }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _updateTimer_decorators, { kind: "method", name: "updateTimer", static: false, private: false, access: { has: obj => "updateTimer" in obj, get: obj => obj.updateTimer }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, _boardWidth_decorators, { kind: "field", name: "boardWidth", static: false, private: false, access: { has: obj => "boardWidth" in obj, get: obj => obj.boardWidth, set: (obj, value) => { obj.boardWidth = value; } }, metadata: _metadata }, _boardWidth_initializers, _boardWidth_extraInitializers);
            __esDecorate(null, null, _boardHeight_decorators, { kind: "field", name: "boardHeight", static: false, private: false, access: { has: obj => "boardHeight" in obj, get: obj => obj.boardHeight, set: (obj, value) => { obj.boardHeight = value; } }, metadata: _metadata }, _boardHeight_initializers, _boardHeight_extraInitializers);
            __esDecorate(null, null, _time_decorators, { kind: "field", name: "time", static: false, private: false, access: { has: obj => "time" in obj, get: obj => obj.time, set: (obj, value) => { obj.time = value; } }, metadata: _metadata }, _time_initializers, _time_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.MainComponent = MainComponent;


/***/ }),

/***/ "./src/app/paddle/paddle.component.ts":
/*!********************************************!*\
  !*** ./src/app/paddle/paddle.component.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PaddleComponent = void 0;
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const paddle_component_html_1 = __importDefault(__webpack_require__(/*! ./paddle.component.html */ "./src/app/paddle/paddle.component.html"));
const paddle_component_css_1 = __importDefault(__webpack_require__(/*! ./paddle.component.css */ "./src/app/paddle/paddle.component.css"));
const globals_1 = __webpack_require__(/*! ../globals */ "./src/app/globals.ts");
/**
 * @description The paddle component
 * @export
 * @class PaddleComponent
 * @extends {EzComponent}
 * @method movePaddleUp : Move the paddle up
 * @method movePaddleDown : Move the paddle down
 * @method getPaddleRect : Get the paddle rectangle
 * @method onKeyPress : Event handler for key press
 */
let PaddleComponent = (() => {
    var _a;
    let _classSuper = webez_1.EzComponent;
    let _instanceExtraInitializers = [];
    let __paddle_width_decorators;
    let __paddle_width_initializers = [];
    let __paddle_width_extraInitializers = [];
    let __paddle_height_decorators;
    let __paddle_height_initializers = [];
    let __paddle_height_extraInitializers = [];
    let __paddle_x_decorators;
    let __paddle_x_initializers = [];
    let __paddle_x_extraInitializers = [];
    let __paddle_y_decorators;
    let __paddle_y_initializers = [];
    let __paddle_y_extraInitializers = [];
    let __paddle_color_decorators;
    let __paddle_color_initializers = [];
    let __paddle_color_extraInitializers = [];
    let _onKeyPress_decorators;
    return _a = class PaddleComponent extends _classSuper {
            get paddle_width() {
                return parseInt(this._paddle_width);
            }
            set paddle_width(value) {
                this._paddle_width = value.toString();
            }
            get paddle_height() {
                return parseInt(this._paddle_height);
            }
            set paddle_height(value) {
                this._paddle_height = value.toString();
            }
            get paddle_x() {
                return parseInt(this._paddle_x);
            }
            set paddle_x(value) {
                this._paddle_x = value.toString();
            }
            get paddle_y() {
                return parseInt(this._paddle_y);
            }
            set paddle_y(value) {
                this._paddle_y = value.toString();
            }
            /**
             * @description The maximum y coordinate of the paddle
             * @private
             * @type {number}
             * @memberof PaddleComponent
             */
            get maxY() {
                return globals_1.Globals.BOARD_HEIGHT - this.paddle_height;
            }
            /**
             * @description The constructor for the paddle component
             * @memberof PaddleComponent
             * @summary Initializes the paddle component
             */
            constructor() {
                super(paddle_component_html_1.default, paddle_component_css_1.default);
                /**
                 * @description The width of the paddle
                 * @private
                 * @type {string}
                 * @memberof PaddleComponent
                 * @summary Binds to paddle style.width
                 */
                this._paddle_width = (__runInitializers(this, _instanceExtraInitializers), __runInitializers(this, __paddle_width_initializers, globals_1.Globals.PADDLE_WIDTH.toString()));
                /**
                 * @description The height of the paddle
                 * @private
                 * @type {string}
                 * @memberof PaddleComponent
                 * @summary Binds to paddle style.height
                 */
                this._paddle_height = (__runInitializers(this, __paddle_width_extraInitializers), __runInitializers(this, __paddle_height_initializers, globals_1.Globals.PADDLE_HEIGHT.toString()));
                /**
                 * @description The x coordinate of the paddle
                 * @private
                 * @type {string}
                 * @memberof PaddleComponent
                 * @summary Binds to paddle style.left
                 * @summary Appends px to the value
                 */
                this._paddle_x = (__runInitializers(this, __paddle_height_extraInitializers), __runInitializers(this, __paddle_x_initializers, globals_1.Globals.PADDLE_INDENT.toString()));
                /**
                 * @description The y coordinate of the paddle
                 * @private
                 * @type {string}
                 * @memberof PaddleComponent
                 * @summary Binds to paddle style.top
                 * @summary Appends px to the value
                 */
                this._paddle_y = (__runInitializers(this, __paddle_x_extraInitializers), __runInitializers(this, __paddle_y_initializers, "0"));
                /**
                 * @description The color of the paddle
                 * @private
                 * @type {string}
                 * @memberof PaddleComponent
                 * @summary Binds to paddle style.backgroundColor
                 */
                this._paddle_color = (__runInitializers(this, __paddle_y_extraInitializers), __runInitializers(this, __paddle_color_initializers, globals_1.Globals.PADDLE_COLOR));
                /**
                 * @description The speed of the paddle
                 * @private
                 * @type {number}
                 * @memberof PaddleComponent
                 */
                this.paddle_speed = (__runInitializers(this, __paddle_color_extraInitializers), globals_1.Globals.PADDLE_SPEED);
                this.paddle_y = (globals_1.Globals.BOARD_HEIGHT - this.paddle_height) / 2;
            }
            /**
             * @description Move the paddle up
             * @memberof PaddleComponent
             */
            movePaddleUp() {
                this.paddle_y = Math.max(0, this.paddle_y - this.paddle_speed);
            }
            /**
             * @description Move the paddle down
             * @memberof PaddleComponent
             */
            movePaddleDown() {
                this.paddle_y = Math.min(this.maxY, this.paddle_y + this.paddle_speed);
            }
            /**
             * @description Get the paddle rectangle
             * @returns {Rectangle}
             * @memberof PaddleComponent
             */
            getPaddleRect() {
                return {
                    x: this.paddle_x,
                    y: this.paddle_y,
                    width: this.paddle_width,
                    height: this.paddle_height,
                };
            }
            /**
             * @description Event handler for key press
             * @param {KeyboardEvent} event
             * @memberof PaddleComponent
             * @summary Binds to the window keydown event
             * @summary Moves the paddle up or down based on the key pressed
             * @summary Moves the paddle up when the "a" key is pressed
             * @summary Moves the paddle down when the "z" key is pressed
             */
            onKeyPress(event) {
                if (event.key === "a") {
                    this.movePaddleUp();
                }
                else if (event.key === "z") {
                    this.movePaddleDown();
                }
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            __paddle_width_decorators = [(0, webez_1.BindStyle)("paddle", "width"), (0, webez_1.AppendPipe)("px")];
            __paddle_height_decorators = [(0, webez_1.BindStyle)("paddle", "height"), (0, webez_1.AppendPipe)("px")];
            __paddle_x_decorators = [(0, webez_1.BindStyle)("paddle", "left"), (0, webez_1.AppendPipe)("px")];
            __paddle_y_decorators = [(0, webez_1.BindStyle)("paddle", "top"), (0, webez_1.AppendPipe)("px")];
            __paddle_color_decorators = [(0, webez_1.BindStyle)("paddle", "backgroundColor")];
            _onKeyPress_decorators = [(0, webez_1.WindowEvent)("keydown")];
            __esDecorate(_a, null, _onKeyPress_decorators, { kind: "method", name: "onKeyPress", static: false, private: false, access: { has: obj => "onKeyPress" in obj, get: obj => obj.onKeyPress }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, __paddle_width_decorators, { kind: "field", name: "_paddle_width", static: false, private: false, access: { has: obj => "_paddle_width" in obj, get: obj => obj._paddle_width, set: (obj, value) => { obj._paddle_width = value; } }, metadata: _metadata }, __paddle_width_initializers, __paddle_width_extraInitializers);
            __esDecorate(null, null, __paddle_height_decorators, { kind: "field", name: "_paddle_height", static: false, private: false, access: { has: obj => "_paddle_height" in obj, get: obj => obj._paddle_height, set: (obj, value) => { obj._paddle_height = value; } }, metadata: _metadata }, __paddle_height_initializers, __paddle_height_extraInitializers);
            __esDecorate(null, null, __paddle_x_decorators, { kind: "field", name: "_paddle_x", static: false, private: false, access: { has: obj => "_paddle_x" in obj, get: obj => obj._paddle_x, set: (obj, value) => { obj._paddle_x = value; } }, metadata: _metadata }, __paddle_x_initializers, __paddle_x_extraInitializers);
            __esDecorate(null, null, __paddle_y_decorators, { kind: "field", name: "_paddle_y", static: false, private: false, access: { has: obj => "_paddle_y" in obj, get: obj => obj._paddle_y, set: (obj, value) => { obj._paddle_y = value; } }, metadata: _metadata }, __paddle_y_initializers, __paddle_y_extraInitializers);
            __esDecorate(null, null, __paddle_color_decorators, { kind: "field", name: "_paddle_color", static: false, private: false, access: { has: obj => "_paddle_color" in obj, get: obj => obj._paddle_color, set: (obj, value) => { obj._paddle_color = value; } }, metadata: _metadata }, __paddle_color_initializers, __paddle_color_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.PaddleComponent = PaddleComponent;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!*************************!*\
  !*** ./wbcore/start.ts ***!
  \*************************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ../styles.css */ "./styles.css");
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const main_component_1 = __webpack_require__(/*! ../src/app/main.component */ "./src/app/main.component.ts");
(0, webez_1.bootstrap)(main_component_1.MainComponent);

})();

/******/ })()
;
//# sourceMappingURL=main.bundle.js.map