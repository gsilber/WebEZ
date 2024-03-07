import { WebElement } from "./webelement";

export class WebPage {
    private elements: Record<string, WebElement> = {};

    constructor() {
        //walk the dom and collect any elements that have an id or a name
        let allElements = document.getElementsByTagName("*");
        for (let element of allElements) {
            let id = element.id || element.getAttribute("name");
            if (id) {
                this.elements[id] = new WebElement(id, element);
            }
        }
    }

    hasElement(id: string): boolean {
        return Object.keys(this.elements).indexOf(id) !== -1;
    }

    getElement(id: string): WebElement | undefined {
        if (!this.hasElement(id)) return undefined;
        return this.elements[id];
    }
}
