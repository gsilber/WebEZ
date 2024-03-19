/** TODO
 * 6. Timer decorator and docs
 */
import { EzComponent } from "./EzComponent";

/**
 * @description replaces a property with a new setter and the default getter.  The new setter can call the original setter.
 * @param target the class to replace the setter in
 * @param element the element to bind the property to
 * @param privateKey the private property to store the value in
 * @param publicKey the public property to replace the setter for
 * @param value the initial value of the property
 * @param setter the new setter to replace the original setter with, this does not need to update the hidden private property.
 */
function hookProperty<This extends EzComponent>(
    target: This,
    element: HTMLElement,
    privateKey: keyof This,
    publicKey: keyof This,
    value: string,
    setter: (value: string) => void,
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
        set(value: string) {
            this[privateKey] = value;
            setter(value);
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
 * @param setter the new setter to replace the original setter with, this does not need to update the hidden private property.
 */
function hookPropertySetter<This extends EzComponent>(
    target: This,
    element: HTMLElement,
    publicKey: keyof This,
    origDescriptor: PropertyDescriptor,
    setter: (value: string) => void,
) {
    Object.defineProperty(target, publicKey, {
        get: origDescriptor.get, // Leave the get accessor as it was
        set(value: string): void {
            // This should not happen normally, only hear in case.
            /* istanbul ignore next */
            if (!origDescriptor.set) {
                throw new Error(
                    `can not find setter with name: ${publicKey as string}`,
                );
            }
            origDescriptor.set.call(target, value); // Call the original set accessor with the provided value
            setter(value);
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
    /* istanbul ignore next */
    if (!origDescriptor) {
        throw new Error(`can not find setter with name: ${key as string}`);
    }
    return origDescriptor;
}

/**
 * @description Decorator to bind a specific style to an element
 * @param id the element to bind the property to
 * @param style the style to bind (i.e. background-color, left, top, etc.)
 * @returns DecoratorCallback
 * @export
 */
export function BindStyle<K extends keyof CSSStyleDeclaration>(
    id: string,
    style: K,
) {
    return function <This extends EzComponent, Value extends string>(
        target: undefined,
        context: ClassFieldDecoratorContext<This, Value>,
    ) {
        context.addInitializer(function (this: This) {
            const element = this.shadow.getElementById(id);
            //no easy way to test in Jest
            /* istanbul ignore next */
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = String(context.name) as keyof This;
            const privateKey = `__${String(context.name)}` as keyof This;
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            //replace the style tag with the new value
            (element.style[style] as any) = value;
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    element,
                    publicKey,
                    origDescriptor,
                    (value: string): void => {
                        (element.style[style] as any) = value;
                    },
                );
            } else {
                hookProperty(
                    this,
                    element,
                    privateKey,
                    publicKey,
                    value,
                    (value: string): void => {
                        (element.style[style] as any) = value;
                    },
                );
            }
        });
    };
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
            //no easy way to test in Jest
            /* istanbul ignore next */
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = String(context.name) as keyof This;
            const privateKey = `__${String(context.name)}` as keyof This;
            const origDescriptor = getPropertyDescriptor(this, publicKey);

            const origValue = element.className;
            const value = context.access.get(this);

            element.className = origValue + " " + value;
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    element,
                    publicKey,
                    origDescriptor,
                    (value: string): void => {
                        (element as any)["className"] = origValue + " " + value;
                    },
                );
            } else {
                hookProperty(
                    this,
                    element,
                    privateKey,
                    publicKey,
                    value,
                    (value: string): void => {
                        (element as any)["className"] = origValue + " " + value;
                    },
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
            //no easy way to test in Jest
            /* istanbul ignore next */
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
                    (value: string): void => {
                        (element as any)["innerHTML"] = value;
                    },
                );
            } else {
                hookProperty(
                    this,
                    element,
                    privateKey,
                    publicKey,
                    value,
                    (value: string): void => {
                        (element as any)["innerHTML"] = value;
                    },
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
            //no easy way to test in Jest
            /* istanbul ignore next */
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = String(context.name) as keyof This;
            const privateKey = `__${String(context.name)}` as keyof This;
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            element.value = value;
            //hook both getter and setter to value
            //no easy way to test in jet
            /* istanbul ignore next */
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
                    (value: string): void => {
                        (element as any)["value"] = value;
                    },
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
 * @description Decorator to call a method periodically with a timer
 * @param intervalMS the interval in milliseconds to call the method
 * @returns DecoratorCallback
 * @note This executes repeatedly.  The decorated function is passed a cancel function that can be called to stop the timer.
 * @export
 */
export function Timer(intervalMS: number) {
    return function <This extends EzComponent, Value extends () => void>(
        target: (this: This, cancelFn: () => void) => void,
        context: ClassMethodDecoratorContext<
            This,
            (this: This, cancel: Value) => void
        >,
    ): void {
        context.addInitializer(function (this: This) {
            const intervalID = setInterval(() => {
                target.call(this, () => {
                    clearInterval(intervalID);
                });
            }, intervalMS);
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
 * @param htmlElementID the element to bind the event to
 * @returns DecoratorCallback
 * @export
 */
export function Input(htmlElementID: string) {
    return GenericEvent(htmlElementID, "input");
}
