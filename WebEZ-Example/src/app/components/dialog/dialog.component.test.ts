import { describe, expect, test, beforeAll } from "@jest/globals";
import { DialogComponent } from "./dialog.component";
import { bootstrap } from "@gsilber/webez";

describe("DialogComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<DialogComponent>(DialogComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(DialogComponent);
        });
    });
});
