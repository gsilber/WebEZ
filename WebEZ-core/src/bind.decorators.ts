/** TODO
 * 6. Timer decorator and docs
 */
import { EzComponent } from "./EzComponent";


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
): string {
    const pipeKey = getPipeKey(name);
    let newValue = value;
    if (target[pipeKey] as any) {
        newValue = (target[pipeKey] as any)(newValue) as string;
    }
    return newValue;
}
/**
 * @description replaces a property with a new setter and the default getter.  The new setter can call the original setter.
 * @param target the class to replace the setter in
 * @param name the property to replace the setter for
 * @param value the initial value of the property
 * @param setter the new setter to replace the original setter with, this does not need to update the hidden private property.
 * @param callSetterFirst if true, the setter is called before the original setter, otherwise it is called after.
 */
function hookProperty<This extends EzComponent, T extends string | boolean>(
    target: This,
    name: string | symbol,
    value: T,
    setter: (value: T) => void,
    callSetterFirst: boolean = false,
) {
    const publicKey: keyof This = getPublicKey(name);
    const privateKey: keyof This = getPrivateKey(name);
    Object.defineProperty(target, privateKey, {
        value,
        writable: true,
        enumerable: false,
        configurable: true,
    });
    Object.defineProperty(target, publicKey, {
        get(): T {
            return this[privateKey] as T;
        },
        set(value: T) {
            if (callSetterFirst) setter(value);
            this[privateKey] = value;
            if (!callSetterFirst) setter(value);
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
 * @param callSetterFirst if true, the setter is called before the original setter, otherwise it is called after.
 */
function hookPropertySetter<
    This extends EzComponent,
    T extends string | boolean,
>(
    target: This,
    name: string | symbol,
    origDescriptor: PropertyDescriptor,
    setter: (value: T) => void,
    callSetterFirst: boolean = false,
) {
    const publicKey: keyof This = getPublicKey(name);
    Object.defineProperty(target, publicKey, {
        get: origDescriptor.get, // Leave the get accessor as it was
        set(value: T): void {
            if (callSetterFirst) setter(value);
            if (origDescriptor.set) {
                origDescriptor.set.call(target, value); // Call the original set accessor with the provided value
            }
            if (!callSetterFirst) setter(value);
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
 * @throws Error if the property descriptor is not found
 */
function getPropertyDescriptor<This extends EzComponent>(
    target: This,
    key: keyof This,
): PropertyDescriptor {
    let origDescriptor = Object.getOwnPropertyDescriptor(target, key);
    /* this can't happen.  Just here for type safety checking*/
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
 * @example
 * //This will set the background color of the div with id myDiv to the value in backgroundColor
 * @BindStyle("myDiv", "backgroundColor")
 * public backgroundColor: string = "red";
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
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey: keyof This = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            //replace the style tag with the new value
            (element.style[style] as any) = computePipe(
                this,
                context.name,
                value,
            );
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    context.name,
                    origDescriptor,
                    (value: string): void => {
                        (element.style[style] as any) = computePipe(
                            this,
                            context.name,
                            value,
                        );
                    },
                );
            } else {
                hookProperty(
                    this,
                    context.name,
                    value,
                    (value: string): void => {
                        (element.style[style] as any) = computePipe(
                            this,
                            context.name,
                            value,
                        );
                    },
                );
            }
        });
    };
}

/**
 * @description Decorator to bind the className property to an element.  Only effects BindStyle and BindInnerHtml decorators
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will set the CSS class of the div with id myDiv to the value in cssClass
 * @BindCSSClass("myDiv")
 * public cssClass: string = "myCSSClass";
 */
export function BindCSSClass(id: string) {
    return function <This extends EzComponent, Value extends string>(
        target: undefined,
        context: ClassFieldDecoratorContext<This, Value>,
    ) {
        context.addInitializer(function (this: This) {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey: keyof This = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);

            const value = context.access.get(this);

            let valArray = value.split(" ").filter((v) => v.length > 0);
            if (valArray.length > 0) element.classList.add(...value.split(" "));
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    context.name,
                    origDescriptor,
                    (value: string): void => {
                        let currentList = context.access
                            .get(this)
                            .split(" ")
                            .filter((v) => v.length > 0);
                        if (currentList.length > 0)
                            element.classList.remove(...currentList);
                        let newClasses = value
                            .split(" ")
                            .filter((v) => v.length > 0);
                        if (newClasses.length > 0)
                            element.classList.add(...newClasses);
                    },
                    true,
                );
            } else {
                hookProperty(
                    this,
                    context.name,
                    value,
                    (value: string): void => {
                        let currentList = context.access
                            .get(this)
                            .split(" ")
                            .filter((v) => v.length > 0);
                        if (currentList.length > 0)
                            element.classList.remove(...currentList);
                        let newClasses = value
                            .split(" ")
                            .filter((v) => v.length > 0);
                        if (newClasses.length > 0)
                            element.classList.add(...newClasses);
                    },
                    true,
                );
            }
        });
    };
}

/**
 * @description Decorator to bind the cssClassName property if the boolean property is true
 * @param id the element to bind the property to
 * @param cssClassName the class name to add
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will add the css class myCSSClass to the div with id myDiv if the enabled property is true
 * @BindCSSClassEnabled("myDiv", "myCSSClass")
 * public enabled: boolean = true;
 */
