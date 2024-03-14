import { describe, expect, test, beforeAll } from "@jest/globals";
import { bootstrap } from "../../bootstrap";
import { TestComponent } from "../testing_compnents/test.component";

declare const window: Window;
describe("WebEZ-Bind", () => {
    let toplevel: any = undefined;
    beforeAll(() => {
        toplevel = bootstrap<TestComponent>(TestComponent, true);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(toplevel).toBeInstanceOf(TestComponent);
        });
    });
});
