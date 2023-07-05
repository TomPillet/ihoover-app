import { CardinauxEnum } from "../enums/CardinauxEnum";

export class Hoover {
    x: number;
    y: number;
    direction: CardinauxEnum;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
    offsetX: number;
    offsetY: number;

    constructor(posX: number, posY: number, dir: CardinauxEnum, width: number, offsetX: number, offsetY: number) {
        this.x = posX;
        this.y = posY;
        this.direction = dir;
        this.width = width;
        this.height = width * Math.sqrt(3) / 2;
        this.centerX = this.width/2;
        this.centerY = this.height/2;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }
}