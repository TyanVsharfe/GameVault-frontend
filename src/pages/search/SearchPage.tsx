import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Alert, Badge, Form, Spinner, Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import {igdbGamesService} from "../../api/services/igdbGamesService";
import {useNavigate, useSearchParams} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import "../../assets/styles/game-card.css"
import {useTranslation} from "react-i18next";
import {useTheme} from "next-themes";
import {IgdbGameList} from "../../components/game/list/IgdbGameList";

function SearchPage() {
    const { t } = useTranslation();
    const { theme } = useTheme();

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

        if (searchQuery !== null && searchQuery !== "") {
            setIsLoading(true);
            igdbGamesService.getIdgbGames(searchQuery).then(results => {
                setSearchResults([]);
                setSearchResults(results);
                setIsLoading(false);
            });
        }
    }, [searchParams]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (filter === "") {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
        }
        else {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}&filter=${encodeURIComponent(filter)}`);
        }
    };

    const renderSearchResults = () => {
        const games = searchResults;
        console.log("render search results");
        console.log(games);
        if (Array.isArray(games) && games.length > 0) {
            return (
                <IgdbGameList games={games}/>
            )
        }
        else if(searchParams.get("q") != null) {
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
                {/*<h2 className='page-title'>{searchParams.get("q") == null ? t('search') : t('result')}</h2>*/}
                <Container style={{textAlign: "center", width: '35rem', paddingBottom: "10px"}}>
                    <Form className="mb-4 w-100" style={{maxWidth: "600px"}} onSubmit={handleSubmit}>
                        <Row className="justify-content-center g-2 mt-2">
                            <Col xs="auto" className="mx-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Введите поисковый запрос..."
                                    value={searchTerm}
                                    onChange={(e) => setsearchTerm(e.target.value)}
                                    style={{width: '250px'}}
                                    data-bs-theme={`${theme === 'light' ? 'light' : 'dark'}`}
                                />
                            </Col>
                            <Col xs="auto" className="mx-2">
                                <Button variant="primary" type="submit">
                                    {t('search')}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
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

export default SearchPage;