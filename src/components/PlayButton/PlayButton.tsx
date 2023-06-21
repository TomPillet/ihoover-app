import { FC } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import LoaderSVG from '../LoaderSVG/LoaderSVG';

import './PlayButton.scss';

interface PlayButtonProps {
    loading: boolean,
    onClick: any,
}
 
const PlayButton: FC<PlayButtonProps> = ({onClick, loading}) => {
    return ( 
        <button className='btn btn-valid' onClick={() => onClick()}>
            <FontAwesomeIcon style={{display: (loading) ? 'none' : 'inline-block'}} icon={faPlay}></FontAwesomeIcon>
            <LoaderSVG display={(loading) ? 'inline-block' : 'none'}></LoaderSVG>
        </button>
     );
}
 
export default PlayButton;