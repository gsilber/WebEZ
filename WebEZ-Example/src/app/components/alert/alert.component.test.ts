import { describe, expect, test, beforeAll } from "@jest/globals";
import { AlertComponent } from "./alert.component";
import { bootstrap } from "@gsilber/webez";

describe("AlertComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        component = bootstrap<AlertComponent>(AlertComponent, true);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(AlertComponent);
        });
    });
});
