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
function hookProperty<This extends EzComponent, T>(
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
function hookPropertySetter<This extends EzComponent, T>(
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
 * @description Decorator to bind a specific style string property to an element
 * @param id the element to bind the property to
 * @param style the style to bind (i.e. background-color, left, top, etc.)
 * @param transform an optional function to transform the value before it is set on the element
 * @returns DecoratorCallback
 * @overload
 * @export
 * @example
 * //This will set the background color of the div with id myDiv to the value in backgroundColor
 * @BindStyle("myDiv", "backgroundColor")
 * public backgroundColor: string = "red";
 */
export function BindStyle<
    K extends keyof CSSStyleDeclaration,
    Value extends CSSStyleDeclaration[K],
>(
    id: string,
    style: K,
    transform?: (value: Value) => CSSStyleDeclaration[K],
): <This extends EzComponent>(
    target: any,
    context: ClassFieldDecoratorContext<This, Value>,
) => any;

/**
 * @description Decorator to bind a specific style non-string property to an element
 * @param id the element to bind the property to
 * @param a value that the transformer will turn into a string that will be set as the style
 * @param transform a function to transform the value to a valid style name before it is set on the element
 * @returns DecoratorCallback
 * @overload
 * @export
 * @example
 * //This will set the background color of the div with id myDiv to the red if the property is true, or blue if it is false
 * @BindStyle("myDiv", "backgroundColor",(value: boolean) => value ? "red" : "blue")
 * public backgroundColor: boolean=true;
 */
export function BindStyle<K extends keyof CSSStyleDeclaration, Value>(
    id: string,
    style: K,
    transform: (value: Value) => CSSStyleDeclaration[K],
): <This extends EzComponent>(
    target: any,
    context: ClassFieldDecoratorContext<This, Value>,
) => any;

// Actual implementation, should not be in documentation as the overloads capture the two cases
export function BindStyle<K extends keyof CSSStyleDeclaration, Value>(
    id: string,
    style: K,
    transform: (value: Value) => string = (value: Value) => value as string,
): <This extends EzComponent>(
    target: any,
    context: ClassFieldDecoratorContext<This, Value>,
) => any {
    return function <This extends EzComponent>(
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
            const value: Value = context.access.get(this);
            //replace the style tag with the new value
            (element.style[style] as any) = computePipe(
                this,
                context.name,
                transform(value),
            );
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    context.name,
                    origDescriptor,
                    (value: Value): void => {
                        (element.style[style] as any) = computePipe(
                            this,
                            context.name,
                            transform(value),
                        );
                    },
                );
            } else {
                hookProperty(
                    this,
                    context.name,
                    value,
                    (value: Value): void => {
                        (element.style[style] as any) = computePipe(
                            this,
                            context.name,
                            transform(value),
                        );
                    },
                );
            }
        });
    };
}

/**
 * @description Decorator to bind a specific style to a number, and append a 'px' to the value
 * @param id the element to bind the property to
 * @param a value that the transformer will turn into a string that will be set as the style
 * @returns DecoratorCallback
 * @overload
 * @export
 * @example
 * //This will set the width of the div to the number in width
 * @BindstyleToNumberAppendPx("myDiv", "width")
 * public width: number = 100;
 */
export function BindstyleToNumberAppendPx<
    K extends keyof CSSStyleDeclaration,
    This extends EzComponent,
    Value extends number,
>(id: string, style: K) {
    return BindStyle(
        id,
        style,
        (value: Value) => `${value}px` as CSSStyleDeclaration[K],
    );
}

/**
 * @description Decorator to bind the className property to an element.  Only effects BindStyle and BindInnerHtml decorators
 * @param id the element to bind the property to
 * @param transform an optional function to transform the value to a string before it is set on the element
 * @returns DecoratorCallback
 * @export
 * @overload
 * @example
 * //This will set the CSS class of the div with id myDiv to the value in cssClass
 * @BindCSSClass("myDiv")
 * public cssClass: string = "myCSSClass";
 */
export function BindCSSClass<Value extends string>(
    id: string,
    transform?: (value: Value) => string,
): <This extends EzComponent>(
    target: any,
    context: ClassFieldDecoratorContext<This, Value>,
) => any;

