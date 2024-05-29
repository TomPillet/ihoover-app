import { useState } from 'react';
import './App.scss';

import HooverCanvas from './components/HooverGrid/HooverCanvas';
import FeedbackModal from './components/FeedbackModal/FeedbackModal';

function App() {
  const squareSize = 100;
  const [squaresX, setSquaresX] = useState(10);
  const [squaresY, setSquaresY] = useState(10);

  function updateSquaresX (value: number) {
    setSquaresX((value) ? value : 1);
  }
  function updateSquaresY (value: number) {
    setSquaresY((value) ? value : 1);
  }

  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [feedbackType, setFeedbackType] = useState("");

  function hooverFeedback (msg: string, type: string) {
    setFeedbackMsg(msg);
    setFeedbackType(type);
  }
  function resetFeedback () {
    setFeedbackMsg("");
    setFeedbackType("");
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

      <p className='tips'>For better experience, use arrows up and down to edit inputs values.</p>

      <HooverCanvas hooverFeedback={hooverFeedback} canvasHeight={squaresY*squareSize} canvasWidth={squaresX*squareSize} squaresX={squaresX} squaresY={squaresY} squareSize={squareSize} animationSpeed={200}></HooverCanvas>
      <FeedbackModal modalClosed={resetFeedback} msg={feedbackMsg} type={feedbackType}></FeedbackModal>
    </div>
  );
}

export default App;