import { describe, expect, test, beforeAll } from "@jest/globals";
import { TasksComponent } from "./tasks.component";
import { bootstrap, popupDialog } from "@gsilber/webez";
import { TasklineComponent } from "../taskline/taskline.component";

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
        test("Create Instance with Data", () => {
            const data = [{ taskText: "test" }];
            let component2 = new TasksComponent(data);
            expect(component2).toBeInstanceOf(TasksComponent);
        });
    });
    describe("Binding Tests", () => {
        test("CSS Class", () => {
            expect(component).toBeInstanceOf(TasksComponent);
            component.addDisabled = "test";
            expect(component.addDisabled).toBe("test");
            const el = component["shadow"].getElementById(
                "add-task",
            ) as HTMLElement;
            expect(el).toBeInstanceOf(HTMLElement);
            expect(el.className).toContain("test");
            component.addDisabled = "test2";
            expect(el.className).toContain("test2");
        });
    });
    describe("Task Data", () => {
        test("Task Data Accessors", () => {
            expect(component).toBeInstanceOf(TasksComponent);
            expect(component.taskData).toEqual([]);
            const data = [{ taskText: "test" }];
            component.taskData = data;
            expect(component.taskData).toEqual(data);
            const data2 = [{ taskText: "test2" }];
            component.taskData = data2;
            expect(component.taskData).toEqual(data2);
        });
    });
    describe("Click Events", () => {
        test("Add Task", () => {
            expect(component).toBeInstanceOf(TasksComponent);
            component.taskLines.forEach((task: TasklineComponent) => {
                component.removeComponent(task);
            });
            component.taskLines = [];
            const el = component["shadow"].getElementById(
                "add-task",
            ) as HTMLElement;
            expect(el).toBeInstanceOf(HTMLElement);
            el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
            expect(component.taskLines.length).toBe(1);
            component["onAddTask"]();
            expect(component.taskLines.length).toBe(2);
        });
        test("Clear Tasks", () => {
            expect(component).toBeInstanceOf(TasksComponent);
            component.taskData = [{ taskText: "test" }];
            expect(component.taskLines.length).toBe(1);
            component.onClearTasks();
            //need to deal with dialog.
            if (!popupDialog) {
                expect(true).toBe(false);
            } else {
                expect(true).toBe(true);

                const btn = popupDialog["shadow"].querySelector(
                    "button",
                ) as HTMLElement;
                btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                expect(component.taskLines.length).toBe(0);
            }
            component.onClearTasks();
            //need to deal with dialog.
            if (!popupDialog) {
                expect(true).toBe(false);
            } else {
                expect(true).toBe(true);

                const btn = popupDialog["shadow"].querySelector(
                    "button",
                ) as HTMLElement;
                btn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
                expect(component.taskLines.length).toBe(0);
            }
        });
    });
    describe("EventSubject tests", () => {
        test("lineDelete", async () => {
            expect(component).toBeInstanceOf(TasksComponent);
            component.taskData = [{ taskText: "test" }];
            expect(component.taskLines.length).toBe(1);
            const line = component.taskLines[0] as TasklineComponent;
            line.lineDelete.next(line.data);
            expect(component.taskLines.length).toBe(0);
        });
        test("lineEditClose", async () => {
            expect(component).toBeInstanceOf(TasksComponent);
            component.taskData = [{ taskText: "test" }];
            expect(component.taskLines.length).toBe(1);
            const line = component.taskLines[0] as TasklineComponent;
            line.lineEditClose.next(true);
            line.lineEditClose.next(false);
            component.taskLines[0].data.uniqueID = undefined;
            line.lineEditClose.next(false);
        });
    });
});
