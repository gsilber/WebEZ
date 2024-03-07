export class WebElement {
    constructor(
        public id: string,
        public element: Element,
    ) {}

    setAttribute(attrName: string, attrValue: string): void {
        this.element.setAttribute(attrName, attrValue);
    }
    getAttribute(attrName: string): string {
        return this.element.getAttribute(attrName) || "";
    }
    setValue(value: string): void {
        this.element.setAttribute("value", value);
    }
    getValue(): string {
        return this.element.getAttribute("value") || "";
    }
    setChecked(checked: boolean): void {
        this.element.setAttribute("checked", checked.toString());
    }
    getChecked(): boolean {
        return this.element.getAttribute("checked") === "true";
    }
    setHtml(html: string): void {
        this.element.innerHTML = html;
    }
    getHtml(): string {
        return this.element.innerHTML;
    }
    listen(event: string, callback: (event: Event) => void): void {
        this.element.addEventListener(event, callback);
    }
    releaseListen(event: string, callback: (event: Event) => void): void {
        this.element.removeEventListener(event, callback);
    }

    // click(id: string): void {
    //     if (!this.hasKey(id)) return;
    //     this.elements[id].element.click();
    // }
    // submit(id: string): void {
    //     if (!this.hasKey(id)) return;
    //     this.elements[id].element.submit();
    // }
    // focus(id: string): void {
    //     if (!this.hasKey(id)) return;
    //     this.elements[id].element.focus();
    // }
    // blur(id: string): void {
    //     if (!this.hasKey(id)) return;
    //     this.elements[id].element.blur();
    // }
    // select(id: string, value: string): void {
    //     if (!this.hasKey(id)) return;
    //     let element = this.elements[id].element as HTMLSelectElement;
    //     element.value = value;
    // }
    // getSelected(id: string): string {
    //     if (!this.hasKey(id)) return "";
    //     let element = this.elements[id].element as HTMLSelectElement;
    //     return element.value;
    // }
}
