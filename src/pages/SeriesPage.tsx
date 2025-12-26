import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Alert, Spinner, Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import "../assets/styles/game-card.css"
import {useTranslation} from "react-i18next";
import {igdbGamesService} from "../api/services/igdbGamesService";
import {IgdbGameList} from "../components/game/list/IgdbGameList";

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
                <Container style={{textAlign: "center", maxWidth: "500px"}}>
                    <Alert>{t('not_found')}</Alert>
                </Container>
            )
        }
    };

    return (
        <Container>
            <Stack className=".d-flex justify-content-center align-items-center">
                <Container style={{textAlign: "center", width: '35rem', paddingBottom: "10px"}}>
                    {searchResults[0]?.name != null && (
                        <h2 className='page-title' style={{justifyContent: 'flex-start'}}>
                            {`${t('series')}: ${searchResults[0].name}`}
                        </h2>)
                    }
                </Container>
                <Row className="flex-wrap" style={{display: 'flex', alignItems: 'flex-end'}} gap="4">
                    {isLoading ? (
                        <Container style={{display: "flex", justifyContent: "center", paddingBottom: '20px'}}>
                            <Spinner animation="border" variant="primary"/>
                        </Container>
                    ) : (
                        <Container className="justify-content-start align-items-center">
                            {renderSearchResults()}
                            {/*<SearhResult searchResults={searchResults}/>*/}
                        </Container>
                    )}
                </Row>
            </Stack>
        </Container>
    );
}

export default SeriesPage;