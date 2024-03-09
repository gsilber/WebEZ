import "reflect-metadata";

export interface BindDescriptor {
    type: string;
    key: string;
    bidirectional: boolean;
    targetName: string;
    eventName?: string;
}

type DecoratorCallback = (target: any, propertyKey: string) => void;

/**
 * @description Decorator to bind a property to an element
 * @param bidirectional if true, the element will be updated when the property changes and the property will be updated when the element changes
 * @returns DecoratorCallback
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
 * @description Decorator to bind a click event to an element
 * @param selector the element to bind the event to
 * @returns DecoratorCallback
 */
export function Click(selector: string): DecoratorCallback {
    return function (target: any, propertyKey: string): void {
        //only on method
        if (typeof target[propertyKey] !== "function") {
            console.error("Click decorator must be used on a method");
            return;
        }
        Reflect.defineMetadata(
            "clic:" + propertyKey,
            {
                type: "event",
                key: selector,
                bidirectional: false,
                eventName: "click",
            },
            target,
        );
    };
}

/**
 * @description Decorator to bind a blur event to an element
 * @param selector the element to bind the event to
 * @returns DecoratorCallback
 */
export function Blur(selector: string): DecoratorCallback {
    return function (target: any, propertyKey: string): void {
        //only on method
        if (typeof target[propertyKey] !== "function") {
            console.error("Click decorator must be used on a method");
            return;
        }
        Reflect.defineMetadata(
            "blur:" + propertyKey,
            {
                type: "event",
                key: selector,
                bidirectional: false,
                eventName: "blur",
            },
            target,
        );
    };
}

/**
 * @description Decorator to bind a change event to an element
 * @param selector the element to bind the event to
 * @returns DecoratorCallback
 */
export function Change(selector: string): DecoratorCallback {
    return function (target: any, propertyKey: string): void {
        //only on method
        if (typeof target[propertyKey] !== "function") {
            console.error("Click decorator must be used on a method");
            return;
        }
        Reflect.defineMetadata(
            "chan:" + propertyKey,
            {
                type: "event",
                key: selector,
                bidirectional: false,
                eventName: "change",
            },
            target,
        );
    };
}

/**
 * @description Decorator to bind a generic event to an element
 * @param selector the element to bind the event to
 * @param event the event to bind
 * @returns DecoratorCallback
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
