import React, {useState, useEffect, useRef, useMemo} from 'react';
import GameControls from "../../components/game/GameControls";
import NotesModal from "../../components/modal/NotesModal";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';
import GameSwiper from "../../components/game/list/GameSwiper";
import {igdbGamesService} from "../../api/services/igdbGamesService";
import {userGameService} from "../../api/services/userGamesService";
import "../../assets/styles/game-card.css"
import "../../assets/styles/review.css"
import {CategoryIGDB, getCategoryName} from "../../utils/Enums";
import {GameProvider} from "../../components/game/provider/GameProdiver";
import {
    AspectRatio,
    Box, Breadcrumbs,
    Card,
    CardContent,
    CardOverflow,
    Checkbox,
    Chip,
    Divider, FormHelperText, Input,
    Link,
    Modal, ModalClose,
    ModalDialog, Sheet,
    Skeleton,
    Stack, Textarea,
    Typography
} from "@mui/joy";
import Review, { GameReview } from '../../components/Review';
import {formatRelative, getRatingColor, statusColors} from "../../utils/Utils";
import {useTranslation} from "react-i18next";

import {Button} from "@mui/joy";
import Accordion, { accordionClasses } from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionSummary from '@mui/joy/AccordionSummary';
import {PlatformBadge} from "../../components/game/badge/PlatformBadge";
import {useTheme} from "next-themes";
import {userGameListService} from "../../api/services/userGameListService";
import useSWR from "swr";
import {IgdbGame, Platform, Series} from '../../types/igdb.game.types';
import {UserGameList} from "../../types/user.game.list.types";
import {UserGame} from "../../types/user.game.types";
import {useSelector} from "react-redux";
import {RootState} from "../../store/store";
import { PageResponse } from '../../types/types';
import {Helmet} from "react-helmet-async";
import { Note } from "../../api/services/noteService";
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import DescriptionIcon from '@mui/icons-material/Description';
import FormControl from "@mui/joy/FormControl";

