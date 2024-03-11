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
 * @param elementID the element to bind the property to
 * @param bidirectional if true, the element will be updated when the property changes and the property will be updated when the element changes
 * @returns DecoratorCallback
 * @export
 */
export function Bind(
    elementID: string,
    bidirectional: boolean = false,
): DecoratorCallback {
    return function (target: any, propertyKey: string): void {
        if (!propertyKey) {
            console.error("Bind decorator must be used on a property");
            return;
        }
        Reflect.defineMetadata(
            "bind:" + elementID,
            { type: "bind", key: elementID, bidirectional: bidirectional },
            target,
        );
    };
}

/**
 * @description Decorator to bind a generic event to an element
 * @param elementID the element to bind the event to
 * @param event the event to bind
 * @returns DecoratorCallback
 * @export
 */
export function GenericEvent(
    elementID: string,
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
                key: elementID,
                bidirectional: false,
                eventName: event,
            },
            target,
        );
    };
}

/**
 * @description Decorator to bind a click event to an element
 * @param elementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 */
export function Click(elementID: string): DecoratorCallback {
    return GenericEvent(elementID, "click");
}

/**
 * @description Decorator to bind a blur event to an element
 * @param elementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 */
export function Blur(elementID: string): DecoratorCallback {
    return GenericEvent(elementID, "blur");
}

/**
 * @description Decorator to bind a change event to an element
 * @param elementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 */
export function Change(elementID: string): DecoratorCallback {
    return GenericEvent(elementID, "change");
}

/**
 * @description Decorator to bind an input event to an element
 * @param elementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 */
export function Input(elementID: string): DecoratorCallback {
    return GenericEvent(elementID, "input");
}

/**
 * @description Decorator to bind an objects class to an element
 * @param elementID the element to bind the event to
 * @param className the class to bind
 * @param remove if true, the class will be removed from the element
 * @returns DecoratorCallback
 * @export
 */
export function CSSClass(elementID: string): DecoratorCallback {
    return function (target: any, propertyKey: string): void {
        if (!propertyKey) {
            console.error("CSSClass decorator must be used on a property");
            return;
        }
        Reflect.defineMetadata(
            "cssc:" + propertyKey,
            {
                type: "cssc",
                key: elementID,
                valueKey: propertyKey,
            } as BindDescriptor,
            target,
        );
    };
}
