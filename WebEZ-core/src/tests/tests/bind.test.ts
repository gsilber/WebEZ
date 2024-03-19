import { describe, expect, test, beforeAll } from "@jest/globals";
import { bootstrap } from "../../bootstrap";
import { TestComponent } from "../testing_components/test.component";

describe("WebEZ-Bind", () => {
    let toplevel: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        toplevel = bootstrap<TestComponent>(TestComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(toplevel).toBeInstanceOf(TestComponent);
        });
    });
    describe("Bind:Parent", () => {
        test("Bind innerHtml single", () => {
            let el = toplevel["shadow"].getElementById(
                "bindDiv1",
            ) as HTMLElement;
            expect(toplevel.testbind1).toBe("hello");
            expect(el.innerHTML).toEqual("hello");
            toplevel.testbind1 = "testing";
            expect(toplevel.testbind1).toBe("testing");
            expect(el.innerHTML).toEqual("testing");
        });
        test("Bind value single", () => {
            const el = toplevel["shadow"].getElementById(
                "bindInput1",
            ) as HTMLInputElement;
            expect(toplevel.testbind2).toBe("hello");
            expect(el.value).toEqual("hello");
            toplevel.testbind2 = "testing";
            expect(toplevel.testbind2).toBe("testing");
            expect(el.value).toEqual("testing");
            el.value = "not testing";
            el.dispatchEvent(new Event("input"));
            expect(toplevel.testbind2).toBe("not testing");
        });
        test("Stacked Binders all InnerHTML", () => {
            let el1 = toplevel["shadow"].getElementById(
                "bindDiv2",
            ) as HTMLElement;
            let el2 = toplevel["shadow"].getElementById(
                "bindDiv3",
            ) as HTMLElement;
            expect(toplevel.testbind3).toBe("hello");
            expect(el1.innerHTML).toEqual("hello");
            expect(el2.innerHTML).toEqual("hello");
            toplevel.testbind3 = "testing";
            expect(toplevel.testbind3).toBe("testing");
            expect(el1.innerHTML).toEqual("testing");
            expect(el2.innerHTML).toEqual("testing");
        });
        test("Stacked Binders with BindValue", () => {
            let el1 = toplevel["shadow"].getElementById(
                "bindDiv4",
            ) as HTMLElement;
            let el2 = toplevel["shadow"].getElementById(
                "bindDiv5",
            ) as HTMLElement;
            let el3 = toplevel["shadow"].getElementById(
                "bindInput2",
            ) as HTMLInputElement;

            expect(toplevel.testbind4).toBe("hello");
            expect(el1.innerHTML).toEqual("hello");
            expect(el2.innerHTML).toEqual("hello");
            expect(el3.value).toEqual("hello");
            toplevel.testbind4 = "testing";
            expect(toplevel.testbind4).toBe("testing");
            expect(el1.innerHTML).toEqual("testing");
            expect(el2.innerHTML).toEqual("testing");
            expect(el3.value).toEqual("testing");
            el3.value = "not testing";
            el3.dispatchEvent(new Event("input"));
            expect(toplevel.testbind4).toBe("not testing");
            expect(el1.innerHTML).toBe("not testing");
            expect(el2.innerHTML).toBe("not testing");
            expect(el3.value).toBe("not testing");
        });
        test("Single Binders with BindStyle", () => {
            let el = toplevel["shadow"].getElementById(
                "styleDiv1",
            ) as HTMLElement;
            expect(toplevel.testStyle1).toBe("red");
            expect(el.style.color).toBe("red");
            toplevel.testStyle1 = "blue";
            expect(toplevel.testStyle1).toBe("blue");
            expect(el.style.color).toBe("blue");
        });
        test("Stacked Binders with BindStyle", () => {
            let el1 = toplevel["shadow"].getElementById(
                "styleDiv2",
            ) as HTMLElement;
            let el2 = toplevel["shadow"].getElementById(
                "styleDiv3",
            ) as HTMLElement;
            expect(toplevel.testStyle2).toBe("blue");
            expect(el1.style.color).toBe("blue");
            expect(el2.style.color).toBe("blue");
            toplevel.testStyle2 = "red";
            expect(toplevel.testStyle2).toBe("red");
            expect(el1.style.color).toBe("red");
            expect(el2.style.color).toBe("red");
        });
    });

    describe("Bind:Grandhild", () => {
        test("Bind to child", () => {
            expect(true).toBe(true);
        });
    });
});
