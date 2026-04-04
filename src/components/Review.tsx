import React, {useEffect, useRef, useState} from "react";
import { getScoreClass } from "../utils/Utils";
import {Box} from "@mui/joy";

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
        <Box style={{width: '36.5rem'}}>
            <Box className='review-header'>
                <div>
                    {gameReview.username}
                </div>
                {gameReview.userRating != undefined && (
                    <div className={getScoreClass(gameReview.userRating)}>
                        {gameReview.userRating}
                    </div>
                )}
            </Box>
            <Box className={`review-text ${expanded ? "expanded" : ""}`} ref={reviewTextRef}>
                {gameReview.review}
            </Box>
            {isOverflowing && (
                <button className='review-text-button' onClick={() => setExpanded(!expanded)}>
                    {expanded ? "Скрыть" : "Читать далее"}
                </button>
            )}
        </Box>
    );
    }

    export default Review