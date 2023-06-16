import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import './App.scss';

import Canvas from './components/Canvas/Canvas';
import ToggleSwitcher from './components/ToggleSwitcher/ToggleSwitcher';

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

function App() {
  const [squaresX, setSquaresX] = useState(10);
  const [squaresY, setSquaresY] = useState(10);
  const [useScript, setUseScript] = useState(false);

  const [hooverX, setHooverX] = useState(5);
  const [hooverY, setHooverY] = useState(5);
  const [hooverDir, setHooverDir] = useState(Cardinaux.N);

  const toggleScript = (toggleData: boolean) => {
    setUseScript(toggleData);
  }

  const updateSquaresX = (value: number | 0) => {
    setSquaresX((value) ? value : 1);
  }
  const updateSquaresY = (value: number | 0) => {
    setSquaresY((value) ? value : 1);
  }

  const draw = (movement: any) => {
    if (movement === "D") {
      let nextDir = EnumIndex.of(Cardinaux).next(hooverDir);
      setHooverDir(nextDir);
    } else if (movement === "G") {
      let prevDir = EnumIndex.of(Cardinaux).prev(hooverDir);
      setHooverDir(prevDir);
    } else if (movement === "A") {
      switch (hooverDir) {
        case Cardinaux.N:
          setHooverY(hooverY+1);
          break;
        case Cardinaux.E:
          setHooverX(hooverX+1);
          break;
        case Cardinaux.S:
          setHooverY(hooverY-1);
          break;
        case Cardinaux.O:
          setHooverX(hooverX-1);
          break;
      }
    }
  }

  return (
    <div className="App">
      
      <div className="grid-settings">
        <label htmlFor="grid-sizeX">Cases sur l'axe X
          <input type="number" className="grid-param" id="grid-sizeX"
            value={squaresX} onChange={(e) => updateSquaresX(parseInt(e.target.value))}/>
        </label>
        <label htmlFor="grid-sizeY">Cases sur l'axe Y
          <input type="number" className="grid-param" id="grid-sizeY"
            value={squaresY} onChange={(e) => updateSquaresY(parseInt(e.target.value))}/>
        </label>
      </div>

      <div className="grid-wrapper">
        <div className='grid-layout'>
          {hooverX}
          {hooverY}
          {hooverDir}
          <Canvas draw={draw} height={1000} width={1000}></Canvas>
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
              <button className="btn btn-action manual-btn" onClick={() => draw("D")}>Droite</button>
              <button className="btn btn-action manual-btn" onClick={() => draw("G")}>Gauche</button>
              <button className="btn btn-action manual-btn" onClick={() => draw("A")}>Avant</button>
            </div>
          </div>

        </div>
      </div>
    
    </div>
  );
}

export default App;