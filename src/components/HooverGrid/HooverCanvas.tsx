import { FC, useEffect, useRef, useState } from 'react';
import './HooverCanvas.scss';

import ToggleSwitcher from '../ToggleSwitcher/ToggleSwitcher';
import PlayButton from '../PlayButton/PlayButton';

import { CardinauxEnum } from '../../enums/CardinauxEnum';
import { Cardinaux } from '../../classes/Cardinaux';
import { Hoover } from '../../classes/Hoover';

interface HooverCanvasProps {
    canvasHeight: number,
    canvasWidth: number,
    squaresX: number,
    squaresY: number,
    squareSize: number,
    animationSpeed: number
}
 
const HooverCanvas: FC<HooverCanvasProps> = ({canvasHeight, canvasWidth, squaresX, squaresY, squareSize, animationSpeed}) => { 
    const createNewHoover = (x: number, y: number, dir: CardinauxEnum) => {
        return new Hoover(x, y, dir, 30, x*squareSize, y*squareSize);
    }
    const [hoover, setHoover] = useState(createNewHoover(5, 5, CardinauxEnum.N));

    const [useScript, setUseScript] = useState(false);
    const [scriptContent, setScriptContent] = useState('');
    const [launchScript, setLaunchScript] = useState(false);
    const [scriptIteration, setScriptIteration] = useState(0);

    const [launchMoveTo, setLaunchMoveTo] = useState(false);
    const [moveToX, setMoveToX] = useState(hoover.x);
    const [moveToY, setMoveToY] = useState(hoover.y);

    const canvas = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (hoover.x > squaresX-1) { setHoover(createNewHoover(squaresX-1, hoover.y, hoover.direction)); }
        if (hoover.y > squaresY-1) { setHoover(createNewHoover(hoover.x, squaresY-1, hoover.direction)); }

        const context = canvas.current?.getContext('2d');

        if (!context) { return; }

        if (launchScript) {
            setTimeout(() => {
                if (scriptIteration === scriptContent.length || updateHoover(scriptContent.charAt(scriptIteration))) { 
                    resetProcesses();
                    return;
                }

                setScriptIteration(scriptIteration+1);
                draw(context);
            }, animationSpeed);
        }
        else if (launchMoveTo) {
            setTimeout(() => {
                if (moveToX === hoover.x && moveToY === hoover.y) {
                    resetProcesses();
                    return;
                }

                adjustHooverX();
                adjustHooverY();
                draw(context);
            }, animationSpeed)
        }
        else {
            draw(context);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [launchScript, launchMoveTo, hoover, canvasHeight, canvasWidth]);

    const draw = (context: CanvasRenderingContext2D) => {
        context.clearRect(0, 0, canvasWidth, canvasHeight)
        drawGrid(context);
        drawHoover(context);
    }

    const drawGrid = (context: CanvasRenderingContext2D) => {
        context.beginPath();
    
        for (let x=0; x<=squaresX; x++) {
            context.moveTo(x*squareSize, 0);
            context.lineTo(x*squareSize, canvasHeight);
        }
        for (let y=0; y<=squaresY; y++) {
            context.moveTo(0, y*squareSize);
            context.lineTo(canvasWidth, y*squareSize);
        }
    
        context.strokeStyle = '#000';
        context.lineWidth = 1;
        context.stroke();

        context.closePath();
    }

    const drawHoover = (context: CanvasRenderingContext2D) => {
        context.save();

        const hooverSVG = `M ${-hoover.centerX} ${hoover.centerY} H ${hoover.centerX} L 0 ${-hoover.centerY} Z`;
        const path = new Path2D(hooverSVG);

        const squareLeftPadding = (squareSize - hoover.width) / 2;
        const squareTopPadding = (squareSize - hoover.height) / 2;
        const drawOffsetX = squareLeftPadding + hoover.centerX + hoover.offsetX;
        const drawOffsetY = squareTopPadding + hoover.centerY + hoover.offsetY;

        context.translate(drawOffsetX, drawOffsetY);
        context.rotate((Math.PI / 180) * Cardinaux.getRotationDegree(hoover.direction));

        context.strokeStyle = "#c26f4e";
        context.lineWidth = 4;
        context.stroke(path);
        context.fillStyle = "#ffa07a";
        context.fill(path);

        context.arc(0, -hoover.centerY, 3, 0, 2*Math.PI);
        context.fillStyle = "#c26f4e";
        context.fill();
      
        context.restore();
    }

    const adjustHooverX = () => {
        if (hoover.x > moveToX) {
            if (hoover.direction !== CardinauxEnum.O) {
                updateHoover((hoover.direction === CardinauxEnum.N) ? 'g' : 'd');
            } else { 
                updateHoover('a');
            }
        } else if (hoover.x < moveToX) {
            if (hoover.direction !== CardinauxEnum.E) {
                updateHoover((hoover.direction === CardinauxEnum.S) ? 'g' : 'd');
            } else { 
                updateHoover('a');
            }
        }
    }
    const adjustHooverY = () => {
        if (hoover.y > moveToY) {
            if (hoover.direction !== CardinauxEnum.N) {
                updateHoover((hoover.direction === CardinauxEnum.E) ? 'g' : 'd');
            } else {
                updateHoover('a');
            }
        } else if (hoover.y < moveToY) {
            if (hoover.direction !== CardinauxEnum.S) {
                updateHoover((hoover.direction === CardinauxEnum.O) ? 'g' : 'd');
            } else {
                updateHoover('a');
            }
        }
    }
  
    const updateHoover = (movement: string): boolean | Error => {
        movement.toLowerCase();

        if (movement === "d") {
            let nextDir = Cardinaux.of(CardinauxEnum).next(hoover.direction);
            setHoover(createNewHoover(hoover.x, hoover.y, nextDir));
        }
        else if (movement === "g") {
            let prevDir = Cardinaux.of(CardinauxEnum).prev(hoover.direction);
            setHoover(createNewHoover(hoover.x, hoover.y, prevDir));
        }
        else if (movement === "a") {
            switch (hoover.direction) {       
                case CardinauxEnum.E:
                    if (hoover.x >= squaresX-1) { return Error("Error on movement forward on CardinauxEnum.E"); }
                    setHoover(createNewHoover(hoover.x+1, hoover.y, hoover.direction));
                    break;
                case CardinauxEnum.O:
                    if (hoover.x <= 0) { return Error("Error on movement forward on CardinauxEnum.O"); }
                    setHoover(createNewHoover(hoover.x-1, hoover.y, hoover.direction));
                    break;    
                case CardinauxEnum.N:
                    if (hoover.y <= 0) { return Error("Error on movement forward on CardinauxEnum.N"); }
                    setHoover(createNewHoover(hoover.x, hoover.y-1, hoover.direction));
                    break;
                case CardinauxEnum.S:
                    if (hoover.y >= squaresY-1) { return Error("Error on movement forward on CardinauxEnum.S"); }
                    setHoover(createNewHoover(hoover.x, hoover.y+1, hoover.direction));
                    break;
            }
        }
        
        return false;
    }

    const playMoveTo = () => {
        if (launchScript) { return; }
        setLaunchMoveTo(true);
    }
    const updateMoveToX = (x: number) => {
        setMoveToX((x) ? x : 0);
    }
    const updateMoveToY = (y: number) => {
        setMoveToY((y) ? y : 0);
    }
  
    const toggleScript = () => {
        setUseScript(!useScript);
    }
    const updateScript = (value: string) => {
        let lastChar = value.slice(-1).toLowerCase();
        if (!(lastChar === "a" || lastChar === "d" || lastChar === "g" || !lastChar)) { return; }
        setScriptContent(value.toLowerCase());
    }
    const playScript = () => {
        if (launchMoveTo) { return; }
        setLaunchScript(true);
    }
    const resetProcesses = () => {
        setLaunchMoveTo(false);
        setLaunchScript(false);
        setScriptIteration(0);  
    }

    return ( 
        <div className="grid-wrapper">
            <div className='grid-layout'>
                <div className="canvas-wrapper">
                    <canvas ref={canvas} height={canvasHeight} width={canvasWidth}>
                    </canvas>
                </div>
            </div>

            <div className="grid-data">
                <div className="hoover-data">
                    <h3 className="hoover-data-header">Hoover data :</h3>
                    <div className="hoover-coords">
                        <span>X : {hoover.x}</span>
                        <span>Y : {hoover.y}</span>
                        <span>Direction : {hoover.direction}</span>
                    </div>
                    <div className="hoover-move-to-inner">
                        <label htmlFor="move-toX">Move to X :
                            <input min="0" max={squaresX-1} type="number" className="input-number hoover-move-to" id="move-toX" disabled={launchMoveTo}
                                value={moveToX} onChange={(e) => updateMoveToX(parseInt(e.target.value))}/>
                        </label>
                        <label htmlFor="move-toY">Move to Y :
                            <input min="0" max={squaresY-1} type="number" className="input-number hoover-move-to" id="move-toY" disabled={launchMoveTo}
                                value={moveToY} onChange={(e) => updateMoveToY(parseInt(e.target.value))}/>
                        </label>
                        <div className="move-to-btn">
                            <PlayButton loading={launchMoveTo} onClick={() => playMoveTo()}></PlayButton>
                        </div>
                    </div>
                </div>

                <div className="grid-instructions">
                    <h3 className="instructions-header">Instructions :</h3>
                    
                    <div className="switch-mode">
                        <span className="mode">Manual</span>
                        <ToggleSwitcher toggler={() => toggleScript()}></ToggleSwitcher>
                        <span className="mode">Script</span>
                    </div>

                    <div className="instructions-wrapper">
                        <div id="script-instructions" className={`instructions-card ${(!useScript)? 'hide' : ''}`}>
                            <textarea name="script" id="script" disabled={launchScript}
                                value={scriptContent}
                                onChange={(e) => updateScript(e.target.value)} />
                            <div className="script-btn">
                                <PlayButton loading={launchScript} onClick={() => playScript()}></PlayButton>
                            </div>
                        </div>

                        <div id="manual-instructions"  className={`instructions-card ${(useScript)? 'hide' : ''}`}>
                            <button className="btn btn-action manual-btn" onClick={() => updateHoover("d")}>Droite</button>
                            <button className="btn btn-action manual-btn" onClick={() => updateHoover("g")}>Gauche</button>
                            <button className="btn btn-action manual-btn" onClick={() => updateHoover("a")}>Avant</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
     );    
}
 
export default HooverCanvas;