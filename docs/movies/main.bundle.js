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
     * @static
     * @example myComponent.ajax("https://some.api.url.com/posts", HttpMethod.GET)
     *  .subscribe((data) => {
     *   console.log(data);
     * }, (error) => {
     *   console.error(error);
     * });
     */
    static ajax(url, method, headers = [], data) {
        const evt = new eventsubject_1.EventSubject();
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        for (let header of headers) {
            Object.keys(header).forEach((key) => {
                if (header[key])
                    xhr.setRequestHeader(key, header[key]);
            });
        }
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
    /**
     * @description Get the value of an element on this component.
     * @param {string} elementId The id of the element to get the value of
     * @returns string | undefined
     * @throws Error when element does not have a value property or does not exist
     * @memberof
     */
    getValue(elementId) {
        const element = this.shadow.getElementById(elementId);
        if (element instanceof HTMLInputElement)
            return element.value;
        else if (element instanceof HTMLTextAreaElement)
            return element.value;
        else if (element instanceof HTMLSelectElement)
            return element.value;
        else if (element instanceof HTMLOptionElement)
            return element.value;
        else
            throw new Error("Element does not have a value property");
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
    static clickPopupButton(buttonNumber) {
        if (exports.popupDialog) {
            const button = this.popupButtons.length > buttonNumber ?
                this.popupButtons[buttonNumber]
                : undefined;
            if (button)
                button.click();
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
                this.popupButtons.push(button);
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
EzDialog.popupButtons = [];


/***/ }),

/***/ "./node_modules/@gsilber/webez/bind.decorators.js":
/*!********************************************************!*\
  !*** ./node_modules/@gsilber/webez/bind.decorators.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BindStyleToNumberAppendPx = exports.BindStyleToNumber = exports.BindVisibleToBoolean = exports.BindDisabledToBoolean = exports.BindCSSClassToBoolean = exports.BindAttribute = exports.BindValue = exports.BindCSSClass = exports.BindStyle = void 0;
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
 * @description replaces a property with a new setter and the default getter.  The new setter can call the original setter.
 * @param target the class to replace the setter in
 * @param name the property to replace the setter for
 * @param value the initial value of the property
 * @param setter the new setter to replace the original setter with, this does not need to update the hidden private property.
 * @param callSetterFirst if true, the setter is called before the original setter, otherwise it is called after.
 */
function hookProperty(target, name, value, setter, callSetterFirst = false) {
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
            if (callSetterFirst)
                setter(value);
            this[privateKey] = value;
            if (!callSetterFirst)
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
 * @param callSetterFirst if true, the setter is called before the original setter, otherwise it is called after.
 */
function hookPropertySetter(target, name, origDescriptor, setter, callSetterFirst = false) {
    const publicKey = getPublicKey(name);
    Object.defineProperty(target, publicKey, {
        get: origDescriptor.get, // Leave the get accessor as it was
        set(value) {
            if (callSetterFirst)
                setter(value);
            if (origDescriptor.set) {
                origDescriptor.set.call(target, value); // Call the original set accessor with the provided value
            }
            if (!callSetterFirst)
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
 * @throws Error if the property descriptor is not found
 */
function getPropertyDescriptor(target, key) {
    let origDescriptor = Object.getOwnPropertyDescriptor(target, key);
    /* this can't happen.  Just here for type safety checking*/
    if (!origDescriptor) {
        throw new Error(`can not find setter with name: ${key}`);
    }
    return origDescriptor;
}
// Actual implementation, should not be in documentation as the overloads capture the two cases
function BindStyle(id, style, transform = (value) => value) {
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
            element.style[style] = transform.call(this, value);
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, (value) => {
                    element.style[style] = transform.call(this, value);
                });
            }
            else {
                hookProperty(this, context.name, value, (value) => {
                    element.style[style] = transform.call(this, value);
                });
            }
        });
    };
}
exports.BindStyle = BindStyle;
// Actual implementation, should not be in documentation as the overloads capture the two cases
function BindCSSClass(id, transform = (value) => value) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            if (value) {
                let valArray = transform
                    .call(this, value)
                    .split(" ")
                    .filter((v) => v.length > 0);
                if (valArray.length > 0)
                    element.className = valArray.join(" ");
            }
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, (value) => {
                    let origValue = context.access.get(this);
                    let currentList;
                    if (origValue) {
                        currentList = transform
                            .call(this, origValue)
                            .split(" ")
                            .filter((v) => v.length > 0);
                        if (currentList.length > 0)
                            currentList.forEach((v) => (element.className =
                                element.className.replace(v, "")));
                    }
                    let newClasses = transform
                        .call(this, value)
                        .split(" ")
                        .filter((v) => v.length > 0);
                    if (newClasses.length > 0)
                        newClasses.forEach((v) => (element.className += ` ${v}`));
                }, true);
            }
            else {
                hookProperty(this, context.name, value, (value) => {
                    let origValue = context.access.get(this);
                    let currentList;
                    if (origValue) {
                        currentList = transform
                            .call(this, origValue)
                            .split(" ")
                            .filter((v) => v.length > 0);
                        if (currentList.length > 0)
                            currentList.forEach((v) => (element.className =
                                element.className.replace(v, "")));
                    }
                    let newClasses = transform
                        .call(this, value)
                        .split(" ")
                        .filter((v) => v.length > 0);
                    if (newClasses.length > 0)
                        newClasses.forEach((v) => (element.className += ` ${v}`));
                }, true);
            }
        });
    };
}
exports.BindCSSClass = BindCSSClass;
// Actual implementation, should not be in documentation as the overloads capture the two cases
function BindValue(id, transform = (value) => value) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            if (element instanceof HTMLInputElement)
                element.value = transform.call(this, value);
            else if (element instanceof HTMLTextAreaElement)
                element.value = transform.call(this, value);
            else if (element instanceof HTMLSelectElement)
                element.value = transform.call(this, value);
            else if (element instanceof HTMLOptionElement) {
                element.value = transform.call(this, value);
                element.text = transform.call(this, value);
            }
            else
                element.innerHTML = transform.call(this, value);
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, (value) => {
                    if (element instanceof HTMLInputElement)
                        element.value =
                            transform.call(this, value);
                    else if (element instanceof HTMLTextAreaElement)
                        element.value =
                            transform.call(this, value);
                    else if (element instanceof HTMLSelectElement)
                        element.value =
                            transform.call(this, value);
                    else if (element instanceof HTMLOptionElement) {
                        element.value =
                            transform.call(this, value);
                        element.text = transform.call(this, value);
                    }
                    else
                        element.innerHTML = transform.call(this, value);
                });
            }
            else {
                hookProperty(this, context.name, value, (value) => {
                    if (element instanceof HTMLInputElement)
                        element.value =
                            transform.call(this, value);
                    else if (element instanceof HTMLTextAreaElement)
                        element.value =
                            transform.call(this, value);
                    else if (element instanceof HTMLSelectElement)
                        element.value =
                            transform.call(this, value);
                    else if (element instanceof HTMLOptionElement) {
                        element.value =
                            transform.call(this, value);
                        element.text = transform.call(this, value);
                    }
                    else
                        element.innerHTML = transform.call(this, value);
                });
            }
        });
    };
}
exports.BindValue = BindValue;
// Actual implementation, should not be in documentation as the overloads capture the two cases
function BindAttribute(id, attribute, transform = (value) => value) {
    return function (target, context) {
        context.addInitializer(function () {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            let setfn;
            setfn = (value) => {
                if (transform.call(this, value) !== "")
                    element.setAttribute(attribute, transform.call(this, value));
                else
                    element.removeAttribute(attribute);
            };
            setfn(value);
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, setfn);
            }
            else {
                hookProperty(this, context.name, value, setfn);
            }
        });
    };
}
exports.BindAttribute = BindAttribute;
// Wrapper methods for specific operations
/**
 * @description Decorator to bind the cssClassName property if the boolean property is true
 * @param id the element to bind the property to
 * @param cssClassName the class name to add
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will add the css class myCSSClass to the div with id myDiv if the enabled property is true
 * @BindCSSClassToBoolean("myDiv", "myCSSClass")
 * public enabled: boolean = true;
 */
