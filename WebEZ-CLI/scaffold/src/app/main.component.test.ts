import { describe, expect, test, beforeAll } from "@jest/globals";
import { MainComponent } from "./main.component";
import { bootstrap } from "@gsilber/webez";

describe("MainComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        component = bootstrap<MainComponent>(MainComponent, true);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(MainComponent);
        });
    });
});

