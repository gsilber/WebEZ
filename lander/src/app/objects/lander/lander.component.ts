import html from "./lander.component.html";
import css from "./lander.component.css";
import { ObjectBaseComponent } from "../object-base.component";
import {
    AppendPipe,
    BindStyle,
    EventSubject,
    Pipe,
    Timer,
    WindowEvent,
} from "@gsilber/webez";
import { Globals } from "../../globals";
import { GameStatus, Position } from "../utils";
import { TerrainItem } from "../terrain/terrain.component";
import { HudComponent } from "../../hud/hud.component";

export class LanderComponent extends ObjectBaseComponent {
    @Pipe((value: string) => `url(${value}?v=${new Date().valueOf()})`)
    @BindStyle("lander", "backgroundImage")
    private _landerImg: string = "assets/lander.png";

    private landerWidth = 65;
    private landerHeight = 60;
    private fuel = 0;
    private startTime: Date = new Date();

    @BindStyle("lander", "left")
    @AppendPipe("px")
    private _xPos: string = "0";

    @BindStyle("lander", "top")
    @AppendPipe("px")
    private _yPos: string = "0";
    private get position(): Position {
        return { x: parseInt(this._xPos), y: parseInt(this._yPos) };
    }
    private set position(value: Position) {
        this._xPos = value.x.toString();
        this._yPos = value.y.toString();
    }
    private get worldPosition(): Position {
        //Note: 50 is the title height
        //12 is the height of the flame
        return {
            x: this.position.x,
            y:
                this.getWindowSize().windowHeight -
                50 -
                this.position.y -
                this.landerHeight +
                12,
        };
    }

    @BindStyle("lander", "transform")
    private _transform: string = "rotate(0 deg)";
    private _angle: number = 0;
    set rotation(value: number) {
        if (value < 0) value = 360 + value;
        if (value > 360) value = value % 360;
        this._angle = value;
        this._transform = `rotate(${value}deg)`;
    }
    get rotation(): number {
        return this._angle;
    }

    @BindStyle("flame", "display")
    private _flameDisplay: string = "none";
    private set flameDisplay(value: boolean) {
        this._flameDisplay = value ? "block" : "none";
    }
    private get flameDisplay(): boolean {
        return this._flameDisplay === "block";
    }

    private velocity: Position = { x: 0, y: 0 };

    constructor(
        private _terrain: TerrainItem[],
        private hud: HudComponent,
    ) {
        super(html, css);
        this.position = { x: 50, y: 50 };
    }
    @BindStyle("lander", "display")
    private _showLander: string = "none";
    public get showLander(): boolean {
        return this._showLander === "block";
    }
    public set showLander(value: boolean) {
        this._showLander = value ? "block" : "none";
    }

    get altitudeTerrain(): number {
        return this.getAltitudeAt(this.position.x + this.landerWidth / 2);
    }

    private flying: boolean = false;

    gameOver: EventSubject<GameStatus> = new EventSubject<GameStatus>();

    @WindowEvent("keyup")
    stopFlame(event: KeyboardEvent) {
        if (event.key === " ") {
            this.flameDisplay = false;
        }
    }
    @WindowEvent("keydown")
    moveAndFlame(event: KeyboardEvent) {
        if (this.flying) {
            switch (event.key) {
                case "a":
                case "A":
                    this.rotation -= Globals.LANDER_ROTATION_SPEED;
                    break;
                case "d":
                case "D":
                    this.rotation += Globals.LANDER_ROTATION_SPEED;
                    break;
                case " ":
                    this.flameDisplay = this.fuel > 0;
                    break;
            }
        }
    }

    velocityTest(): boolean {
        return (
            Math.abs(this.velocity.x) < Globals.TERRAIN_GOOD_VELOCITYX &&
            Math.abs(this.velocity.y) < Globals.TERRAIN_GOOD_VELOCITYY
        );
    }