function BindCSSClassToBoolean(id, cssClassName) {
    return BindCSSClass(id, (value) => (value ? cssClassName : ""));
}
exports.BindCSSClassToBoolean = BindCSSClassToBoolean;
/**
 * @description Decorator to bind the disabled attribute of an element to a boolean
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will disable the button with id myButton if the disabled property is true
 * @BindDisabledToBoolean("myButton")
 * public disabled: boolean = true;
 */
function BindDisabledToBoolean(id) {
    return BindAttribute(id, "disabled", (value) => value ? "disabled" : "");
}
exports.BindDisabledToBoolean = BindDisabledToBoolean;
/**
 * @description Decorator to bind the visibility of an element to a boolean
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will check the checkbox with id myCheckbox if the checked property is true
 * @BindCheckedToBoolean("myCheckbox")
 * public checked: boolean = true;
 */
function BindVisibleToBoolean(id) {
    return BindStyle(id, "display", (value) => value ? "block" : "none");
}
exports.BindVisibleToBoolean = BindVisibleToBoolean;
function BindStyleToNumber(id, style, append = "") {
    return BindStyle(id, style, (value) => `${value}${append}`);
}
exports.BindStyleToNumber = BindStyleToNumber;
/**
 * @description Decorator to bind a specific style to a number, and append a 'px' to the value
 * @param id the element to bind the property to
 * @param a value that the transformer will turn into a string that will be set as the style
 * @returns DecoratorCallback
 * @overload
 * @export
 * @example
 * //This will set the width of the div to the number in width
 * @BindStyleToNumberAppendPx("myDiv", "width")
 * public width: number = 100;
 */
