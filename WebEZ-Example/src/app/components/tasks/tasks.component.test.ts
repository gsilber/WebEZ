import { describe, expect, test, beforeAll } from "@jest/globals";
import { TasksComponent } from "./tasks.component";
import { bootstrap } from "@gsilber/webez";

describe("TasksComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<TasksComponent>(TasksComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TasksComponent);
        });
    });
});
