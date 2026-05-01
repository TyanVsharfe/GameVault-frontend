import React, {useEffect, useState} from "react";
import {igdbGamesService} from "../../api/services/igdbGamesService";
import {useNavigate, useSearchParams} from "react-router-dom";
import "../../assets/styles/game-card.css"
import {useTranslation} from "react-i18next";
import {useTheme} from "next-themes";
import {EnrichedIgdbGameList} from "../../components/game/list/EnrichedIgdbGameList";
import Select from "@mui/joy/Select";
import {Box, Button, buttonClasses, Card, CircularProgress, IconButton, Input, Option, Stack, ToggleButtonGroup} from "@mui/joy";
import IgdbGameEnhancedList from "../../components/game/list/IgdbGameEnhancedList";
import {SearchFilterModal} from "../../components/modal/SearchFilterModal";
import {Helmet} from "react-helmet-async";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from '@mui/icons-material/ViewList';
import {EnrichedGameSearch, enrichedGamesService} from "../../api/services/enrichedGamesService";

function SearchPage() {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState([]);
    const [enrichedSearchResults, setEnrichedSearchResults] = useState<EnrichedGameSearch[]>([]);
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
            enrichedGamesService.searchGames(searchQuery).then(results => {
                setEnrichedSearchResults([]);
                setEnrichedSearchResults(results);
                setIsLoading(false);
            });
        }
    }, [searchParams]);

    const updateGameStatus = (gameId: number, status: string) => {
        setEnrichedSearchResults(prev =>
            prev.map(game =>
                game.id === gameId
                    ? {
                        ...game,
                        userData: {
                            ...(game.userData ?? {}),
                            status,
                        },
                    }
                    : game
            )
        );
    };

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
        if (Array.isArray(games) && games.length > 0) {
            return (
                //<IgdbGameEnhancedList games={games} listType={listType}/>
                <EnrichedIgdbGameList games={enrichedSearchResults} listType={listType} onStatusChange={updateGameStatus}/>
            )
        }
        else if(searchParams.get("q") != null) {
            return (
                <Box style={{textAlign: "center", maxWidth: "500px"}}>
                    <Card>{t('not_found')}</Card>
                </Box>
            )
        }
    };

    return (
        <Box sx={{display: 'flex', justifyContent: 'center'}}>
            <Helmet>
                <title>{searchTerm == "" ? "Search" : searchTerm} | GameVault</title>
            </Helmet>
            <Stack
                style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
            >
                <Box style={{display: 'contents', textAlign: "center", width: '35rem', paddingBottom: "10px"}}>
                    <form style={{maxWidth: "600px", marginBottom: '0.25rem', width: '25rem'}} onSubmit={handleSubmit}>
                        <Stack direction="row" gap={2}
                               style={{justifyContent: 'center', marginTop: 2, gap: 2}}
                        >
                            <Input
                                type="text"
                                placeholder="Введите поисковый запрос..."
                                value={searchTerm}
                                onChange={(e) => setsearchTerm(e.target.value)}
                                style={{width: '250px'}}
                                data-bs-theme={`${theme === 'light' ? 'light' : 'dark'}`}
                            />
                            <Button type="submit">
                                {t('search')}
                            </Button>
                            {/*<Button onClick={() => setShowFilterModal(true)}>*/}
                            {/*    {t('search_filter')}*/}
                            {/*</Button>*/}
                            {/*<Col xs="auto" className="mx-2">*/}
                            {/*    <FormControl*/}
                            {/*        type="text"*/}
                            {/*        placeholder="Введите поисковый запрос..."*/}
                            {/*        value={searchTerm}*/}
                            {/*        onChange={(e) => setsearchTerm(e.target.value)}*/}
                            {/*        style={{width: '250px'}}*/}
                            {/*        data-bs-theme={`${theme === 'light' ? 'light' : 'dark'}`}*/}
                            {/*    />*/}
                            {/*</Col>*/}
                            {/*<Col xs="auto" className="mx-2">*/}
                            {/*    <Button variant="primary" type="submit">*/}
                            {/*        {t('search')}*/}
                            {/*    </Button>*/}
                            {/*    /!*<Button onClick={() => setShowFilterModal(true)}>*!/*/}
                            {/*    /!*    {t('search_filter')}*!/*/}
                            {/*    /!*</Button>*!/*/}
                            {/*</Col>*/}
                        </Stack>
                    </form>
                    <div style={{width: '15rem', display: 'flex', justifyContent: 'center', margin: 'auto', marginBottom: '0.75rem'}}>
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
                <Stack className="flex-wrap" style={{display: 'flex', alignItems: 'flex-end'}} gap="4">
                    {isLoading ? (
                        <Box style={{display: "flex", justifyContent: "center", paddingBottom: '20px'}}>
                            <CircularProgress/>
                        </Box>
                    ) : (
                        <Box
                             sx={{
                                 justifyContent: 'start',
                                 alignItems: 'center'
                             }}
                        >
                            {renderSearchResults()}
                            {/*<SearhResult searchResults={searchResults}/>*/}
                        </Box>
                    )}
                </Stack>

                <SearchFilterModal show={showFilterModal} handleClose={() => setShowFilterModal(false)}/>
            </Stack>
        </Box>
    );
}

export default SearchPage;