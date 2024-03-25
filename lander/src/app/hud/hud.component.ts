import {
    AppendPipe,
    BindCSSClass,
    BindInnerHTML,
    BindStyle,
    EzComponent,
} from "@gsilber/webez";
import html from "./hud.component.html";
import css from "./hud.component.css";
import { GameStatus } from "../objects/utils";
import { Globals } from "../globals";

export class HudComponent extends EzComponent {
    public set Velocity(value: { x: number; y: number }) {
        this._horizDeltaV = value.x.toFixed(0);
        this._vertDeltaV = value.y.toFixed(0);
    }

    @BindInnerHTML("deltax")
    @AppendPipe(" m/s")
    private _horizDeltaV: string = "0";
    @AppendPipe(" m/s")
    @BindInnerHTML("deltay")
    private _vertDeltaV: string = "0";

    @BindStyle("rotation", "color")
    private _flagRotation: string = "white";
    public set flagRotation(value: boolean) {
        this._flagRotation = value ? "red" : "white";
    }

    @BindStyle("deltax", "color")
    private _flagDeltaV: string = "white";
    public set flagHVelocity(value: boolean) {
        this._flagDeltaV = value ? "red" : "white";
    }
    @BindStyle("deltay", "color")
    private _flagVVelocity: string = "white";
    public set flagVVelocity(value: boolean) {
        this._flagVVelocity = value ? "red" : "white";
    }
    @BindStyle("altitudeterrain", "color")
    private _flagAltitude: string = "white";
    public set flagAltitude(value: boolean) {
        this._flagAltitude = value ? "red" : "white";
    }

    @BindInnerHTML("altitudemsl")
    @AppendPipe(" m")
    private _altMSL: string = "0";
    public set AltitudeMSL(value: number) {
        this._altMSL = value.toFixed(0);
    }

    @BindInnerHTML("altitudeterrain")
    @AppendPipe(" m")
    private _altTerain: string = "0";

    public set AltitudeTerrain(value: number) {
        this._altTerain = value.toFixed(0);
    }

    @BindCSSClass("fuel")
    private _fuelWarning: string = "";

    @BindInnerHTML("fuel")
    @AppendPipe(" lbs")
    private _fuel: string = Globals.LANDER_FUEL_CAPACITY.toString();

    public set Fuel(value: number) {
        if (value < 10) {
            this._fuelWarning = "danger";
        } else if (value < 40) {
            this._fuelWarning = "warning";
        } else this._fuelWarning = "";
        this._fuel = value.toFixed(0);
    }
    @BindInnerHTML("time")
    @AppendPipe(" s")
    private _time: string = "0";
    public set Time(value: number) {
        this._time = value.toFixed(0);
    }
    @BindInnerHTML("rotation")
    private _rotation: string = "0";
    public set Rotation(value: number) {
        let val = value.toFixed(0);
        if (value > 180) val = (value - 360).toFixed(0);
        this._rotation = val;
    }
    @BindInnerHTML("status")
    private _status: string = "Waiting...";
    public set status(value: GameStatus) {
        if (value === GameStatus.Crash) {
            this._status = "Crashed";
        } else if (value === GameStatus.Orbit) {
            this._status = "Orbit";
        } else if (value === GameStatus.Miss) {
            this._status = "Missed";
        } else if (value === GameStatus.Land) {
            this._status = "Landed";
        } else {
            this._status = "Flying";
        }
    }

    constructor() {
        super(html, css);
    }
    resetFlags() {
        this.flagAltitude = false;
        this.flagHVelocity = false;
        this.flagRotation = false;
        this.flagVVelocity = false;
    }
}
