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
    This extends EzComponent,
    K extends keyof CSSStyleDeclaration,
    Value extends CSSStyleDeclaration[K],
>(
    id: string,
    style: K,
    transform?: (this: This, value: Value) => CSSStyleDeclaration[K],
): (target: undefined, context: ClassFieldDecoratorContext<This, Value>) => any;

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
export function BindStyle<
    This extends EzComponent,
    K extends keyof CSSStyleDeclaration,
    Value,
>(
    id: string,
    style: K,
    transform: (this: This, value: Value) => CSSStyleDeclaration[K],
): (target: undefined, context: ClassFieldDecoratorContext<This, Value>) => any;

// Actual implementation, should not be in documentation as the overloads capture the two cases
export function BindStyle<
    This extends EzComponent,
    K extends keyof CSSStyleDeclaration,
    Value,
>(
    id: string,
    style: K,
    transform: (this: This, value: Value) => CSSStyleDeclaration[K] = (
        value: Value,
    ) => value as CSSStyleDeclaration[K],
): (
    target: undefined,
    context: ClassFieldDecoratorContext<This, Value>,
) => any {
    return function (
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
            element.style[style] = transform.call(
                this,
                value,
            ) as CSSStyleDeclaration[K];
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    context.name,
                    origDescriptor,
                    (value: Value): void => {
                        element.style[style] = transform.call(
                            this,
                            value,
                        ) as CSSStyleDeclaration[K];
                    },
                );
            } else {
                hookProperty(
                    this,
                    context.name,
                    value,
                    (value: Value): void => {
                        element.style[style] = transform.call(
                            this,
                            value,
                        ) as CSSStyleDeclaration[K];
                    },
                );
            }
        });
    };
}

/**
 * @description Decorator to bind the className property to an element.
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
export function BindCSSClass<This extends EzComponent, Value extends string>(
    id: string,
    transform?: (this: This, value: Value) => string,
): (target: any, context: ClassFieldDecoratorContext<This, Value>) => any;

/**
 * @description Decorator to bind the className property to an element.
 * @param id the element to bind the property to
 * @param transform a function to transform the value to a string before it is set on the element
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will set the CSS class of the div with id myDiv to the value in cssClass
 * @BindCSSClass("myDiv")
 * public cssClass: string = "myCSSClass";
 */
export function BindCSSClass<This extends EzComponent, Value>(
    id: string,
    transform: (this: This, value: Value) => string,
): (target: any, context: ClassFieldDecoratorContext<This, Value>) => any;

// Actual implementation, should not be in documentation as the overloads capture the two cases
export function BindCSSClass<This extends EzComponent, Value>(
    id: string,
    transform: (this: This, value: Value) => string = (value: Value) =>
        value as string,
): (target: any, context: ClassFieldDecoratorContext<This, Value>) => any {
    return function (
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
            if (value) {
                let valArray = transform
                    .call(this, value)
                    .split(" ")
                    .filter((v) => v.length > 0);
                if (valArray.length > 0) element.className = valArray.join(" ");
            }
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    context.name,
                    origDescriptor,
                    (value: Value): void => {
                        let origValue = context.access.get(this);
                        let currentList;
                        if (origValue) {
                            currentList = transform
                                .call(this, origValue)
                                .split(" ")
                                .filter((v) => v.length > 0);
                            if (currentList.length > 0)
                                currentList.forEach(
                                    (v: string) =>
                                        (element.className =
                                            element.className.replace(v, "")),
                                );
                        }
                        let newClasses = transform
                            .call(this, value)
                            .split(" ")
                            .filter((v) => v.length > 0);
                        if (newClasses.length > 0)
                            newClasses.forEach(
                                (v: string) => (element.className += ` ${v}`),
                            );
                    },
                    true,
                );
            } else {
                hookProperty(
                    this,
                    context.name,
                    value,
                    (value: Value): void => {
                        let origValue = context.access.get(this);
                        let currentList;
                        if (origValue) {
                            currentList = transform
                                .call(this, origValue)
                                .split(" ")
                                .filter((v) => v.length > 0);
                            if (currentList.length > 0)
                                currentList.forEach(
                                    (v: string) =>
                                        (element.className =
                                            element.className.replace(v, "")),
                                );
                        }

                        let newClasses = transform
                            .call(this, value)
                            .split(" ")
                            .filter((v) => v.length > 0);
                        if (newClasses.length > 0)
                            newClasses.forEach(
                                (v: string) => (element.className += ` ${v}`),
                            );
                    },
                    true,
                );
            }
        });
    };
}

