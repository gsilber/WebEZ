import { describe, expect, test, beforeAll } from "@jest/globals";
import { $$$$$$$$Component } from "./########.component";
import { bootstrap } from "webez";

describe("$$$$$$$$Component", () => {
    beforeAll(() => {
        bootstrap<$$$$$$$$Component>($$$$$$$$Component, true);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            const component = new $$$$$$$$Component();
            expect(component).toBeInstanceOf($$$$$$$$Component);
        });
    });
});
