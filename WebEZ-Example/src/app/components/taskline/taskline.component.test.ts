import { describe, expect, test, beforeAll } from "@jest/globals";
import { TasklineComponent } from "./taskline.component";
import { bootstrap } from "@gsilber/webez";

describe("TasklineComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        component = bootstrap<TasklineComponent>(TasklineComponent, true);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TasklineComponent);
        });
    });
});
