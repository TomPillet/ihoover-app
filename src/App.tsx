import { useState } from 'react';
import './App.scss';

import HooverCanvas from './components/HooverGrid/HooverCanvas';

function App() {
  const [squaresX, setSquaresX] = useState(11);
  const [squaresY, setSquaresY] = useState(11);

  const updateSquaresX = (value: number | 0) => {
    setSquaresX((value) ? value : 1);
  }
  const updateSquaresY = (value: number | 0) => {
    setSquaresY((value) ? value : 1);
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

      <HooverCanvas squaresX={squaresX} squaresY={squaresY}></HooverCanvas>
    </div>
  );
}

export default App;