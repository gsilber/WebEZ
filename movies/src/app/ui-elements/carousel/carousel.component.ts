import {
    BindCSSClass,
    BindInnerHTML,
    BindStyle,
    Click,
    EventSubject,
    EzComponent,
} from "@gsilber/webez";
import html from "./carousel.component.html";
import css from "./carousel.component.css";
import { SearchResult } from "../../themoviedb/models/search-results.model";
import { Globals } from "../../globals";

/**
 * @description CarouselComponent is a component for a carousel
 * @export
 * @class CarouselComponent
 * @extends {EzComponent}
 * @property {number} position The position of the carousel
 * @property {EventSubject<number>} positionChanged The position changed event subject
 * @property {EventSubject<SearchResult>} onNextCard The next card event subject
 * @property {EventSubject<SearchResult>} onPrevCard The previous card event subject
 */
export class CarouselComponent extends EzComponent {
    /**
     * @description This is the constructor
     * @constructor
     * @param {number} _numElements The number of elements in the carousel
     * @param {string[]} _cardHtmls The html for the cards
     * @param {(itemNumber: number) => Promise<string[]>} requestCallback The request callback when the carousel needs more data.  should return a single string in an array that is the html of the card
     * @throws {Error} Carousel must have 4 cards
     */
    constructor(
        private _numElements: number,
        private _cardHtmls: string[] = [],
        private requestCallback: (
            itemNumber: number,
        ) => Promise<string[]> = async () => {
            return [];
        },
    ) {
        super(html, css);
        this.position = 1;
        if (_cardHtmls.length != 4) {
            throw new Error("Carousel must have 4 cards");
        }
        this.card1 = _cardHtmls[0];
        this.card2 = _cardHtmls[1];
        this.card3 = _cardHtmls[2];
        this.card4 = _cardHtmls[3];
    }

    /**
     * @description Event fires when the position of the carousel has changed
     * @type {EventSubject<number>}
     * @memberof CarouselComponent
     * @emits number The new position
     */
    public positionChanged: EventSubject<number> = new EventSubject<number>();
    private animationTime = Globals.animationTime;

    private _rotating: boolean = false;

    /**
     * @description Event that fires when the next card moves to the middle
     * @type {EventSubject<SearchResult>}
     * @memberof CarouselComponent
     * @emits SearchResult The next card
     */
    public onNextCard: EventSubject<SearchResult> =
        new EventSubject<SearchResult>();
    /**
     * @description Event that fires when the previous card moves to the middle
     * @type {EventSubject<SearchResult>}
     * @memberof CarouselComponent
     * @emits SearchResult The previous card
     */
    public onPrevCard: EventSubject<SearchResult> =
        new EventSubject<SearchResult>();
    private _position: number = 1;
    /**
     * @description The position of the carousel
     * @type {number}
     * @memberof CarouselComponent
     */
    get position(): number {
        return this._position;
    }
    set position(value: number) {
        this._position = value;
        if (this._position === 0) {
            //disable left button
            this.showLeftArrow = false;
            this.showBox0 = false;
            this.showBox1 = false;
        } else if (this._position === 1) {
            this.showLeftArrow = true;
            this.showBox0 = false;
            this.showBox1 = true;
        } else {
            this.showLeftArrow = true;
            this.showBox0 = true;
            this.showBox1 = true;
        }
        if (this._position === this._numElements - 2) {
            this.showRightArrow = true;
            this.showBox4 = false;
            this.showBox3 = true;
        } else if (this._position === this._numElements - 1) {
            this.showRightArrow = false;
            this.showBox4 = false;
            this.showBox3 = false;
            //disable right button
        } else {
            this.showRightArrow = true;
            this.showBox3 = true;
            this.showBox4 = true;
        }
        this.positionChanged.next(this._position);
    }

    /*Bindings*/
    @BindStyle("card0item", "display")
    private _showBox0: string = "inline-block";
    @BindStyle("card1item", "display")
    private _showBox1: string = "inline-block";
    @BindStyle("card3item", "display")
    private _showBox3: string = "inline-block";
    @BindStyle("card4item", "display")
    private _showBox4: string = "inline-block";

