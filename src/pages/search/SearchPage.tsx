import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Alert, Badge, Spinner, Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import {getIdgbGames} from "../../services/igdbGamesService";
import {useNavigate, useSearchParams} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import "../../assets/styles/game-card.css"
import IgdbGameList from "../../components/game/list/IgdbGameList";
import {useTranslation} from "react-i18next";

function SearchPage() {
    const { t } = useTranslation();

    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const [searchTerm, setsearchTerm] = useState("");
    const [filter, setFilter] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState<string>("");

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const searchQuery = searchParams.get("q");
        const savedFilter = searchParams.get("filter") || "";

        setsearchTerm(searchQuery || "");
        setFilter(savedFilter);
        console.log("search query:", searchQuery);

        if (searchQuery !== null && searchQuery !== "") {
            console.log("search query:!!!!!!!!!!!", searchQuery);
            setIsLoading(true);
            getIdgbGames(searchQuery).then(results => {
                setSearchResults([]);
                console.log(results);
                setSearchResults(results);
                setIsLoading(false);
            });
        }
    }, [searchParams]);

    const renderSearchResults = () => {
        const games = searchResults;
        console.log("render search results");
        console.log(games);
        if (Array.isArray(games) && games.length > 0) {
            return (
                <IgdbGameList games={games} gamesPerPage={15}/>
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
                <h2 className='page-title'>{t('result')}</h2>
                <Row className="flex-wrap" style={{ display: 'flex', alignItems: 'flex-end' }} gap="4">
                    {isLoading ? (
                        <Container style={{display: "flex", justifyContent: "center", paddingBottom: '20px'}}>
                            <Spinner animation="border" variant="primary" />
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

export default SearchPage;