function GamePage() {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const { isLogin } = useSelector((state: RootState) => state.auth);

    const [gameData, setGameData] = useState<IgdbGame>();
    const [uGameData, setUGameData] = useState<UserGame>();
    const [gameReviews, setGameReviews] = useState<GameReview[]>([]);

    const [gameStatus, setGameStatus] = useState(false);
    const { id: igdbId } = useParams<{ id: string }>();
    const [reviewContent, setReviewContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showUserReview, setShowUserReview] = useState(false);
    const [showUserReviews, setShowUserReviews] = useState(false);
    const [showUserNotes, setShowUserNotes] = useState(false);
    const [showUserLists, setShowUserLists] = useState(false);

    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [backgroundHeight, setBackgroundHeight] = useState(0);
    const [backgroundWidth, setBackgroundWidth] = useState(0);

    const descriptionTextRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleCloseUsersReview = () => setShowUserReviews(false);
    const handleShowUsersReview = () => setShowUserReviews(true);
    const handleCloseUserReview = () => setShowUserReview(false);
    const handleShowUserReview = () => setShowUserReview(true);
    const handleCloseUserNotes = () => setShowUserNotes(false);
    const handleShowUserNotes = () => setShowUserNotes(true);
    const reviewContentChange = (e) => setReviewContent(e.target.value);

    const reviewsWithScores = gameReviews != undefined ? gameReviews?.filter?.(review => review.userRating !== null) : [];

    const completedDlcCount = useMemo(() => {
        if (!uGameData) return 0;

        const completedDlcs = gameData?.dlcs?.filter(dlc =>
            uGameData.dlcs?.find(d => ((d.game.igdbId === dlc.id) && (d.status == "completed"))
        )).length ?? 0;

        const completedExpansions = gameData?.expansions?.filter(exp =>
            uGameData.dlcs?.find(e => ((e.game.igdbId === exp.id) && (e.status == "completed"))
        )).length ?? 0;

        return completedDlcs + completedExpansions;
    }, [uGameData?.dlcs, uGameData?.expansions, gameData?.dlcs, gameData?.expansions]);

    const averageScore = reviewsWithScores?.length > 0
        ? Math.round(reviewsWithScores.reduce((acc, review) => acc + review.userRating, 0) / reviewsWithScores.length)
        : 0;

    const [currentPage, setCurrentPage] = useState(1);
    const url = userGameListService.buildUserGameListsUrl(currentPage - 1, 20);
    const { data: gameListData, error: gameListError, isLoading: gameListIsLoading } = useSWR<PageResponse<UserGameList>>(
        isLogin ? url : null,
        userGameListService.fetchUserGameLists,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 2000,
        }
    );

    const formatter = new Intl.DateTimeFormat(i18n.language, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        // hour: '2-digit',
        // minute: '2-digit'
    });

    const [selectedListsToAdd, setselectedListsToAdd] = useState<Set<string>>(new Set());
    const handleCheckboxChange = (listId: string, isChecked: boolean) => {
        setselectedListsToAdd(prev => {
            const newSet = new Set(prev);
            if (isChecked) {
                newSet.add(listId);
            } else {
                newSet.delete(listId);
            }
            return newSet;
        });
    };

    const sortedNotes = useMemo(() => {
        const notes = uGameData?.notes ?? [];

        return [...notes].sort((a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
    }, [uGameData?.notes]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const status = await userGameService.checkEntity(igdbId)
                setGameStatus(status);

                const response = await igdbGamesService.getIdgbGame(igdbId);

                if (!response) {
                    console.error('No data received from API');
                    return;
                }

                console.log(response)

                if (status) {
                    const uResponse = await userGameService.getUserGame(igdbId);
                    console.log("User game data");
                    console.log(uResponse);
                    setUGameData(uResponse);
                    if (uResponse.review != undefined) {
                        setReviewContent(uResponse.review)
                    }
                }

                await userGameService.getGameReviews(igdbId).then(data => {
                    Array.isArray(data) ? setGameReviews(data) : setGameReviews([])
                });

                setGameData(response);

                if (cardRef.current) {
                    setBackgroundHeight(cardRef.current.offsetHeight + 20);
                }
            } catch (error) {
                console.error('Error fetching game data:', error);
            }
            console.log(gameData);
            setIsLoading(false);
        };

        fetchData();
    }, [igdbId]);

    useEffect(() => {
        if (!gameData || !descriptionTextRef.current) return;

        requestAnimationFrame(() => {
            const el = descriptionTextRef.current!;
            setIsOverflowing(el.scrollHeight > el.clientHeight);
        });
    }, [gameData, expanded]);

    useEffect(() => {
        if (cardRef.current) {
            setBackgroundHeight(cardRef.current.offsetHeight + 20);
        }
    }, [gameStatus]);

    function checkDlc(id: number) {
        console.log(id);
        if (!uGameData?.dlcs) return 'neutral';
        return uGameData.dlcs.find(d => d.game.igdbId === id && d.status == 'completed') ? 'success' : 'neutral';
    }

    return (
        <Stack direction="column"
               sx={{
                   display: 'flex',
                   justifyContent: 'flex-start',
                   maxWidth: '1200px',
                   margin: '0 auto',
                   width: '100%',
                   alignItems: 'flex-start',
               }}
        >
            <Helmet>
                <title>{uGameData?.game?.title ? `${uGameData?.game?.title} | `: ''} GameVault</title>
            </Helmet>
            <Breadcrumbs aria-label="breadcrumbs" sx={{padding: '0 0 1rem 0'}}>
                <Link variant="plain" color="neutral" component={RouterLink} to='/account/games'>
                    <Typography fontWeight="md">
                        {t('user_games')}
                    </Typography>
                </Link>
                <Typography fontWeight="xl">{gameData?.name}</Typography>
            </Breadcrumbs>
            <GameProvider initialStatus={uGameData?.status} initialUserRating={uGameData?.userRating} initialUserModes={uGameData?.userModes}>

                <Stack direction="row"
                       sx={{
                           maxWidth: '1200px',
                           margin: '0 auto',
                           width: '100%',
                           alignItems: 'flex-start',
                           justifyContent: 'center',
                       }}
                       gap={5}>
                    {/*<div*/}
                    {/*    className='game-page__background'*/}
                    {/*    style={{*/}
                    {/*        ...(gameData?.cover?.url && {*/}
                    {/*                backgroundImage: `url(${gameData.cover.url.replace('t_thumb', 't_cover_big')})`,*/}
                    {/*            }),*/}
                    {/*        height: `${backgroundHeight}px`,*/}
                    {/*        top: `${gameStatus ? 42 : 35}%`,*/}
                    {/*    }}*/}
                    {/*/>*/}
                    <Stack direction="column" spacing={2} ref={cardRef} style={{display: 'flex', gap: '1rem'}}>
                        <AspectRatio ratio="3/4" style={{width: '18rem', border: '0px', borderRadius: '0.25rem'}} className="text-center"
                                     sx={{
                                         transition: 'transform 0.2s ease-in-out',
                                         '&:hover': {
                                             transform: 'translateY(-5px) scale(1.01)',
                                             boxShadow: 'md',
                                         },
                                     }}
                        >
                            {isLoading ? (
                                <Skeleton variant="rectangular" width="100%" height='17rem'/>
                            ) : (
                                <CardOverflow>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 5,
                                            right: 5,
                                            px: 1.5,

                                            borderRadius: "0.25rem",
                                            backgroundColor: "rgba(0,0,0,0.35)",
                                            backdropFilter: "blur(4px)",
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.4)",

                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            textAlign: "center",
                                            zIndex: 2,
                                        }}
                                    >
                                        <Typography
                                            level="body-md"
                                            sx={{
                                                color: "#fff",
                                                fontWeight: 700,
                                                fontSize: `0.95rem`,
                                                textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                                            }}
                                        >
                                            {t(`${getCategoryName(gameData?.game_type?.id)}`)}
                                        </Typography>
                                    </Box>
                                    <img
                                        variant="top"
                                        alt={gameData?.name}
                                        src={gameData?.cover?.url?.replace('t_thumb', 't_1080p') || ''}
                                    />
                                </CardOverflow>
                            )}
                        </AspectRatio>

                        <Card style={{width: '18rem', margin: '0'}} className="text-start">
                            <CardContent>
                                <Typography level="title-md"
                                            sx={{
                                                textTransform: 'uppercase',
                                                fontWeight: '700',
                                                marginBottom: '0.1rem'
                                            }}
                                >
                                    {t('play_status')}
                                </Typography>

                                {isLoading ? (
                                    <Skeleton variant="rectangular" width='100%' height='5rem'
                                              sx={{mx: 'auto', borderRadius: 1}}/>
                                ) : (gameStatus) ? (
                                    <GameControls gameModes={uGameData?.userModes ?? gameData?.game_modes}
                                                  isOverallRating={uGameData?.overallRating ?? true}
                                                  isOverallStatus={uGameData?.overallStatus ?? true}
                                                  status={uGameData?.status}

                                    />
                                ) : (gameData?.game_modes != null
                                        ? (
                                            <Button
                                                type="button"
                                                onClick={() => {
                                                    if (isLogin) {
                                                        userGameService.addUserGame(igdbId).then(() => {
                                                            setGameStatus(true);
                                                        });
                                                    }
                                                    else {
                                                        navigate("/login", {
                                                            state: { from: location.pathname }
                                                        });
                                                    }
                                                }}
                                            >
                                                {t('add_game')}
                                            </Button>)
                                        : <></>
                                )}
                            </CardContent>
                            <Divider/>
                            {uGameData?.createdAt && (
                                <Typography
                                    level="body-xs"
                                    sx={{
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase',
                                        // letterSpacing: '0.1em',
                                        color: 'text.tertiary',
                                        textAlign: 'center'
                                    }}
                                >
                                    {t('added')} {formatter.format(new Date(uGameData?.createdAt))}
                                </Typography>
                            )}
                        </Card>
                        <Stack style={{margin: '0'}}>
                            {isLogin ? (
                                    <Button
                                        sx={{
                                            width: '18rem',
                                            fontSize: '1rem',
                                            fontWeight: 'normal'
                                        }}
                                        onClick={() => {
                                            setShowUserLists(true);
                                        }}
                                    >
                                        {t('add_to_list')}
                                    </Button>
                                ):
                                <></>}
                        </Stack>
                    </Stack>

                    <Stack
                        sx={{ flex: 1, minWidth: 0, gap: '1rem'}}
                    >
                        <Stack direction='row'>
                            <Card style={{width: '60rem', border: '0', padding: 0}}>
                                <CardContent>
                                    <Stack direction="row" style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Stack direction="column">
                                            <div style={{display: 'flex', justifyContent: 'flex-start', paddingBottom: '0.25rem'}}>
                                                {isLoading ? (
                                                    <Skeleton variant="rectangular" width="10rem" height='2rem'/>
                                                ) : gameData?.first_release_date ? (
                                                    <Chip>
                                                        {new Date(gameData.first_release_date * 1000).toLocaleDateString()}
                                                    </Chip>
                                                ) : (
                                                    <Chip>{gameData?.release_dates?.[0]?.y || 'Unknown'}</Chip>
                                                )}
                                            </div>
                                            {isLoading
                                                ? <Skeleton width='10rem' height='1rem'/>
                                                : <Typography level="h1" fontWeight="xl">{gameData?.name}</Typography>
                                            }
                                        </Stack>
                                        {uGameData?.createdAt && (
                                            <Stack>
                                                {uGameData?.overallRating ? (
                                                    <Card
                                                        variant="soft"
                                                        orientation="horizontal"
                                                        sx={{
                                                            width: '13rem',
                                                            gap: 2,
                                                            alignItems: 'center',
                                                            borderRadius: 'xl',
                                                            bgcolor: 'background.surface',
                                                            boxShadow: 'sm',
                                                        }}
                                                    >
                                                        <CardContent
                                                            sx={{display: 'flex', alignItems: 'start', flexDirection: 'start', height: '100%'}}>
                                                            <Typography
                                                                level="body-xs"
                                                                sx={{
                                                                    fontWeight: 'bold',
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.1em',
                                                                    color: 'text.tertiary',
                                                                }}
                                                            >
                                                                {t('your_score')}
                                                            </Typography>
                                                            {!uGameData?.userRating && (
                                                                <Typography level="h4" component="div"
                                                                            sx={{
                                                                                color: getRatingColor(uGameData?.userRating, 1),
                                                                            }}>
                                                                    {t('none_score')}
                                                                </Typography>
                                                            )}
                                                        </CardContent>

                                                        <Box
                                                            sx={{
                                                                width: 48,
                                                                height: 48,
                                                                borderRadius: '50%',
                                                                border: '4px solid',
                                                                borderColor: uGameData?.userRating == undefined
                                                                    ? 'neutral.softBg'
                                                                    : getRatingColor(uGameData?.userRating, 1),
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                // color: 'neutral.400',
                                                                fontSize: 'l',
                                                                fontWeight: 'bold',
                                                            }}
                                                        >
                                                            {uGameData?.userRating ?? '-'}
                                                        </Box>
                                                    </Card>
                                                ) : (
                                                    <Card
                                                        variant="soft"
                                                        orientation="horizontal"
                                                        sx={{
                                                            gap: 2,
                                                            alignItems: 'center',
                                                            borderRadius: 'xl',
                                                            bgcolor: 'background.surface',
                                                            boxShadow: 'sm',
                                                        }}
                                                    >
                                                        <CardContent
                                                            sx={{display: 'flex', flexDirection: 'row', alignItems: 'start', height: '100%'}}>
                                                            <Stack direction='column' sx={{justifyContent: 'space-between', alignItems: 'center', gap: 1, textAlign: 'center'}}>
                                                                <Typography level="title-md" component="div"
                                                                            sx={{fontSize: '0.85rem', color: 'black'}}>
                                                                    {t('average_score')}
                                                                </Typography>
                                                                <Box
                                                                    sx={{
                                                                        width: 48,
                                                                        height: 48,
                                                                        borderRadius: '50%',
                                                                        border: '4px solid',
                                                                        borderColor: uGameData?.userRating == undefined
                                                                            ? 'neutral.softBg'
                                                                            : getRatingColor(uGameData?.userRating, 1),
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        // color: 'neutral.400',
                                                                        fontSize: 'l',
                                                                        fontWeight: 'bold',
                                                                    }}
                                                                >
                                                                    {uGameData?.userRating ?? '-'}
                                                                </Box>
                                                            </Stack>
                                                            <Divider orientation="vertical" />
                                                            {uGameData?.userModes?.map((mode, i) => (
                                                                <Stack direction='column' key={i} sx={{justifyContent: 'space-between', alignItems: 'center', gap: 1, textAlign: 'center'}}>
                                                                    {mode?.userRating && (
                                                                        <Typography level="title-md" component="div"
                                                                                    sx={{fontSize: '0.85rem', color: 'black'}}
                                                                        >
                                                                            {t(`${mode.mode.replace('-','_')}`)}
                                                                        </Typography>
                                                                    )}
                                                                    <Box
                                                                        sx={{
                                                                            width: 48,
                                                                            height: 48,
                                                                            borderRadius: '50%',
                                                                            border: '4px solid',
                                                                            borderColor: uGameData?.userRating == undefined
                                                                                ? 'neutral.softBg'
                                                                                : getRatingColor(mode?.userRating, 1),
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            // color: 'neutral.400',
                                                                            fontSize: 'l',
                                                                            fontWeight: 'bold',
                                                                        }}
                                                                    >
                                                                        {mode?.userRating ?? '-'}
                                                                    </Box>
                                                                </Stack>
                                                            ))}
                                                        </CardContent>
                                                    </Card>
                                                )}
                                            </Stack>
                                        )}
                                    </Stack>

                                    <AccordionGroup variant='plain'
                                                    size="lg"
                                                    disableDivider
                                                    transition={{
                                                        initial: "0.3s ease-out",
                                                        expanded: "0.2s ease",
                                                    }}
                                                    style={{width: '100%'}}
                                    >
                                        {gameData?.collections != null ? (
                                                gameData?.collections?.map((series: Series, index: number) => (
                                                    <Accordion
                                                        key={index}
                                                        sx={{
                                                            display: 'flex', flexDirection: 'column',
                                                            padding: '0', margin: '0', borderRadius: '2rem',
                                                        }}
                                                    >
                                                        <AccordionSummary
                                                            key={index}
                                                            variant="plain"
                                                            slotProps={{
                                                                button: {
                                                                    sx: {
                                                                        p: 0,
                                                                        m: 0,
                                                                        borderRadius: '0.5rem'
                                                                    }
                                                                }
                                                            }}
                                                            sx={{
                                                                '--Icon-color': 'black',
                                                                // '--joy-palette-text-primary': 'white',
                                                                // '--joy-palette-text-secondary': 'white',
                                                                // '--joy-palette-text-icon': 'white',
                                                                '--joy-palette-neutral-plainColor': 'black',
                                                                padding: '0', margin: '0',
                                                                borderRadius: '2rem',
                                                                width: '26.5rem'
                                                            }}>
                                                            <Typography level="h4" gap={1} style={{display: 'flex'}}>
                                                                {t('series')}:
                                                                <Link variant="plain" color="neutral" component={RouterLink} to={`/series/${series.slug}`}>
                                                                    <Typography level="h4" fontWeight="xl">
                                                                        {series.name}
                                                                    </Typography>
                                                                </Link>
                                                            </Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <GameSwiper franchiseGames={series?.games} t={t}/>
                                                        </AccordionDetails>
                                                    </Accordion>)
                                                )
                                            ) :
                                            <></>
                                        }
                                    </AccordionGroup>
                                </CardContent>
                            </Card>
                        </Stack>

                        <Stack direction="row"
                               style={{
                                   gap: '1rem',
                                   maxWidth: '60rem',
                                   flexWrap: 'wrap',
                                   justifyContent: 'space-between'
                        }}>
                            <Card style={{maxWidth: '30rem', height: '100%', flex: '0 1 26.5rem'}}>
                                <h4 style={{textTransform: 'uppercase'}}>{t('game_details')}:</h4>
                                <CardContent>
                                    <Stack direction="row" sx={{verticalAlign: 'middle'}}>
                                        <strong style={{fontSize: '0.9rem', display: 'flex', alignItems:'center', textTransform: 'uppercase'}}>
                                            {t('developer')}:
                                        </strong>
                                        <div>
                                            {gameData?.involved_companies && (
                                                gameData.involved_companies.map((company) =>
                                                    company.developer ?
                                                        <Chip style={{marginRight: '0.3rem'}}
                                                              component={Link}
                                                              href={`/company/${company.company.slug}`}
                                                              key={company.company.slug}>
                                                            {company.company.name}
                                                        </Chip> : null
                                                        // <Button variant="plain"
                                                        //         sx={{
                                                        //             padding: '0 0.5rem',
                                                        //             marginRight: '0.3rem',
                                                        //             fontSize: '0.9rem',
                                                        //             fontWeight: 'normal',
                                                        //             color: 'black',
                                                        //             backgroundColor: 'background.level1',
                                                        //             borderRadius: '0.25rem',
                                                        //             height: '0.25rem'
                                                        //         }}
                                                        //         component={Link}
                                                        //         href={`/company/${company.company.slug}`}
                                                        //         key={company.company.slug}>
                                                        //     {company.company.name}
                                                        // </Button> : null
                                                )
                                            )}
                                        </div>
                                    </Stack>
                                    <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                                    <Stack direction="row">
                                        <strong style={{fontSize: '0.9rem', display: 'flex', alignItems:'center', textTransform: 'uppercase'}}>
                                            {t('genre')}:
                                        </strong>
                                        <div>
                                            {gameData?.genres && (
                                                gameData.genres.map((genre) =>
                                                    <Chip style={{marginRight: '0.3rem'}} key={genre.id}>
                                                        {genre.name}
                                                    </Chip>)
                                            )}
                                        </div>
                                    </Stack>
                                    <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                                    <Stack direction="row">
                                        <strong style={{fontSize: '0.9rem', display: 'flex', alignItems:'center', textTransform: 'uppercase'}}>
                                            {t('platforms')}:
                                        </strong>
                                        <div>
                                            {gameData?.platforms && (
                                                gameData?.platforms.map((platform: Platform, index) =>
                                                    PlatformBadge(platform.abbreviation?.replace(' ', '-'), index))
                                            )}
                                        </div>
                                    </Stack>
                                    <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                                    <Stack direction="row">
                                        <strong style={{fontSize: '0.9rem', display: 'flex', alignItems:'center', textTransform: 'uppercase'}}>
                                            {t('publisher')}:
                                        </strong>
                                        <div>
                                            {gameData?.involved_companies && (
                                                gameData.involved_companies.map((company) =>
                                                    company.publisher ?
                                                        <Chip style={{
                                                            maxWidth: '14rem'
                                                        }}
                                                              component={Link}
                                                              href={`/company/${company.company.slug}`}
                                                              key={company.company.slug}>
                                                            {company.company.name}
                                                        </Chip> : null
                                                )
                                            )}
                                        </div>
                                    </Stack>
                                    <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                                    <Stack direction="row">
                                        <strong style={{fontSize: '0.9rem', display: 'flex', alignItems:'center', textTransform: 'uppercase'}}>
                                            {t('type')}:
                                        </strong>
                                        <div>
                                            <Chip>
                                                {gameData?.game_type != null ? t(CategoryIGDB[gameData?.game_type.id]) : null}
                                            </Chip>
                                        </div>
                                    </Stack>
                                    {(gameData?.game_type?.id != undefined) && ![1, 2].includes(gameData?.game_type?.id) && (
                                        <>
                                            {(gameData?.dlcs?.length ?? 0) > 0 && (
                                                <>
                                                    <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                                                    <Stack direction="row">
                                                        <strong style={{fontSize: '0.9rem', display: 'flex', alignItems:'flex-start', textTransform: 'uppercase'}}>
                                                            {t('dlcs')}:
                                                        </strong>
                                                        {/*{gameData?.dlcs != null ? gameData.dlcs.length : null}*/}
                                                        <div style={{}}>
                                                            {gameData?.dlcs ? (
                                                                    gameData.dlcs.map((dlc) =>
                                                                        <Chip style={{
                                                                            marginBottom: '0.4rem',
                                                                            marginRight: '0.3rem',
                                                                            maxWidth: '14rem',
                                                                        }}
                                                                              color={checkDlc(dlc.id)}
                                                                              key={dlc.id}
                                                                              component={Link}
                                                                              href={`/games/${dlc.id}`}
                                                                        >
                                                                            {dlc.name}
                                                                        </Chip>
                                                                    )
                                                                )
                                                                :
                                                                <Chip style={{
                                                                    marginBottom: '0.4rem',
                                                                    marginRight: '0.3rem',
                                                                    maxWidth: '14rem'
                                                                }}>
                                                                    {t('none')}
                                                                </Chip>
                                                            }
                                                        </div>
                                                    </Stack>
                                                </>
                                            )}
                                            {gameData?.expansions?.length != undefined && gameData?.expansions?.length > 0 && (
                                                <Stack direction="row">
                                                    <strong style={{fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', textTransform: 'uppercase'}}>
                                                        {t('expansions')}:
                                                    </strong>
                                                    {/*{gameData?.expansions != null ? gameData.expansions.length : null}*/}
                                                    <div>
                                                        {gameData?.expansions ? (
                                                                gameData.expansions.map((expansion) =>
                                                                    <Chip style={{
                                                                        marginRight: '0.3rem',
                                                                        maxWidth: '14rem'
                                                                    }}
                                                                          color={checkDlc(expansion.id)}
                                                                          key={expansion.id}
                                                                          component={Link}
                                                                          href={`/games/${expansion.id}`}
                                                                    >
                                                                        {expansion.name}
                                                                    </Chip>
                                                                )
                                                            )
                                                            :
                                                            <Chip style={{
                                                                marginRight: '0.3rem',
                                                                maxWidth: '14rem'
                                                            }}>
                                                                {t('none')}
                                                            </Chip>
                                                        }
                                                    </div>
                                                </Stack>
                                            )}
                                            {(((gameData?.expansions?.length ?? 0)  > 0) || ((gameData?.dlcs?.length ?? 0) > 0)) && (
                                                <>
                                                    <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                                                    <strong style={{fontSize: '0.9rem', display: 'flex', alignItems:'center', textTransform: 'uppercase'}}>
                                                        {t('completed')}: {completedDlcCount}/{(gameData?.expansions?.length ?? 0) + (gameData?.dlcs?.length ?? 0)}
                                                    </strong>
                                                </>
                                            )}
                                        </>
                                    )}
                                    {(gameData?.game_type?.id != undefined) && (gameData?.parent_game != undefined) && (
                                        <>
                                            <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                                            <Stack direction="row">
                                                <strong style={{fontSize: '0.9rem', display: 'flex', alignItems:'center', textTransform: 'uppercase'}}>
                                                    {t('parent_game')}:
                                                </strong>
                                                <div>
                                                    <Chip style={{
                                                        marginRight: '0.3rem',
                                                        maxWidth: '14rem'
                                                    }}
                                                          key={gameData?.parent_game?.id}
                                                          component={Link}
                                                          href={`/games/${gameData?.parent_game?.id}`}
                                                    >
                                                        {gameData?.parent_game?.name}
                                                    </Chip>
                                                </div>
                                            </Stack>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            {isLogin && (
                                <Stack direction="column" sx={{display: 'flex', gap: '1rem'}}>
                                    <Card sx={{width: '26.5rem', paddingBottom: '0', paddingTop: 1}}>
                                        {uGameData?.review ? (
                                            <CardContent sx={{justifyContent: 'space-between'}}>
                                                <Stack sx={{maxHeight: '20rem'}}>
                                                    <Stack direction="row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
                                                        <Typography level="title-md" fontWeight="xl" sx={{textTransform: 'uppercase'}}>
                                                            {t('your_review')}
                                                        </Typography>
                                                        <Button variant="plain"
                                                                style={{
                                                                    padding: '0 0.5rem',
                                                                    fontSize: '1rem',
                                                                    fontWeight: 'normal',
                                                                }}
                                                                onClick={handleShowUserReview}
                                                        >
                                                            {t('edit')}
                                                        </Button>
                                                    </Stack>
                                                    <Stack direction="column" style={{minHeight: '4rem', alignItems: 'start'}}>
                                                        <Typography style={{maxHeight: '30rem', overflowY: 'auto'}}>
                                                            {reviewContent}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                                <Stack direction="row" sx={{justifyContent: 'space-between', alignItems: 'center'}}>
                                                    <Typography
                                                        level="body-xs"
                                                        sx={{
                                                            fontWeight: 'bold',
                                                            textTransform: 'uppercase',
                                                            // letterSpacing: '0.1em',
                                                            color: 'text.tertiary',
                                                        }}
                                                    >
                                                        {t('posted')} {formatter?.format(new Date(uGameData?.createdAt))}
                                                    </Typography>

                                                    <Button variant="plain"
                                                            sx={{
                                                                padding: '0rem 0.25rem',
                                                                fontSize: '0.9rem',
                                                                fontWeight: 'normal',
                                                            }}
                                                            onClick={handleShowUsersReview}
                                                    >
                                                        {t('view_all_reviews')}
                                                    </Button>
                                                </Stack>
                                            </CardContent>
                                        ) : (
                                            <CardContent sx={{justifyContent: 'space-between', paddingBottom: 1}}>
                                                <Stack gap={1}>
                                                    <Stack>
                                                        <Typography level="title-md" fontWeight="xl" sx={{textTransform: 'uppercase'}}>
                                                            {t('what_do_you_think')}
                                                        </Typography>
                                                        <Typography level="body-sm" sx={{mt: 1}}>
                                                            {t('helper_reviews')}
                                                        </Typography>
                                                    </Stack>

                                                    <Stack direction="row" sx={{gap: 2, alignItems: 'center'}}>
                                                        <Button
                                                            variant="soft"
                                                            startDecorator={<StarIcon/>}
                                                            sx={{
                                                                borderRadius: '0.25rem',
                                                                textTransform: 'none',
                                                                fontWeight: 500,
                                                                fontSize: '0.85rem',
                                                                padding: '0',
                                                                width: '11rem'
                                                            }}
                                                            onClick={() => {isLogin
                                                                ? handleShowUserReview()
                                                                : navigate("/login", {
                                                                    state: { from: location.pathname }});
                                                            }}
                                                        >
                                                            {isLogin ? t('rate_and_review') : t('register_and_review')}
                                                        </Button>

                                                        <Button
                                                            variant="plain"
                                                            sx={{
                                                                textTransform: 'none',
                                                                fontWeight: 500,
                                                                fontSize: '0.85rem',
                                                                color: 'text.primary',
                                                                '&:hover': {
                                                                    bgcolor: 'transparent',
                                                                }
                                                            }}
                                                            onClick={handleShowUsersReview}
                                                        >
                                                            {t('read_reviews')}
                                                        </Button>
                                                    </Stack>
                                                </Stack>
                                            </CardContent>
                                        )}
                                    </Card>

                                    <Card sx={{ width: '26.5rem', maxHeight: '500px', overflow: 'auto' }}>
                                        <CardContent>
                                            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography
                                                    level="title-md"
                                                    fontWeight="xl"
                                                    startDecorator={<DescriptionIcon color="primary" />}
                                                >
                                                    {t('your_notes')}
                                                    <Typography color="neutral" sx={{ ml: 0.5 }}>
                                                        ({uGameData?.notes?.length || 0})
                                                    </Typography>
                                                </Typography>
                                                <Button variant="plain" size="sm" onClick={handleShowUserNotes}>
                                                    {t('view_all')}
                                                </Button>
                                            </Stack>
                                            {uGameData?.notes && uGameData?.notes.length > 0 ? (
                                                <>
                                                    <Stack spacing={1.5} sx={{ mb: 2 }}>
                                                        {sortedNotes.slice(0, 3).map((note: Note, index: number) => (
                                                            <Sheet
                                                                key={index}
                                                                variant="soft"
                                                                color={note.color || 'neutral'}
                                                                sx={{
                                                                    p: 1.5,
                                                                    borderRadius: 'md',
                                                                    border: '1px solid',
                                                                    borderColor: 'divider',
                                                                }}
                                                            >
                                                                <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                                                                    <Typography level="title-sm" sx={{ fontWeight: 'bold' }}>
                                                                        {note.title}
                                                                    </Typography>
                                                                    <Typography level="body-xs" sx={{ opacity: 0.6 }}>
                                                                        {formatRelative(note?.updatedAt, i18n.language)}
                                                                    </Typography>
                                                                </Stack>

                                                                <Typography
                                                                    level="body-sm"
                                                                    sx={{
                                                                        display: '-webkit-box',
                                                                        WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical',
                                                                        overflow: 'hidden',
                                                                        mt: 0.5,
                                                                    }}
                                                                >
                                                                    {note.content}
                                                                </Typography>
                                                            </Sheet>
                                                        ))}
                                                    </Stack>
                                                </>
                                            ) : (
                                                <>
                                                    <Button variant="plain" startDecorator={<AddIcon/>}
                                                            onClick={handleShowUserNotes}
                                                            style={{width: '100%', height: '100%', border: '1px dashed'}}>
                                                        {t('add_note')}
                                                    </Button>
                                                </>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                </Stack>

                {/*User Review Modal*/}
                <Modal open={showUserReview}
                       centered={true}
                       onClose={() => {
                           handleCloseUserReview();
                           if (uGameData?.review != undefined) {
                               setReviewContent(uGameData?.review)
                           }
                       }}
                >
                    <ModalDialog
                        style={{
                            width: '40rem'
                        }}
                    >
                        <div style={{border: 'none', paddingBottom: '0px'}}>
                            <Typography level="h2">{t('review')}</Typography>
                        </div>
                        <ModalClose/>

                        <div className="modal-dialog-scrollable">
                            <Box style={{maxHeight: '30rem', overflowY: 'auto'}}>
                                {/*<Form>*/}
                                {/*    /!*<Form.Label><h5>{t('review_text')}</h5></Form.Label>*!/*/}
                                {/*    <Form.Control style={{height: '25rem', resize: 'none'}} as="textarea" rows={3} placeholder="Ваша рецензия" onChange={reviewContentChange}*/}
                                {/*                  defaultValue={`${reviewContent}`}*/}
                                {/*    />*/}
                                {/*</Form>*/}
                                <FormControl>
                                    <Textarea style={{height: '25rem', resize: 'none'}}
                                              // minRows={2}
                                              // maxRows={4}
                                              placeholder="Ваша рецензия" onChange={reviewContentChange}
                                              defaultValue={`${reviewContent}`}
                                    />
                                    {/*<FormHelperText>This is a helper text.</FormHelperText>*/}
                                </FormControl>
                            </Box>
                        </div>

                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button color="danger" onClick={() => {
                                userGameService.deleteGameReview(igdbId, reviewContent).then(() => handleCloseUserReview())
                            }}>{t('review_delete')}</Button>
                            <Button color="primary" onClick={() => {
                                userGameService.updateGameReview(igdbId, reviewContent).then(() => handleCloseUserReview())
                            }}>{t('review_save')}</Button>
                        </div>
                    </ModalDialog>
                </Modal>

                {/*User Reviews Modal*/}
                <Modal open={showUserReviews}
                       onClose={() => {
                           handleCloseUsersReview();
                       }}
                       dialogClassName="modal-user-reviews"
                       aria-labelledby="example-custom-modal-styling-title">
                    <ModalDialog
                        style={{
                            width: '40rem',
                            minHeight: '18rem'
                        }}
                    >
                        <div style={{border: 'none', paddingBottom: '0px'}}>
                            <Typography level="h3">Рецензии пользователей</Typography>
                        </div>
                        <ModalClose/>

                        {averageScore !== null && (
                            <div style={{
                                backgroundColor: '#fff8e1',
                                padding: '10px 16px',
                                margin: '0 1rem 1rem 0',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <div style={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: getRatingColor(averageScore, 1)
                                }}></div>
                                <div>
                                    <strong>Средняя оценка: {averageScore}</strong><br />
                                    <span style={{ fontSize: '0.9rem', color: '#777' }}>
                                (на основе отзывов с оценкой: {reviewsWithScores?.length})
                            </span>
                                </div>
                            </div>
                        )}

                        <div className="modal-dialog-scrollable" style={{maxHeight: '30rem', overflowY: 'auto'}}>
                            {gameReviews ? (
                                <>
                                    <Stack style={{
                                        //maxWidth: '25rem',
                                        display: 'flex',
                                        justifyContent: 'start',
                                        justifySelf: 'start'
                                    }}>
                                        {
                                            gameReviews?.map?.((gameReview: GameReview) => (
                                                <Review key={gameReview.id} gameReview={gameReview}/>
                                            ))
                                        }
                                    </Stack>
                                </>
                            ) : <></>}
                        </div>

                        {/*<div style={{border: 'none'}}>*/}
                        {/*    <Button color="primary" onClick={() => {*/}
                        {/*        handleCloseUsersReview()*/}
                        {/*    }}>Закрыть</Button>*/}
                        {/*</div>*/}
                    </ModalDialog>
                </Modal>

                {/*User Notes Modal*/}
                {gameStatus ? (<NotesModal notes={uGameData?.notes ?? []} gameTitle={gameData?.name ?? ""} show={showUserNotes} handleClose={handleCloseUserNotes}/>) : <></>}

                <Modal open={showUserLists}
                       onClose={() => {
                           setShowUserLists(false);
                       }}>
                    <ModalDialog
                        style={{width: '30rem'}}
                    >
                        <div style={{border: 'none', paddingBottom: '0px'}}>
                            <h2>{t('lists')}</h2>
                        </div>
                        <ModalClose/>

                        <div className="modal-dialog-scrollable">
                            <Box style={{minHeight: '10rem', overflowY: 'auto', paddingLeft: '0'}}>
                                {gameListData?.content?.map((gameList: UserGameList, index: number) => (
                                    <Stack key={index}
                                           style={{flexDirection: 'row', width: '100%',
                                               justifyContent: 'space-between', padding: '0.25rem'}}
                                    >
                                        <Typography>
                                            {gameList.name}
                                        </Typography>
                                        <Checkbox label={t('add')}
                                                  checked={selectedListsToAdd.has(gameList?.uuid)}
                                                  onChange={(e) => handleCheckboxChange(gameList?.uuid, e.target.checked)}
                                        />
                                    </Stack>
                                ))}
                            </Box>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Button color="primary" onClick={() => {
                                setShowUserLists(false);
                            }}>{t('close')}</Button>
                            <Button color="primary" onClick={() => {
                                if (selectedListsToAdd.size > 0) {
                                    selectedListsToAdd.values().forEach((list: string) => {
                                        userGameListService.updateUserGameList({games: Array.from([igdbId])}, list)
                                            .then(() => {setShowUserLists(false);});
                                    })
                                }
                            }}>{t('add_to_lists')}</Button>
                        </div>
                    </ModalDialog>
                </Modal>
            </GameProvider>
        </Stack>
    );
}

export default GamePage;
