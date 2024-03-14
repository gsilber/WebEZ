import { EzComponent } from "./EzComponent";

declare const window: Window;
type Constructor<T> = { new (): T };
const html: string =
    "<div>Testing Environment</div><div id='main-target'></div>";

export function bootstrap<T extends EzComponent>(
    target: Constructor<T>,
    testMode: boolean = false,
): T {
    if (testMode) {
        //create the dom and attach to window
        window.document.body.innerHTML = html;
    }
    let obj: T = Object.assign(new target()) as T;
    const element = window.document.getElementById("main-target");
    if (element) obj.appendToDomElement(element);
    else obj.appendToDomElement(window.document.body);
    return obj;
}
