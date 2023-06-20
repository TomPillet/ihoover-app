import { FC } from 'react';

import './LoaderSVG.scss';

interface LoaderSVGProps {
    display: string
}
 
const LoaderSVG: FC<LoaderSVGProps> = ({display}) => {
    return (
        <svg id="loader" style={{display: display}} viewBox="25 25 50 50">
            <circle r="20" cy="50" cx="50"></circle>
        </svg>
    );
}
 
export default LoaderSVG;