    @Timer(100)
    private UpdatePosition() {
        if (this.flying) {
            //shouldn't happen after collision detection
            if (this.position.y > this.getWindowSize().windowHeight) {
                this.stopFlying(GameStatus.Crash);
                return;
            }
            //thrust
            //this is title height+lander height+20
            if (this.position.y < -50) {
                this.stopFlying(GameStatus.Orbit);
                return;
            }
            if (
                this.position.x > this.getWindowSize().windowWidth - 65 ||
                this.position.x < 0
            ) {
                this.stopFlying(GameStatus.Miss);
                return;
            }
            if (this.flameDisplay && this.fuel > 0) {
                this.velocity.x +=
                    Math.sin((this.rotation * Math.PI) / 180) *
                    Globals.THRUST_MULTIPLIER;
                this.velocity.y -=
                    Math.cos((this.rotation * Math.PI) / 180) *
                    Globals.THRUST_MULTIPLIER;
                this.fuel -= Globals.LANDER_FUEL_CONSUMPTION;
            }
            this.hud.Fuel = this.fuel;
            //gravity
            this.velocity.y += Globals.GRAVITY;
            this.hud.Velocity = this.velocity;
            this.position = {
                x: this.position.x + this.velocity.x,
                y: this.position.y + this.velocity.y,
            };
            this.hud.AltitudeMSL = this.worldPosition.y;
            this.hud.AltitudeTerrain = this.altitudeTerrain;
            this.hud.Rotation = this.rotation;
            this.hud.Time = Math.floor(
                (new Date().getTime() - this.startTime.getTime()) / 1000,
            );

            //collision detection
            if (this.altitudeTerrain <= 0) {
                this.hud.AltitudeTerrain = 0;
                const midX = this.position.x + this.landerWidth / 2;
                this.position = {
                    x: this.position.x,
                    y:
                        this.getWindowSize().windowHeight -
                        this.getTerrainHeightAt(midX) -
                        50 -
                        this.landerHeight +
                        12,
                };
                let y1 = this.getAltitudeAt(this.position.x);
                let y2 = this.getAltitudeAt(this.position.x + this.landerWidth);
                if (this.rotation != 0) {
                    this.hud.flagRotation = true;
                    this._landerImg = "assets/explode.gif";
                    this.stopFlying(GameStatus.Crash);
                    return;
                } else if (this.velocity.x > Globals.TERRAIN_GOOD_VELOCITYX) {
                    this.hud.flagHVelocity = true;
                    this._landerImg = "assets/explode.gif";
                    this.stopFlying(GameStatus.Crash);
                } else if (this.velocity.y > Globals.TERRAIN_GOOD_VELOCITYY) {
                    this.hud.flagVVelocity = true;
                    this._landerImg = "assets/explode.gif";
                    this.stopFlying(GameStatus.Crash);
                } else if (
                    Math.abs(y1 - y2) > Globals.TERRAIN_GOOD_DIFFERENCE
                ) {
                    this.hud.flagAltitude = true;
                    //show explosion
                    this._landerImg = "assets/explode.gif";
                    this.stopFlying(GameStatus.Crash);
                } else {
                    this.stopFlying(GameStatus.Land);
                }
            }
        }
    }
    resetHud() {
        this.hud.Rotation = this.rotation;
        this.hud.Velocity = this.velocity;
        this.hud.status = GameStatus.Ok;
        this.hud.AltitudeMSL = this.position.y;
        this.hud.AltitudeTerrain = this.position.y;
        this.hud.Fuel = this.fuel;
        this.hud.Time = 0;
        this.hud.resetFlags();
    }
    startFlying() {
        this._landerImg = "assets/lander.png";
        this.startTime = new Date();
        this.rotation = 0;
        this.velocity = { x: 0, y: 0 };
        const randomX = Math.floor(
            Math.random() * (this.getWindowSize().windowWidth - 100 + 1) + 50,
        );
        this.position = { x: randomX, y: 50 };
        this.fuel = Globals.LANDER_FUEL_CAPACITY;
        this.resetHud();
        this.flying = true;
        this.showLander = true;
    }
    private stopFlying(stopType: GameStatus) {
        this.flying = false;
        this.hud.status = stopType;
        this.gameOver.next(stopType);
    }

    getAltitudeAt(x: number): number {
        const terrain =
            this._terrain[Math.floor(x / Globals.TERRAIN_PART_WIDTH)];
        return this.worldPosition.y - terrain.height + terrain.getYatX(x);
    }
    getTerrainHeightAt(x: number): number {
        return this._terrain[
            Math.floor(x / Globals.TERRAIN_PART_WIDTH)
        ].getHeightatX(x);
    }
}
