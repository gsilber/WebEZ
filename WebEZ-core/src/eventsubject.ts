interface CallbackDescription {
    id: number;
    fn: (value: any) => void;
}
export class EventSubject<T = void> {
    refCount: number = 0;
    private callbacks: CallbackDescription[] = [];
    private errorFns: CallbackDescription[] = [];
    constructor() {}

    subscribe(callback: (value: T) => void, error?: (value: Error) => void) {
        this.callbacks.push({ id: this.refCount, fn: callback });
        if (error) this.errorFns.push({ id: this.refCount, fn: error });
        return this.refCount++;
    }
    unsubscribe(id: number) {
        this.callbacks = this.callbacks.filter((cb) => cb.id !== id);
        this.errorFns = this.errorFns.filter((cb) => cb.id !== id);
    }
    next(value: T) {
        for (const callback of this.callbacks) callback.fn(value);
    }
    error(value: Error) {
        for (const errorFn of this.errorFns) errorFn.fn(value);
    }
}
