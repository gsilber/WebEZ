import { EventSubject, EzComponent, HttpMethod } from "@gsilber/webez";
import { Globals } from "../globals";
import { MovieDBConfiguration } from "./models/configuration.model";
import { SearchResult, SearchResults } from "./models/search-results.model";
import { MovieDetail } from "./models/movie-details.model";

/**
 * @description MovieDBService is a service for the MovieDB API
 * @export
 * @class MovieDBService
 * @property {number} totalPages The total pages
 * @property {EventSubject<void>} dbReady The event subject for when the database is ready
 * @method {Promise<void>} nextPage() Get the next page of data
 * @method {Promise<void>} previousPage() Get the previous page of data
 * @method {Promise<MovieDetail>} getMovieDetails(id: number) Get details for a specific movie
 * @method {Promise<SearchResult[]>} getPage(page: number) Get a page of data
 * @method {Promise<SearchResult[]>} getRecordsInRange(start: number, end: number) Get the records in range
 */
export class MovieDBService {
    private _config: MovieDBConfiguration;
    private _totalPages: number = 0;
    private _totalResults: number = 0;
    private _currentPage: number = 0;
    private _results: SearchResult[][] = [];
    private static addOnOptions: string =
        "include_adult=false&include_video=false&language=en-US";

    public dbReady: EventSubject<void> = new EventSubject<void>();

    /**
     * Get the total pages
     * @description This property gets the total pages
     * @returns {number} The total pages
     * @readonly
     */
    public get totalPages(): number {
        return this._totalPages;
    }

    /**
     * Get the total results
     * @description This property gets the total results
     * @returns {number} The total results
     * @readonly
     */
    public get totalResults(): number {
        return this._totalResults;
    }

    /**
     * @description This is the constructor
     * @constructor
     */
    constructor() {
        this._config = {} as MovieDBConfiguration;
        this.loadConfiguration().then((result: MovieDBConfiguration) => {
            this._config = result;
            this.dbReady.next();
        });
    }

    /**
     * Get the configuration object
     * @description This method sets the configuration object
     * @returns {MovieDBConfiguration} The configuration object
     * @throws {Error} If the configuration object is not set
     * @async
     */
    private async loadConfiguration(): Promise<MovieDBConfiguration> {
        try {
            let result = EzComponent.ajax<MovieDBConfiguration>(
                `${Globals.movieApiUrl}configuration?api_key=${Globals.movieApiKey}`,
                HttpMethod.GET,
            ).toPromise() as Promise<MovieDBConfiguration>;
            return await result;
        } catch (e) {
            throw new Error("Configuration object not set");
        }
    }

    /**
     * Get popular movies
     * @description This method gets popular movies
     * @param {number} page The page number
     * @returns {SearchResults} The search results
     * @throws {Error} If there is an error getting popular movies
     * @async
     */
    private async getPopularMovies(page: number): Promise<SearchResult[]> {
        if (this._results[page - 1]) return this._results[page - 1];
        try {
            let result = EzComponent.ajax<SearchResults>(
                `${Globals.movieApiUrl}movie/popular?api_key=${Globals.movieApiKey}&${MovieDBService.addOnOptions}&page=${page}&sort_by=popularity.desc`,
                HttpMethod.GET,
            ).toPromise() as Promise<SearchResults>;
            const movies: SearchResults = await result;
            this._totalPages = movies.total_pages;
            this._totalResults = movies.total_results;
            return this.updateImageUrls(movies.results);
        } catch (e) {
            throw new Error("Error getting popular movies");
        }
    }

    /**
     * Update image URLs
     * @description This method updates image URLs
     * @param {SearchResult[]} results The search results
     * @returns {SearchResult[]} The search results
     */
    private updateImageUrls(results: SearchResult[]): SearchResult[] {
        results.forEach((result: SearchResult) => {
            if (result.poster_path && this._config.images) {
                result.poster_path = `${this._config.images.base_url}${this._config.images.poster_sizes[2]}${result.poster_path}`;
            }
            if (result.backdrop_path && this._config.images) {
                result.backdrop_path = `${this._config.images.base_url}${this._config.images.backdrop_sizes[2]}${result.backdrop_path}`;
            }
        });
        return results;
    }

    /**
     * Get the next page of data
     * @description This method gets the next page of data
     * @returns {Promise<void>} A promise that resolves with the next page of data
     * @async
     */
    public async nextPage(): Promise<void> {
        if (this._currentPage >= this._totalPages) return;
        this._currentPage++;
        const page: SearchResult[] = await this.getPopularMovies(
            this._currentPage,
        );
        this._results[this._currentPage - 1] = page;
    }

    /**
     * Get the previous page of data
     * @description This method gets the previous page of data
     * @returns {Promise<void>} A promise that resolves with the previous page of data
     * @async
     */
    public async previousPage(): Promise<void> {
        if (this._currentPage <= 1) return;
        this._currentPage--;
        const page: SearchResult[] = await this.getPopularMovies(
            this._currentPage,
        );
        this._results[this._currentPage - 1] = page;
    }

    /**
     * Get details for a specific movie
     * @description This method gets details for a specific movie
     * @param {number} id The movie id
     * @returns {MovieDetail} The search result
     * @throws {Error} If there is an error getting movie details
     */
    public async getMovieDetails(id: number): Promise<MovieDetail> {
        try {
            let result = EzComponent.ajax<MovieDetail>(
                `${Globals.movieApiUrl}movie/${id}?api_key=${Globals.movieApiKey}&${MovieDBService.addOnOptions}`,
                HttpMethod.GET,
            ).toPromise() as Promise<MovieDetail>;
            return await result;
        } catch (e) {
            throw new Error("Error getting movie details");
        }
    }

    /**
     * Get a page of data
     * @description This method gets a page of data
     * @param {number} page The page number
     * @returns {SearchResult[]} The search result
     * @throws {Error} If there is an error getting a page of data
     * @async
     */
    public async getPage(page: number): Promise<SearchResult[]> {
        if (!this._results[page - 1]) {
            this._results[page - 1] = await this.getPopularMovies(page);
        }
        return this._results[page - 1];
    }
    /**
     * @description Get the records in range
     * @param {number} start The start index
     * @param {number} end The end index
     * @returns {SearchResult[]} The records in range
     * @async
     * @throws {Error} If there is an error getting the records in range
     */
    public async getRecordsInRange(
        start: number,
        end: number,
    ): Promise<SearchResult[]> {
        if (this.totalResults === 0) await this.getPopularMovies(1);
        if (start < 1 || end > this._totalResults) {
            throw new Error("Invalid range");
        }
        let records: SearchResult[] = [];
        let startPage: number = Math.floor((start - 1) / 20) + 1;
        let endPage: number = Math.floor((end - 1) / 20) + 1;
        let startOnFirstPage: number = (start - 1) % 20;
        let endOnLastPage: number = (end - 1) % 20;
        let p1records = await this.getPage(startPage);
        let p2records = await this.getPage(endPage);
        if (start == end) return [p1records[startOnFirstPage]];
        p1records = p1records.slice(startOnFirstPage);
        if (startPage === endPage) {
            p2records = p1records.slice(0, endOnLastPage + 1);
            p1records = [];
        } else {
            p2records = p2records.slice(0, endOnLastPage + 1);
        }

        for (let i: number = startPage + 1; i < endPage; i++) {
            let page: SearchResult[] = await this.getPage(i);
            records = [...records, ...page];
        }
        return [...p1records, ...records, ...p2records];
    }
}
