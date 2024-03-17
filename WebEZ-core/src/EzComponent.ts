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
    /**
     * @hidden
     */
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
        //jest does not test this, tested elsewhere
        /* istanbul ignore next */
        for (let style of window.document.styleSheets) {
            if (style.ownerNode)
                this.shadow.appendChild(style.ownerNode.cloneNode(true));
        }
        this.styles = window.document.createElement("style");
        this.styles.innerHTML = this.css;
        this.shadow.appendChild(this.styles);
        this.shadow.appendChild(this.template.content.cloneNode(true));
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
}
