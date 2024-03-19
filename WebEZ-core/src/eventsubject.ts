export class EventSubject<T = void> {
    private callback: (value: T) => void = () => {};
    private errorFn: (value: Error) => void = () => {};
    constructor() {}

    subscribe(callback: (value: T) => void, error?: (value: Error) => void) {
        this.callback = callback;
        if (error) this.errorFn = error;
    }

    next(value: T) {
        this.callback(value);
    }
    error(value: Error) {
        this.errorFn(value);
    }
}
