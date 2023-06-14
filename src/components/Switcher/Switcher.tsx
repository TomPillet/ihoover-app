import React, { FC } from 'react';
import './Switcher.css';

interface SwitcherProps {
    
}
 
const Switcher: FC<SwitcherProps> = () => {
    return ( 
        <label className="switch">
            <input type="checkbox"/>
            <span className="slider"></span>
        </label>
     );
}
 
export default Switcher;