import { describe, expect, test } from "@jest/globals";
import { bootstrap } from "../../bootstrap";
import { TestComponent } from "../testing_components/test.component";
import { NoRootParentCompnent } from "../testing_components/exceptions/bad.components";
import { EzComponent, HttpMethod } from "../../EzComponent";

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
describe("Ajax Testing", () => {
    describe("Test bad target", () => {
        let toplevel: EzComponent = bootstrap<TestComponent>(TestComponent);
        toplevel["ajax"]("http://badhost.com", HttpMethod.GET, [
            { "content-type": "application/json" },
        ]).subscribe(
            () => {},
            (e: Error) => {
                expect(e).toBeInstanceOf(Error);
            },
        );
    });
    describe("Test bad target no headers", () => {
        let toplevel: EzComponent = bootstrap<TestComponent>(TestComponent);
        toplevel["ajax"]("http://badhost.com", HttpMethod.GET).subscribe(
            () => {},
            (e: Error) => {
                expect(e).toBeInstanceOf(Error);
            },
        );
    });
});
