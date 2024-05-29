import { useState } from 'react';
import './App.scss';

import HooverCanvas from './components/HooverGrid/HooverCanvas';
import FeedbackModal from './components/FeedbackModal/FeedbackModal';

function App() {
  const squareSize = 100;
  const [squaresX, setSquaresX] = useState(10);
  const [squaresY, setSquaresY] = useState(10);

  const updateSquaresX = (value: number) => {
    setSquaresX((value) ? value : 1);
  }
  const updateSquaresY = (value: number) => {
    setSquaresY((value) ? value : 1);
  }

  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  const hooverFeedback = (msg: string, type: string) => {
    setFeedbackMsg(msg);
    setFeedbackType(type);
  }

  return (
    <div className="App">
      
      <div className="grid-settings">
        <label htmlFor="grid-sizeX">Cases sur l'axe X
          <input min="1" type="number" className="input-number grid-param" id="grid-sizeX"
            value={squaresX} onChange={(e) => updateSquaresX(parseInt(e.target.value))}/>
        </label>
        <label htmlFor="grid-sizeY">Cases sur l'axe Y
          <input min="1" type="number" className="input-number grid-param" id="grid-sizeY"
            value={squaresY} onChange={(e) => updateSquaresY(parseInt(e.target.value))}/>
        </label>
      </div>

      <HooverCanvas hooverFeedback={hooverFeedback} canvasHeight={squaresX*squareSize} canvasWidth={squaresY*squareSize} squaresX={squaresX} squaresY={squaresY} squareSize={squareSize} animationSpeed={200}></HooverCanvas>
      <FeedbackModal msg={feedbackMsg} type={feedbackType}></FeedbackModal>
    </div>
  );
}

export default App;