import { BindDescriptor } from "./decorators";
import "reflect-metadata";

declare const window: Window;

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
    public shadow: ShadowRoot;
    private template: HTMLTemplateElement;
    private styles: HTMLStyleElement;

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
        private html: string = "",
        private css: string = "",
    ) {
        this.htmlElement = window.document.createElement("div");

        this.shadow = this.htmlElement.attachShadow({ mode: "open" });
        this.template = window.document.createElement("template");
        this.template.innerHTML = this.html;
        for (let style of window.document.styleSheets) {
            if (style.ownerNode)
                this.shadow.appendChild(style.ownerNode.cloneNode(true));
        }
        this.styles = window.document.createElement("style");
        this.styles.innerHTML = this.css;
        this.shadow.appendChild(this.styles);
        this.shadow.appendChild(this.template.content.cloneNode(true));
        this.attachHooks();
    }

    /**
     * @description Add a component to the dom
     * @param component The component to add
     * @param id The id of the element to append the component to (optional)
     * @returns void
     * @memberof EzComponent
     * @protected
     * @example const component = new EzComponent("<h1>Hello World</h1>", "h1{color:red;}");
     *   component.addComponent(component);
     *   component.addComponent(component, "myDiv");
     */
    protected addComponent(
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
                else this.shadow.appendChild(component.htmlElement);
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
     * @protected
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
     * @public
     * @example const component = new EzComponent("<h1>Hello World</h1>", "h1{color:red;}");
     *   component.appendToDomElement(document.getElementById("myDiv"));
     */
    public appendToDomElement(domElement: HTMLElement) {
        domElement.appendChild(this.htmlElement);
    }
    private attachHooks(): void {
        let properties = Reflect.getMetadataKeys(this);
        properties.forEach((property) => {
            let bindDescriptor: BindDescriptor = Reflect.getMetadata(
                property,
                this,
            ) as BindDescriptor;
            if (bindDescriptor.type === "bind") {
                this.attachBindHook(bindDescriptor);
            } else if (bindDescriptor.type === "event") {
                this.attachEventHook(
                    bindDescriptor,
                    (this as any)[property.substring(5)] as (
                        evt: Event,
                    ) => void,
                );
            } else if (bindDescriptor.type === "cssc") {
                this.attachClassHook(bindDescriptor);
            }
        });
    }
    private attachClassHook(descriptor: BindDescriptor): void {
        const name: string = descriptor.valueKey || "";
        let key = ("__" + name) as keyof this;
        let pkey = name as keyof this;
        Object.defineProperty(this, "__" + name, {
            value: this[pkey],
            writable: true,
            enumerable: false,
            configurable: true,
        });

        let element: any = this.shadow.getElementById(descriptor.key);
        if (element) {
            Object.defineProperty(this, "__old_" + name, {
                value: this[pkey],
                writable: true,
                enumerable: false,
                configurable: true,
            });
            let old = ("__old_" + name) as keyof this;
            const t = this[old];
            this[old] = element.className as typeof t;
            element.className += " " + this[key];
            Object.defineProperty(this, name, {
                set: (value) => {
                    element.className = this[old];
                    const t = this[key];
                    this[key] = value as typeof t;
                    element.className += (" " + value) as typeof t;
                },
                get: () => {
                    return this[key];
                },
            });
        }
    }
    private attachEventHook(
        descriptor: BindDescriptor,
        callback: (evt: Event) => void,
    ): void {
        let element: HTMLElement | null = this.shadow.getElementById(
            descriptor.key,
        );
        if (element && descriptor.eventName) {
            element.addEventListener(descriptor.eventName, (e: Event) => {
                callback.bind(this)(e);
            });
        }
    }

    private attachBindHook(descriptor: BindDescriptor): void {
        const name: string = descriptor.key;
        let key = ("__" + name) as keyof this;
        let pkey = name as keyof this;
        Object.defineProperty(this, "__" + name, {
            value: this[pkey],
            writable: true,
            enumerable: false,
            configurable: true,
        });
        let element: any = this.shadow.getElementById(descriptor.targetName);
        if (element) {
            element.innerHTML = this[key];
            if (!descriptor.bidirectional) {
                Object.defineProperty(this, name, {
                    set: (value) => {
                        const t = this[key];
                        this[key] = value as typeof t;
                        if (element.value) {
                            element.value = value as typeof t;
                        } else {
                            element.innerHTML = value as typeof t;
                        }
                    },
                    get: () => {
                        return this[key];
                    },
                });
            } else {
                element.addEventListener("input", () => {
                    let t = this[key];
                    this[key] = element.value as typeof t;
                });
                Object.defineProperty(this, name, {
                    set: (value) => {
                        const t = this[key];
                        this[key] = value as typeof t;
                        element.value = value as typeof t;
                    },
                    get: () => {
                        return this[key];
                    },
                });
            }
        }
    }
}
