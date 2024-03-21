import {
    BindCSSClass,
    CancelFunction,
    Click,
    EventSubject,
    EzComponent,
    EzDialog,
    Timer,
} from "@gsilber/webez";
import html from "./tasks.component.html";
import css from "./tasks.component.css";
import { TasklineComponent } from "../taskline/taskline.component";
import { TaskData } from "../taskeditor/taskeditor.component";
import guid from "guid";

/**
 * @description Top level component of the task list.
 * @class TasksComponent
 * @extends {EzComponent}
 * @property {EventSubject<TaskData[]>} saveData - event subject for the save event.  emits the task data when the save event is triggered.
 * @memberof TasksComponent
 */
export class TasksComponent extends EzComponent {
    @BindCSSClass("add-task") addDisabled: string = "";

    private taskLines: TasklineComponent[] = [];
    private counter: number = 0;
    saveData: EventSubject<TaskData[]> = new EventSubject<TaskData[]>();

    private get taskData(): TaskData[] {
        return this.taskLines.map((task) => task.data);
    }

    private set taskData(data: TaskData[]) {
        this.taskLines.forEach((line) => {
            this.removeComponent(line);
        });
        this.taskLines = [];
        data.forEach((task) => {
            let line = new TasklineComponent(task);
            this.addComponent(line, "task-list");
            this.taskLines.push(line);
            this.wireUpTaskLine(line);
            line.disableEditing();
        });
        this.taskLines.forEach((task) => {
            task.disableViewButtons(false);
        });
        this.addDisabled = "";
    }
    constructor(data: TaskData[] = []) {
        super(html, css);
        this.taskData = data;
    }

    @Click("add-task") private onAddTask() {
        let taskLine = new TasklineComponent();
        this.addComponent(taskLine, "task-list", true);
        this.taskLines.unshift(taskLine);
        this.wireUpTaskLine(taskLine);
        taskLine.startEditing();
    }
    @Click("clear-tasks") private onClearTasks() {
        if (this.taskLines.length === 0) {
            EzDialog.popup(
                this,
                "There are no tasks to clear.",
                "Notice",
                ["Ok"],
                "btn btn-primary",
            );
        } else {
            EzDialog.popup(
                this,
                "Are you sure you want to clear all tasks?",
                "Warning",
                ["Yes", "No", "Cancel"],
                "btn btn-primary",
            ).subscribe((result) => {
                if (result === "Yes") {
                    this.taskLines.forEach((task) => {
                        this.removeComponent(task);
                    });
                    this.taskLines = [];
                    this.saveData.next(this.taskData);
                }
            });
        }
    }

    private wireUpTaskLine(line: TasklineComponent) {
        //if we start editing, then we want to disable the add button and all child edit/cancel buttons
        line.lineEdit.subscribe(() => {
            this.addDisabled = "disabled";
            this.taskLines.forEach((task) => {
                task.disableViewButtons();
            });
        });

        //if we are deleting, then we want to remove the line from the list and remove the component
        line.lineDelete.subscribe(() => {
            this.removeComponent(line);
            this.taskLines.splice(this.taskLines.indexOf(line), 1);
            this.saveData.next(this.taskData);
        });

        //if we are closing editor, then we want to enable the add button and all child edit/cancel buttons
        line.lineEditClose.subscribe((save) => {
            this.addDisabled = "";
            this.taskLines.forEach((task) => {
                task.disableViewButtons(false);
            });
            if (save) {
                if (line.data.uniqueID === undefined) {
                    line.data.uniqueID = guid.create();
                }
                //save the data to a datasource
                this.saveData.next(this.taskData);
            } else if (line.data.uniqueID === undefined) {
                this.removeComponent(line);
                this.taskLines.splice(this.taskLines.indexOf(line), 1);
            }
        });
    }
    @Timer(1000)
    private counterfn(cancel: CancelFunction) {
        this.counter++;
        console.log(this.counter);
        if (this.counter >= 15) {
            cancel();
        }
    }
}
