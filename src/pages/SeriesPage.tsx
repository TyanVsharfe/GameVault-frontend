import React, {useEffect, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import "../assets/styles/game-card.css"
import {useTranslation} from "react-i18next";
import {igdbGamesService} from "../api/services/igdbGamesService";
import {IgdbGameList} from "../components/game/list/IgdbGameList";
import {Card, CircularProgress, Stack} from "@mui/joy";

function SeriesPage() {
    const { t } = useTranslation();

    const seriesSlug = useParams<{ series: string }>();
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {

        if (seriesSlug.series !== null && seriesSlug.series !== "") {
            setIsLoading(true);
            igdbGamesService.getGameSeries(seriesSlug.series).then(results => {
                setSearchResults([]);
                setSearchResults(results);
                setIsLoading(false);
            });
        }
    }, [seriesSlug]);

    const renderSearchResults = () => {
        const games = searchResults;
        if (Array.isArray(games) && games.length > 0) {
            return (
                <IgdbGameList games={games[0].games} gamesPerPage={15}/>
            )
        }
        else {
            return (
                <div style={{textAlign: "center", maxWidth: "500px"}}>
                    <Card>{t('not_found')}</Card>
                </div>
            )
        }
    };

    return (
        <div>
            <Stack style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{textAlign: "start", width: '75rem', paddingBottom: "10px"}}>
                    {searchResults[0]?.name != null && (
                        <h2 className='page-title' style={{justifyContent: 'flex-start'}}>
                            {`${t('series')}: ${searchResults[0].name}`}
                        </h2>)
                    }
                </div>
                <Stack style={{display: 'flex', alignItems: 'flex-end'}} gap="4">
                    {isLoading ? (
                        <div style={{display: "flex", justifyContent: "center", paddingBottom: '20px'}}>
                            <CircularProgress/>
                        </div>
                    ) : (
                        <div>
                            {renderSearchResults()}
                            {/*<SearhResult searchResults={searchResults}/>*/}
                        </div>
                    )}
                </Stack>
            </Stack>
        </div>
    );
}

export default SeriesPage;