export function BindCSSClassEnabled(id: string, cssClassName: string) {
    return function <This extends EzComponent, Value extends boolean>(
        target: undefined,
        context: ClassFieldDecoratorContext<This, Value>,
    ) {
        context.addInitializer(function (this: This) {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey: keyof This = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            element.classList.remove(cssClassName);
            if (value) element.classList.add(cssClassName);
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    context.name,
                    origDescriptor,
                    (value: boolean): void => {
                        element.classList.remove(cssClassName);
                        if (value) element.classList.add(cssClassName);
                    },
                    true,
                );
            } else {
                hookProperty(
                    this,
                    context.name,
                    value,
                    (value: boolean): void => {
                        element.classList.remove(cssClassName);
                        if (value) element.classList.add(cssClassName);
                    },
                    true,
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
 * @example
 * //This will display Hello World in the div with id myDiv
 * @BindInnerHTML("myDiv")
 * public hello: string = "Hello World";
 */
export function BindInnerHTML(id: string) {
    return function <This extends EzComponent, Value extends string>(
        _target: undefined,
        context: ClassFieldDecoratorContext<This, Value>,
    ) {
        context.addInitializer(function (this: This) {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey: keyof This = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const value = context.access.get(this);
            element.innerHTML = computePipe(this, context.name, value);
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    context.name,
                    origDescriptor,
                    (value: string): void => {
                        (element as any)["innerHTML"] = computePipe(
                            this,
                            context.name,
                            value,
                        );
                    },
                );
            } else {
                hookProperty(
                    this,
                    context.name,
                    value,
                    (value: string): void => {
                        (element as any)["innerHTML"] = computePipe(
                            this,
                            context.name,
                            value,
                        );
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
 * @example
 * //This will bind the value of the input element with id myInput to the value property of the class
 * @BindValue("myInput")
 * public value: string = "Hello";
 */
export function BindValue(id: string) {
    return function <This extends EzComponent, Value extends string>(
        target: undefined,
        context: ClassFieldDecoratorContext<This, Value>,
    ) {
        context.addInitializer(function (this: This) {
            const element = this["shadow"].getElementById(id) as
                | HTMLInputElement
                | undefined;
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey: keyof This = getPublicKey(context.name);
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
                    context.name,
                    value,
                    (value: string): void => {
                        (element as any)["value"] = value;
                    },
                );
                element.addEventListener("input", () => {
                    (this[publicKey] as any) = element.value;
                });
            }
        });
    };
}

/**
 * @description Decorator to bind any attribute of an element to a property
 * @param id the element to bind the property to
 * @param attribute the attribute to bind
 * @note can be bound to both a boolean or a string property.  For a boolean, the value adds or removes the attribute (for things like disabled, checked, etc.).  If a string,the attribute is set to that value.
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will set the disabled attribute of the button with id myButton to the value of the disabled property
 * @BindAttribute("myButton", "disabled")
 * public disabled: boolean = false;
 * @example
 * //This will set the src attribute of the img with id myImg to the value of the src property
 * @BindAttribute("myImg", "src")
 * public src: string = "https://via.placeholder.com/150";
 */
export function BindAttribute(id: string, attribute: string) {
    return function <This extends EzComponent, Value extends string | boolean>(
        target: undefined,
        context: ClassFieldDecoratorContext<This, Value>,
    ) {
        context.addInitializer(function (this: This) {
            const element = this["shadow"].getElementById(id);
            if (!element) {
                throw new Error(`can not find HTML element with id: ${id}`);
            }
            const publicKey: keyof This = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);

            const value = context.access.get(this);
            let setfn: any;
            if (typeof value === "boolean") {
                setfn = (value: boolean) => {
                    if (value) {
                        element.setAttribute(attribute, "true");
                    } else {
                        element.removeAttribute(attribute);
                    }
                };
                setfn(value);
            } else {
                setfn = (value: string) => {
                    element.setAttribute(attribute, value);
                };
                setfn(value);
            }
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, setfn);
            } else {
                hookProperty(this, context.name, value, setfn);
            }
        });
    };
}

/**
 * @description Decorator to transform the value of a property before it is set on the html element.
 * @param fn {PipeFunction} the function to transform the value
 * @returns DecoratorCallback
 * @example
 * //This will display Hello World in the div with id myDiv
 * @Pipe((v: string) => v + " World")
 * @BindInnerHTML("myDiv")
 * public hello: string = "Hello";
 * @export
 */
export function Pipe(fn: PipeFunction) {
    return function <This extends EzComponent, Value extends string>(
        target: undefined,
        context: ClassFieldDecoratorContext<This, Value>,
    ) {
        context.addInitializer(function (this: This) {
            const privateKey: keyof This = getPipeKey(context.name);
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
                (this[privateKey] as any) = fn;
                context.access.set(this, context.access.get(this) as Value);
            }
        });
    };
}

/**
 * @description Decorator to append to the value of a property before it is set on the html element.
 * @param val string to append
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will display Hello World in the div with id myDiv
 * @AppendPipe(" World")
 * @BindInnerHTML("myDiv")
 * public hello: string = "Hello";
 */
export function AppendPipe(val: string) {
    return Pipe((v: string) => v + val);
}
/**
 * @description Decorator to prepend the value of a property before it is set on the html element.
 * @param val The string to prepend
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will display Hello World in the div with id myDiv
 * @PrependPipe("Hello ")
 * @BindInnerHTML("myDiv")
 * public hello: string = "World";
 */
export function PrependPipe(val: string) {
    return Pipe((v: string) => val + v);
}
/**
 * @description Decorator to replace the value of a property before it is set on the html element.
 * @param search {string | RegExp} The string to replace
 * @param  replaceWith The string to replace in the current string
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will display Hello World in the div with id myDiv
 * @ReplacePipe("planet", "World")
 * @BindInnerHTML("myDiv")
 * public hello: string = "Hello planet";
 */
export function ReplacePipe(search: string | RegExp, replaceWith: string) {
    return Pipe((v: string) => v.replace(search, replaceWith));
}
