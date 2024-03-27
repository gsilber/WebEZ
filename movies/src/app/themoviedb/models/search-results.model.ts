/**
 * @description Interface for the search results from the movie database API https://developers.themoviedb.org/3/search/search-movies
 * @interface SearchResult
 * @export
 */
export interface SearchResult {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

/**
 * @description interface for the list of search results from the movie database API https://developers.themoviedb.org/3/search/search-movies
 * @interface SearchResults
 * @export
 */
export interface SearchResults {
    page: number;
    results: SearchResult[];
    total_pages: number;
    total_results: number;
}
