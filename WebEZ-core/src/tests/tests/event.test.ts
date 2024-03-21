import {
    describe,
    jest,
    expect,
    test,
    beforeAll,
    afterEach,
} from "@jest/globals";
import { bootstrap } from "../../bootstrap";
import { TestComponent } from "../testing_components/test.component";

describe("WebEZ-Event", () => {
    let toplevel: any = undefined;
    describe("Constructor", () => {
        beforeAll(() => {
            const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
            toplevel = bootstrap<TestComponent>(TestComponent, html);
        });
        test("Create Instance", () => {
            expect(toplevel).toBeInstanceOf(TestComponent);
        });
    });
    describe("Single Events:Parent", () => {
        beforeAll(() => {
            const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
            toplevel = bootstrap<TestComponent>(TestComponent, html);
        });
        test("Click event on parent", () => {
            toplevel.testVal = false;
            expect(toplevel.testVal).toBe(false);
            toplevel["shadow"].getElementById("evtButton1").click();
            expect(toplevel.testVal).toBe(true);
            toplevel.testVal2 = false;
            expect(toplevel.testVal2).toBe(false);
            toplevel["shadow"].getElementById("evtDiv1").click();
            expect(toplevel.testVal2).toBe(true);
        });
        test("Stacked click event on parent", () => {
            toplevel.testVal3 = 0;
            expect(toplevel.testVal3).toBe(0);
            toplevel["shadow"].getElementById("evtDiv2").click();
            expect(toplevel.testVal3).toBe(1);
            toplevel["shadow"].getElementById("evtButton2").click();
            expect(toplevel.testVal3).toBe(2);
        });
        test("Test other events", () => {
            const el = toplevel["shadow"].getElementById(
                "evtInput1",
            ) as HTMLInputElement;
            toplevel.testVal4 = "";
            el.value = "test";
            el.dispatchEvent(new Event("change"));
            expect(toplevel.testVal4).toBe("test");
            el.value = "test2";
            el.dispatchEvent(new Event("input"));
            expect(toplevel.testVal4).toBe("test2");
            el.value = "test3";
            el.dispatchEvent(new Event("change"));
            expect(toplevel.testVal4).toBe("test3");
        });
    });
    describe("Events:Grandchild", () => {
        beforeAll(() => {
            const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
            toplevel = bootstrap<TestComponent>(TestComponent, html);
        });
        test("Click event on grandchild", () => {
            //***TODO */
            toplevel.child1.baby1.testVal = false;
            expect(toplevel.child1.baby1.testVal).toBe(false);
            toplevel.child1.baby1["shadow"]
                .getElementById("evtButton1")
                .click();
            expect(toplevel.child1.baby1.testVal).toBe(true);
        });
    });
    describe("Timer Test", () => {
        beforeAll(() => {
            jest.useFakeTimers();
            const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
            toplevel = bootstrap<TestComponent>(TestComponent, html);
        });
        test("Test timer after interval", () => {
            toplevel.fn = jest.fn();
            expect(toplevel.fn).toHaveBeenCalledTimes(0);
            jest.advanceTimersByTime(1005);
            expect(toplevel.fn).toHaveBeenCalledTimes(1);
            jest.advanceTimersByTime(500);
            expect(toplevel.fn).toHaveBeenCalledTimes(1);
            jest.advanceTimersByTime(3500);
            expect(toplevel.fn).toHaveBeenCalledTimes(5);
            jest.advanceTimersByTime(10000);
            expect(toplevel.fn).toHaveBeenCalledTimes(5);
            expect(toplevel.timerTest1).toBe(5);
        });
        afterEach(() => {
            jest.runOnlyPendingTimers();
            jest.useRealTimers();
        });
    });
});
