import React, {useState, useEffect, useRef, useMemo} from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import {Form, Modal, Stack} from "react-bootstrap";
import UserGameInfo from "../../components/game/UserGameInfo";
import GameControls from "../../components/game/GameControls";
import Notes from "../../components/Notes";
import {Link, useParams} from "react-router-dom";
import GameSwiper from "../../components/game/list/GameSwiper";
import {igdbGamesService} from "../../api/services/igdbGamesService";
import {userGameService} from "../../api/services/userGamesService";
import "../../assets/styles/game-card.css"
import "../../assets/styles/review.css"
import {CategoryIGDB} from "../../utils/Enums";
import {GameProvider} from "../../components/game/provider/GameProdiver";
import {Box, Checkbox, Chip, Divider, Skeleton, Typography} from "@mui/joy";
import Review, { GameReview } from '../../components/Review';
import {getRatingColor} from "../../utils/Utils";
import {useTranslation} from "react-i18next";

import {Button} from "@mui/joy";
import Accordion from '@mui/joy/Accordion';
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

function GamePage() {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const { isLogin } = useSelector((state: RootState) => state.auth);

    const [gameData, setGameData] = useState<IgdbGame>();
    const [uGameData, setUGameData] = useState<UserGame>();
    const [gameReviews, setGameReviews] = useState<GameReview[]>([]);

    const [gameStatus, setGameStatus] = useState(false);
    const igdbId = useParams<{ id: string }>();
    const [franchiseGames, setFranchiseGames] = useState(null);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const status = await userGameService.checkEntity(igdbId.id)
                setGameStatus(status);

                const response = await igdbGamesService.getIdgbGame(igdbId.id);

                if (!response) {
                    console.error('No data received from API');
                    return;
                }

                console.log(response)

                if (status) {
                    const uResponse = await userGameService.getUserGame(igdbId.id);
                    console.log("User game data");
                    console.log(uResponse);
                    setUGameData(uResponse);
                    if (uResponse.review != undefined) {
                        setReviewContent(uResponse.review)
                    }
                }

                await userGameService.getGameReviews(igdbId.id).then(data => {
                    Array.isArray(data) ? setGameReviews(data) : setGameReviews([])
                });

                setGameData(response);
                setFranchiseGames(response[0]?.franchises);

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
        <GameProvider initialStatus={uGameData?.status} initialUserRating={uGameData?.userRating} initialUserModes={uGameData?.userModes}>
            <Helmet>
                <title>{uGameData?.game?.title ? `${uGameData?.game?.title} | `: ''} GameVault</title>
            </Helmet>
            <Stack className="game-page" direction="horizontal"
                   style={{
                       paddingTop: "20px",
                   }}
                   gap={5}>
                <div
                    className='game-page__background'
                    style={{
                        ...(gameData?.cover?.url && {
                                backgroundImage: `url(${gameData.cover.url.replace('t_thumb', 't_cover_big')})`,
                            }),
                        height: `${backgroundHeight}px`,
                        top: `${gameStatus ? 42 : 35}%`,
                    }}
                />
                <div ref={cardRef}>
                    <Card data-bs-theme="dark" style={{width: '15rem', opacity: '98%', border: '0px'}} className="text-center">
                        {isLoading ? (
                            <Skeleton variant="rectangular" width="100%" height='17rem'/>
                        ) : (
                            <Card.Img
                                variant="top"
                                alt={gameData?.name}
                                src={gameData?.cover?.url?.replace('t_thumb', 't_cover_big') || ''}
                            />
                        )}

                        <Card.Body>
                            <Card.Title style={{display: 'flex', justifyContent: 'center'}}>
                                {isLoading ? <Skeleton width='10rem' height='1rem'/> : gameData?.name}
                            </Card.Title>

                            {isLoading ? (
                                <Skeleton variant="rectangular" width='10rem' height='5rem'
                                          sx={{mx: 'auto', borderRadius: 1}}/>
                            ) : (gameStatus) ? (
                                <GameControls gameModes={uGameData?.userModes ?? gameData?.game_modes}
                                              isOverallRating={uGameData?.overallRatingManual ?? false}
                                              isOverallStatus={uGameData?.overallStatus ?? false}

                                />
                            ) : (gameData?.game_modes != null
                                    ? (
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                userGameService.addUserGame(igdbId.id).then(() => setGameStatus(true));
                                            }}
                                        >
                                            {t('add_game')}
                                        </Button>)
                                    : <></>
                            )}
                        </Card.Body>
                        <Card.Footer style={{display: 'flex', justifyContent: 'center'}} className="text-muted">
                            {isLoading ? (
                                <Skeleton variant="rectangular" width="10rem" height='2rem'/>
                            ) : gameData?.first_release_date ? (
                                new Date(gameData.first_release_date * 1000).toLocaleDateString()
                            ) : (
                                gameData?.release_dates?.[0]?.y || 'Unknown'
                            )}
                        </Card.Footer>
                    </Card>
                    <Stack>
                        {gameStatus ? (
                                <Button style={{width: '15rem', marginTop: '10px'}} onClick={handleShowUserNotes}>
                                    {t('notes')}
                                </Button>
                            ):
                            <></>}
                        {isLogin ? (
                            <Button
                                sx={{
                                    marginTop: '1rem',
                                    width: '15rem',
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
                </div>

                <Stack style={{maxWidth: '34rem', zIndex: 0, color: 'white', alignItems: 'baseline'}}>
                    <Box
                        sx={{
                            top: 8,
                            left: 8,
                            px: 1.5,
                            borderRadius: "0.5rem",
                            background: `${theme === "light" ? "rgba(4,4,4,0.50)" : "rgba(255,255,255,0.15)"}`,
                            // border: "1px solid rgba(255,255,255,0.25)",
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            justifyContent: "center",
                            textAlign: "start",
                            zIndex: 2,
                            maxWidth: '34rem',
                            height: 'auto',
                            minHeight: expanded ? 'auto' : 'fit-content',
                            transition: 'all 0.3s ease',
                        }}
                    >
                        <h2> {t('description')}:</h2>
                        <Typography
                            component="div"
                            level="body-md"
                            // className={`game__description ${expanded ? "expanded" : ""}`}
                            sx={{
                                color: "whitesmoke",
                                fontWeight: 700,
                                fontSize: "1rem",
                                textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                            }}
                        >
                            {isLoading ? (
                                <Skeleton width="34rem" height="10rem"/>
                            ) : (
                                <span
                                    className={`game__description ${expanded ? "expanded" : ""}`}
                                    ref={descriptionTextRef}>
                                    {gameData === undefined
                                        ? ""
                                        : gameData?.summary}
                                </span>
                            )}
                            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                {(isOverflowing || expanded) && (
                                    <Button variant='plain' style={{color: 'white', background: 'none'}}
                                            className='game__description-button' onClick={() => setExpanded(!expanded)}>
                                        {expanded ? t('hide') : t('more')}
                                    </Button>
                                )}
                            </div>
                        </Typography>
                    </Box>

                    <AccordionGroup variant='plain'
                                    size="lg"
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
                                        style={{display: 'flex', flexDirection: 'column', padding: '0px 0px 0px 0px'}}>
                                        <div key={index}>
                                            <AccordionSummary
                                                variant="plain"
                                                sx={{
                                                    '--Icon-color': 'white',
                                                    // '--joy-palette-text-primary': 'white',
                                                    // '--joy-palette-text-secondary': 'white',
                                                    // '--joy-palette-text-icon': 'white',
                                                    '--joy-palette-neutral-plainColor': 'white',
                                                    color: 'white',
                                                }}>
                                                {t('series')}: {series.name}
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <h2>
                                                    <Chip style={{
                                                        marginBottom: '0.4rem',
                                                        marginRight: '0.3rem',
                                                        maxWidth: '14rem',
                                                    }}
                                                          key={series.slug}
                                                          component={Link}
                                                          to={`/series/${series.slug}`}
                                                    >
                                                        {t('read_more')}
                                                    </Chip>
                                                </h2>
                                                <GameSwiper franchiseGames={series.games} t={t}/>
                                            </AccordionDetails>
                                        </div>
                                    </Accordion>)
                                )
                            ) :
                            <></>
                        }
                    </AccordionGroup>
                </Stack>
                <div style={{opacity: '98%'}}>
                    {gameStatus ? (<UserGameInfo isOverallStatus={uGameData?.overallStatus ?? false}/>) : <></>}
                    <Card data-bs-theme="dark" style={{width: '16rem', border: '0px'}}>
                        <Card.Header>{t('info_about_game')}:</Card.Header>
                        <Card.Body>
                            <strong style={{fontSize: '1.1rem'}}>
                                {t('developer')}:
                            </strong>
                            <div style={{marginTop: '0.2rem'}}>
                                {gameData?.involved_companies && (
                                    gameData.involved_companies.map((company) =>
                                        company.developer ?
                                            <Chip style={{marginBottom: '0.4rem', marginRight: '0.3rem'}}
                                                  component={Link}
                                                  to={`/company/${company.company.slug}`}
                                                  key={company.company.slug}>
                                                {company.company.name}
                                            </Chip> : null
                                    )
                                )}
                            </div>
                            <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                            <strong style={{fontSize: '1.1rem'}}>
                                {t('genre')}:
                            </strong>
                            <div style={{marginTop: '0.2rem'}}>
                                {gameData?.genres && (
                                    gameData.genres.map((genre) =>
                                        <Chip style={{marginBottom: '0.4rem', marginRight: '0.3rem'}} key={genre.id}>
                                            {genre.name}
                                        </Chip>)
                                )}
                            </div>
                            <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                            <strong style={{fontSize: '1.1rem'}}>
                                {t('platforms')}:
                            </strong>
                            <div style={{marginTop: '0.2rem'}}>
                                {gameData?.platforms && (
                                    gameData?.platforms.map((platform: Platform, index) =>
                                        PlatformBadge(platform.abbreviation?.replace(' ', '-'), index))
                                )}
                            </div>
                            <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                            <strong style={{fontSize: '1.1rem'}}>
                                {t('publisher')}:
                            </strong>
                            <div style={{marginTop: '0.2rem'}}>
                                {gameData?.involved_companies && (
                                    gameData.involved_companies.map((company) =>
                                        company.publisher ?
                                            <Chip style={{
                                                marginBottom: '0.4rem',
                                                marginRight: '0.3rem',
                                                maxWidth: '14rem'
                                            }}
                                                  component={Link}
                                                  to={`/company/${company.company.slug}`}
                                                  key={company.company.slug}>
                                                {company.company.name}
                                            </Chip> : null
                                    )
                                )}
                            </div>
                            <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                            <strong style={{fontSize: '1.1rem'}}>
                                {t('type')}:
                            </strong>
                            <div style={{marginTop: '0.2rem'}}>
                                <Chip>
                                    {gameData?.game_type != null ? t(CategoryIGDB[gameData?.game_type.id]) : null}
                                </Chip>
                            </div>
                            {(gameData?.game_type?.id != undefined) && ![1, 2].includes(gameData?.game_type?.id) && (
                                <>
                                    {(gameData?.dlcs?.length ?? 0) > 0 && (
                                        <>
                                            <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                                            <strong style={{fontSize: '1.1rem'}}>
                                                {t('dlcs')}: {gameData?.dlcs != null ? gameData.dlcs.length : null}
                                            </strong>
                                            <div style={{marginTop: '0.2rem'}}>
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
                                                                  to={`/games/${dlc.id}`}
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
                                        </>
                                    )}
                                    {gameData?.expansions?.length != undefined && gameData?.expansions?.length > 0 && (
                                        <>
                                            <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                                            <strong style={{fontSize: '1.1rem'}}>
                                                {t('expansions')}: {gameData?.expansions != null ? gameData.expansions.length : null}
                                            </strong>
                                            <div style={{marginTop: '0.2rem'}}>
                                                {gameData?.expansions ? (
                                                        gameData.expansions.map((expansion) =>
                                                            <Chip style={{
                                                                marginBottom: '0.4rem',
                                                                marginRight: '0.3rem',
                                                                maxWidth: '14rem'
                                                            }}
                                                                  color={checkDlc(expansion.id)}
                                                                  key={expansion.id}
                                                                  component={Link}
                                                                  to={`/games/${expansion.id}`}
                                                                  >
                                                                {expansion.name}
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
                                        </>
                                    )}
                                    <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                                    {(((gameData?.expansions?.length ?? 0)  > 0) || ((gameData?.dlcs?.length ?? 0) > 0)) && (
                                        <strong style={{fontSize: '1.1rem'}}>
                                            {t('completed')}: {completedDlcCount}/{(gameData?.expansions?.length ?? 0) + (gameData?.dlcs?.length ?? 0)}
                                        </strong>
                                    )}
                                </>
                            )}
                            {(gameData?.game_type?.id != undefined) && [1, 2].includes(gameData?.game_type?.id) && (
                                <>
                                    <Divider style={{margin: '0.4rem'}} component="div" role="presentation"/>
                                    <strong style={{fontSize: '1.1rem'}}>
                                        {t('parent_game')}:
                                    </strong>
                                    <div>
                                        <Chip style={{
                                            marginBottom: '0.4rem',
                                            marginRight: '0.3rem',
                                            maxWidth: '14rem'
                                        }}
                                              key={gameData?.parent_game?.id}
                                              component={Link}
                                              to={`/games/${gameData?.parent_game?.id}`}
                                              >
                                            {gameData?.parent_game?.name}
                                        </Chip>
                                    </div>
                                </>
                            )}
                        </Card.Body>
                    </Card>
                    <Stack>
                        {gameStatus ? (
                                <Button style={{width: '16rem', marginTop: '10px'}} onClick={handleShowUserReview}>
                                    {t('user_review')}
                                </Button>)
                            : <></>}
                        <Button style={{width: '16rem', marginTop: '10px'}} onClick={handleShowUsersReview}>
                            {t('reviews')}
                        </Button>
                    </Stack>
                </div>
            </Stack>

            {/*User Review*/}
            <Modal show={showUserReview}
                //size={"lg"}
                   centered={true}
                   onHide={() => {
                       handleCloseUserReview();
                       if (uGameData?.review != undefined) {
                           setReviewContent(uGameData?.review)
                       }
                   }}
                // fullscreen={true}
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header style={{border: 'none', paddingBottom: '0px'}} closeButton>
                    <Modal.Title>{t('review')}</Modal.Title>
                </Modal.Header>

                <Modal.Body className="modal-dialog-scrollable">
                    <Container style={{maxHeight: '30rem', overflowY: 'auto'}}>
                        <Form>
                            <Form.Label><h5>{t('review_text')}</h5></Form.Label>
                            <Form.Control style={{height: '25rem', resize: 'none'}} as="textarea" rows={3} placeholder="Ваша рецензия" onChange={reviewContentChange}
                                          defaultValue={`${reviewContent}`}
                            />
                        </Form>
                    </Container>
                </Modal.Body>

                <Modal.Footer style={{border: 'none', justifyContent: 'space-between'}}>
                    <Button color="danger" onClick={() => {
                        userGameService.deleteGameReview(igdbId.id, reviewContent).then(() => handleCloseUserReview())
                    }}>{t('review_delete')}</Button>
                    <Button color="primary" onClick={() => {
                        userGameService.updateGameReview(igdbId.id, reviewContent).then(() => handleCloseUserReview())
                    }}>{t('review_save')}</Button>
                </Modal.Footer>
            </Modal>

            {/*User Reviews*/}
            <Modal show={showUserReviews}
                // size={"lg"}
                   centered={true}
                   onHide={() => {
                       handleCloseUsersReview();
                   }}
                   dialogClassName="modal-user-reviews"
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header style={{border: 'none', paddingBottom: '0px'}} closeButton>
                    <Modal.Title>Рецензии пользователей</Modal.Title>
                </Modal.Header>

                {averageScore !== null && (
                    <div style={{
                        backgroundColor: '#fff8e1',
                        padding: '10px 16px',
                        margin: '1rem 1.5rem 0.5rem',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            backgroundColor: getRatingColor(averageScore)
                        }}></div>
                        <div>
                            <strong>Средняя оценка: {averageScore}</strong><br />
                            <span style={{ fontSize: '0.9rem', color: '#777' }}>
                                (на основе отзывов с оценкой: {reviewsWithScores?.length})
                            </span>
                        </div>
                    </div>
                )}

                {/*User Notes Modal*/}
                <Modal.Body className="modal-dialog-scrollable" style={{maxHeight: '30rem', overflowY: 'auto'}}>
                    {gameReviews ? (
                        <>
                            <Stack style={{
                                maxWidth: '25rem',
                                display: 'flex',
                                justifyContent: 'start',
                                justifySelf: 'start'
                            }}>
                                {
                                    gameReviews?.map?.((gameReview: GameReview) => (
                                        <Review gameReview={gameReview}/>
                                    ))
                                }
                            </Stack>
                        </>
                    ) : <></>}
                </Modal.Body>

                <Modal.Footer style={{border: 'none'}}>
                    <Button color="primary" onClick={() => {
                        handleCloseUsersReview()
                    }}>Закрыть</Button>
                </Modal.Footer>
            </Modal>

            {/*User Notes*/}
            <Modal show={showUserNotes}
                //size={"lg"}
                   centered={true}
                   onHide={() => {
                       handleCloseUserNotes();
                   }}
                // fullscreen={true}
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header style={{border: 'none', paddingBottom: '0px'}} closeButton>
                    <Modal.Title>{t('notes')}</Modal.Title>
                </Modal.Header>

                <Modal.Body className="modal-dialog-scrollable">
                    <Container style={{maxHeight: '30rem', overflowY: 'auto'}}>
                        {gameStatus ? (<Notes notes={uGameData?.notes}/>) : <></>}
                    </Container>
                </Modal.Body>
            </Modal>

            <Modal show={showUserLists}
                //size={"lg"}
                   centered={true}
                   onHide={() => {
                       setShowUserLists(false);
                   }}
                // fullscreen={true}
                   aria-labelledby="example-custom-modal-styling-title">
                <Modal.Header style={{border: 'none', paddingBottom: '0px'}} closeButton>
                    <Modal.Title>{t('lists')}</Modal.Title>
                </Modal.Header>

                <Modal.Body className="modal-dialog-scrollable">
                    <Container style={{minHeight: '10rem', overflowY: 'auto', paddingLeft: '0'}}>
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
                    </Container>
                </Modal.Body>
                <Modal.Footer style={{border: 'none', justifyContent: 'space-between'}}>
                    <Button color="primary" onClick={() => {
                        setShowUserLists(false);
                    }}>{t('close')}</Button>
                    <Button color="primary" onClick={() => {
                        if (selectedListsToAdd.size > 0) {
                            selectedListsToAdd.values().forEach((list: string) => {
                                userGameListService.updateUserGameList({games: Array.from([igdbId?.id])}, list)
                                    .then(() => {setShowUserLists(false);});
                            })
                        }
                    }}>{t('add_to_lists')}</Button>
                </Modal.Footer>
            </Modal>
        </GameProvider>
    );
}

export default GamePage;
