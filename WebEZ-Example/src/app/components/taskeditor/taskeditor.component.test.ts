import { describe, expect, test, beforeAll } from "@jest/globals";
import { TaskeditorComponent } from "./taskeditor.component";
import { bootstrap } from "@gsilber/webez";

describe("TaskeditorComponent", () => {
    let component: any = undefined;
    beforeAll(() => {
        component = bootstrap<TaskeditorComponent>(TaskeditorComponent, true);
    });
    describe("Constructor", () => {
        test("Create Instance", () => {
            expect(component).toBeInstanceOf(TaskeditorComponent);
        });
    });
});
