import { FC, useEffect, useState } from 'react';

import './FeedbackModal.scss';

interface FeedbackModalProps {
    msg: string;
    type: string;
}
 
const FeedbackModal: FC<FeedbackModalProps> = ({msg, type}) => {
    const [isDisplayed, setIsDisplayed] = useState(false);

    const reset = () => {
        setIsDisplayed(false);
        msg = "";
    }

    useEffect(() => {
        if (msg.length > 0) {
            setIsDisplayed(true);
        }
    }, [msg])

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