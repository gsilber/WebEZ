import { beforeEach, describe, expect, test } from "@jest/globals";
import { bootstrap } from "../../bootstrap";
import { TestComponent } from "../testing_components/test.component";
import { NoRootParentCompnent } from "../testing_components/exceptions/bad.components";
import { SizeInfo } from "../../EzComponent";
describe("Exceptions and  (out of band testing)", () => {
    describe("Attach to body instead of target", () => {
        test("Create Instance", () => {
            let toplevel: any = undefined;
            const html: string = `<div>Testing Environment</div><div></div>`;
            toplevel = bootstrap<TestComponent>(TestComponent, html);
            expect(toplevel).toBeInstanceOf(TestComponent);
        });
    });
    describe("No html for root", () => {
        test("Create Instance", () => {
            let toplevel: any = undefined;
            toplevel = bootstrap<TestComponent>(TestComponent);
            expect(toplevel).toBeInstanceOf(TestComponent);
        });
    });
    describe("No target in for child", () => {
        test("Create Instance", () => {
            let toplevel: any = undefined;
            toplevel = bootstrap<NoRootParentCompnent>(NoRootParentCompnent);
            expect(toplevel).toBeInstanceOf(NoRootParentCompnent);
        });
    });
    describe("Callable methods", () => {
        test("Create Instance", () => {
            let toplevel: any = undefined;
            toplevel = bootstrap<TestComponent>(TestComponent);
            expect(toplevel).toBeInstanceOf(TestComponent);
            toplevel.evtTest = false;
            toplevel.focus("evtInput3");
            expect(toplevel.evtTest).toBeTruthy();
            toplevel.evtTest = false;
            toplevel.click("evtButton3");
            expect(toplevel.evtTest).toBeTruthy();
        });
    });
    describe("Resize Event Tests", () => {
        test("onResizeEvent", () => {
            let toplevel: any = undefined;
            toplevel = bootstrap<TestComponent>(TestComponent);
            expect(toplevel).toBeInstanceOf(TestComponent);
            const mysz = toplevel.getWindowSize() as SizeInfo;
            expect(mysz).toBeDefined();
            toplevel.onResizeEvent.subscribe((sz: SizeInfo) => {
                expect(sz).toBeDefined();
                expect(sz.windowHeight).toBe(mysz.windowHeight);
                expect(sz.windowWidth).toBe(mysz.windowWidth);
            });
        });
    });
    describe("Test getValue Method", () => {
        let toplevel: any = undefined;
        beforeEach(() => {
            toplevel = bootstrap<TestComponent>(TestComponent);
        });
        test("getValue: does not exist", () => {
            expect(toplevel.getValue("doesnotexist")).toBeUndefined();
        });
        test("getValue: does not exist", () => {
            expect(toplevel.getValue("doesnotexist")).toBeUndefined();
        });
        test("getValue: div", () => {
            const input = toplevel.shadow.getElementById(
                "covDiv1",
            ) as HTMLInputElement;
            input.value = "test";
            expect(toplevel.getValue("covDiv1")).toBeUndefined();
        });
        test("getValue: input", () => {
            const input = toplevel.shadow.getElementById(
                "covInp1",
            ) as HTMLInputElement;
            input.value = "test";
            expect(toplevel.getValue("covInp1")).toBe("test");
        });
    });
});
