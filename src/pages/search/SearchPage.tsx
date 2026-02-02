import React, {useEffect, useState} from "react";
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
import Select from "@mui/joy/Select";
import {Box, buttonClasses, IconButton, Option, ToggleButtonGroup} from "@mui/joy";
import IgdbGameEnhancedList from "../../components/game/list/IgdbGameEnhancedList";
import {SearchFilterModal} from "../../components/modal/SearchFilterModal";
import {Helmet} from "react-helmet-async";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from '@mui/icons-material/ViewList';

function SearchPage() {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    const [ showFilterModal, setShowFilterModal ] = useState(false);
    const [listType, setListType] = useState('0');

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
                // <IgdbGameList games={games}/>
                <IgdbGameEnhancedList games={games} listType={listType}/>
            )
        }
        else if(searchParams.get("q") != null) {
            return (
                <Box style={{textAlign: "center", maxWidth: "500px"}}>
                    <Alert>{t('not_found')}</Alert>
                </Box>
            )
        }
    };

    return (
        <Box>
            <Helmet>
                <title>{searchTerm == "" ? "Search" : searchTerm} | GameVault</title>
            </Helmet>
            <Stack className=".d-flex justify-content-center align-items-center">
                {/*<h2 className='page-title'>{searchParams.get("q") == null ? t('search') : t('result')}</h2>*/}
                <Box style={{textAlign: "center", width: '35rem', paddingBottom: "10px"}}>
                    <Form className="mb-2 w-100" style={{maxWidth: "600px"}} onSubmit={handleSubmit}>
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
                                {/*<Button onClick={() => setShowFilterModal(true)}>*/}
                                {/*    {t('search_filter')}*/}
                                {/*</Button>*/}
                            </Col>
                        </Row>
                    </Form>
                    <div style={{width: '15rem', display: 'flex', justifyContent: 'center', margin: 'auto'}}>
                        <ToggleButtonGroup
                            sx={{
                                display: 'flex',

                                [`& .${buttonClasses.root}[aria-pressed="true"]`]: {
                                    bgcolor: theme === 'dark' ? 'neutral.700' : 'background.surface',
                                    color: theme === 'dark' ? 'white' : 'black',
                                },

                                [`& .${buttonClasses.root}:hover`]: {
                                    bgcolor: theme === 'dark' ? 'neutral.600' : 'neutral.200',
                                    color: theme === 'dark' ? 'white' : 'black',
                                },
                            }}
                        >
                            <IconButton
                                style={{color: theme === 'dark' ? 'white' : 'black'}}
                                sx={{
                                    width: '2rem',
                                    height: '2rem',
                                    alignItems: 'center',
                                }}
                                onClick={() => {
                                    setListType('0')
                                }}>
                                <ViewModuleIcon/>
                            </IconButton>
                            <IconButton
                                style={{color: theme === 'dark' ? 'white' : 'black'}}
                                sx={{
                                    width: '2rem',
                                    height: '2rem',
                                    alignItems: 'center',
                                }}
                                onClick={() => {
                                    setListType('1')
                                }}>
                                <ViewListIcon/>
                            </IconButton>
                        </ToggleButtonGroup>
                    </div>
                </Box>
                <Row className="flex-wrap" style={{display: 'flex', alignItems: 'flex-end'}} gap="4">
                    {isLoading ? (
                        <Box style={{display: "flex", justifyContent: "center", paddingBottom: '20px'}}>
                            <Spinner animation="border" variant="primary"/>
                        </Box>
                    ) : (
                        <Box className="justify-content-start align-items-center">
                            {renderSearchResults()}
                            {/*<SearhResult searchResults={searchResults}/>*/}
                        </Box>
                    )}
                </Row>

                <SearchFilterModal show={showFilterModal} handleClose={() => setShowFilterModal(false)}/>
            </Stack>
        </Box>
    );
}

export default SearchPage;