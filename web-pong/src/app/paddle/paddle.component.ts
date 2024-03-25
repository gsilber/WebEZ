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

/**
 * @description The paddle component
 * @export
 * @class PaddleComponent
 * @extends {EzComponent}
 * @method movePaddleUp : Move the paddle up
 * @method movePaddleDown : Move the paddle down
 * @method getPaddleRect : Get the paddle rectangle
 * @method onKeyPress : Event handler for key press
 */
export class PaddleComponent extends EzComponent {
    /**
     * @description The width of the paddle
     * @private
     * @type {string}
     * @memberof PaddleComponent
     * @summary Binds to paddle style.width
     */
    @BindStyle("paddle", "width")
    @AppendPipe("px")
    private _paddle_width: string = Globals.PADDLE_WIDTH.toString();
    get paddle_width(): number {
        return parseInt(this._paddle_width);
    }
    set paddle_width(value: number) {
        this._paddle_width = value.toString();
    }

    /**
     * @description The height of the paddle
     * @private
     * @type {string}
     * @memberof PaddleComponent
     * @summary Binds to paddle style.height
     */
    @BindStyle("paddle", "height")
    @AppendPipe("px")
    private _paddle_height: string = Globals.PADDLE_HEIGHT.toString();
    private get paddle_height(): number {
        return parseInt(this._paddle_height);
    }
    private set paddle_height(value: number) {
        this._paddle_height = value.toString();
    }

    /**
     * @description The x coordinate of the paddle
     * @private
     * @type {string}
     * @memberof PaddleComponent
     * @summary Binds to paddle style.left
     * @summary Appends px to the value
     */
    @BindStyle("paddle", "left")
    @AppendPipe("px")
    private _paddle_x: string = Globals.PADDLE_INDENT.toString();
    get paddle_x(): number {
        return parseInt(this._paddle_x);
    }
    set paddle_x(value: number) {
        this._paddle_x = value.toString();
    }

    /**
     * @description The y coordinate of the paddle
     * @private
     * @type {string}
     * @memberof PaddleComponent
     * @summary Binds to paddle style.top
     * @summary Appends px to the value
     */
    @BindStyle("paddle", "top")
    @AppendPipe("px")
    private _paddle_y: string = "0";
    private get paddle_y(): number {
        return parseInt(this._paddle_y);
    }
    private set paddle_y(value: number) {
        this._paddle_y = value.toString();
    }

    /**
     * @description The color of the paddle
     * @private
     * @type {string}
     * @memberof PaddleComponent
     * @summary Binds to paddle style.backgroundColor
     */
    @BindStyle("paddle", "backgroundColor")
    private _paddle_color: string = Globals.PADDLE_COLOR;

    /**
     * @description The speed of the paddle
     * @private
     * @type {number}
     * @memberof PaddleComponent
     */
    private paddle_speed: number = Globals.PADDLE_SPEED;

    /**
     * @description The maximum y coordinate of the paddle
     * @private
     * @type {number}
     * @memberof PaddleComponent
     */
    private get maxY(): number {
        return Globals.BOARD_HEIGHT - this.paddle_height;
    }

    /**
     * @description The constructor for the paddle component
     * @memberof PaddleComponent
     * @summary Initializes the paddle component
     */
    constructor() {
        super(html, css);
        this.paddle_y = (Globals.BOARD_HEIGHT - this.paddle_height) / 2;
    }

    /**
     * @description Move the paddle up
     * @memberof PaddleComponent
     */
    movePaddleUp() {
        this.paddle_y = Math.max(0, this.paddle_y - this.paddle_speed);
    }

    /**
     * @description Move the paddle down
     * @memberof PaddleComponent
     */
    movePaddleDown() {
        this.paddle_y = Math.min(this.maxY, this.paddle_y + this.paddle_speed);
    }

    /**
     * @description Get the paddle rectangle
     * @returns {Rectangle}
     * @memberof PaddleComponent
     */
    getPaddleRect(): Rectangle {
        return {
            x: this.paddle_x,
            y: this.paddle_y,
            width: this.paddle_width,
            height: this.paddle_height,
        };
    }

    /**
     * @description Event handler for key press
     * @param {KeyboardEvent} event
     * @memberof PaddleComponent
     * @summary Binds to the window keydown event
     * @summary Moves the paddle up or down based on the key pressed
     * @summary Moves the paddle up when the "a" key is pressed
     * @summary Moves the paddle down when the "z" key is pressed
     */
    @WindowEvent("keydown")
    onKeyPress(event: KeyboardEvent) {
        if (event.key === "a") {
            this.movePaddleUp();
        } else if (event.key === "z") {
            this.movePaddleDown();
        }
    }
}