/**
 * @description Decorator to bind the innerHtml or value property to an element.
 * @param id the element to bind the property to
 * @param transform an optional function to transform the value before it is set on the element
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will display Hello World in the div with id myDiv
 * @BindValue("myDiv")
 * public hello: string = "Hello World";
 * @example
 * //This will display Hello World in the div with id myDiv in upper case
 * @BindValue("myDiv", (value: string) => value.toUpperCase())
 * public hello: string = "Hello World";
 * @example
 * //This will display the value of the variable in the input box with id myInput
 * @BindValue("myInput")
 * public hello: string = "Hello World";
 * @example
 * //This will display the value of the variable in the input box with id myInput in upper case
 * @BindValue("myInput", (value: string) => value.toUpperCase())
 * public hello: string = "Hello World";
 *
 */
export function BindValue<This extends EzComponent, Value extends string>(
    id: string,
    transform?: (this: This, value: Value) => string,
): (target: any, context: ClassFieldDecoratorContext<This, Value>) => any;

/**
 * @description Decorator to bind the innerHtml property to an element.
 * @param id the element to bind the property to
 * @param transform a function to transform the value before it is set on the element
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will display Hello World in the div with id myDiv
 * @BindValue("myDiv", (value: boolean) => value ? "Hello" : "Goodbye")
 * public hello: boolean = true;
 * @example
 * //This will display hello world in the input box with id myInput
 * @BindValue("myInput", (value: string) => value.toUpperCase())
 * public hello: string = "Hello World";
 */
export function BindValue<This extends EzComponent, Value>(
    id: string,
    transform: (this: This, value: Value) => string,
): (target: any, context: ClassFieldDecoratorContext<This, Value>) => any;