    private get showBox0(): boolean {
        return this._showBox0 === "inline-block";
    }
    private set showBox0(value: boolean) {
        this._showBox0 = value ? "inline-block" : "none";
    }
    private get showBox1(): boolean {
        return this._showBox1 === "inline-block";
    }
    private set showBox1(value: boolean) {
        this._showBox1 = value ? "inline-block" : "none";
    }
    private get showBox3(): boolean {
        return this._showBox3 === "inline-block";
    }
    private set showBox3(value: boolean) {
        this._showBox3 = value ? "inline-block" : "none";
    }
    private get showBox4(): boolean {
        return this._showBox4 === "inline-block";
    }
    private set showBox4(value: boolean) {
        this._showBox4 = value ? "inline-block" : "none";
    }
    @BindStyle("left", "display")
    private _showLeftArrow: string = "none";
    private get showLeftArrow(): boolean {
        return this._showLeftArrow === "block";
    }
    private set showLeftArrow(value: boolean) {
        this._showLeftArrow = value ? "block" : "none";
    }
    @BindStyle("right", "display")
    private _showRightArrow: string = "none";
    private get showRightArrow(): boolean {
        return this._showRightArrow === "block";
    }
    private set showRightArrow(value: boolean) {
        this._showRightArrow = value ? "block" : "none";
    }
    @BindCSSClass("card0")
    private card0Animate: string = "";
    @BindCSSClass("card1")
    private card1Animate: string = "";
    @BindCSSClass("card2")
    private card2Animate: string = "";
    @BindCSSClass("card3")
    private card3Animate: string = "";
    @BindCSSClass("card4")
    private card4Animate: string = "";
    @BindInnerHTML("card0item")
    private card0 = "";
    @BindInnerHTML("card1item")
    private card1 = "";
    @BindInnerHTML("card2item")
    private card2 = "";
    @BindInnerHTML("card3item")
    private card3 = "";
    @BindInnerHTML("card4item")
    private card4 = "";
    /*End Bindings*/

    /**
     * @description Animate the carousel
     * @param {boolean} [backward=false] If true, animate backward
     * @memberof CarouselComponent
     * @private
     * @returns {void}
     */
    private animate(backward: boolean = false): void {
        const addString = backward ? "-back" : "";
        this._rotating = true;
        this.card0Animate = "";
        this.card1Animate = "";
        this.card2Animate = "";
        this.card3Animate = "";
        this.card4Animate = "";
        setTimeout(() => {
            this.card0Animate = "animate-0" + addString;
            this.card1Animate = "animate-1" + addString;
            this.card2Animate = "animate-2" + addString;
            this.card3Animate = "animate-3" + addString;
            this.card4Animate = "animate-4" + addString;
        }, 1);
    }

    /**
     * @description Clear animations on the caorusel
     * @memberof CarouselComponent
     * @private
     * @returns {void}
     */
    clearAnimations() {
        this.card0Animate = "";
        this.card1Animate = "";
        this.card2Animate = "";
        this.card3Animate = "";
        this.card4Animate = "";
        this._rotating = false;
    }

    /**
     * @description Update the cards in the carousel after a click on one of the nav buttons
     * @param {boolean} [backward=false] If true, update the cards backward
     * @memberof CarouselComponent
     * @private
     * @returns {void}
     */
    private async updateCards(backward: boolean = false) {
        if (backward) {
            //largest deleted
            //smallest fetched
            this.card4 = this.card3;
            this.card3 = this.card2;
            this.card2 = this.card1;
            this.card1 = this.card0;
            this.card0 = this._cardHtmls[this.position - 2];
            //should be in the array already.
        } else {
            //smallest deleted
            //largest fetched
            this.card0 = this.card1;
            this.card1 = this.card2;
            this.card2 = this.card3;
            this.card3 = this.card4;
            let newCards: string[] = await this.requestCallback(
                this.position + 3,
            );
            if (newCards.length != 1) {
                throw new Error(
                    "Request callback must return exactly one card",
                );
            }
            this.card4 = newCards[0];
            this._cardHtmls.push(this.card4);
        }
    }

    /**
     * @description Move the carousel to the right
     * @memberof CarouselComponent
     * @private
     * @returns {void}
     */
    @Click("right")
    private moveRight() {
        if (!this._rotating) {
            this.showLeftArrow = false;
            this.showRightArrow = false;
            this.animate();
            setTimeout(() => {
                this.position++;
                this.clearAnimations();
                this.updateCards();
            }, this.animationTime);
        }
    }

    /**
     * @description Move the carousel to the left
     * @memberof CarouselComponent
     * @private
     * @returns {void}
     */
    @Click("left")
    private moveLeft() {
        if (!this._rotating) {
            this.showLeftArrow = false;
            this.showRightArrow = false;
            this.animate(true);
            setTimeout(() => {
                this.position--;
                this.clearAnimations();
                this.updateCards(true);
            }, this.animationTime);
        }
    }
}
