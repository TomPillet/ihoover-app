import React, { FC, TextareaHTMLAttributes, useEffect, useRef, useState } from 'react';
import './HooverCanvas.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

import ToggleSwitcher from '../ToggleSwitcher/ToggleSwitcher';

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
    const [useScript, setUseScript] = useState(false);
    const [scriptContent, setScriptContent] = useState('');
    const [launchScript, setLaunchScript] = useState(false);
    const [scriptIteration, setScriptIteration] = useState(0);

    const [hooverX, setHooverX] = useState(5);
    const [hooverY, setHooverY] = useState(5);
    const [hooverDir, setHooverDir] = useState(Cardinaux.N);
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
  
    const canvasHeight = squareSize*squaresY;
    const canvasWidth = squareSize*squaresX;
  
    const canvas = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const context = canvas.current?.getContext('2d');
  
        if (!context) { return; }

        if (launchScript) {
            setTimeout(() => {
                updateHoover(scriptContent.charAt(scriptIteration))
                draw(context);

                const nextIteration = scriptIteration+1;
                setScriptIteration(nextIteration);

                if (scriptIteration === scriptContent.length) {
                    setLaunchScript(false);
                    setScriptIteration(0);
                }
            }, 360);
        } else {
            draw(context);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [launchScript, hooverDir, hooverX, hooverY]);

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
  
    const updateHoover = (movement: string) => {
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
                    if (hooverY > 1) { setHooverY(hooverY-1) }
                    break;
                case Cardinaux.E:
                    if (hooverX < squaresX) { setHooverX(hooverX+1) }
                    break;
                case Cardinaux.S:
                    if (hooverY < squaresY) { setHooverY(hooverY+1) }
                    break;
                case Cardinaux.O:
                    if (hooverX > 1) { setHooverX(hooverX-1) }
                    break;
            }
        }
    }

    const getHooverRotation = (): number => {
        if (hooverDir === Cardinaux.E)      { return 90  }
        else if (hooverDir === Cardinaux.S) { return 180 }
        else if (hooverDir === Cardinaux.O) { return 270 }
        return 0;
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
        setLaunchScript(true);
    }

    return ( 
        <div className="grid-wrapper">
            <div className='grid-layout'>
                <div className="canvas-wrapper">
                    <canvas ref={canvas} height={canvasHeight} width={canvasWidth}>
                    </canvas>
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
                        <textarea name="script" id="script"
                            value={scriptContent}
                            onChange={(e) => updateScript(e.target.value)} />
                        <button className='btn btn-valid script-btn' onClick={() => playScript()}>
                            <FontAwesomeIcon icon={faPlay}></FontAwesomeIcon>
                        </button>
                    </div>

                    <div id="manual-instructions"  className={`instructions-card ${(useScript)? 'hide' : ''}`}>
                        <button className="btn btn-action manual-btn" onClick={() => updateHoover("d")}>Droite</button>
                        <button className="btn btn-action manual-btn" onClick={() => updateHoover("g")}>Gauche</button>
                        <button className="btn btn-action manual-btn" onClick={() => updateHoover("a")}>Avant</button>
                    </div>
                </div>
            </div>
        </div>
     );    
}
 
export default HooverCanvas;