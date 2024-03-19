import { describe, expect, test, beforeAll } from "@jest/globals";
import { AlertComponent } from "./alert.component";
import { bootstrap } from "@gsilber/webez";

describe("AlertComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<AlertComponent>(AlertComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(AlertComponent);
        });
    });
});
