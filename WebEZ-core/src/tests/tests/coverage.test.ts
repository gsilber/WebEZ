import { describe, expect, test } from "@jest/globals";
import { bootstrap } from "../../bootstrap";
import { TestComponent } from "../testing_components/test.component";
import { NoRootParentCompnent } from "../testing_components/exceptions/bad.components";
declare const window: Window;
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
});
