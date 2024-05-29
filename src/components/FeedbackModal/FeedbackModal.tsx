import { FC, useCallback, useEffect, useRef, useState } from 'react';

import './FeedbackModal.scss';

interface FeedbackModalProps {
    modalClosed: () => void;
    msg: string;
    type: string;
}
 
const FeedbackModal: FC<FeedbackModalProps> = ({modalClosed, msg, type}) => {
    const [isModalDisplayed, setIsModalDisplayed] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    

    const closeModal = useCallback(() => {
        setIsModalDisplayed(false);
        modalClosed();
    }, [modalClosed]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                closeModal();
            }
        }

        if (msg.length > 0) {
            setIsModalDisplayed(true);
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [msg, isModalDisplayed, closeModal])

    
    return (
        <div className="feedback-modal" style={{display: (isModalDisplayed) ? 'flex' : "none"}} ref={modalRef}>
            <div className="feedback-msg">{msg}</div>
            <div className="feedback-buttons">
                <button onClick={() => closeModal()} className={type}>{(type==="success" ? "OK" : "CLOSE")}</button>
            </div>
        </div>
    );
}
 
export default FeedbackModal;