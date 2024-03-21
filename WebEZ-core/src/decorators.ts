/** TODO
 * 6. Timer decorator and docs
 */
import { EzComponent } from "./EzComponent";

/**
 * @description Cancel function that the timer decorator can add to the method it decorates.
 * @export
 */
export declare type CancelFunction = () => void;
/**
 * @description Pipe function to be passed tot he type decorator
 * @export
 */
export declare type PipeFunction = (value: string) => string;

/**
 * @description Gets the public key of the field name
 * @param name the name of the field
 * @returns the public key
 */
function getPublicKey<This extends EzComponent>(
    name: string | symbol,
): keyof This {
    return String(name) as keyof This;
}

/**
 * @description Gets the private key of the field name
 * @param name the name of the field
 * @returns the private key
 */
function getPrivateKey<This extends EzComponent>(
    name: string | symbol,
): keyof This {
    return `__${String(name)}` as keyof This;
}

/**
 * @description Gets the pipe key of the field name
 * @param name the name of the field
 * @returns the pipe key
 */
function getPipeKey<This extends EzComponent>(
    name: string | symbol,
): keyof This {
    return `__${String(name)}_pipe` as keyof This;
}

let refCount: number = 0;
/**
 * @description Gets a unique marker key for each decorator
 * @param name the name of the field
 * @returns the marker key
 * @export
 */
function getMerkerKey<This extends EzComponent>(
    name: string | symbol,
    index: number,
): keyof This {
    return `__${String(name)}_${index.toString()}_marker` as keyof This;
}

/**
 * @description computes a piped value
 * @param target the class to decorate
 * @param name the name of the field
 * @returns The field with the pipe applied if it has not already been applied
 */
function computePipe<This extends EzComponent>(
    target: This,
    name: string | symbol,
    value: string,
    index: number,
): string {
    const pipeKey = getPipeKey(name);
    const markerKey = getMerkerKey(name, index);
    let newValue = value;
    console.log(markerKey, target[markerKey]);
    if ((target[pipeKey] as any) && (!target[markerKey] as any)) {
        newValue = (target[pipeKey] as any)(newValue) as string;
        Object.defineProperty(target, markerKey, {
            value: true,
            writable: true,
            enumerable: true,
            configurable: true,
        });
    }
    return newValue;
}
/**
 * @description replaces a property with a new setter and the default getter.  The new setter can call the original setter.
 * @param target the class to replace the setter in
 * @param name the property to replace the setter for
 * @param value the initial value of the property
 * @param setter the new setter to replace the original setter with, this does not need to update the hidden private property.
 */
function hookProperty<This extends EzComponent>(
    target: This,
    name: string | symbol,
    value: string,
    setter: (value: string) => void,
    index: number,
) {
    const publicKey = getPublicKey(name);
    const privateKey = getPrivateKey(name);
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
            const newValue = computePipe(this, name, value, index);
            this[privateKey] = newValue;
            setter(newValue);
        },
        enumerable: true,
        configurable: true,
    });
}

/**
 * @description Replace setter and getter with the ones provided.  These may call the original setter and getter.
 * @param target the class to replace the setter and getter in
 * @param name the property to replace the setter and getter for
 * @param origDescriptor the original property descriptor
 * @param setter the new setter to replace the original setter with, this does not need to update the hidden private property.
 */
function hookPropertySetter<This extends EzComponent>(
    target: This,
    name: string | symbol,
    origDescriptor: PropertyDescriptor,
    setter: (value: string) => void,
    index: number,
) {
    const publicKey = getPublicKey(name);
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
            let newValue = computePipe(this, name, value, index);
            setter(newValue);
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
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            //replace the style tag with the new value
            let index = refCount++;
            (element.style[style] as any) = computePipe(
                this,
                context.name,
                value,
                index,
            );
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    context.name,
                    origDescriptor,
                    (value: string): void => {
                        (element.style[style] as any) = value;
                    },
                    index,
                );
            } else {
                hookProperty(
                    this,
                    context.name,
                    value,
                    (value: string): void => {
                        (element.style[style] as any) = value;
                    },
                    index,
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
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);

            const origValue = element.className;
            const value = context.access.get(this);
            let index = refCount++;
            element.className =
                origValue + " " + computePipe(this, context.name, value, index);
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    context.name,
                    origDescriptor,
                    (value: string): void => {
                        (element as any)["className"] = origValue + " " + value;
                    },
                    index,
                );
            } else {
                hookProperty(
                    this,
                    context.name,
                    value,
                    (value: string): void => {
                        (element as any)["className"] = origValue + " " + value;
                    },
                    index,
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
        _target: undefined,
        context: ClassFieldDecoratorContext<This, Value>,
    ) {
        context.addInitializer(function (this: This) {
            const element = this.shadow.getElementById(id);
            //no easy way to test in Jest
            /* istanbul ignore next */
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            let index = refCount++;
            element.innerHTML = computePipe(this, context.name, value, index);
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    context.name,
                    origDescriptor,
                    (value: string): void => {
                        (element as any)["innerHTML"] = value;
                    },
                    index,
                );
            } else {
                hookProperty(
                    this,
                    context.name,
                    value,
                    (value: string): void => {
                        (element as any)["innerHTML"] = value;
                    },
                    index,
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
            const publicKey = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);

            let index = refCount++;
            element.value = computePipe(this, context.name, value, index);
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
                    context.name,
                    value,
                    (value: string): void => {
                        (element as any)["value"] = value;
                    },
                    index,
                );
                element.addEventListener("input", () => {
                    (this[publicKey] as any) = element.value;
                });
            }
        });
    };
}

/**
 * @description Decorator to transform the value of a property before it is set on the html element.
 * @param fn {PipeFunction} the function to transform the value
 * @returns DecoratorCallback
 * @export
 */
export function Pipe(fn: PipeFunction) {
    return function <This extends EzComponent, Value extends string>(
        target: undefined,
        context: ClassFieldDecoratorContext<This, Value>,
    ) {
        context.addInitializer(function (this: This) {
            const privateKey = `__${String(context.name)}_pipe` as keyof This;
            //get method descriptor for publicKey in This
            if (this[privateKey]) {
                //overwrite it and call the original first
                const origMethod: PipeFunction = this[
                    privateKey
                ] as PipeFunction;
                (this[privateKey] as any) = (value: string) => {
                    return fn(origMethod(value));
                };
                context.access.set(this, context.access.get(this) as Value);
            } else {
                //add pipe method to class under __publicKey__pipe
                (this[privateKey] as any) = fn;
                context.access.set(this, context.access.get(this) as Value);
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

/**
 * @description Decorator to append to the value of a property before it is set on the html element.
 * @param val string to append
 * @returns DecoratorCallback
 * @export
 */
export function AppendPipe(val: string) {
    return Pipe((v: string) => v + val);
}
/**
 * @description Decorator to prepend the value of a property before it is set on the html element.
 * @param val The string to prepend
 * @returns DecoratorCallback
 * @export
 */

export function PrependPipe(val: string) {
    return Pipe((v: string) => val + v);
}
/**
 * @description Decorator to replace the value of a property before it is set on the html element.
 * @param search The string to replace
 * @param replaceWith The string to replace in the current string
 * @returns DecoratorCallback
 * @export
 */

export function ReplacePipe(search: string | RegExp, replaceWith: string) {
    return Pipe((v: string) => v.replace(search, replaceWith));
}
