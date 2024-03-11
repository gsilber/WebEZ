export class EventSubject<T = void> {
    private callback: (value: T) => void = () => {};
    constructor() {}

    subscribe(callback: (value: T) => void) {
        this.callback = callback;
    }

    next(value: T) {
        this.callback(value);
    }
}
