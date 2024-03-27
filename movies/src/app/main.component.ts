import html from "./main.component.html";
import css from "./main.component.css";
import {
    AppendPipe,
    BindInnerHTML,
    BindStyle,
    EzComponent,
    PrependPipe,
} from "@gsilber/webez";
import { MovieDBService } from "./themoviedb/moviedb.service";
import { CarouselComponent } from "./ui-elements/carousel/carousel.component";
import { SearchResult } from "./themoviedb/models/search-results.model";
import { MovieDetail } from "./themoviedb/models/movie-details.model";
import { Globals } from "./globals";
/**
 * @description MainComponent is the main component of the app
 * @extends EzComponent
 *
 */
export class MainComponent extends EzComponent {
    private service: MovieDBService = new MovieDBService();
    private carousel?: CarouselComponent;
    private movies: SearchResult[] = [];

    /** Bindings for details */
    @BindInnerHTML("movie-title")
    private movieTitle: string = "";

    @BindInnerHTML("release-date")
    private releaseDate: string = "";

    @BindInnerHTML("genres")
    private genres: string = "";

    @AppendPipe(" minutes")
    @BindInnerHTML("runtime")
    private runtime: string = "";

    @AppendPipe("'>Home Page</a>")
    @PrependPipe("<a href='")
    @BindInnerHTML("home-link")
    private homePage: string = "";

    @PrependPipe("<b>Overview:</b><br/> ")
    @BindInnerHTML("overview")
    private overview: string = "";

    @AppendPipe("'>IMDB Page</a>")
    @PrependPipe("<a href='")
    @BindInnerHTML("imdb-link")
    private imdbLink: string = "";

    /**End bindings for details */
    @BindStyle("content", "width")
    @AppendPipe("px")
    private _carouselWidth: string = "100%";
    private get carouselWidth(): number {
        return parseInt(this._carouselWidth);
    }
    private set carouselWidth(value: number) {
        this._carouselWidth = value.toString();
    }

    @BindStyle("content", "height")
    @AppendPipe("px")
    private _carouselHeight: string = "300";
    private get carouselHeight(): number {
        return parseInt(this._carouselHeight);
    }
    private set carouselHeight(value: number) {
        this._carouselHeight = value.toString();
    }

    /**
     * @description This is the constructor
     * @constructor
     * @summary Creates an instance of MainComponent and loads configruation data from the MovieDB API service.
     * @sideeffects Loads configuration from the api service, then continues setup.
     */
    constructor() {
        super(html, css);
        this.service.dbReady.subscribe(() => {
            this.setup();
        });
    }

    /**
     * @description This method sets up the component
     * @method
     * @summary Sets up the component by getting the records and setting up the carousel
     * @private
     * @sideeffects Sets up the carousel and loads the first set of movies
     */
    private setup() {
        this.service.getRecordsInRange(1, 4).then((results: SearchResult[]) => {
            this.movies = results;
            this.carousel = new CarouselComponent(
                this.service.totalResults,
                results.map(this.buildHtml.bind(this)),
                async (itemNumber: number): Promise<string[]> => {
                    let result = await this.service.getRecordsInRange(
                        itemNumber,
                        itemNumber,
                    );
                    if (this.movies.indexOf(result[0]) === -1) {
                        this.movies.push(result[0]);
                    }
                    return result.map(this.buildHtml.bind(this)) as string[];
                },
            );
            this.carousel.positionChanged.subscribe(async (pos: number) => {
                this.movieTitle = "&nbsp;";
                const details: MovieDetail = await this.service.getMovieDetails(
                    this.movies[pos].id,
                );
                this.setMovieDetails(details);
            });
            this.carousel.position = 1;
            this.addComponent(this.carousel, "movie-imgs");
            let width = this.getWindowSize().windowWidth;
            if (width > 1300) width = 1300;
            this.carouselHeight = (width - 20) / 2;
            this.carouselWidth = width - 20;
            this.onResizeEvent.subscribe(() => {
                let width = this.getWindowSize().windowWidth;
                if (width > 1300) width = 1300;
                this.carouselHeight = (width - 20) / 2;
                this.carouselWidth = width - 20;
            });
        });
    }

    /**
     * @description This method builds the HTML for a record as an image
     * @method
     * @param {SearchResult} record The record to build the HTML for
     * @returns {string} The HTML for the record
     * @private
     */
    private buildHtml(record: SearchResult): string {
        return `<div "><img src="${record.poster_path}" alt="${record.title}" style="height:100%;width:100%" /></div>`;
    }

    /**
     * @description This method sets the movie details in the bound properties to update the screen
     * @method
     * @param {MovieDetail} details The details to set the properties from
     * @returns {void}
     * @private
     */
    private setMovieDetails(details: MovieDetail): void {
        this.movieTitle = details.title;
        this.releaseDate = new Date(details.release_date).toLocaleDateString();
        this.genres = details.genres.map((genre) => genre.name).join(", ");
        this.runtime = details.runtime.toString();
        this.homePage = details.homepage;
        this.overview = details.overview;
        this.imdbLink = Globals.imdbLink + details.imdb_id;
    }
}
