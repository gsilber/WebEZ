import { describe, expect, test, beforeAll } from "@jest/globals";
import { EventSubject } from "../../eventsubject";

describe("WebEZ-EventSubject", () => {
    beforeAll(() => {});
    describe("Constructor", () => {
        test("Create Instance", async () => {
            expect(true).toBeTruthy();
            let evt: EventSubject<boolean> = new EventSubject<boolean>();
            expect(evt).toBeInstanceOf(EventSubject);
            evt.subscribe((data: boolean) => {
                expect(data).toBeTruthy();
            });
            evt.next(true);
            evt.subscribe((data: boolean) => {
                expect(data).not.toBeTruthy();
            });
            evt.next(false);
        });
    });
});