function BindStyleToNumberAppendPx(id, style) {
    return BindStyleToNumber(id, style, "px");
}
exports.BindStyleToNumberAppendPx = BindStyleToNumberAppendPx;


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
function bootstrap(target, testModeHTML = "", ...args) {
    if (testModeHTML.length > 0) {
        window.document.body.innerHTML = testModeHTML;
    }
    let obj = Object.assign(new target(...args));
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
function GenericEvent(htmlElementID, type) {
    return function (target, context) {
        context.addInitializer(function () {
            let element = this["shadow"].getElementById(htmlElementID);
            if (element) {
                element.addEventListener(type, (e) => {
                    if (type === "input" || type === "change")
                        e.value = element.value;
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("#movie-imgs {\n    height: 100%;\n    display: block;\n    position: relative;\n    margin: auto;\n    width: 100%;\n}\n#content {\n    position: relative;\n    text-align: center;\n    display: inline-block;\n    width: 100%;\n    min-height: 200px;\n    padding: 0;\n}\n.page {\n    background: #333;\n    margin: 0;\n    padding: 0;\n    padding-top: 10px;\n    font-family: Arial, sans-serif;\n    position: absolute;\n    top: 0px;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    overflow-y: auto;\n    min-width: 600px;\n    text-align: center;\n    background-image: url(\"assets/space.jpg\");\n    background-repeat: no-repeat;\n    background-position: center;\n    background-size: conver;\n}\n.detail {\n    position: relative;\n    border-top: solid 1px gold;\n    overflow: hidden;\n}\n#movie-title {\n    text-align: center;\n    font-size: 40px;\n    color: gold;\n    border-bottom: 1px solid white;\n}\n.movie-info {\n    overflow-y: auto;\n    display: flex;\n    flex-direction: row;\n}\n.movie-info > div {\n    display: inline-block;\n    width: 50%;\n    color: gold;\n    text-align: left;\n    font-size: 20px;\n    font-weight: bold;\n    overflow: hidden;\n    position: relative;\n}\n.movie-info a {\n    color: #fafafa;\n    text-decoration: underline;\n}\n.movie-info a:hover {\n    color: black;\n    font-style: italic;\n}\n.left-info,\n.right-info {\n    vertical-align: top;\n    display: inline-block;\n}\n.movie-info-left {\n    box-sizing: border-box;\n}\n.line {\n    display: flex;\n    flex-direction: row;\n    width: 100%;\n}\n.left-info {\n    width: 150px;\n    font-weight: bold;\n}\n.right-info {\n    flex: 1;\n    display: flex;\n    flex-direction: column;\n}\n.movie-card {\n    flex: 1;\n    padding: 20px;\n    margin: 20px;\n    font-size: 18px;\n    background: gray;\n    color: #fafafa;\n    border-radius: 10px;\n    box-shadow: 5px 5px 5px rgba(128, 128, 128, 1);\n}\n");

/***/ }),

/***/ "./src/app/ui-elements/carousel/carousel.component.css":
/*!*************************************************************!*\
  !*** ./src/app/ui-elements/carousel/carousel.component.css ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("div {\n    box-sizing: border-box;\n}\n\n.outside {\n    position: absolute;\n    top: 0;\n    right: 0;\n    left: 0;\n    bottom: 0;\n    display: flex;\n    flex-direction: row;\n}\n#carousel-container {\n    top: 0;\n    right: 0;\n    left: 0;\n    bottom: 0;\n    display: block;\n    position: absolute;\n    display: block;\n    overflow: hidden;\n}\n.arrow {\n    position: absolute;\n    top: 0;\n    bottom: 0;\n    width: 30px;\n    opacity: 100%;\n    z-index: 1;\n}\n\n#left-arrow {\n    left: 0;\n}\n#right-arrow {\n    right: 0;\n}\n.nav-btn {\n    background: gray;\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    text-align: center;\n    font-size: 30px;\n    text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.5);\n    color: white;\n    opacity: 30%;\n    font-weight: blue;\n}\n.nav-btn > div {\n    position: relative;\n    top: 50%;\n    transform: translateY(-50%);\n}\n.nav-btn:hover {\n    opacity: 80%;\n    font-weight: bold;\n    color: white;\n    cursor: pointer;\n}\n#carousel {\n    position: absolute;\n    top: 0px;\n    bottom: 0px;\n    left: -33%;\n    width: 166%;\n    display: flex;\n    overflow: hidden;\n}\n\n.cardcol {\n    position: relative;\n    width: 20%;\n    height: 100%;\n    margin: 0;\n    padding: 0;\n}\n.carditem {\n    position: absolute;\n    top: 10px;\n    bottom: 10px;\n    left: 0px;\n    right: 0px;\n    border-radius: 10px;\n    box-shadow: 10px 10px 10px rgba(128, 128, 128, 1);\n}\n\n@keyframes left0 {\n    from {\n        transform: translateX(0) scale(0.6);\n    }\n    to {\n        transform: translateX(-100%) scale(0.4);\n    }\n}\n@keyframes right0 {\n    from {\n        transform: translateX(0) scale(0.6);\n    }\n    to {\n        transform: translateX(100%) scale(0.8);\n    }\n}\n@keyframes left1 {\n    from {\n        transform: translateX(0) scale(0.8);\n    }\n    to {\n        transform: translateX(-100%) scale(0.6);\n    }\n}\n@keyframes right1 {\n    from {\n        transform: translateX(0) scale(0.8);\n    }\n    to {\n        transform: translateX(100%) scale(1);\n    }\n}\n\n@keyframes left2 {\n    from {\n        transform: translateX(0) scale(1);\n    }\n    to {\n        transform: translateX(-100%) scale(0.8);\n    }\n}\n@keyframes right2 {\n    from {\n        transform: translateX(0) scale(1);\n    }\n    to {\n        transform: translateX(100%) scale(0.8);\n    }\n}\n\n@keyframes left3 {\n    from {\n        transform: translateX(0) scale(0.8);\n    }\n    to {\n        transform: translateX(-100%) scale(1);\n    }\n}\n@keyframes right3 {\n    from {\n        transform: translateX(0) scale(0.8);\n    }\n    to {\n        transform: translateX(100%) scale(0.6);\n    }\n}\n@keyframes left4 {\n    from {\n        transform: translateX(0) scale(0.6);\n    }\n    to {\n        transform: translateX(-100%) scale(0.8);\n    }\n}\n@keyframes right4 {\n    from {\n        transform: translateX(0) scale(0.6);\n    }\n    to {\n        transform: translateX(100%) scale(0.4);\n    }\n}\n#card1,\n#card3 {\n    transform: scale(0.8);\n}\n#card0,\n#card4 {\n    transform: scale(0.6);\n}\n.animate-0,\n.animate-1,\n.animate-2,\n.animate-3,\n.animate-4,\n.animate-0-back,\n.animate-1-back,\n.animate-2-back,\n.animate-3-back,\n.animate-4-back {\n    animation-duration: 0.25s;\n    animation-iteration-count: 1;\n    animation-fill-mode: forwards;\n}\n.animate-0 {\n    animation-name: left0;\n}\n.animate-0-back {\n    animation-name: right0;\n}\n\n.animate-1 {\n    animation-name: left1;\n}\n.animate-1-back {\n    animation-name: right1;\n}\n.animate-2 {\n    animation-name: left2;\n}\n.animate-2-back {\n    animation-name: right2;\n}\n.animate-3 {\n    animation-name: left3;\n}\n.animate-3-back {\n    animation-name: right3;\n}\n.animate-4 {\n    animation-name: left4;\n}\n.animate-4-back {\n    animation-name: right4;\n}\n");

/***/ }),

/***/ "./src/app/main.component.html":
/*!*************************************!*\
  !*** ./src/app/main.component.html ***!
  \*************************************/
/***/ ((module) => {

module.exports = "<div class=\"page\">\n    <div id=\"content\">\n        <div id=\"movie-imgs\"></div>\n    </div>\n    <div class=\"detail\">\n        <div id=\"movie-title\">&nbsp;</div>\n        <div class=\"movie-info\">\n            <div class=\"movie-info-left\">\n                <div class=\"movie-card\">\n                <div class=\"line\"><div class=\"left-info\">Release Date: </div><div id=\"release-date\" class=\"right-info\"></div></div>\n                <div class=\"line\"><div class=\"left-info\">Genres: </div><div id=\"genres\" class=\"right-info\"></div></div> \n                <div class=\"line\"><div class=\"left-info\">Runtime: </div><div id=\"runtime\" class=\"right-info\"></div></div>\n                <div class=\"line\"><div id=\"home-link\"></div></div>\n                <div class=\"line\"><div id=\"imdb-link\"></div></div>\n                </div>\n                </div>\n                <div class=\"movie-info-right\">\n                    <div class=\"movie-card\">\n                    <div id=\"overview\"></div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n</div>\n";

/***/ }),

/***/ "./src/app/ui-elements/carousel/carousel.component.html":
/*!**************************************************************!*\
  !*** ./src/app/ui-elements/carousel/carousel.component.html ***!
  \**************************************************************/
/***/ ((module) => {

module.exports = "<div class=\"outside\">\n    <div class=\"arrow\" id=\"left-arrow\">\n        <div id=\"left\" class=\"nav-btn\"><div><</div></div>\n    </div>\n    <div id=\"carousel-container\">\n        <div id=\"carousel\">\n            <div id=\"card0\" class=\"cardcol\">\n                <div id=\"card0item\" class=\"carditem\"></div>\n            </div>\n            <div class=\"cardcol\" id=\"card1\">\n                <div id=\"card1item\" class=\"carditem\"></div>\n            </div>\n            <div id=\"card2\" class=\"cardcol\">\n                <div id=\"card2item\" class=\"carditem\"></div>\n            </div>\n            <div id=\"card3\" class=\"cardcol\">\n                <div id=\"card3item\" class=\"carditem\"></div>\n            </div>\n            <div id=\"card4\" class=\"cardcol\">\n                <div id=\"card4item\" class=\"carditem\"></div>\n            </div>\n        </div>\n    </div>\n    <div class=\"arrow\" id=\"right-arrow\">\n        <div id=\"right\" class=\"nav-btn\"><div>></div></div>\n    </div>\n</div>\n";

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

/***/ "./src/app/globals.ts":
/*!****************************!*\
  !*** ./src/app/globals.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Globals = void 0;
/**
 * Varies global values used in the application
 */
exports.Globals = {
    //movieApiKey: "ab433506",
    movieApiKey: "1e8c7c168c4a76f2d5ffc2711c57749a",
    movieApiUrl: "https://api.themoviedb.org/3/",
    imdbLink: "https://www.imdb.com/title/",
    animationTime: 250,
};


/***/ }),

/***/ "./src/app/main.component.ts":
/*!***********************************!*\
  !*** ./src/app/main.component.ts ***!
  \***********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MainComponent = void 0;
const main_component_html_1 = __importDefault(__webpack_require__(/*! ./main.component.html */ "./src/app/main.component.html"));
const main_component_css_1 = __importDefault(__webpack_require__(/*! ./main.component.css */ "./src/app/main.component.css"));
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const moviedb_service_1 = __webpack_require__(/*! ./themoviedb/moviedb.service */ "./src/app/themoviedb/moviedb.service.ts");
const carousel_component_1 = __webpack_require__(/*! ./ui-elements/carousel/carousel.component */ "./src/app/ui-elements/carousel/carousel.component.ts");
const globals_1 = __webpack_require__(/*! ./globals */ "./src/app/globals.ts");
/**
 * @description MainComponent is the main component of the app
 * @extends EzComponent
 *
 */
let MainComponent = (() => {
    var _a;
    let _classSuper = webez_1.EzComponent;
    let _movieTitle_decorators;
    let _movieTitle_initializers = [];
    let _movieTitle_extraInitializers = [];
    let _releaseDate_decorators;
    let _releaseDate_initializers = [];
    let _releaseDate_extraInitializers = [];
    let _genres_decorators;
    let _genres_initializers = [];
    let _genres_extraInitializers = [];
    let _runtime_decorators;
    let _runtime_initializers = [];
    let _runtime_extraInitializers = [];
    let _homePage_decorators;
    let _homePage_initializers = [];
    let _homePage_extraInitializers = [];
    let _overview_decorators;
    let _overview_initializers = [];
    let _overview_extraInitializers = [];
    let _imdbLink_decorators;
    let _imdbLink_initializers = [];
    let _imdbLink_extraInitializers = [];
    let __carouselWidth_decorators;
    let __carouselWidth_initializers = [];
    let __carouselWidth_extraInitializers = [];
    let __carouselHeight_decorators;
    let __carouselHeight_initializers = [];
    let __carouselHeight_extraInitializers = [];
    return _a = class MainComponent extends _classSuper {
            get carouselWidth() {
                return parseInt(this._carouselWidth);
            }
            set carouselWidth(value) {
                this._carouselWidth = value.toString();
            }
            get carouselHeight() {
                return parseInt(this._carouselHeight);
            }
            set carouselHeight(value) {
                this._carouselHeight = value.toString();
            }
            /**
             * @description This is the constructor
             * @constructor
             * @summary Creates an instance of MainComponent and loads configruation data from the MovieDB API service.
             * @sideeffects Loads configuration from the api service, then continues setup.
             */
            constructor() {
                super(main_component_html_1.default, main_component_css_1.default);
                this.service = new moviedb_service_1.MovieDBService();
                this.movies = [];
                /** Bindings for details */
                this.movieTitle = __runInitializers(this, _movieTitle_initializers, "");
                this.releaseDate = (__runInitializers(this, _movieTitle_extraInitializers), __runInitializers(this, _releaseDate_initializers, ""));
                this.genres = (__runInitializers(this, _releaseDate_extraInitializers), __runInitializers(this, _genres_initializers, ""));
                this.runtime = (__runInitializers(this, _genres_extraInitializers), __runInitializers(this, _runtime_initializers, ""));
                this.homePage = (__runInitializers(this, _runtime_extraInitializers), __runInitializers(this, _homePage_initializers, ""));
                this.overview = (__runInitializers(this, _homePage_extraInitializers), __runInitializers(this, _overview_initializers, ""));
                this.imdbLink = (__runInitializers(this, _overview_extraInitializers), __runInitializers(this, _imdbLink_initializers, ""));
                /**End bindings for details */
                this._carouselWidth = (__runInitializers(this, _imdbLink_extraInitializers), __runInitializers(this, __carouselWidth_initializers, "100%"));
                this._carouselHeight = (__runInitializers(this, __carouselWidth_extraInitializers), __runInitializers(this, __carouselHeight_initializers, "300"));
                __runInitializers(this, __carouselHeight_extraInitializers);
                this.service.dbReady.subscribe(() => {
                    this.setup();
                });
            }
            /**
             * @description This method sets up the component
             * @method
             * @summary Sets up the component by getting the records and setting up the carousel
             * @private
             * @sideeffects Sets up the carousel and loads the first set of movies
             */
            setup() {
                this.service.getRecordsInRange(1, 4).then((results) => {
                    this.movies = results;
                    this.carousel = new carousel_component_1.CarouselComponent(this.service.totalResults, results.map(this.buildHtml.bind(this)), (itemNumber) => __awaiter(this, void 0, void 0, function* () {
                        let result = yield this.service.getRecordsInRange(itemNumber, itemNumber);
                        if (this.movies.indexOf(result[0]) === -1) {
                            this.movies.push(result[0]);
                        }
                        return result.map(this.buildHtml.bind(this));
                    }));
                    this.carousel.positionChanged.subscribe((pos) => __awaiter(this, void 0, void 0, function* () {
                        this.movieTitle = "&nbsp;";
                        const details = yield this.service.getMovieDetails(this.movies[pos].id);
                        this.setMovieDetails(details);
                    }));
                    this.carousel.position = 1;
                    this.addComponent(this.carousel, "movie-imgs");
                    let width = this.getWindowSize().windowWidth;
                    if (width > 1300)
                        width = 1300;
                    this.carouselHeight = (width - 20) / 2;
                    this.carouselWidth = width - 20;
                    this.onResizeEvent.subscribe(() => {
                        let width = this.getWindowSize().windowWidth;
                        if (width > 1300)
                            width = 1300;
                        this.carouselHeight = (width - 20) / 2;
                        this.carouselWidth = width - 20;
                    });
                });
            }
            /**
             * @description This method builds the HTML for a record as an image
             * @method
             * @param {SearchResult} record The record to build the HTML for
             * @returns {string} The HTML for the record
             * @private
             */
            buildHtml(record) {
                return `<div "><img src="${record.poster_path}" alt="${record.title}" style="height:100%;width:100%" /></div>`;
            }
            /**
             * @description This method sets the movie details in the bound properties to update the screen
             * @method
             * @param {MovieDetail} details The details to set the properties from
             * @returns {void}
             * @private
             */
            setMovieDetails(details) {
                this.movieTitle = details.title;
                this.releaseDate = new Date(details.release_date).toLocaleDateString();
                this.genres = details.genres.map((genre) => genre.name).join(", ");
                this.runtime = details.runtime.toString();
                this.homePage = details.homepage;
                this.overview = details.overview;
                this.imdbLink = globals_1.Globals.imdbLink + details.imdb_id;
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _movieTitle_decorators = [(0, webez_1.BindValue)("movie-title")];
            _releaseDate_decorators = [(0, webez_1.BindValue)("release-date")];
            _genres_decorators = [(0, webez_1.BindValue)("genres")];
            _runtime_decorators = [(0, webez_1.BindValue)("runtime", (value) => value + " minutes")];
            _homePage_decorators = [(0, webez_1.BindValue)("home-link", (value) => `<a href='${value}>'Home Page</a>`)];
            _overview_decorators = [(0, webez_1.BindValue)("overview", (value) => `<b>Overview:</b><br/> ${value}`)];
            _imdbLink_decorators = [(0, webez_1.BindValue)("imdb-link", (value) => `<a href='${value}'>IMDB Page</a>`)];
            __carouselWidth_decorators = [(0, webez_1.BindStyle)("content", "width", (value) => value.toString() + "px")];
            __carouselHeight_decorators = [(0, webez_1.BindStyle)("content", "height", (value) => value.toString() + "px")];
            __esDecorate(null, null, _movieTitle_decorators, { kind: "field", name: "movieTitle", static: false, private: false, access: { has: obj => "movieTitle" in obj, get: obj => obj.movieTitle, set: (obj, value) => { obj.movieTitle = value; } }, metadata: _metadata }, _movieTitle_initializers, _movieTitle_extraInitializers);
            __esDecorate(null, null, _releaseDate_decorators, { kind: "field", name: "releaseDate", static: false, private: false, access: { has: obj => "releaseDate" in obj, get: obj => obj.releaseDate, set: (obj, value) => { obj.releaseDate = value; } }, metadata: _metadata }, _releaseDate_initializers, _releaseDate_extraInitializers);
            __esDecorate(null, null, _genres_decorators, { kind: "field", name: "genres", static: false, private: false, access: { has: obj => "genres" in obj, get: obj => obj.genres, set: (obj, value) => { obj.genres = value; } }, metadata: _metadata }, _genres_initializers, _genres_extraInitializers);
            __esDecorate(null, null, _runtime_decorators, { kind: "field", name: "runtime", static: false, private: false, access: { has: obj => "runtime" in obj, get: obj => obj.runtime, set: (obj, value) => { obj.runtime = value; } }, metadata: _metadata }, _runtime_initializers, _runtime_extraInitializers);
            __esDecorate(null, null, _homePage_decorators, { kind: "field", name: "homePage", static: false, private: false, access: { has: obj => "homePage" in obj, get: obj => obj.homePage, set: (obj, value) => { obj.homePage = value; } }, metadata: _metadata }, _homePage_initializers, _homePage_extraInitializers);
            __esDecorate(null, null, _overview_decorators, { kind: "field", name: "overview", static: false, private: false, access: { has: obj => "overview" in obj, get: obj => obj.overview, set: (obj, value) => { obj.overview = value; } }, metadata: _metadata }, _overview_initializers, _overview_extraInitializers);
            __esDecorate(null, null, _imdbLink_decorators, { kind: "field", name: "imdbLink", static: false, private: false, access: { has: obj => "imdbLink" in obj, get: obj => obj.imdbLink, set: (obj, value) => { obj.imdbLink = value; } }, metadata: _metadata }, _imdbLink_initializers, _imdbLink_extraInitializers);
            __esDecorate(null, null, __carouselWidth_decorators, { kind: "field", name: "_carouselWidth", static: false, private: false, access: { has: obj => "_carouselWidth" in obj, get: obj => obj._carouselWidth, set: (obj, value) => { obj._carouselWidth = value; } }, metadata: _metadata }, __carouselWidth_initializers, __carouselWidth_extraInitializers);
            __esDecorate(null, null, __carouselHeight_decorators, { kind: "field", name: "_carouselHeight", static: false, private: false, access: { has: obj => "_carouselHeight" in obj, get: obj => obj._carouselHeight, set: (obj, value) => { obj._carouselHeight = value; } }, metadata: _metadata }, __carouselHeight_initializers, __carouselHeight_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.MainComponent = MainComponent;


/***/ }),

/***/ "./src/app/themoviedb/moviedb.service.ts":
/*!***********************************************!*\
  !*** ./src/app/themoviedb/moviedb.service.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MovieDBService = void 0;
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const globals_1 = __webpack_require__(/*! ../globals */ "./src/app/globals.ts");
/**
 * @description MovieDBService is a service for the MovieDB API
 * @export
 * @class MovieDBService
 * @property {number} totalPages The total pages
 * @property {EventSubject<void>} dbReady The event subject for when the database is ready
 * @method {Promise<void>} nextPage() Get the next page of data
 * @method {Promise<void>} previousPage() Get the previous page of data
 * @method {Promise<MovieDetail>} getMovieDetails(id: number) Get details for a specific movie
 * @method {Promise<SearchResult[]>} getPage(page: number) Get a page of data
 * @method {Promise<SearchResult[]>} getRecordsInRange(start: number, end: number) Get the records in range
 */
class MovieDBService {
    /**
     * Get the total pages
     * @description This property gets the total pages
     * @returns {number} The total pages
     * @readonly
     */
    get totalPages() {
        return this._totalPages;
    }
    /**
     * Get the total results
     * @description This property gets the total results
     * @returns {number} The total results
     * @readonly
     */
    get totalResults() {
        return this._totalResults;
    }
    /**
     * @description This is the constructor
     * @constructor
     */
    constructor() {
        this._totalPages = 0;
        this._totalResults = 0;
        this._currentPage = 0;
        this._results = [];
        this.dbReady = new webez_1.EventSubject();
        this._config = {};
        this.loadConfiguration().then((result) => {
            this._config = result;
            this.dbReady.next();
        });
    }
    /**
     * Get the configuration object
     * @description This method sets the configuration object
     * @returns {MovieDBConfiguration} The configuration object
     * @throws {Error} If the configuration object is not set
     * @async
     */
    loadConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = webez_1.EzComponent.ajax(`${globals_1.Globals.movieApiUrl}configuration?api_key=${globals_1.Globals.movieApiKey}`, webez_1.HttpMethod.GET).toPromise();
                return yield result;
            }
            catch (e) {
                throw new Error("Configuration object not set");
            }
        });
    }
    /**
     * Get popular movies
     * @description This method gets popular movies
     * @param {number} page The page number
     * @returns {SearchResults} The search results
     * @throws {Error} If there is an error getting popular movies
     * @async
     */
    getPopularMovies(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._results[page - 1])
                return this._results[page - 1];
            try {
                let result = webez_1.EzComponent.ajax(`${globals_1.Globals.movieApiUrl}movie/popular?api_key=${globals_1.Globals.movieApiKey}&${MovieDBService.addOnOptions}&page=${page}&sort_by=popularity.desc`, webez_1.HttpMethod.GET).toPromise();
                const movies = yield result;
                this._totalPages = movies.total_pages;
                this._totalResults = movies.total_results;
                return this.updateImageUrls(movies.results);
            }
            catch (e) {
                throw new Error("Error getting popular movies");
            }
        });
    }
    /**
     * Update image URLs
     * @description This method updates image URLs
     * @param {SearchResult[]} results The search results
     * @returns {SearchResult[]} The search results
     */
    updateImageUrls(results) {
        results.forEach((result) => {
            if (result.poster_path && this._config.images) {
                result.poster_path = `${this._config.images.base_url}${this._config.images.poster_sizes[2]}${result.poster_path}`;
            }
            if (result.backdrop_path && this._config.images) {
                result.backdrop_path = `${this._config.images.base_url}${this._config.images.backdrop_sizes[2]}${result.backdrop_path}`;
            }
        });
        return results;
    }
    /**
     * Get the next page of data
     * @description This method gets the next page of data
     * @returns {Promise<void>} A promise that resolves with the next page of data
     * @async
     */
    nextPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._currentPage >= this._totalPages)
                return;
            this._currentPage++;
            const page = yield this.getPopularMovies(this._currentPage);
            this._results[this._currentPage - 1] = page;
        });
    }
    /**
     * Get the previous page of data
     * @description This method gets the previous page of data
     * @returns {Promise<void>} A promise that resolves with the previous page of data
     * @async
     */
    previousPage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._currentPage <= 1)
                return;
            this._currentPage--;
            const page = yield this.getPopularMovies(this._currentPage);
            this._results[this._currentPage - 1] = page;
        });
    }
    /**
     * Get details for a specific movie
     * @description This method gets details for a specific movie
     * @param {number} id The movie id
     * @returns {MovieDetail} The search result
     * @throws {Error} If there is an error getting movie details
     */
    getMovieDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = webez_1.EzComponent.ajax(`${globals_1.Globals.movieApiUrl}movie/${id}?api_key=${globals_1.Globals.movieApiKey}&${MovieDBService.addOnOptions}`, webez_1.HttpMethod.GET).toPromise();
                return yield result;
            }
            catch (e) {
                throw new Error("Error getting movie details");
            }
        });
    }
    /**
     * Get a page of data
     * @description This method gets a page of data
     * @param {number} page The page number
     * @returns {SearchResult[]} The search result
     * @throws {Error} If there is an error getting a page of data
     * @async
     */
    getPage(page) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._results[page - 1]) {
                this._results[page - 1] = yield this.getPopularMovies(page);
            }
            return this._results[page - 1];
        });
    }
    /**
     * @description Get the records in range
     * @param {number} start The start index
     * @param {number} end The end index
     * @returns {SearchResult[]} The records in range
     * @async
     * @throws {Error} If there is an error getting the records in range
     */
    getRecordsInRange(start, end) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.totalResults === 0)
                yield this.getPopularMovies(1);
            if (start < 1 || end > this._totalResults) {
                throw new Error("Invalid range");
            }
            let records = [];
            let startPage = Math.floor((start - 1) / 20) + 1;
            let endPage = Math.floor((end - 1) / 20) + 1;
            let startOnFirstPage = (start - 1) % 20;
            let endOnLastPage = (end - 1) % 20;
            let p1records = yield this.getPage(startPage);
            let p2records = yield this.getPage(endPage);
            if (start == end)
                return [p1records[startOnFirstPage]];
            p1records = p1records.slice(startOnFirstPage);
            if (startPage === endPage) {
                p2records = p1records.slice(0, endOnLastPage + 1);
                p1records = [];
            }
            else {
                p2records = p2records.slice(0, endOnLastPage + 1);
            }
            for (let i = startPage + 1; i < endPage; i++) {
                let page = yield this.getPage(i);
                records = [...records, ...page];
            }
            return [...p1records, ...records, ...p2records];
        });
    }
}
exports.MovieDBService = MovieDBService;
MovieDBService.addOnOptions = "include_adult=false&include_video=false&language=en-US";


