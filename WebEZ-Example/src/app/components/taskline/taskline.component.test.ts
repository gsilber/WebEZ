import { describe, expect, test, beforeAll } from "@jest/globals";
import { TasklineComponent } from "./taskline.component";
import { bootstrap } from "@gsilber/webez";

describe("TasklineComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        const html: string = `<div>Testing Environment</div><div id='main-target'></div>`;
        component = bootstrap<TasklineComponent>(TasklineComponent, html);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TasklineComponent);
        });
    });
});
