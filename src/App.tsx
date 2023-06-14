import React from 'react';
import './App.css';

import Canvas from './components/Canvas/Canvas';
import Switcher from './components/Switcher/Switcher';

function App() {
  return (
    <div className="App">
      
      <div className="grid-settings">
        <label htmlFor="grid-sizeX">Cases sur l'axe X</label>
        <input type="number" className="grid-param" id="grid-sizeX"/>
        <label htmlFor="grid-sizeY">Cases sur l'axe Y</label>
        <input type="number" className="grid-param" id="grid-sizeY"/>
        <button onClick={() => console.log('reload')}>Reload</button>
      </div>

      <div className="grid-wrapper">
        <div className='grid-layout'>
          <Canvas draw='' height={1000} width={1000} squaresX={10} squaresY={10}></Canvas>
        </div>

        <div className="grid-instructions">
          <h3 className="instructions-header">Instructions :</h3>
          
          <div className="switch-mode">
            <span className="mode">Manual</span>
            <Switcher></Switcher>
            <span className="mode">Auto</span>
          </div>

          <div className="instructions-card">
            <button className="btn btn-action instructions-btn" onClick={() => console.log('droite')}>Droite</button>
            <button className="btn btn-action instructions-btn" onClick={() => console.log('gauche')}>Gauche</button>
            <button className="btn btn-action instructions-btn" onClick={() => console.log('avancer')}>Avancer</button>
          </div>

        </div>
      </div>
    
    </div>
  );
}

export default App;