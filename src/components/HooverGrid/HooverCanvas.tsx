import { FC, useEffect, useRef, useState } from 'react';
import './HooverCanvas.scss';

import ToggleSwitcher from '../ToggleSwitcher/ToggleSwitcher';
import PlayButton from '../PlayButton/PlayButton';

interface HooverCanvasProps {
    squaresX: number,
    squaresY: number
}

enum Cardinaux {
  N = "N",
  E = "E",
  S = "S",
  O = "O"
}

class EnumIndex {
  static of<T extends object>(e: T) {
    const values = Object.values(e);
    return {
      next: <K extends keyof T>(v: T[K]) => values[(values.indexOf(v)+1) % values.length],
      prev: <K extends keyof T>(v: T[K]) => values[(values.indexOf(v) === 0) ? values.length-1 : values.indexOf(v)-1]
    }
  }
}
 
const HooverCanvas: FC<HooverCanvasProps> = ({squaresX, squaresY}) => { 
    const squareSize: number = 100;
    const canvasHeight = squareSize*squaresY;
    const canvasWidth = squareSize*squaresX;

    const [useScript, setUseScript] = useState(false);
    const [scriptContent, setScriptContent] = useState('');
    const [launchScript, setLaunchScript] = useState(false);
    const [scriptIteration, setScriptIteration] = useState(0);

    const [hooverX, setHooverX] = useState(5);
    const [hooverY, setHooverY] = useState(5);
    const [hooverDir, setHooverDir] = useState(Cardinaux.N);
    const [moveToX, setMoveToX] = useState(hooverX);
    const [moveToY, setMoveToY] = useState(hooverY);
    const [launchMoveTo, setLaunchMoveTo] = useState(false);
    const movementDelay = 350;

    const hooverWidth: number = 30;
    // utilisation de pythagore pour la hauteur du triangle qui doit être équilatéral
    const hooverHeight: number = hooverWidth * Math.sqrt(3) / 2;
    const hooverCenterX: number = hooverWidth / 2;
    const hooverCenterY: number = hooverHeight / 2;
    const hooverOffsetX = hooverX*squareSize;
    const hooverOffsetY = hooverY*squareSize;

    // définition de padding pour les squares de la grille car le triangle doit être au centre de ceux-ci
    const squareLeftPadding = (squareSize - hooverWidth) / 2;
    const squareTopPadding = (squareSize - hooverHeight)/2;
  
    const canvas = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (hooverX > squaresX-1) { setHooverX(squaresX-1); }
        if (hooverY > squaresY-1) { setHooverY(squaresY-1); }

        const context = canvas.current?.getContext('2d');

        if (!context) { return; }

        if (launchScript) {
            setTimeout(() => {
                if (scriptIteration === scriptContent.length) { stopProcesses(); return; }

                if (updateHoover(scriptContent.charAt(scriptIteration))) {
                    stopProcesses();
                    return;
                }

                draw(context);

                const nextIteration = scriptIteration+1;
                setScriptIteration(nextIteration);
            }, movementDelay);
        }

        else if (launchMoveTo) {
            setTimeout(() => {
                if (moveToX === hooverX && moveToY === hooverY) { stopProcesses(); return; }

                if (moveToX !== hooverX) {
                    adjustHooverX();
                }
                if (moveToY !== hooverY) {
                    adjustHooverY();
                }

                draw(context);
            }, movementDelay)
        }

        else {
            draw(context);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [launchScript, launchMoveTo, hooverDir, hooverX, hooverY, canvasHeight, canvasWidth]);

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

        const hooverSVG = `M ${-hooverCenterX} ${hooverCenterY} H ${hooverCenterX} L 0 ${-hooverCenterY} Z`;
        const path = new Path2D(hooverSVG);

        const drawOffsetX = squareLeftPadding + hooverCenterX + hooverOffsetX;
        const drawOffsetY = squareTopPadding + hooverCenterY + hooverOffsetY;

        context.translate(drawOffsetX, drawOffsetY);
        context.rotate((Math.PI / 180) * getHooverRotation());

        context.strokeStyle = "#c26f4e";
        context.lineWidth = 4;
        context.stroke(path);
        context.fillStyle = "#ffa07a";
        context.fill(path);

        context.arc(0, -hooverCenterY, 3, 0, 2*Math.PI);
        context.fillStyle = "#c26f4e";
        context.fill();
      
        context.restore();
    }

    const adjustHooverX = () => {
        if (hooverX > moveToX) {
            if (hooverDir !== Cardinaux.O) {
                updateHoover((hooverDir === Cardinaux.N) ? 'g' : 'd');
            } else { 
                setHooverX(hooverX-1);
            }
        } else if (hooverX < moveToX) {
            if (hooverDir !== Cardinaux.E) {
                updateHoover((hooverDir === Cardinaux.S) ? 'g' : 'd');
            } else { 
                setHooverX(hooverX+1);
            }
        }
    }
    const adjustHooverY = () => {
        if (hooverY > moveToY) {
            if (hooverDir !== Cardinaux.N) {
                updateHoover((hooverDir === Cardinaux.E) ? 'g' : 'd');
            } else {
                setHooverY(hooverY-1);
            }
        } else if (hooverY < moveToY) {
            if (hooverDir !== Cardinaux.S) {
                updateHoover((hooverDir === Cardinaux.O) ? 'g' : 'd');
            } else {
                setHooverY(hooverY+1);
            }
        }
    }
  
    // Doit return true si le hoover ne peut pas avancer car se situe au bord de la grille
    const updateHoover = (movement: string): boolean => {
        movement.toLowerCase();

        if (movement === "d") {
            let nextDir = EnumIndex.of(Cardinaux).next(hooverDir);
            setHooverDir(nextDir);
        } else if (movement === "g") {
            let prevDir = EnumIndex.of(Cardinaux).prev(hooverDir);
            setHooverDir(prevDir);
        } else if (movement === "a") {
            switch (hooverDir) {           
                case Cardinaux.N:
                    if (hooverY > 0) { 
                        setHooverY(hooverY-1);
                        break;
                    }
                    return true;
                case Cardinaux.E:
                    if (hooverX < squaresX-1) {
                        setHooverX(hooverX+1); 
                        break;
                    }
                    return true;
                case Cardinaux.S:
                    if (hooverY < squaresY-1) {
                        setHooverY(hooverY+1);
                        break;
                    }
                    return true;
                case Cardinaux.O:
                    if (hooverX > 0) {
                        setHooverX(hooverX-1);
                        break;
                    }
                    return true;
            }
        }

        return false;
    }

    const getHooverRotation = (): number => {
        if (hooverDir === Cardinaux.E)      { return 90  }
        else if (hooverDir === Cardinaux.S) { return 180 }
        else if (hooverDir === Cardinaux.O) { return 270 }
        return 0;
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
    const stopProcesses = () => {
        setTimeout(() => {
            setLaunchMoveTo(false);
            setLaunchScript(false);
            setScriptIteration(0);
        }, 500);    
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
                        <span>X : {hooverX}</span>
                        <span>Y : {hooverY}</span>
                        <span>Direction : {hooverDir}</span>
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