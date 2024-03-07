export class WebElement {
    constructor(
        public id: string,
        public element: Element,
    ) {
    }

    /**
     * Set an attribute on the HTML element
     * @param attrName The name of the attribute
     * @param attrValue The value to store in the attribute
     * @returns void
     * @sideeffects Modifies the HTML element
     */
    setAttribute(attrName: string, attrValue: string): void {
        this.element.setAttribute(attrName, attrValue);
    }
    /**
     * Get an attribute from the HTML element
     * @param attrName the attribute value to retrieve
     * @returns the attribute value
     * @sideeffects none
     */
    getAttribute(attrName: string): string {
        return this.element.getAttribute(attrName) || "";
    }

    /**
     * Set the value of the HTML element
     * @param value the value to set
     * @returns void
     * @sideeffects Modifies the HTML element
     */
    setValue(value: string): void {
        let el= this.element as HTMLInputElement;
        if (el && el.value) {
            el.value= value;
        }
    }
    /**
     * Get the value of the HTML element
     * @returns the value of the HTML element
     * @sideeffects none
     */
    getValue(): string {
        let el= this.element as HTMLInputElement;
        if (el && el.value) {
            return el.value;
        }
        return "0";
    }
    /**
     * Set the checked attribute of the HTML element
     * @param checked the value to set
     * @returns void
     * @sideeffects Modifies the HTML element
     */
    setChecked(checked: boolean): void {
        let el= this.element as HTMLInputElement;
        if (el && el.checked) {
            el.checked= checked;
        }

    }
    /**
     * Get the checked attribute of the HTML element
     * @returns the value of the checked attribute
     * @sideeffects none
     */
    getChecked(): boolean {
        let el= this.element as HTMLInputElement;
        if (el && el.checked) {
            return el.checked;
        }
        return false;
    }
    /**
     * Get the style of the object
     * @param none
     * @returns the style of the object
     * @sideeffects none
     */
    getStyle(style:string):string {
        return window.getComputedStyle(this.element).getPropertyValue(style);
    }
    /**
     * Set the style of the HTML element
     * @param style the style to set
     * @param value the value to set
     * @returns void
     * @sideeffects Modifies the HTML element
     */
    setStyle(style: string, value: string): void {
        let el= this.element as HTMLHtmlElement;
        if (el && el.style) {
            el.style.setProperty(style, value);
        }
    }
    /**
     * Set the innerHtml of the HTML element
     * @param html the value to set
     * @returns void
     * @sideeffects Modifies the HTML element
     */
    setHtml(html: string): void {
        this.element.innerHTML = html;
    }
    /**
     * Get the innerHtml of the HTML element
     * @returns the innerHtml of the HTML element
     * @sideeffects none
     */
    getHtml(): string {
        return this.element.innerHTML;
    }
    /**
     * Listen for the named event on this object and call the callback if it happens
     * @param event the name of the event to listen for
     * @param callback the function to call when the event happens (must take an Event as a parameter and return void)
     * @returns void
     * @sideeffects Modifies the HTML element
     */
    listen(event: string, callback: (event: Event) => void): void {
        this.element.addEventListener(event, callback);
    }
    /**
     * Stop listening for the named event on this object
     * @param event the name of the event to stop listening for
     * @param callback the function to stop calling when the event happens
     * @returns void
     * @sideeffects Modifies the HTML element
     */
    releaseListen(event: string, callback: (event: Event) => void): void {
        this.element.removeEventListener(event, callback);
    }
    /**
     * Element event handler properties
     * Sets the appropriate event handler to the callback method provided
     */
    set click(callback:(event:Event)=>void) {
        this.listen("click", callback);
    } 
    set change(callback:(event:Event)=>void) {
        this.listen("change", callback);
    }
    set input(callback:(event:Event)=>void) {
        this.listen("input", callback);
    }
    set focus(callback:(event:Event)=>void) {
        this.listen("focus", callback);
    }
    set blur(callback:(event:Event)=>void) {
        this.listen("blur", callback);
    }
    set submit(callback:(event:Event)=>void) {
        this.listen("submit", callback);
    }
    set keydown(callback:(event:Event)=>void) {
        this.listen("keydown", callback);
    }
    set keyup(callback:(event:Event)=>void) {
        this.listen("keyup", callback);
    }
    set keypress(callback:(event:Event)=>void) {
        this.listen("keypress", callback);
    }
    set select(callback:(event:Event)=>void) {
        this.listen("select", callback);
    }
    set focusout(callback:(event:Event)=>void) {
        this.listen("focusout", callback);
    }
    set focusin(callback:(event:Event)=>void) {
        this.listen("focusin", callback);
    }
    set mouseover(callback:(event:Event)=>void) {
        this.listen("mouseover", callback);
    }
    set mouseout(callback:(event:Event)=>void) {
        this.listen("mouseout", callback);
    }
    set mouseenter(callback:(event:Event)=>void) {
        this.listen("mouseenter", callback);
    }
    set mouseleave(callback:(event:Event)=>void) {
        this.listen("mouseleave", callback);
    }
    set mousedown(callback:(event:Event)=>void) {
        this.listen("mousedown", callback);
    }
    set mouseup(callback:(event:Event)=>void) {
        this.listen("mouseup", callback);
    }
    set dblclick(callback:(event:Event)=>void) {
        this.listen("dblclick", callback);
    }
    set contextmenu(callback:(event:Event)=>void) {
        this.listen("contextmenu", callback);
    }
    set wheel(callback:(event:Event)=>void) {
        this.listen("wheel", callback);
    }
    set drag(callback:(event:Event)=>void) {
        this.listen("drag", callback);
    }
    set dragstart(callback:(event:Event)=>void) {
        this.listen("dragstart", callback);
    }
    set dragend(callback:(event:Event)=>void) {
        this.listen("dragend", callback);
    }
    set dragover(callback:(event:Event)=>void) {
        this.listen("dragover", callback);
    }
    set dragenter(callback:(event:Event)=>void) {
        this.listen("dragenter", callback);
    }
    set dragleave(callback:(event:Event)=>void) {
        this.listen("dragleave", callback);
    }
    set drop(callback:(event:Event)=>void) {
        this.listen("drop", callback);
    }
    set scroll(callback:(event:Event)=>void) {
        this.listen("scroll", callback);
    }
    set resize(callback:(event:Event)=>void) {
        this.listen("resize", callback);
    }
    set load(callback:(event:Event)=>void) {
        this.listen("load", callback);
    }
    set unload(callback:(event:Event)=>void) {
        this.listen("unload", callback);
    }
}
