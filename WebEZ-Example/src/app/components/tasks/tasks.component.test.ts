import { describe, expect, test, beforeAll } from "@jest/globals";
import { TasksComponent } from "./tasks.component";
import { bootstrap } from "@gsilber/webez";

describe("TasksComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        component = bootstrap<TasksComponent>(TasksComponent, true);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TasksComponent);
        });
    });
});
