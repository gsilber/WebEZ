import {
    AppendPipe,
    BindStyle,
    EzComponent,
    WindowEvent,
} from "@gsilber/webez";
import html from "./paddle.component.html";
import css from "./paddle.component.css";
import { Globals } from "../globals";
import { Rectangle } from "../utils/rectangle";

export class PaddleComponent extends EzComponent {
    @BindStyle("paddle", "width")
    @AppendPipe("px")
    private _paddle_width: string = Globals.PADDLE_WIDTH.toString();
    get paddle_width(): number {
        return parseInt(this._paddle_width);
    }
    set paddle_width(value: number) {
        this._paddle_width = value.toString();
    }

    @BindStyle("paddle", "height")
    @AppendPipe("px")
    private _paddle_height: string = Globals.PADDLE_HEIGHT.toString();
    private get paddle_height(): number {
        return parseInt(this._paddle_height);
    }
    private set paddle_height(value: number) {
        this._paddle_height = value.toString();
    }

    @BindStyle("paddle", "left")
    @AppendPipe("px")
    private _paddle_x: string = Globals.PADDLE_INDENT.toString();
    get paddle_x(): number {
        return parseInt(this._paddle_x);
    }
    set paddle_x(value: number) {
        this._paddle_x = value.toString();
    }

    @BindStyle("paddle", "top")
    @AppendPipe("px")
    private _paddle_y: string = "0";
    private get paddle_y(): number {
        return parseInt(this._paddle_y);
    }
    private set paddle_y(value: number) {
        this._paddle_y = value.toString();
    }

    @BindStyle("paddle", "backgroundColor")
    private _paddle_color: string = Globals.PADDLE_COLOR;

    private paddle_speed: number = Globals.PADDLE_SPEED;

    private get maxY(): number {
        return Globals.BOARD_HEIGHT - this.paddle_height;
    }
    constructor() {
        super(html, css);
        this.paddle_y = (Globals.BOARD_HEIGHT - this.paddle_height) / 2;
    }

    movePaddleUp() {
        this.paddle_y = Math.max(0, this.paddle_y - this.paddle_speed);
    }
    movePaddleDown() {
        this.paddle_y = Math.min(this.maxY, this.paddle_y + this.paddle_speed);
    }
    getPaddleRect(): Rectangle {
        return {
            x: this.paddle_x,
            y: this.paddle_y,
            width: this.paddle_width,
            height: this.paddle_height,
        };
    }
    @WindowEvent("keydown")
    onKeyPress(event: KeyboardEvent) {
        if (event.key === "a") {
            this.movePaddleUp();
        } else if (event.key === "z") {
            this.movePaddleDown();
        }
    }
}
