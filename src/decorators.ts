import { EzComponent } from "./EzComponent";

/**
 * @description replaces a property with a new setter and the default getter.  The new setter can call the original setter.
 * @param target the class to replace the setter in
 * @param element the element to bind the property to
 * @param privateKey the private property to store the value in
 * @param publicKey the public property to replace the setter for
 * @param value the initial value of the property
 * @param propertyName the name of the property to bind to
 */
function hookProperty<This extends EzComponent>(
    target: This,
    element: HTMLElement,
    privateKey: keyof This,
    publicKey: keyof This,
    value: string,
    propertyName: string,
) {
    Object.defineProperty(target, privateKey, {
        value,
        writable: true,
        enumerable: false,
        configurable: true,
    });
    Object.defineProperty(target, publicKey, {
        get(): string {
            return this[privateKey] as string;
        },
        set(value: string): void {
            (element as any)[propertyName] = value;
            this[privateKey] = value;
        },
        enumerable: true,
        configurable: true,
    });
}

/**
 * @description Replace setter and getter with the ones provided.  These may call the original setter and getter.
 * @param target the class to replace the setter and getter in
 * @param element the element to bind the property to
 * @param publicKey the property to replace the setter and getter for
 * @param origDescriptor the original property descriptor
 * @param propertyName the name of the property to bind to
 */
function hookPropertySetter<This extends EzComponent>(
    target: This,
    element: HTMLElement,
    publicKey: keyof This,
    origDescriptor: PropertyDescriptor,
    propertyName: string,
) {
    Object.defineProperty(target, publicKey, {
        get: origDescriptor.get, // Leave the get accessor as it was
        set(value: string): void {
            origDescriptor.set?.call(target, value); // Call the original set accessor with the provided value
            (element as any)[propertyName] = value;
        },
        enumerable: origDescriptor.enumerable,
        configurable: origDescriptor.configurable,
    });
}
/**
 * @description Returns a property descriptor for a property in this class
 * @param target the class to get the property descriptor from
 * @param key the property to get the descriptor for
 * @returns PropertyDescriptor
 */
function getPropertyDescriptor<This extends EzComponent>(
    target: This,
    key: keyof This,
): PropertyDescriptor {
    let origDescriptor = Object.getOwnPropertyDescriptor(target, key);
    if (!origDescriptor) {
        throw new Error(`can not find setter with name: ${key as string}`);
    }
    return origDescriptor;
}

/**
 * @description Decorator to bind the className property to an element.
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 */
export function BindCSSClass(id: string) {
    return function <This extends EzComponent, Value extends string>(
        target: undefined,
        context: ClassFieldDecoratorContext<This, Value>,
    ) {
        context.addInitializer(function (this: This) {
            const element = this.shadow.getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = String(context.name) as keyof This;
            const privateKey = `__${String(context.name)}` as keyof This;
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            element.className = value;
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    element,
                    publicKey,
                    origDescriptor,
                    "className",
                );
            } else {
                hookProperty(
                    this,
                    element,
                    privateKey,
                    publicKey,
                    value,
                    "className",
                );
            }
        });
    };
}

/**
 * @description Decorator to bind the innerHtml property to an element.
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 */
export function BindInnerHTML(id: string) {
    return function <This extends EzComponent, Value extends string>(
        target: undefined,
        context: ClassFieldDecoratorContext<This, Value>,
    ) {
        context.addInitializer(function (this: This) {
            const element = this.shadow.getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = String(context.name) as keyof This;
            const privateKey = `__${String(context.name)}` as keyof This;
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            element.innerHTML = value;
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    element,
                    publicKey,
                    origDescriptor,
                    "innerHTML",
                );
            } else {
                hookProperty(
                    this,
                    element,
                    privateKey,
                    publicKey,
                    value,
                    "innerHTML",
                );
            }
        });
    };
}

/**
 * @description Decorator to bind the Value property to an element.  Should be input elements
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @note This decorator should be last in the list of decorators for a property and can only appear once.
 * @export
 */
export function BindValue(id: string) {
    return function <This extends EzComponent, Value extends string>(
        target: undefined,
        context: ClassFieldDecoratorContext<This, Value>,
    ) {
        context.addInitializer(function (this: This) {
            const element = this.shadow.getElementById(id) as
                | HTMLInputElement
                | undefined;
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = String(context.name) as keyof This;
            const privateKey = `__${String(context.name)}` as keyof This;
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            element.value = value;
            //hook both getter and setter to value
            if (origDescriptor.set) {
                throw new Error(
                    "Cannot stack multiple value decorators.  If stacking with InnerHtml decorator, the value decorator must be last in the list.",
                );
            } else {
                hookProperty(
                    this,
                    element,
                    privateKey,
                    publicKey,
                    value,
                    "value",
                );
                element.addEventListener("input", () => {
                    const elementType = this[privateKey];
                    this[publicKey] = element.value as typeof elementType;
                });
            }
        });
    };
}

/**
 * @description Decorator to bind a generic event to an element
 * @param htmlElementID the element to bind the event to
 * @param type the event to bind
 * @returns DecoratorCallback
 * @export
 */
export function GenericEvent<K extends keyof HTMLElementEventMap>(
    htmlElementID: string,
    type: K,
) {
    return function <This extends EzComponent>(
        target: (this: This, event: HTMLElementEventMap[K]) => void,
        context: ClassMethodDecoratorContext<
            This,
            (this: This, event: HTMLElementEventMap[K]) => void
        >,
    ): void {
        context.addInitializer(function (this: This) {
            const element: HTMLElement | null =
                this.shadow.getElementById(htmlElementID);
            if (element) {
                element.addEventListener(type, (e: HTMLElementEventMap[K]) => {
                    target.call(this, e);
                });
            }
        });
    };
}

/**
 * @description Decorator to bind a click event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 */
export function Click(htmlElementID: string) {
    return GenericEvent(htmlElementID, "click");
}

/**
 * @description Decorator to bind a blur event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 */
export function Blur(htmlElementID: string) {
    return GenericEvent(htmlElementID, "blur");
}

/**
 * @description Decorator to bind a change event to an element
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 */
export function Change(htmlElementID: string) {
    return GenericEvent(htmlElementID, "change");
}

/**
 * @description Decorator to bind an input event to an element
 * @param elementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 */
export function Input(htmlElementID: string) {
    return GenericEvent(htmlElementID, "input");
}
