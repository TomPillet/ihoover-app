import { CardinauxEnum } from "../enums/CardinauxEnum";

export class Cardinaux {
    static getRotationDegree(current: CardinauxEnum) {
        if (current === CardinauxEnum.E)      { return 90  }
        else if (current === CardinauxEnum.S) { return 180 }
        else if (current === CardinauxEnum.O) { return 270 }
        return 0;
    }

    static of<T extends object>(e: T) {
        const values = Object.values(e);
        return {
            next: <K extends keyof T>(v: T[K]) => values[(values.indexOf(v)+1) % values.length],
            prev: <K extends keyof T>(v: T[K]) => values[(values.indexOf(v) === 0) ? values.length-1 : values.indexOf(v)-1]
        }
    }
}