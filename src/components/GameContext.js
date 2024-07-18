import React, { createContext, useState } from 'react';

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
    const [userRating, setUserRating] = useState(undefined);
    const [gameStatus, setGameStatus] = useState(undefined);

    return (
        <GameContext.Provider value={{ userRating, setUserRating, gameStatus, setGameStatus }}>
            {children}
        </GameContext.Provider>
    );
};
