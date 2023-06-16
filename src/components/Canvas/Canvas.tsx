import React, { useEffect, useRef } from 'react';
import './Canvas.scss';

interface CanvasProps {
    draw: any,
    height: number,
    width: number,
    squareSize: number
}

const Canvas = ({draw, height, width, squareSize}: CanvasProps) => {

    const canvas = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const context = canvas.current?.getContext('2d');

        if (context) {
            context.clearRect(0, 0, width, height)
            draw(context);
        }
    });

    return ( 
        <div className="canvas-wrapper">
            <canvas ref={canvas} height={height} width={width}>        
            </canvas>
        </div>
    )
}

export default Canvas;