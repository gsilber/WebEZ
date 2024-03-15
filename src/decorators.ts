import { EzComponent } from "./EzComponent";

declare type SetterFunction = (this: EzComponent, value: string) => void;
declare type GetterFunction = (this: EzComponent) => string;

function hookProperty<This extends EzComponent>(
    target: This,
    element: HTMLElement,
    privateKey: keyof This,
    publicKey: keyof This,
    value: string,
    setter: SetterFunction,
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
        set: setter,
        enumerable: true,
        configurable: true,
    });
}

function hookPropertySetter<This extends EzComponent>(
    target: This,
    element: HTMLElement,
    publicKey: keyof This,
    getter: GetterFunction,
    setter: SetterFunction,
) {
    Object.defineProperty(target, publicKey, {
        get: getter, // Leave the get accessor as it was
        set: setter,
        enumerable: true,
        configurable: true,
    });
}

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
                    origDescriptor.get as GetterFunction,
                    (value: string) => {
                        origDescriptor.set?.call(target, value); // Call the original set accessor with the provided value
                        element.className = value;
                    },
                );
            } else {
                hookProperty(
                    this,
                    element,
                    privateKey,
                    publicKey,
                    value,
                    (value: string) => {
                        element.className = value;
                        (this as any)[privateKey] = value;
                    },
                );
            }
        });
    };
}

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
                    origDescriptor.get as GetterFunction,
                    (value: string) => {
                        origDescriptor.set?.call(target, value); // Call the original set accessor with the provided value
                        element.innerHTML = value;
                    },
                );
            } else {
                hookProperty(
                    this,
                    element,
                    privateKey,
                    publicKey,
                    value,
                    () => {
                        element.innerHTML = value;
                        (this as any)[privateKey] = value;
                    },
                );
            }
        });
    };
}
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
                    (value: string) => {
                        if (!(element as any).value)
                            throw new Error(
                                `Decorator is invalid for this type of html element.  Element does not have a property named: value}`,
                            );
                        (element as any).value = value;
                        (this as any)[privateKey] = value;
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
export function GenEvent<K extends keyof HTMLElementEventMap>(
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

export function Click(htmlElementID: string) {
    return GenEvent(htmlElementID, "click");
}
