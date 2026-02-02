import { useTranslation } from "react-i18next";
import BaseList from "./BaseList";
import IgdbGameCard from "../card/IgdbGameCard";
import {IgdbGame} from "../../../types/igdb.game.types";

export const IgdbGameList: React.FC<{ games: IgdbGame[] }> = ({ games }) => {
    const { t } = useTranslation();

    return (
        <BaseList
            items={games}
            itemsPerPage={12}
            filterItem={(game) => game.cover?.url != null}
            renderItem={(game) => (
                <IgdbGameCard
                    game={game}
                    t={t}
                />
            )}
        />
    );
};