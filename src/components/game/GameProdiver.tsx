import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';

interface GameContextType {
    userRating: number | undefined;
    gameStatus: string | undefined;
    setUserRating: (rating: number | undefined) => void;
    setGameStatus: (status: string | undefined) => void;
}

interface GameProviderProps {
    children: ReactNode;
    initialStatus?: string;
    initialUserRating?: number;
}

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameContext must be used within a GameProvider");
    }
    return context;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<GameProviderProps> = ({ children, initialStatus, initialUserRating }) => {
    const [gameStatus, setGameStatus] = useState<string | undefined>(initialStatus);
    const [userRating, setUserRating] = useState<number | undefined>(initialUserRating);

    useEffect(() => {
        setUserRating(initialUserRating);
        setGameStatus(initialStatus);
        console.log("INIT " + initialStatus, " ", initialUserRating);
    }, [initialUserRating, initialStatus]);

    return (
        <GameContext.Provider value={{ userRating, gameStatus, setUserRating, setGameStatus }}>
            {children}
        </GameContext.Provider>
    );
};