// Actual implementation, should not be in documentation as the overloads capture the two cases
export function BindValue<This extends EzComponent, Value>(
    id: string,
    transform: (this: This, value: Value) => string = (value: Value) =>
        value as string,
): (target: any, context: ClassFieldDecoratorContext<This, Value>) => any {
    return function (
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
            if (element instanceof HTMLInputElement)
                (element as HTMLInputElement).value = transform.call(
                    this,
                    value,
                );
            else if (element instanceof HTMLTextAreaElement)
                (element as HTMLTextAreaElement).value = transform.call(
                    this,
                    value,
                );
            else if (element instanceof HTMLSelectElement)
                (element as HTMLSelectElement).value = transform.call(
                    this,
                    value,
                );
            else if (element instanceof HTMLOptionElement) {
                (element as HTMLOptionElement).value = transform.call(
                    this,
                    value,
                );
                element.text = transform.call(this, value);
            } else element.innerHTML = transform.call(this, value);
            if (origDescriptor.set) {
                hookPropertySetter(
                    this,
                    context.name,
                    origDescriptor,
                    (value: Value): void => {
                        if (element instanceof HTMLInputElement)
                            (element as HTMLInputElement).value =
                                transform.call(this, value);
                        else if (element instanceof HTMLTextAreaElement)
                            (element as HTMLTextAreaElement).value =
                                transform.call(this, value);
                        else if (element instanceof HTMLSelectElement)
                            (element as HTMLSelectElement).value =
                                transform.call(this, value);
                        else if (element instanceof HTMLOptionElement) {
                            (element as HTMLOptionElement).value =
                                transform.call(this, value);
                            element.text = transform.call(this, value);
                        } else element.innerHTML = transform.call(this, value);
                    },
                );
            } else {
                hookProperty(
                    this,
                    context.name,
                    value,
                    (value: Value): void => {
                        if (element instanceof HTMLInputElement)
                            (element as HTMLInputElement).value =
                                transform.call(this, value);
                        else if (element instanceof HTMLTextAreaElement)
                            (element as HTMLTextAreaElement).value =
                                transform.call(this, value);
                        else if (element instanceof HTMLSelectElement)
                            (element as HTMLSelectElement).value =
                                transform.call(this, value);
                        else if (element instanceof HTMLOptionElement) {
                            (element as HTMLOptionElement).value =
                                transform.call(this, value);
                            element.text = transform.call(this, value);
                        } else element.innerHTML = transform.call(this, value);
                    },
                );
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

export function BindAttribute<
    This extends EzComponent,
    K extends string,
    Value extends string,
>(
    id: string,
    attribute: K,
    transform?: (this: This, value: Value) => string,
): (target: any, context: ClassFieldDecoratorContext<This, Value>) => any;

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
export function BindAttribute<
    This extends EzComponent,
    K extends string,
    Value,
>(
    id: string,
    attribute: K,
    transform: (this: This, value: Value) => string,
): (target: any, context: ClassFieldDecoratorContext<This, Value>) => any;

// Actual implementation, should not be in documentation as the overloads capture the two cases
export function BindAttribute<
    This extends EzComponent,
    K extends string,
    Value,
>(
    id: string,
    attribute: K,
    transform: (this: This, value: Value) => string = (value: Value) =>
        value as string,
): (target: any, context: ClassFieldDecoratorContext<This, Value>) => any {
    return function (
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
            let setfn: (value: Value) => void;
            setfn = (value: Value) => {
                if (transform.call(this, value) !== "")
                    element.setAttribute(
                        attribute,
                        transform.call(this, value),
                    );
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

// Wrapper methods for specific operations
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    This extends EzComponent,
    Value extends boolean,
>(id: string, cssClassName: string) {
    return BindCSSClass(id, (value: Value) => (value ? cssClassName : ""));
}

/**
 * @description Decorator to bind the disabled attribute of an element to a boolean
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will disable the button with id myButton if the disabled property is true
 * @BindDisabledToBoolean("myButton")
 * public disabled: boolean = true;
 */
export function BindDisabledToBoolean<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    This extends EzComponent,
    Value extends boolean,
>(id: string) {
    return BindAttribute(id, "disabled", (value: Value) =>
        value ? "disabled" : "",
    );
}

/**
 * @description Decorator to bind the visibility of an element to a boolean
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 * @example
 * //This will check the checkbox with id myCheckbox if the checked property is true
 * @BindCheckedToBoolean("myCheckbox")
 * public checked: boolean = true;
 */
export function BindVisibleToBoolean<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    This extends EzComponent,
    Value extends boolean,
>(id: string) {
    return BindStyle(id, "display", (value: Value) =>
        value ? "block" : "none",
    );
}

export function BindStyleToNumber<
    K extends keyof CSSStyleDeclaration,
    This extends EzComponent,
    Value extends number,
>(id: string, style: K, append: string = "") {
    return BindStyle(
        id,
        style,
        (value: Value) => `${value}${append}` as CSSStyleDeclaration[K],
    );
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
 * @BindStyleToNumberAppendPx("myDiv", "width")
 * public width: number = 100;
 */
export function BindStyleToNumberAppendPx<
    K extends keyof CSSStyleDeclaration,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    This extends EzComponent,
    Value extends number,
>(id: string, style: K) {
    return BindStyleToNumber(id, style, "px");
}
