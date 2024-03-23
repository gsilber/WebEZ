import { EventSubject } from "./eventsubject";
declare const window: Window;
export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
    OPTIONS = "OPTIONS",
}
/**
 * @description An interface for the size of the window
 * @export
 * @interface SizeInfo
 * @example const sizeInfo: SizeInfo = {
 *  windowWidth: window.innerWidth,
 *  windowHeight: window.innerHeight
 * };
 */
export interface SizeInfo {
    windowWidth: number;
    windowHeight: number;
}

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
export abstract class EzComponent {
    private htmlElement: HTMLElement;
    /**
     * @hidden
     */
    private shadow: ShadowRoot;
    private template: HTMLTemplateElement;
    private styles: HTMLStyleElement;

    private static resizeEvent: EventSubject<SizeInfo> =
        new EventSubject<SizeInfo>();

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
    public get onResizeEvent(): EventSubject<SizeInfo> {
        return EzComponent.resizeEvent;
    }

    /**
     * @description Creates an instance of EzComponent.
     * @param {string} [html=""] The html as a string to be used as the body of this component
     * @param {string} [css=""] The css as a string to be used as the style of this component
     * @memberof EzComponent
     * @public
     * @constructor
     * @example const component = new EzComponent("<h1>Hello World</h1>", "h1{color:red;}");
     */
    constructor(
        private html: string,
        private css: string,
    ) {
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
     * @example const component = new EzComponent("<h1>Hello World</h1>", "h1{color:red;}");
     *   component.addComponent(component);
     *   component.addComponent(component, "myDiv");
     */
    public addComponent(
        component: EzComponent,
        id: string = "root",
        front: boolean = false,
    ) {
        if (front) {
            if (id === "root") {
                if (this.shadow.firstChild)
                    this.shadow.insertBefore(
                        component.htmlElement,
                        this.shadow.firstChild,
                    );
            } else {
                let el: HTMLElement | null = this.shadow.getElementById(id);
                if (el) {
                    if (el.firstChild)
                        el.insertBefore(component.htmlElement, el.firstChild);
                    else el.appendChild(component.htmlElement);
                }
            }
        } else {
            if (id === "root") {
                this.shadow.appendChild(component.htmlElement);
            } else {
                let el: HTMLElement | null = this.shadow.getElementById(id);
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
     * @example const component = new EzComponent("<h1>Hello World</h1>", "h1{color:red;}");
     *   component.addComponent(component);
     *   component.removeComponent(component);
     */
    protected removeComponent(component: EzComponent): EzComponent {
        component.htmlElement.remove();
        return component;
    }
    /**
     * @description Append the component to a dom element
     * @param domElement
     * @returns void
     * @memberof EzComponent
     * @example const component = new EzComponent("<h1>Hello World</h1>", "h1{color:red;}");
     *   component.appendToDomElement(document.getElementById("myDiv"));
     */
    public appendToDomElement(domElement: HTMLElement) {
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
     */
    protected ajax<T = any>(
        url: string,
        method: HttpMethod,
        headers: any[] = [],
        data?: any,
    ): EventSubject<T> {
        const evt: EventSubject<T> = new EventSubject<T>();
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        for (let header of headers) {
            Object.keys(header).forEach((key) => {
                if (header[key]) xhr.setRequestHeader(key, header[key]);
            });
        }
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                evt.next(JSON.parse(xhr.responseText));
            } else {
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
     */
    public getWindowSize(): SizeInfo {
        return {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        };
    }
}
