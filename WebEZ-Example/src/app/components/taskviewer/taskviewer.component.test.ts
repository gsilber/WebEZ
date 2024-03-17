import { describe, expect, test, beforeAll } from "@jest/globals";
import { TaskviewerComponent } from "./taskviewer.component";
import { bootstrap } from "@gsilber/webez";

describe("TaskviewerComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        component = bootstrap<TaskviewerComponent>(TaskviewerComponent, true);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TaskviewerComponent);
        });
    });
});
