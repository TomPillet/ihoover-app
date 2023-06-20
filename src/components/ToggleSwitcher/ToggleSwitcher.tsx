import { FC } from 'react';
import './ToggleSwitcher.css';

interface ToggleSwitcherProps {
    toggler: any
}
 
const ToggleSwitcher: FC<ToggleSwitcherProps> = ({toggler}) => {

    return ( 
        <label className="switch">
            <input type="checkbox" onChange={() => toggler()}/>
            <span className="slider"></span>
        </label>
     );
}
 
export default ToggleSwitcher;