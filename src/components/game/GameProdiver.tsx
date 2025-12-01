import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import { UserMode } from '../../services/userGamesService';

interface GameContextType {
    userRating: number | undefined;
    gameStatus: string | undefined;
    userModes: UserMode[] | undefined;

    setUserRating: (rating: number | undefined) => void;
    setGameStatus: (status: string | undefined) => void;
    setUserModes: (modes: UserMode[] | undefined) => void;
}

interface GameProviderProps {
    children: ReactNode;
    initialStatus?: string;
    initialUserRating?: number;
    initialUserModes: UserMode[] | undefined;
}

export const useGameContext = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error("useGameContext must be used within a GameProvider");
    }
    return context;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<GameProviderProps> = ({ children, initialStatus, initialUserRating, initialUserModes }) => {
    const [gameStatus, setGameStatus] = useState<string | undefined>(initialStatus);
    const [userRating, setUserRating] = useState<number | undefined>(initialUserRating);
    const [userModes, setUserModes] = useState<UserMode[] | undefined>(initialUserModes);

    useEffect(() => {
        setUserRating(initialUserRating);
        setGameStatus(initialStatus);
        setUserModes(initialUserModes ?? undefined);
        console.log("INIT " + initialStatus, " ", initialUserRating);
    }, [initialUserRating, initialStatus]);

    return (
        <GameContext.Provider value={{ userRating, gameStatus, userModes, setUserRating, setGameStatus, setUserModes }}>
            {children}
        </GameContext.Provider>
    );
};
