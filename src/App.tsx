import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import './App.scss';

import Canvas from './components/Canvas/Canvas';
import ToggleSwitcher from './components/ToggleSwitcher/ToggleSwitcher';

function App() {
  const [useScript, setUseScript] = useState(false);

  const toggleScript = (toggleData: boolean) => {
    setUseScript(toggleData);
  }

  return (
    <div className="App">
      
      <div className="grid-settings">
        <label htmlFor="grid-sizeX">Cases sur l'axe X
          <input type="number" className="grid-param" id="grid-sizeX"/>
        </label>
        <label htmlFor="grid-sizeY">Cases sur l'axe Y
          <input type="number" className="grid-param" id="grid-sizeY"/>
        </label>
        <button className='btn btn-valid' onClick={() => console.log('reload')}>Reload</button>
      </div>

      <div className="grid-wrapper">
        <div className='grid-layout'>
          <Canvas draw='' height={1000} width={1000} squaresX={10} squaresY={10}></Canvas>
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
              <button className="btn btn-action manual-btn" onClick={() => console.log('droite')}>Droite</button>
              <button className="btn btn-action manual-btn" onClick={() => console.log('gauche')}>Gauche</button>
              <button className="btn btn-action manual-btn" onClick={() => console.log('avancer')}>Avant</button>
            </div>
          </div>

        </div>
      </div>
    
    </div>
  );
}

export default App;