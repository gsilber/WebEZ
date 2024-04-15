import { EzComponent } from "./EzComponent";

/**
 * @description Gets the public key of the field name
 * @param name the name of the field
 * @returns the public key
 * @ignore
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
 * @ignore
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
 * @ignore
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
 * @ignore
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
 * @ignore
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
 * @description Recreates the set of elements bound to the array by duplicating the element parameter for each element in the array
 * @param arr the array of values to bind to the elements
 * @param element the element to duplicate for each element in the array
 * @returns void
 * @ignore
 */
function recreateBoundList(arr: string[], element: HTMLElement) {
    //hide current element
    element.style.display = "none";
    const sibs: HTMLElement[] = [];
    let n = element.parentElement?.firstChild;
    for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== element) sibs.push(n as HTMLElement);
    }
    if (sibs.length > arr.length) {
        //remove extra siblings
        sibs.slice(arr.length).forEach((v) => {
            v.remove();
        });
    } else if (sibs.length < arr.length) {
        //add the extra siblings
        for (let i = sibs.length; i < arr.length; i++) {
            let clone = element.cloneNode(true) as HTMLElement;
            sibs.push(clone);
            element.parentElement?.appendChild(clone);
        }
    }
    //replace the value of the siblings with the value in the array
    arr.forEach((v, i) => {
        sibs[i].style.display = element.getAttribute("original-display") || "";

        if (sibs[i] instanceof HTMLInputElement)
            (sibs[i] as HTMLInputElement).value = v;
        else if (sibs[i] instanceof HTMLOptionElement) {
            (sibs[i] as HTMLOptionElement).value = v;
            (sibs[i] as HTMLOptionElement).text = v;
        } else sibs[i].innerHTML = v;
    });

    /*replaced to not recreate the dom each time the array changed.  Delete once working*/
    // while (element.nextSibling) {
    //     element.nextSibling.remove();
    // }
    // //attach a clone of the element for each element in the list and set its value or innerhtml property to the value to the elmements parent
    // arr.forEach((v) => {
    //     let clone = element.cloneNode(true) as HTMLElement;
    //     clone.style.display = "initial";
    //     if (clone instanceof HTMLInputElement) clone.value = v;
    //     else if (clone instanceof HTMLOptionElement) {
    //         clone.value = v;
    //         clone.text = v;
    //     } else clone.innerHTML = v;
    //     element.parentElement?.appendChild(clone);
    // });
}
/**
 * @description Creates a proxy object that will update the bound list when the array is modified
 * @param array the array to proxy
 * @param element the element to bind the array to
 * @returns Proxy
 * @ignore
 */
function boundProxyFactory(array: string[], element: HTMLElement) {
    return new Proxy(array, {
        set(target: string[], prop: any, value: string) {
            if (prop !== "length") {
                target[prop] = value;
                recreateBoundList(target, element);
            }
            return true;
        },
        get(target: string[], prop: any) {
            let ops = [
                "fill",
                "copyWithin",
                "push",
                "reverse",
                "shift",
                "slice",
                "sort",
                "splice",
                "unshift",
            ];
            if (ops.indexOf(prop) !== -1) {
                const origMethod: any = target[prop];

                return function (...args: any[]) {
                    origMethod.apply(target, args);
                    recreateBoundList(target, element);
                };
            }
            return target[prop];
        },
    });
}

/**
 * @description Decorator to bind a specific style string property to an element
 * @param id the element to bind the property to
 * @param style the style to bind (i.e. background-color, left, top, etc.)
 * @param transform an optional function to transform the value before it is set on the element
 * @returns DecoratorCallback
 * @group Bind Decorators
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
 * @param style the style to bind (i.e. background-color, left, top, etc.)
 * @param transform a function to transform the value to a valid style name before it is set on the element
 * @returns DecoratorCallback
 * @group Bind Decorators
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
/**@ignore */
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
            if (value !== undefined)
                element.style[style] = transform.call(this, value);
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
 * @group Bind Decorators
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
 * @group Bind Decorators
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
/**@ignore */
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
            if (value !== undefined) {
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
 * @group Bind Decorators
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
 * @group Bind Decorators
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
            if (value !== undefined) {
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
            }
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
 * @group Bind Decorators
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
 * @group Bind Decorators
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
            if (value !== undefined) setfn(value);
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, setfn);
            } else {
                hookProperty(this, context.name, value, setfn);
            }
        });
    };
}