/***/ }),

/***/ "./src/app/ui-elements/carousel/carousel.component.ts":
/*!************************************************************!*\
  !*** ./src/app/ui-elements/carousel/carousel.component.ts ***!
  \************************************************************/
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CarouselComponent = void 0;
const webez_1 = __webpack_require__(/*! @gsilber/webez */ "./node_modules/@gsilber/webez/index.js");
const carousel_component_html_1 = __importDefault(__webpack_require__(/*! ./carousel.component.html */ "./src/app/ui-elements/carousel/carousel.component.html"));
const carousel_component_css_1 = __importDefault(__webpack_require__(/*! ./carousel.component.css */ "./src/app/ui-elements/carousel/carousel.component.css"));
const globals_1 = __webpack_require__(/*! ../../globals */ "./src/app/globals.ts");
/**
 * @description CarouselComponent is a component for a carousel
 * @export
 * @class CarouselComponent
 * @extends {EzComponent}
 * @property {number} position The position of the carousel
 * @property {EventSubject<number>} positionChanged The position changed event subject
 * @property {EventSubject<SearchResult>} onNextCard The next card event subject
 * @property {EventSubject<SearchResult>} onPrevCard The previous card event subject
 */
let CarouselComponent = (() => {
    var _a;
    let _classSuper = webez_1.EzComponent;
    let _instanceExtraInitializers = [];
    let __showBox0_decorators;
    let __showBox0_initializers = [];
    let __showBox0_extraInitializers = [];
    let __showBox1_decorators;
    let __showBox1_initializers = [];
    let __showBox1_extraInitializers = [];
    let __showBox3_decorators;
    let __showBox3_initializers = [];
    let __showBox3_extraInitializers = [];
    let __showBox4_decorators;
    let __showBox4_initializers = [];
    let __showBox4_extraInitializers = [];
    let __showLeftArrow_decorators;
    let __showLeftArrow_initializers = [];
    let __showLeftArrow_extraInitializers = [];
    let __showRightArrow_decorators;
    let __showRightArrow_initializers = [];
    let __showRightArrow_extraInitializers = [];
    let _card0Animate_decorators;
    let _card0Animate_initializers = [];
    let _card0Animate_extraInitializers = [];
    let _card1Animate_decorators;
    let _card1Animate_initializers = [];
    let _card1Animate_extraInitializers = [];
    let _card2Animate_decorators;
    let _card2Animate_initializers = [];
    let _card2Animate_extraInitializers = [];
    let _card3Animate_decorators;
    let _card3Animate_initializers = [];
    let _card3Animate_extraInitializers = [];
    let _card4Animate_decorators;
    let _card4Animate_initializers = [];
    let _card4Animate_extraInitializers = [];
    let _card0_decorators;
    let _card0_initializers = [];
    let _card0_extraInitializers = [];
    let _card1_decorators;
    let _card1_initializers = [];
    let _card1_extraInitializers = [];
    let _card2_decorators;
    let _card2_initializers = [];
    let _card2_extraInitializers = [];
    let _card3_decorators;
    let _card3_initializers = [];
    let _card3_extraInitializers = [];
    let _card4_decorators;
    let _card4_initializers = [];
    let _card4_extraInitializers = [];
    let _moveRight_decorators;
    let _moveLeft_decorators;
    return _a = class CarouselComponent extends _classSuper {
            /**
             * @description This is the constructor
             * @constructor
             * @param {number} _numElements The number of elements in the carousel
             * @param {string[]} _cardHtmls The html for the cards
             * @param {(itemNumber: number) => Promise<string[]>} requestCallback The request callback when the carousel needs more data.  should return a single string in an array that is the html of the card
             * @throws {Error} Carousel must have 4 cards
             */
            constructor(_numElements, _cardHtmls = [], requestCallback = () => __awaiter(this, void 0, void 0, function* () {
                return [];
            })) {
                super(carousel_component_html_1.default, carousel_component_css_1.default);
                this._numElements = (__runInitializers(this, _instanceExtraInitializers), _numElements);
                this._cardHtmls = _cardHtmls;
                this.requestCallback = requestCallback;
                /**
                 * @description Event fires when the position of the carousel has changed
                 * @type {EventSubject<number>}
                 * @memberof CarouselComponent
                 * @emits number The new position
                 */
                this.positionChanged = new webez_1.EventSubject();
                this.animationTime = globals_1.Globals.animationTime;
                this._rotating = false;
                /**
                 * @description Event that fires when the next card moves to the middle
                 * @type {EventSubject<SearchResult>}
                 * @memberof CarouselComponent
                 * @emits SearchResult The next card
                 */
                this.onNextCard = new webez_1.EventSubject();
                /**
                 * @description Event that fires when the previous card moves to the middle
                 * @type {EventSubject<SearchResult>}
                 * @memberof CarouselComponent
                 * @emits SearchResult The previous card
                 */
                this.onPrevCard = new webez_1.EventSubject();
                this._position = 1;
                /*Bindings*/
                this._showBox0 = __runInitializers(this, __showBox0_initializers, "inline-block");
                this._showBox1 = (__runInitializers(this, __showBox0_extraInitializers), __runInitializers(this, __showBox1_initializers, "inline-block"));
                this._showBox3 = (__runInitializers(this, __showBox1_extraInitializers), __runInitializers(this, __showBox3_initializers, "inline-block"));
                this._showBox4 = (__runInitializers(this, __showBox3_extraInitializers), __runInitializers(this, __showBox4_initializers, "inline-block"));
                this._showLeftArrow = (__runInitializers(this, __showBox4_extraInitializers), __runInitializers(this, __showLeftArrow_initializers, "none"));
                this._showRightArrow = (__runInitializers(this, __showLeftArrow_extraInitializers), __runInitializers(this, __showRightArrow_initializers, "none"));
                this.card0Animate = (__runInitializers(this, __showRightArrow_extraInitializers), __runInitializers(this, _card0Animate_initializers, ""));
                this.card1Animate = (__runInitializers(this, _card0Animate_extraInitializers), __runInitializers(this, _card1Animate_initializers, ""));
                this.card2Animate = (__runInitializers(this, _card1Animate_extraInitializers), __runInitializers(this, _card2Animate_initializers, ""));
                this.card3Animate = (__runInitializers(this, _card2Animate_extraInitializers), __runInitializers(this, _card3Animate_initializers, ""));
                this.card4Animate = (__runInitializers(this, _card3Animate_extraInitializers), __runInitializers(this, _card4Animate_initializers, ""));
                this.card0 = (__runInitializers(this, _card4Animate_extraInitializers), __runInitializers(this, _card0_initializers, ""));
                this.card1 = (__runInitializers(this, _card0_extraInitializers), __runInitializers(this, _card1_initializers, ""));
                this.card2 = (__runInitializers(this, _card1_extraInitializers), __runInitializers(this, _card2_initializers, ""));
                this.card3 = (__runInitializers(this, _card2_extraInitializers), __runInitializers(this, _card3_initializers, ""));
                this.card4 = (__runInitializers(this, _card3_extraInitializers), __runInitializers(this, _card4_initializers, ""));
                __runInitializers(this, _card4_extraInitializers);
                this._numElements = _numElements;
                this._cardHtmls = _cardHtmls;
                this.requestCallback = requestCallback;
                this.position = 1;
                if (_cardHtmls.length != 4) {
                    throw new Error("Carousel must have 4 cards");
                }
                this.card1 = _cardHtmls[0];
                this.card2 = _cardHtmls[1];
                this.card3 = _cardHtmls[2];
                this.card4 = _cardHtmls[3];
            }
            /**
             * @description The position of the carousel
             * @type {number}
             * @memberof CarouselComponent
             */
            get position() {
                return this._position;
            }
            set position(value) {
                this._position = value;
                if (this._position === 0) {
                    //disable left button
                    this.showLeftArrow = false;
                    this.showBox0 = false;
                    this.showBox1 = false;
                }
                else if (this._position === 1) {
                    this.showLeftArrow = true;
                    this.showBox0 = false;
                    this.showBox1 = true;
                }
                else {
                    this.showLeftArrow = true;
                    this.showBox0 = true;
                    this.showBox1 = true;
                }
                if (this._position === this._numElements - 2) {
                    this.showRightArrow = true;
                    this.showBox4 = false;
                    this.showBox3 = true;
                }
                else if (this._position === this._numElements - 1) {
                    this.showRightArrow = false;
                    this.showBox4 = false;
                    this.showBox3 = false;
                    //disable right button
                }
                else {
                    this.showRightArrow = true;
                    this.showBox3 = true;
                    this.showBox4 = true;
                }
                this.positionChanged.next(this._position);
            }
            get showBox0() {
                return this._showBox0 === "inline-block";
            }
            set showBox0(value) {
                this._showBox0 = value ? "inline-block" : "none";
            }
            get showBox1() {
                return this._showBox1 === "inline-block";
            }
            set showBox1(value) {
                this._showBox1 = value ? "inline-block" : "none";
            }
            get showBox3() {
                return this._showBox3 === "inline-block";
            }
            set showBox3(value) {
                this._showBox3 = value ? "inline-block" : "none";
            }
            get showBox4() {
                return this._showBox4 === "inline-block";
            }
            set showBox4(value) {
                this._showBox4 = value ? "inline-block" : "none";
            }
            get showLeftArrow() {
                return this._showLeftArrow === "block";
            }
            set showLeftArrow(value) {
                this._showLeftArrow = value ? "block" : "none";
            }
            get showRightArrow() {
                return this._showRightArrow === "block";
            }
            set showRightArrow(value) {
                this._showRightArrow = value ? "block" : "none";
            }
            /*End Bindings*/
            /**
             * @description Animate the carousel
             * @param {boolean} [backward=false] If true, animate backward
             * @memberof CarouselComponent
             * @private
             * @returns {void}
             */
            animate(backward = false) {
                const addString = backward ? "-back" : "";
                this._rotating = true;
                this.card0Animate = "";
                this.card1Animate = "";
                this.card2Animate = "";
                this.card3Animate = "";
                this.card4Animate = "";
                setTimeout(() => {
                    this.card0Animate = "animate-0" + addString;
                    this.card1Animate = "animate-1" + addString;
                    this.card2Animate = "animate-2" + addString;
                    this.card3Animate = "animate-3" + addString;
                    this.card4Animate = "animate-4" + addString;
                }, 1);
            }
            /**
             * @description Clear animations on the caorusel
             * @memberof CarouselComponent
             * @private
             * @returns {void}
             */
            clearAnimations() {
                this.card0Animate = "";
                this.card1Animate = "";
                this.card2Animate = "";
                this.card3Animate = "";
                this.card4Animate = "";
                this._rotating = false;
            }
            /**
             * @description Update the cards in the carousel after a click on one of the nav buttons
             * @param {boolean} [backward=false] If true, update the cards backward
             * @memberof CarouselComponent
             * @private
             * @returns {void}
             */
            updateCards() {
                return __awaiter(this, arguments, void 0, function* (backward = false) {
                    if (backward) {
                        //largest deleted
                        //smallest fetched
                        this.card4 = this.card3;
                        this.card3 = this.card2;
                        this.card2 = this.card1;
                        this.card1 = this.card0;
                        this.card0 = this._cardHtmls[this.position - 2];
                        //should be in the array already.
                    }
                    else {
                        //smallest deleted
                        //largest fetched
                        this.card0 = this.card1;
                        this.card1 = this.card2;
                        this.card2 = this.card3;
                        this.card3 = this.card4;
                        let newCards = yield this.requestCallback(this.position + 3);
                        if (newCards.length != 1) {
                            throw new Error("Request callback must return exactly one card");
                        }
                        this.card4 = newCards[0];
                        this._cardHtmls.push(this.card4);
                    }
                });
            }
            /**
             * @description Move the carousel to the right
             * @memberof CarouselComponent
             * @private
             * @returns {void}
             */
            moveRight() {
                if (!this._rotating) {
                    this.showLeftArrow = false;
                    this.showRightArrow = false;
                    this.animate();
                    setTimeout(() => {
                        this.position++;
                        this.clearAnimations();
                        this.updateCards();
                    }, this.animationTime);
                }
            }
            /**
             * @description Move the carousel to the left
             * @memberof CarouselComponent
             * @private
             * @returns {void}
             */
            moveLeft() {
                if (!this._rotating) {
                    this.showLeftArrow = false;
                    this.showRightArrow = false;
                    this.animate(true);
                    setTimeout(() => {
                        this.position--;
                        this.clearAnimations();
                        this.updateCards(true);
                    }, this.animationTime);
                }
            }
        },
        (() => {
            var _b;
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            __showBox0_decorators = [(0, webez_1.BindStyle)("card0item", "display")];
            __showBox1_decorators = [(0, webez_1.BindStyle)("card1item", "display")];
            __showBox3_decorators = [(0, webez_1.BindStyle)("card3item", "display")];
            __showBox4_decorators = [(0, webez_1.BindStyle)("card4item", "display")];
            __showLeftArrow_decorators = [(0, webez_1.BindStyle)("left", "display")];
            __showRightArrow_decorators = [(0, webez_1.BindStyle)("right", "display")];
            _card0Animate_decorators = [(0, webez_1.BindCSSClass)("card0")];
            _card1Animate_decorators = [(0, webez_1.BindCSSClass)("card1")];
            _card2Animate_decorators = [(0, webez_1.BindCSSClass)("card2")];
            _card3Animate_decorators = [(0, webez_1.BindCSSClass)("card3")];
            _card4Animate_decorators = [(0, webez_1.BindCSSClass)("card4")];
            _card0_decorators = [(0, webez_1.BindValue)("card0item")];
            _card1_decorators = [(0, webez_1.BindValue)("card1item")];
            _card2_decorators = [(0, webez_1.BindValue)("card2item")];
            _card3_decorators = [(0, webez_1.BindValue)("card3item")];
            _card4_decorators = [(0, webez_1.BindValue)("card4item")];
            _moveRight_decorators = [(0, webez_1.Click)("right")];
            _moveLeft_decorators = [(0, webez_1.Click)("left")];
            __esDecorate(_a, null, _moveRight_decorators, { kind: "method", name: "moveRight", static: false, private: false, access: { has: obj => "moveRight" in obj, get: obj => obj.moveRight }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _moveLeft_decorators, { kind: "method", name: "moveLeft", static: false, private: false, access: { has: obj => "moveLeft" in obj, get: obj => obj.moveLeft }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(null, null, __showBox0_decorators, { kind: "field", name: "_showBox0", static: false, private: false, access: { has: obj => "_showBox0" in obj, get: obj => obj._showBox0, set: (obj, value) => { obj._showBox0 = value; } }, metadata: _metadata }, __showBox0_initializers, __showBox0_extraInitializers);
            __esDecorate(null, null, __showBox1_decorators, { kind: "field", name: "_showBox1", static: false, private: false, access: { has: obj => "_showBox1" in obj, get: obj => obj._showBox1, set: (obj, value) => { obj._showBox1 = value; } }, metadata: _metadata }, __showBox1_initializers, __showBox1_extraInitializers);
            __esDecorate(null, null, __showBox3_decorators, { kind: "field", name: "_showBox3", static: false, private: false, access: { has: obj => "_showBox3" in obj, get: obj => obj._showBox3, set: (obj, value) => { obj._showBox3 = value; } }, metadata: _metadata }, __showBox3_initializers, __showBox3_extraInitializers);
            __esDecorate(null, null, __showBox4_decorators, { kind: "field", name: "_showBox4", static: false, private: false, access: { has: obj => "_showBox4" in obj, get: obj => obj._showBox4, set: (obj, value) => { obj._showBox4 = value; } }, metadata: _metadata }, __showBox4_initializers, __showBox4_extraInitializers);
            __esDecorate(null, null, __showLeftArrow_decorators, { kind: "field", name: "_showLeftArrow", static: false, private: false, access: { has: obj => "_showLeftArrow" in obj, get: obj => obj._showLeftArrow, set: (obj, value) => { obj._showLeftArrow = value; } }, metadata: _metadata }, __showLeftArrow_initializers, __showLeftArrow_extraInitializers);
            __esDecorate(null, null, __showRightArrow_decorators, { kind: "field", name: "_showRightArrow", static: false, private: false, access: { has: obj => "_showRightArrow" in obj, get: obj => obj._showRightArrow, set: (obj, value) => { obj._showRightArrow = value; } }, metadata: _metadata }, __showRightArrow_initializers, __showRightArrow_extraInitializers);
            __esDecorate(null, null, _card0Animate_decorators, { kind: "field", name: "card0Animate", static: false, private: false, access: { has: obj => "card0Animate" in obj, get: obj => obj.card0Animate, set: (obj, value) => { obj.card0Animate = value; } }, metadata: _metadata }, _card0Animate_initializers, _card0Animate_extraInitializers);
            __esDecorate(null, null, _card1Animate_decorators, { kind: "field", name: "card1Animate", static: false, private: false, access: { has: obj => "card1Animate" in obj, get: obj => obj.card1Animate, set: (obj, value) => { obj.card1Animate = value; } }, metadata: _metadata }, _card1Animate_initializers, _card1Animate_extraInitializers);
            __esDecorate(null, null, _card2Animate_decorators, { kind: "field", name: "card2Animate", static: false, private: false, access: { has: obj => "card2Animate" in obj, get: obj => obj.card2Animate, set: (obj, value) => { obj.card2Animate = value; } }, metadata: _metadata }, _card2Animate_initializers, _card2Animate_extraInitializers);
            __esDecorate(null, null, _card3Animate_decorators, { kind: "field", name: "card3Animate", static: false, private: false, access: { has: obj => "card3Animate" in obj, get: obj => obj.card3Animate, set: (obj, value) => { obj.card3Animate = value; } }, metadata: _metadata }, _card3Animate_initializers, _card3Animate_extraInitializers);
            __esDecorate(null, null, _card4Animate_decorators, { kind: "field", name: "card4Animate", static: false, private: false, access: { has: obj => "card4Animate" in obj, get: obj => obj.card4Animate, set: (obj, value) => { obj.card4Animate = value; } }, metadata: _metadata }, _card4Animate_initializers, _card4Animate_extraInitializers);
            __esDecorate(null, null, _card0_decorators, { kind: "field", name: "card0", static: false, private: false, access: { has: obj => "card0" in obj, get: obj => obj.card0, set: (obj, value) => { obj.card0 = value; } }, metadata: _metadata }, _card0_initializers, _card0_extraInitializers);
            __esDecorate(null, null, _card1_decorators, { kind: "field", name: "card1", static: false, private: false, access: { has: obj => "card1" in obj, get: obj => obj.card1, set: (obj, value) => { obj.card1 = value; } }, metadata: _metadata }, _card1_initializers, _card1_extraInitializers);
            __esDecorate(null, null, _card2_decorators, { kind: "field", name: "card2", static: false, private: false, access: { has: obj => "card2" in obj, get: obj => obj.card2, set: (obj, value) => { obj.card2 = value; } }, metadata: _metadata }, _card2_initializers, _card2_extraInitializers);
            __esDecorate(null, null, _card3_decorators, { kind: "field", name: "card3", static: false, private: false, access: { has: obj => "card3" in obj, get: obj => obj.card3, set: (obj, value) => { obj.card3 = value; } }, metadata: _metadata }, _card3_initializers, _card3_extraInitializers);
            __esDecorate(null, null, _card4_decorators, { kind: "field", name: "card4", static: false, private: false, access: { has: obj => "card4" in obj, get: obj => obj.card4, set: (obj, value) => { obj.card4 = value; } }, metadata: _metadata }, _card4_initializers, _card4_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
})();
exports.CarouselComponent = CarouselComponent;


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