import { describe, expect, test, beforeAll } from "@jest/globals";
import { TestComponent } from "../testing_compnents/test.component";
import { bootstrap } from "../../bootstrap";

declare const window: Window;
describe("WebEZ-Construction and DOM", () => {
    let toplevel: any = undefined;
    beforeAll(() => {
        toplevel = bootstrap<TestComponent>(TestComponent, true);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(toplevel).toBeInstanceOf(TestComponent);
        });
    });
    describe("DOM", () => {
        test("DOM Parent Attachment", () => {
            let target = window.document.getElementById("main-target");
            expect(target).toBeTruthy();
            expect(target).toBeInstanceOf(HTMLElement);
            expect(target?.children.length).toBe(1);
            let parent = toplevel["htmlElement"] as HTMLElement;
            expect(parent).toBeInstanceOf(HTMLElement);
            expect(target?.children[0]).toBe(parent);
        });
        test("DOM Child Attachment", () => {
            expect(true).toBeTruthy();
        });
        test("DOM Grandchild Attachment", () => {
            expect(true).toBeTruthy();
        });
    });
});
