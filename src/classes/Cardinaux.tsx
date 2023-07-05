export enum Cardinaux {
    N = "N",
    E = "E",
    S = "S",
    O = "O"
}

export class CardinauxEnumIndex {
    static of<T extends object>(e: T) {
        const values = Object.values(e);
        return {
        next: <K extends keyof T>(v: T[K]) => values[(values.indexOf(v)+1) % values.length],
        prev: <K extends keyof T>(v: T[K]) => values[(values.indexOf(v) === 0) ? values.length-1 : values.indexOf(v)-1]
        }
    }
}