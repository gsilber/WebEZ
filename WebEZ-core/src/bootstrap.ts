import { EzComponent } from "./EzComponent";

declare const window: Window;

type Constructor<T> = { new (): T };

export function bootstrap<T extends EzComponent>(
    target: Constructor<T>,
    testModeHTML: string = "",
): T {
    if (testModeHTML.length > 0) {
        window.document.body.innerHTML = testModeHTML;
    }
    let obj: T = Object.assign(new target()) as T;
    const element = window.document.getElementById("main-target");

    // Can't test both branches simultaneously, tested manually
    /* istanbul ignore next */
    if (element) obj.appendToDomElement(element);
    else obj.appendToDomElement(window.document.body);
    return obj;
}
