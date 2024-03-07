import { WebElement } from "./webelement";

export abstract class WebPage {
  private elements: Record<string, WebElement> = {};

  constructor() {
    document.body.onload = () => {
      //walk the dom and collect any elements that have an id or a name
      let allElements = document.getElementsByTagName("*");
      for (let element of allElements) {
        let id = element.id || element.getAttribute("name");
        if (id) {
          this.elements[id] = new WebElement(id, element);
        }
      }
      this.onLoad();
    };
  }

  /**
   * Check if an element exists with a given id
   * @param id the id of the html elment to retrieve
   * @returns true if element is on the page, false otherwise
   * @sideeffects none
   */
  protected hasElement(id: string): boolean {
    return Object.keys(this.elements).indexOf(id) !== -1;
  }

    /**
     * Get an element by id
     * @param id the id of the html elment to retrieve
     * @returns the html element or undefined if it does not exist
     * @sideeffects none
     */
  protected getElement(id: string): WebElement | undefined {
    if (!this.hasElement(id)) return undefined;
    return this.elements[id];
  }

    /**
     * Called when the page is loaded.  Must be implemented in child class
     * @param none
     * @returns void
     */
  protected abstract onLoad(): void;
}
