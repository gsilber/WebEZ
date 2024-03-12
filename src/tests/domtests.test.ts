import { TestModuleRoot } from "./testing_compnents/testModuleRoot";
import { TestStart } from "./testing_compnents/teststart";
import { describe, test, expect } from "@jest/globals";

declare const window: Window;

describe("Construction and Structure", () => {
    describe("Constructor", () => {
        const testObj: TestStart = new TestStart(window);
        const rootComponent: TestModuleRoot = testObj.rootComponent;
        test("Create Instance", () => {
            expect(testObj).toBeInstanceOf(TestStart);
            expect(rootComponent).toBeDefined();
            expect(rootComponent).toBeInstanceOf(TestModuleRoot);
        });
    });
    describe("Verify Structure", () => {
        const testObj: TestStart = new TestStart(window);
        const rootComponent: TestModuleRoot = testObj.rootComponent;
        test("Verify DOM", () => {
            //walk through the dom and verify that it is as expected.
            //note this depends on the testing_components classes, so if
            //you modify those, you must modify this test.
            expect(rootComponent).toBeDefined();
            const body = window.document.body;
            expect(body).toBeDefined();
            const mainTarget = window.document.getElementById("main-target");
            expect(mainTarget).toBeDefined();
            //verify that our object is there
            expect(mainTarget?.childNodes.length).toEqual(1);
            expect(mainTarget?.childNodes[0]).toEqual(
                rootComponent["htmlElement"],
            );
        });
    });
});
