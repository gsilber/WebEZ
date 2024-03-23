import html from "./main.component.html";
import css from "./main.component.css";
import {
    AppendPipe,
    BindInnerHTML,
    BindStyle,
    Click,
    EzComponent,
    EzDialog,
    Timer,
} from "@gsilber/webez";
import { PaddleComponent } from "./paddle/paddle.component";
import { Globals } from "./globals";
import { BallComponent } from "./ball/ball.component";

export class MainComponent extends EzComponent {
    @BindStyle("game-board", "width")
    @AppendPipe("px")
    private boardWidth: string = Globals.BOARD_WIDTH.toString();

    @BindStyle("game-board", "height")
    @AppendPipe("px")
    private boardHeight: string = Globals.BOARD_HEIGHT.toString();

    private paddle: PaddleComponent = new PaddleComponent();
    private ball: BallComponent;

    private startTime: Date = new Date();
    private playing: boolean = false;

    @BindInnerHTML("timer")
    private time: string = "00:00";

    constructor() {
        super(html, css);
        this.ball = new BallComponent(this.paddle);
        this.addComponent(this.paddle, "game-board");
        this.addComponent(this.ball, "game-board");
        this.ball.gameOver.subscribe(() => {
            this.stop();
            EzDialog.popup(
                this,
                "Would you like to play again?",
                "Game Over",
                ["Yes", "No"],
                "btn btn-primary",
            ).subscribe((result) => {
                if (result === "Yes") {
                    this.start();
                }
            });
        });
    }
    start() {
        this.time = "00:00";
        this.startTime = new Date();
        this.playing = true;
        this.ball.restart();
    }
    stop() {
        this.playing = false;
    }

    @Click("go")
    startGame() {
        this.start();
    }
    @Timer(1000)
    updateTimer() {
        if (this.playing) {
            const elapsed =
                (new Date().valueOf() - this.startTime.valueOf()) / 1000;
            let minutes: number = Math.floor(elapsed / 60);
            let seconds: number = Math.floor(elapsed % 60);
            this.time =
                minutes.toString().padStart(2, "0") +
                ":" +
                seconds.toString().padStart(2, "0");
        }
    }
}
