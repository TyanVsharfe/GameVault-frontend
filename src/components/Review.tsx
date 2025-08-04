import React, {useEffect, useRef, useState} from "react";
import { Container } from "react-bootstrap";
import { getScoreClass } from "../utils/Utils";

export interface ReviewProps {
    gameReview: GameReview;
}

export interface GameReview {
    id: number;
    username: string;
    review: string;
    userRating: number;
}

const Review: React.FC<ReviewProps> = ({ gameReview }) => {
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const reviewTextRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (reviewTextRef.current) {
            const isTextOverflowing = reviewTextRef.current.scrollHeight > reviewTextRef.current.clientHeight;
            setIsOverflowing(isTextOverflowing);
        }
    }, [gameReview.review]);

    return (
        <Container style={{width: '30rem', maxHeight: '20rem'}} className='review'>
    <Container className='review-header'>
        <div>{gameReview.username}</div>
    {gameReview.userRating != undefined &&
    <div className={getScoreClass(gameReview.userRating)}>{gameReview.userRating}</div>}
    </Container>
    <Container className={`review-text ${expanded ? "expanded" : ""}`} ref={reviewTextRef}>
        {gameReview.review}
        </Container>
        {isOverflowing && (
            <button className='review-text-button' onClick={() => setExpanded(!expanded)}>
            {expanded ? "Скрыть" : "Читать далее"}
            </button>
        )}
        </Container>
    );
    }

    export default Review