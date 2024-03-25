export interface Position {
    x: number;
    y: number;
}
export enum GameStatus {
    Ok,
    Crash,
    Land,
    Orbit,
    Miss,
}
