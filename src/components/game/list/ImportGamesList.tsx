import React, {useState} from "react";
import {ImportedSteamGame} from "../../../api/services/steamGamesService";
import "../../../assets/styles/style.css"
import "../../../assets/styles/game-card.css"
import {useTranslation} from "react-i18next";
import {useMediaQuery} from "react-responsive";
import ImportGameCard from "../card/ImportGameCard";
import BaseList from "./BaseList";

interface ImportGamesListProps {
    importGames: ImportedSteamGame[];
    onSwitchChange: (event: number[]) => void;
    gamesPerPage?: number;
}

function ImportGamesList({importGames, onSwitchChange, gamesPerPage = 12}: ImportGamesListProps) {
    const is1650pxScreen = useMediaQuery({ maxWidth: 1590 });
    gamesPerPage = !is1650pxScreen ? 12 : 10;

    const { t } = useTranslation();

    const [gameStates, setGameStates] = useState(
        Array.isArray(importGames) ? importGames.map(game => ({ ...game, isChecked: game.isChecked ?? false })) : []
    );

    const handleSwitchChange = (gameId) => {
        const updatedStates = gameStates.map(game =>
            game.id === gameId ? { ...game, isChecked: !game.isChecked } : game
        );
        setGameStates(updatedStates);
        onSwitchChange(updatedStates.filter(game => game.isChecked).map(game => game.id));
    };

    return (
        <BaseList
            items={importGames}
            itemsPerPage={gamesPerPage}
            filterItem={(game) => game.cover != null}
            renderItem={(game) => (
                <ImportGameCard game={game}
                                t={t}
                                onSwitchChange={handleSwitchChange}/>
            )}
            containerClassName={"justify-content-center align-items-center import-games-list"}
            rowClassName={"justify-content-center"}
        />
    );
}

export default ImportGamesList;