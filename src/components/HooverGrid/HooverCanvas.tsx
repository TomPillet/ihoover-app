import React, { FC, useEffect, useRef, useState } from 'react';
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

    const [hooverX, setHooverX] = useState(5);
    const [hooverY, setHooverY] = useState(5);
    const [hooverDir, setHooverDir] = useState(Cardinaux.N);
    const hooverHeight: number = Math.floor(squareSize/3);
    const hooverWidth: number = Math.floor(squareSize/3);
    const hooverPixelsX = (hooverX-1)*squareSize;
    const hooverPixelsY = (hooverY-1)*squareSize;

    const squareLeftPadding = (squareSize - hooverWidth)/2;
    const squareTopPadding = (squareSize - hooverHeight)/2;
  
    const canvasHeight = squareSize*squaresY;
    const canvasWidth = squareSize*squaresX;
  
    const canvas = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const context = canvas.current?.getContext('2d');
  
        if (!context) { return; }
        
        context.clearRect(0, 0, canvasWidth, canvasHeight)
        drawGrid(context);
        drawHoover(context);
    });

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
  
      context.strokeStyle = 'rgb(0,0,0)';
      context.lineWidth = 1;
      context.stroke();

      context.closePath();
    }

    const drawHoover = (context: CanvasRenderingContext2D) => {
        context.save();

        const hooverSVG = ` M ${hooverPixelsX + squareLeftPadding} ${hooverPixelsY + squareTopPadding + hooverHeight}
                            H ${hooverPixelsX + squareLeftPadding + hooverWidth}
                            L ${hooverPixelsX + squareLeftPadding + (hooverWidth/2)} ${hooverPixelsY + squareTopPadding}
                            L ${hooverPixelsX + squareLeftPadding} ${hooverPixelsY + squareTopPadding + hooverHeight}`;

        const path = new Path2D(hooverSVG);
        const centerX = hooverPixelsX + squareLeftPadding + (hooverWidth/2);
        const centerY = hooverPixelsY + squareTopPadding + (hooverHeight/2);

        context.translate(centerX, centerY)
        context.rotate((Math.PI / 180) * getHooverRotation());
        context.translate(-centerX, -centerY);
        context.fillStyle = "red";
        context.fill(path);

        context.arc(centerX, centerY, 5, 0, 2 * Math.PI);
        context.fillStyle = "blue";
        context.fill();
      
        context?.restore();
    }
  
    const updateHoover = (movement: any) => {
      if (movement === "D") {
        let nextDir = EnumIndex.of(Cardinaux).next(hooverDir);
        setHooverDir(nextDir);
      } else if (movement === "G") {
        let prevDir = EnumIndex.of(Cardinaux).prev(hooverDir);
        setHooverDir(prevDir);
      } else if (movement === "A") {
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
  
    const toggleScript = (toggleData: boolean) => {
      setUseScript(toggleData);
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
                    <ToggleSwitcher toggler={() => toggleScript(!useScript)}></ToggleSwitcher>
                    <span className="mode">Script</span>
                </div>

                <div className="instructions-wrapper">
                    <div id="script-instructions" className={`instructions-card ${(!useScript)? 'hide' : ''}`}>
                    <textarea name="script" id="script"></textarea>
                    <button className='btn btn-valid script-btn' onClick={() => console.log('reload')}>
                        <FontAwesomeIcon icon={faPlay}></FontAwesomeIcon>
                    </button>
                    </div>

                    <div id="manual-instructions"  className={`instructions-card ${(useScript)? 'hide' : ''}`}>
                    <button className="btn btn-action manual-btn" onClick={() => updateHoover("D")}>Droite</button>
                    <button className="btn btn-action manual-btn" onClick={() => updateHoover("G")}>Gauche</button>
                    <button className="btn btn-action manual-btn" onClick={() => updateHoover("A")}>Avant</button>
                    </div>
                </div>
            </div>
        </div>
     );    
}
 
export default HooverCanvas;