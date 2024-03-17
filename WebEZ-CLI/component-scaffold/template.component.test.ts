import { describe, expect, test, beforeAll } from "@jest/globals";
import { $$$$$$$$Component } from "./########.component";
import { bootstrap } from "@gsilber/webez";

describe("$$$$$$$$Component", () => {
    let component: any = undefined;
    beforeAll(() => {
        component = bootstrap<$$$$$$$$Component>($$$$$$$$Component, true);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf($$$$$$$$Component);
        });
    });
});
