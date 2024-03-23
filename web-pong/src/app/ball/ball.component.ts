import {
    BindStyle,
    AppendPipe,
    EzComponent,
    Timer,
    EventSubject,
} from "@gsilber/webez";
import html from "./ball.component.html";
import css from "./ball.component.css";
import { Globals } from "../globals";
import { Rectangle } from "../utils/rectangle";
import { PaddleComponent } from "../paddle/paddle.component";
import { run } from "node:test";

export class BallComponent extends EzComponent {
    @BindStyle("ball", "width")
    @AppendPipe("px")
    private _ball_width: string = Globals.BALL_DIMENSION.toString();
    private get ball_width(): number {
        return parseInt(this._ball_width);
    }
    private set ball_width(value: number) {
        this._ball_width = value.toString();
    }
    @BindStyle("ball", "height")
    @AppendPipe("px")
    private _ball_height: string = Globals.BALL_DIMENSION.toString();
    private get ball_height(): number {
        return parseInt(this._ball_height);
    }
    private set ball_height(value: number) {
        this._ball_height = value.toString();
    }

    @BindStyle("ball", "left")
    @AppendPipe("px")
    private _ball_x: string = (
        (Globals.BOARD_WIDTH - this.ball_width) /
        2
    ).toString();
    private get ball_x(): number {
        return parseInt(this._ball_x);
    }
    private set ball_x(value: number) {
        this._ball_x = value.toString();
    }

    @BindStyle("ball", "top")
    @AppendPipe("px")
    private _ball_y: string = (
        (Globals.BOARD_HEIGHT - this.ball_height) /
        2
    ).toString();
    private get ball_y(): number {
        return parseInt(this._ball_y);
    }
    private set ball_y(value: number) {
        this._ball_y = value.toString();
    }

    private running: boolean = false;

    private killTimer: () => void = () => {};
    @BindStyle("ball", "backgroundColor")
    private ball_color: string = Globals.BALL_COLOR;

    private ball_speed: number = Globals.BALL_SPEED;
    private ball_direction: number[] = [-1, -1];
    private maxX: number = Globals.BOARD_WIDTH - this.ball_width;
    private maxY: number = Globals.BOARD_HEIGHT - this.ball_height;

    public gameOver: EventSubject<void> = new EventSubject<void>();

    constructor(private paddle: PaddleComponent = new PaddleComponent()) {
        super(html, css);
    }

    public restart(): void {
        this.ball_x = (Globals.BOARD_WIDTH - this.ball_width) / 2;
        this.ball_y = (Globals.BOARD_HEIGHT - this.ball_height) / 2;
        this.ball_direction = [-1, -1];
        this.ball_speed = Globals.BALL_SPEED;
        this.running = true;
    }
    @Timer(10000)
    private increaseSpeed(): void {
        if (this.running) this.ball_speed += Globals.BALL_SPEED_INCREMENT;
    }
    private hitTest(r1: Rectangle, r2: Rectangle): boolean {
        return (
            r1.x < r2.x + r2.width &&
            r1.x + r1.width > r2.x &&
            r1.y < r2.y + r2.height &&
            r1.y + r1.height > r2.y
        );
    }

    @Timer(50)
    private moveBall(kill: () => void): void {
        this.killTimer = kill;
        if (this.running) {
            let newX = this.ball_x + this.ball_speed * this.ball_direction[0];
            let newY = this.ball_y + this.ball_speed * this.ball_direction[1];
            if (this.hitTest(this.getBallRect(), this.paddle.getPaddleRect())) {
                this.ball_direction[0] = 1;
                newX = this.paddle.getPaddleRect().x + Globals.PADDLE_WIDTH;
                this.ball_x = newX;
                this.ball_y = newY;

                return;
            }
            if (newX < 0) {
                this.ball_direction[0] = 1;
                this.ball_x = -50;
                this.gameOver.next();
                this.running = false;
            }
            if (newX > this.maxX) {
                this.ball_direction[0] = -1;
                newX = this.maxX;
            }
            if (newY < 0) {
                this.ball_direction[1] = 1;
                newY = 0;
            }
            if (newY > this.maxY) {
                this.ball_direction[1] = -1;
                newY = this.maxY;
            }
            this.ball_x = newX;
            this.ball_y = newY;
        }
    }
    public getBallRect(): Rectangle {
        return {
            x: this.ball_x,
            y: this.ball_y,
            width: this.ball_width,
            height: this.ball_height,
        };
    }
}