/**
 * @description Decorator to bind a list to an element.  The element will be cloned for each element in the list and the value of the element will be set to the value in the list
 * @param id the element to bind the property to
 * @param transform a function to transform the value to a string[] before it is set on the element
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will create a list of divs with the values in the list that are
 * //siblings to myDiv.  myDiv itself will be hidden
 * @BindList("myDiv")
 * public list: number[] = ["one", "two", "three"];
 */

export function BindList<This extends EzComponent, Value extends string[]>(
    id: string,
    transform?: (this: This, value: Value) => string[],
): (target: any, context: ClassFieldDecoratorContext<This, Value>) => any;

/**
 * @description Decorator to bind a list to an element.  The element will be cloned for each element in the list and the value of the element will be set to the value in the list
 * @param id the element to bind the property to
 * @param transform a function to transform the value to a string[] before it is set on the element
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will create a list of divs with the values in the list that are
 * //siblings to myDiv.  myDiv itself will be hidden
 * @BindList("myDiv", (value: number[]) => value.map((v)=>v.toString()))
 * public list: number[] = [1,2,3];
 */
export function BindList<This extends EzComponent, Value extends []>(
    id: string,
    transform: (this: This, value: Value) => string[],
): (target: any, context: ClassFieldDecoratorContext<This, Value>) => any;

//implementation
export function BindList<This extends EzComponent, Value extends string[]>(
    id: string,
    transform: (this: This, value: Value) => string[] = (value: Value) =>
        value as string[],
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
            element.setAttribute("original-display", element.style.display);
            const value = context.access.get(this);
            const privateKey: keyof This = getPrivateKey(context.name);
            const publicKey: keyof This = getPublicKey(context.name);
            const origDescriptor = getPropertyDescriptor(this, publicKey);
            const setfn = (value: Value) => {
                recreateBoundList(transform.call(this, value), element);
                (this[privateKey] as string[]) = boundProxyFactory(
                    value,
                    element,
                );
            };
            setfn(value as Value);
            if (origDescriptor.set) {
                hookPropertySetter(this, context.name, origDescriptor, setfn);
            } else {
                hookProperty(this, context.name, value as Value, setfn);
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
 * @group Bind Decorators
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
 * @group Bind Decorators
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
 * @group Bind Decorators
 * @example
 * //This will hide the div with id myDiv1 if the visible property is false
 * @BindVisibleToBoolean("myDiv1")
 * public visible: boolean = true;
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

/**
 * @description Decorator to bind the checked/unchecked value of a checkbox input to a boolean
 * @param id the element to bind the property to
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will check the checkbox with id myCheckbox if the checked property is true
 * @BindCheckedToBoolean("myCheckbox")
 * public checked: boolean = true;
 */
export function BindCheckedToBoolean<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    This extends EzComponent,
    Value extends boolean,
>(id: string) {
    return BindAttribute(id, "checked", (value: Value) =>
        value ? "checked" : "",
    );
}

/**
 * @description Decorator to bind the value of an element to a number
 * @param id the element to bind the property to
 * @param append an optional string to append to the number before setting the value
 * @returns DecoratorCallback
 * @export
 * @group Bind Decorators
 * @example
 * //This will bind the text (value) of the div with id myDiv1 to the number in value
 * @BindValueToNumber("myDiv1")
 * public value: number = 100;
 */
export function BindValueToNumber<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    This extends EzComponent,
    Value extends number,
>(id: string, append: string = "") {
    return BindValue(id, (value: Value) => `${value}${append}` as string);
}

/**
 * @description Decorator to bind a specific style to a number, and optionally append a string to the value
 * @param id the element to bind the property to
 * @param style the style to bind (i.e. background-color, left, top, etc.)
 * @Param optional string to append to the number before setting the value
 * @returns DecoratorCallback
 * @overload
 * @export
 * @group Bind Decorators
 * @example
 * //This will set the width of the div to the number in width
 * @BindStyleToNumber("myDiv", "width","%")
 * public width: number = 100;
 */
export function BindStyleToNumber<
    K extends keyof CSSStyleDeclaration,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
 * @param style the style to bind (i.e. background-color, left, top, etc.)
 * @returns DecoratorCallback
 * @overload
 * @export
 * @group Bind Decorators
 * @example
 * //This will set the width of the div to the number in width
 * @BindStyleToNumberAppendPx("myDiv", "width")
 * public width: number = 100;
 */
export function BindStyleToNumberAppendPx<
    K extends keyof CSSStyleDeclaration,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    This extends EzComponent,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Value extends number,
>(id: string, style: K) {
    return BindStyleToNumber(id, style, "px");
}
