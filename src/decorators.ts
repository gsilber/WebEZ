import "reflect-metadata";

/**
 * @description A metadata description of a decorators intent
 * @interface BindDescriptor
 * @export
 */
export interface BindDescriptor {
    type: string;
    key: string;
    bidirectional: boolean;
    targetName: string;
    valueKey?: string;
    eventName?: string;
}

/**
 * @description A decorator callback
 * @type DecoratorCallback
 */
export type DecoratorCallback = (target: any, propertyKey: string) => void;

/**
 * @description Decorator to bind a property to an element
 * @param bidirectional if true, the element will be updated when the property changes and the property will be updated when the element changes
 * @returns DecoratorCallback
 * @export
 */
export function Bind(bidirectional: boolean = false): DecoratorCallback {
    return function (target: any, propertyKey: string): void {
        if (!propertyKey) {
            console.error("Bind decorator must be used on a property");
            return;
        }
        Reflect.defineMetadata(
            "bind:" + propertyKey,
            { type: "bind", key: propertyKey, bidirectional: bidirectional },
            target,
        );
    };
}

/**
 * @description Decorator to bind a generic event to an element
 * @param selector the element to bind the event to
 * @param event the event to bind
 * @returns DecoratorCallback
 * @export
 */
export function GenericEvent(
    selector: string,
    event: string,
): DecoratorCallback {
    return function (target: any, propertyKey: string): void {
        //only on method
        if (typeof target[propertyKey] !== "function") {
            console.error("Click decorator must be used on a method");
            return;
        }
        Reflect.defineMetadata(
            "gene:" + propertyKey,
            {
                type: "event",
                key: selector,
                bidirectional: false,
                eventName: event,
            },
            target,
        );
    };
}

/**
 * @description Decorator to bind a click event to an element
 * @param selector the element to bind the event to
 * @returns DecoratorCallback
 * @export
 */
export function Click(selector: string): DecoratorCallback {
    return GenericEvent(selector, "click");
}

/**
 * @description Decorator to bind a blur event to an element
 * @param selector the element to bind the event to
 * @returns DecoratorCallback
 * @export
 */
export function Blur(selector: string): DecoratorCallback {
    return GenericEvent(selector, "blur");
}

/**
 * @description Decorator to bind a change event to an element
 * @param selector the element to bind the event to
 * @returns DecoratorCallback
 * @export
 */
export function Change(selector: string): DecoratorCallback {
    return GenericEvent(selector, "change");
}

/**
 * @description Decorator to bind an input event to an element
 * @param selector the element to bind the event to
 * @returns DecoratorCallback
 * @export
 */
export function Input(selector: string): DecoratorCallback {
    return GenericEvent(selector, "input");
}

/**
 * @description Decorator to bind an objects class to an element
 * @param selector the element to bind the event to
 * @param className the class to bind
 * @param remove if true, the class will be removed from the element
 * @returns DecoratorCallback
 * @export
 */
export function CSSClass(selector: string): DecoratorCallback {
    return function (target: any, propertyKey: string): void {
        if (!propertyKey) {
            console.error("CSSClass decorator must be used on a property");
            return;
        }
        Reflect.defineMetadata(
            "cssc:" + propertyKey,
            {
                type: "cssc",
                key: selector,
                valueKey: propertyKey,
            } as BindDescriptor,
            target,
        );
    };
}