/**
 * @description Decorator to bind the className property to an element.  Only effects BindStyle and BindInnerHtml decorators
 * @param id the element to bind the property to
 * @param transform a function to transform the value to a string before it is set on the element
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will set the CSS class of the div with id myDiv to the value in cssClass
 * @BindCSSClass("myDiv")
 * public cssClass: string = "myCSSClass";
 */
export function BindCSSClass<Value>(
    id: string,
    transform: (value: Value) => string,
): <This extends EzComponent>(
    target: any,
    context: ClassFieldDecoratorContext<This, Value>,
) => any;

// Actual implementation, should not be in documentation as the overloads capture the two cases
export function BindCSSClass<Value>(
    id: string,
    transform: (value: Value) => string = (value: Value) => value as string,
): <This extends EzComponent>(
    target: any,
    context: ClassFieldDecoratorContext<This, Value>,
) => any {
    return function <This extends EzComponent>(
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

            const value: Value = context.access.get(this);

            let valArray = transform(value)
                .split(" ")
                .filter((v) => v.length > 0);
            if (valArray.length > 0) element.classList.add(...valArray);
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    context.name,
                    origDescriptor,
                    (value: Value): void => {
                        let currentList = transform(context.access.get(this))
                            .split(" ")
                            .filter((v) => v.length > 0);
                        if (currentList.length > 0)
                            element.classList.remove(...currentList);
                        let newClasses = transform(value)
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
                    (value: Value): void => {
                        let currentList = transform(context.access.get(this))
                            .split(" ")
                            .filter((v) => v.length > 0);
                        if (currentList.length > 0)
                            element.classList.remove(...currentList);
                        let newClasses = transform(value)
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
 * @BindCSSClassToBoolean("myDiv", "myCSSClass")
 * public enabled: boolean = true;
 */
export function BindCSSClassToBoolean<
    This extends EzComponent,
    Value extends boolean,
>(id: string, cssClassName: string) {
    return BindCSSClass(id, (value: Value) => (value ? cssClassName : ""));
}

/**
 * @description Decorator to bind the innerHtml property to an element.
 * @param id the element to bind the property to
 * @param transform an optional function to transform the value before it is set on the element
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will display Hello World in the div with id myDiv
 * @BindInnerHTML("myDiv")
 * public hello: string = "Hello World";
 * @example
 * //This will display Hello World in the div with id myDiv in upper case
 * @BindInnerHTML("myDiv", (value: string) => value.toUpperCase())
 * public hello: string = "Hello World";
 */
export function BindInnerHTML<Value extends string>(
    id: string,
    transform?: (value: Value) => string,
): <This extends EzComponent>(
    target: any,
    context: ClassFieldDecoratorContext<This, Value>,
) => any;

/**
 * @description Decorator to bind the innerHtml property to an element.
 * @param id the element to bind the property to
 * @param transform a function to transform the value before it is set on the element
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will display Hello World in the div with id myDiv
 * @BindInnerHTML("myDiv", (value: boolean) => value ? "Hello" : "Goodbye")
 * public hello: boolean = true;
 */
export function BindInnerHTML<Value>(
    id: string,
    transform: (value: Value) => string,
): <This extends EzComponent>(
    target: any,
    context: ClassFieldDecoratorContext<This, Value>,
) => any;

// Actual implementation, should not be in documentation as the overloads capture the two cases
export function BindInnerHTML<Value>(
    id: string,
    transform: (value: Value) => string = (value: Value) => value as string,
): <This extends EzComponent>(
    target: any,
    context: ClassFieldDecoratorContext<This, Value>,
) => any {
    return function <This extends EzComponent>(
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
            element.innerHTML = computePipe(
                this,
                context.name,
                transform(value),
            );
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    context.name,
                    origDescriptor,
                    (value: Value): void => {
                        (element as any)["innerHTML"] = computePipe(
                            this,
                            context.name,
                            transform(value),
                        );
                    },
                );
            } else {
                hookProperty(
                    this,
                    context.name,
                    value,
                    (value: Value): void => {
                        (element as any)["innerHTML"] = computePipe(
                            this,
                            context.name,
                            transform(value),
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
 * @param transform an optional pair of functions of the form {forward: fn1,revers: fn2} to transform the value before it is set on the element and before it is retrieved from the element
 * @returns DecoratorCallback
 * @note This decorator should be last in the list of decorators for a property and can only appear once.
 * @export
 * @example
 * //This will bind the value of the input element with id myInput to the value property of the class
 * @BindValue("myInput")
 * public value: string = "Hello";
 */
export function BindValue<Value extends string>(
    id: string,
    transform?: {
        forward: (value: Value) => string;
        reverse: (value: string) => Value;
    },
): <This extends EzComponent>(
    target: any,
    context: ClassFieldDecoratorContext<This, Value>,
) => any;

/**
 * @description Decorator to bind the Value property to an element.  Should be input elements
 * @param id the element to bind the property to
 * @param transform a pair of functions of the form {forward: fn1,revers: fn2} to transform the value before it is set on the element and before it is retrieved from the element
 * @returns DecoratorCallback
 * @note This decorator should be last in the list of decorators for a property and can only appear once.
 * @export
 * @example
 * //This will bind the value of the input element with id myInput to the value property of the class
 * @BindValue("myInput",{forward:(v: number) => v.toString(), reverse: (v: string) => parseInt(v})
 * public value: number = 4;
 */
export function BindValue<Value>(
    id: string,
    transform: {
        forward: (value: Value) => string;
        reverse: (value: string) => Value;
    },
): <This extends EzComponent>(
    target: any,
    context: ClassFieldDecoratorContext<This, Value>,
) => any;

// Actual implementation, should not be in documentation as the overloads capture the two cases
export function BindValue<Value>(
    id: string,
    transform: {
        forward: (value: Value) => string;
        reverse: (value: string) => Value;
    } = {
        forward: (value: Value) => value as string,
        reverse: (value: string) => value as Value,
    },
): <This extends EzComponent>(
    target: any,
    context: ClassFieldDecoratorContext<This, Value>,
) => any {
    return function <This extends EzComponent>(
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

            element.value = transform.forward(value);
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
                    (value: Value): void => {
                        element["value"] = transform.forward(value);
                    },
                );
                element.addEventListener("input", () => {
                    (this[publicKey] as any) = transform.reverse(element.value);
                });
            }
        });
    };
}

/**
 * @description Decorator to bind any attribute of an element to a property
 * @param id the element to bind the property to
 * @param {string}attribute the attribute to bind (empty string deletes the attribute from the element)
 * @param transform an optional function to transform the value before it is set on the element
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will set the src attribute of the img with id myImg to the value of the src property
 * @BindAttribute("myImg", "src")
 * public src: string = "https://via.placeholder.com/150";
 * @example
 * @BindAttribute("myImg", "src", (val: string) => `https://test.com/images/${val})
 * public src: string = "test.png";
 */

export function BindAttribute<K extends string, Value extends string>(
    id: string,
    attribute: K,
    transform?: (value: Value) => string,
): <This extends EzComponent>(
    target: any,
    context: ClassFieldDecoratorContext<This, Value>,
) => any;

/**
 * @description Decorator to bind any attribute of an element to a property
 * @param id the element to bind the property to
 * @param attribute the attribute to bind (empty string deletes the attribute from the element)
 * @param transform a function to transform the value to a string before it is set on the element
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will set the src attribute of the img with id myImg to the value of the src property
 * @BindAttribute("myImg", "disabled", (val: boolean) => val ? "disabled" : "")
 * disabled:boolean=false;
 */
export function BindAttribute<K extends string, Value>(
    id: string,
    attribute: K,
    transform: (value: Value) => string,
): <This extends EzComponent>(
    target: any,
    context: ClassFieldDecoratorContext<This, Value>,
) => any;

// Actual implementation, should not be in documentation as the overloads capture the two cases
export function BindAttribute<K extends string, Value>(
    id: string,
    attribute: K,
    transform: (value: Value) => string = (value: Value) => value as string,
): <This extends EzComponent>(
    target: any,
    context: ClassFieldDecoratorContext<This, Value>,
) => any {
    return function <This extends EzComponent>(
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
            setfn = (value: Value) => {
                if (transform(value) !== "")
                    element.setAttribute(attribute, transform(value));
                else element.removeAttribute(attribute);
            };
            setfn(value);
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, setfn);
            } else {
                hookProperty(this, context.name, value, setfn);
            }
        });
    };
}
