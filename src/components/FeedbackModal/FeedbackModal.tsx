import { FC, useEffect, useState } from 'react';

import './FeedbackModal.scss';

interface FeedbackModalProps {
    modalClosed: () => void;
    msg: string;
    type: string;
}
 
const FeedbackModal: FC<FeedbackModalProps> = ({modalClosed, msg, type}) => {
    const [isDisplayed, setIsDisplayed] = useState(false);

    function reset () {
        setIsDisplayed(false);
        modalClosed();
    }

    useEffect(() => {
        if (msg.length > 0) {
            setIsDisplayed(true);
        }
    }, [msg, isDisplayed])

    return (
        <div className="feedback-modal" style={{display: (isDisplayed) ? 'flex' : "none"}}>
            <div className="feedback-msg">{msg}</div>
            <div className="feedback-buttons">
                <button onClick={() => reset()} className={type}>{(type==="success" ? "OK" : "CLOSE")}</button>
            </div>
        </div>
    );
}
 
export default FeedbackModal;