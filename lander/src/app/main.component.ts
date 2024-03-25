import html from "./main.component.html";
import css from "./main.component.css";
import {
    AppendPipe,
    BindCSSClass,
    BindStyle,
    Click,
    EzComponent,
    EzDialog,
} from "@gsilber/webez";
import { LanderComponent } from "./objects/lander/lander.component";
import { TerrainComponent } from "./objects/terrain/terrain.component";
import { GameStatus } from "./objects/utils";
import { HudComponent } from "./hud/hud.component";

export class MainComponent extends EzComponent {
    lander: LanderComponent;
    terrain: TerrainComponent;
    hud: HudComponent = new HudComponent();
    @BindStyle("terrain", "height")
    @AppendPipe("px")
    private _terrainHeight: string = "150";
    constructor() {
        super(html, css);
        this.terrain = new TerrainComponent(parseInt(this._terrainHeight));
        this.lander = new LanderComponent(this.terrain.terrainItems, this.hud);
        this.addComponent(this.terrain, "terrain");
        this.addComponent(this.lander, "content");
        this.addComponent(this.hud, "hud");
        this.setupGame();
    }

    @BindCSSClass("start")
    private _startClass: string = "";
    @Click("start")
    startGame() {
        if (this._startClass === "disabledContent") return;
        this._startClass = "disabledContent";
        this.lander.startFlying();
    }

    async setupGame() {
        await EzDialog.popup(
            this,

            "Use the <em><b>'A'</b></em> and <em><b>'D'</b></em> keys to rotate the lander.<br/> Use the 'Space Bar' to thrust. <br/>Land on a flat area!<br/><br/>Good Luck!!!",
            "Welcome to Lunar Lander!",
            ["Play Game"],
            "btn btn-success",
        ).toPromise();

        this.lander.gameOver.subscribe((status) => {
            let title: string = "";
            if (status === GameStatus.Crash) {
                title = "You crashed!";
            } else if (status === GameStatus.Orbit) {
                title = "You have achieved escape velocity!";
            } else if (status === GameStatus.Miss) {
                title = "You left the landing zone!";
            } else if (status === GameStatus.Land) {
                title = "You landed!";
            }
            EzDialog.popup(
                this,
                "Try again?",
                title,
                ["Yes", "No"],
                "btn btn-primary",
            ).subscribe((response: string) => {
                if (response === "Yes") {
                    this._startClass = "";
                    this.startGame();
                } else {
                    this._startClass = "";
                }
            });
        });
    }
}
