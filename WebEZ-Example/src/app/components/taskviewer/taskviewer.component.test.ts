import { describe, expect, test, beforeAll } from "@jest/globals";
import { TaskviewerComponent } from "./taskviewer.component";
import { bootstrap } from "@gsilber/webez";

describe("TaskviewerComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<TaskviewerComponent>(TaskviewerComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TaskviewerComponent);
        });
    });
});
