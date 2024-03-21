import { EzComponent } from "./EzComponent";
import { EventSubject } from "./eventsubject";
declare const window: Window;
export let popupDialog: EzDialog | undefined = undefined;

const alertDialogTempalte = `
<div style="width: 600px; margin: -10px">
    <div
        id="title"
        style="
            background: silver;
            padding: 10px;
            font-size: 20pt;
            font-weight: bold;
            overflow: hidden;
        "
    >
        My Dialog
    </div>
    <div
        style="
            display: flex;
            min-height: 100px;
            margin: 10px;
            font-size: 20px;
            text-align: center;
            align-items: center;
            justify-items: center;
            line-height: 20px;
        "
    >
        <div
            id="content"
            style="display: block; width: 100%; text-align: center"
        >
            Question goes here
        </div>
    </div>
    <div id="buttonDiv" style="margin: 10px; text-align: right; justify-content: center">
    </div>
</div>`;
const backgroundTemplate = `
.dialog-background {
    display: none;
    position: fixed;
    text-align:center;
    z-index: 1050;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    outline: 0;
    background-color: rgb(0, 0, 0, 0.5);

}`;
const popupTemplate = `
.dialog-popup {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-125%, -50%);
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    margin:auto;
    box-shadow: 4px 8px 8px 4px rgba(0, 0, 0, 0.2);
	display:inline-block;
	overflow:hidden;
}`;
export class EzDialog extends EzComponent {
    private popup: HTMLDivElement;
    private background: HTMLDivElement;
    private closeEvent: EventSubject<string> = new EventSubject<string>();
    /**
     * @description Creates an instance of EzComponent.
     * @param {string} [html=""] The html as a string to be used as the body of this component
     * @param {string} [css=""] The css as a string to be used as the style of this component
     * @memberof EzComponent
     * @public
     * @constructor
     * @example const component = new EzComponent("<h1>Hello World</h1>", "h1{color:red;}");
     */
    constructor(html: string = "", css: string = "") {
        super(html, css);
        const styleEl = window.document.createElement("style");
        styleEl.innerHTML = backgroundTemplate + popupTemplate;
        this.shadow.appendChild(styleEl);
        //now add 2 more divs
        this.background = window.document.createElement("div");
        this.background.className = "dialog-background";
        this.background.id = "background-root";
        this.background.style.display = "none";
        this.popup = window.document.createElement("div");
        this.popup.className = "dialog-popup";
        this.background.appendChild(this.popup);
        this.shadow.appendChild(this.background);

        const outside = this.shadow.getElementById("rootTemplate");
        if (outside) this.popup.appendChild(outside);
    }
    show(show: boolean = true) {
        if (show) {
            this.background.style.display = "inline-block";
        } else {
            this.background.style.display = "none";
        }
    }
    static popup(
        attachTo: EzComponent,
        message: string,
        title: string = "Alert",
        buttons: string[] = ["Ok"],
        btnClass: string = "",
    ): EventSubject<string> {
        const dialog = new EzDialog(alertDialogTempalte);
        popupDialog = dialog;

        let titleEl = dialog.shadow.getElementById("title");
        if (titleEl) titleEl.innerHTML = title;
        let contentEl = dialog.shadow.getElementById("content");
        if (contentEl) contentEl.innerHTML = message;
        //add buttons
        const buttonDiv = dialog.shadow.getElementById("buttonDiv");
        if (buttonDiv) {
            for (let btn of buttons) {
                let button = window.document.createElement("button");
                button.innerHTML = btn;
                button.value = btn;
                button.id = "btn_" + btn;
                button.className = btnClass;
                button.style.marginLeft = "10px";

                button.addEventListener("click", () => {
                    dialog.show(false);
                    dialog.closeEvent.next(button.value);
                });
                buttonDiv.appendChild(button);
            }
        }

        attachTo.addComponent(dialog);
        dialog.show();
        dialog.closeEvent.subscribe(() => {
            attachTo["removeComponent"](dialog);
        });
        return dialog.closeEvent;
    }
}
