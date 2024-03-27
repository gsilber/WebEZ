/***
 * @description Model for the configuration object returned by the MovieDB API https://developers.themoviedb.org/3/configuration/get-api-configuration
 * @export
 * @interface MovieDBConfiguration
 */
export interface MovieDBConfiguration {
    images?: {
        base_url: string;
        secure_base_url: string;
        backdrop_sizes: string[];
        logo_sizes: string[];
        poster_sizes: string[];
        profile_sizes: string[];
        still_sizes: string[];
    };
    change_keys?: string[];
}
