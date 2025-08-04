import React, {useState, useEffect, useRef} from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import {Form, Modal, Stack} from "react-bootstrap";
import UserGameInfo from "../../components/game/UserGameInfo";
import GameControls from "../../components/game/GameControls";
import Notes from "../../components/Notes";
import FranchiseGames from "../../components/game/FranchiseGames";
import {Link, useParams} from "react-router-dom";
import SwiperGames from "../../components/game/SwiperGames";
import {SwiperSlide} from "swiper/react";
import {getIdgbGame, IgdbGame} from "../../services/igdbGamesService";
import {
    addUserGame,
    checkEntity,
    deleteGameReview,
    getGameReviews,
    getUserGame, updateGameReview,
    UserGame
} from "../../services/userGamesService";
import "../../assets/styles/game-card.css"
import "../../assets/styles/review.css"
import {CategoryIGDB, getCategoryName} from "../../utils/Enums";
import {GameProvider} from "../../components/game/GameProdiver";
import {Chip, Divider, Skeleton, Typography} from "@mui/joy";
import AspectRatio from '@mui/joy/AspectRatio';
import Review, { GameReview } from '../../components/Review';
import {getRatingColor} from "../../utils/Utils";
import {useTranslation} from "react-i18next";

import {Button} from "@mui/joy";
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionSummary from '@mui/joy/AccordionSummary';
import {PlatformBadge} from "../../components/PlatformBadge";

function GamePage() {
    const { t } = useTranslation();

    const [gameData, setGameData] = useState<IgdbGame>();
    const [uGameData, setUGameData] = useState<UserGame>();
    const [gameReviews, setGameReviews] = useState<GameReview[]>();

    const [gameStatus, setGameStatus] = useState(false);
    const igdbId = useParams<{ id: string }>();
    const [franchiseGames, setFranchiseGames] = useState(null);
    const [reviewContent, setReviewContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [showUserReview, setShowUserReview] = useState(false);
    const [showUserReviews, setShowUserReviews] = useState(false);
    const [showUserNotes, setShowUserNotes] = useState(false);

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

    const reviewsWithScores = gameReviews != undefined ? gameReviews.filter(review => review.userRating !== null) : [];

    const averageScore = reviewsWithScores.length > 0
        ? Math.round(reviewsWithScores.reduce((acc, review) => acc + review.userRating, 0) / reviewsWithScores.length)
        : 0;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const status = await checkEntity(igdbId.id)
                setGameStatus(status);

                const response = await getIdgbGame(igdbId.id);

                if (status) {
                    const uResponse = await getUserGame(igdbId.id);
                    console.log(uResponse);
                    setUGameData(uResponse);
                    if (uResponse.review != undefined) {
                        setReviewContent(uResponse.review)
                    }
                }

                if (descriptionTextRef.current) {
                    const isTextOverflowing = descriptionTextRef.current.scrollHeight > descriptionTextRef.current.clientHeight;
                    setIsOverflowing(isTextOverflowing);
                }

                const gameReviews = await getGameReviews(igdbId.id);
                setGameReviews(gameReviews);

                const keyStorage = `/game/${igdbId.id}`;
                localStorage.setItem(keyStorage, JSON.stringify(response));
                setGameData(response[0]);
                console.log(response[0]);
                setFranchiseGames(response[0].franchises);
                console.log(gameData);
                console.log("Franchise " + franchiseGames);

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

    return (
        <GameProvider initialStatus={uGameData?.status} initialUserRating={uGameData?.userRating}>
            <Stack className="game-page" direction="horizontal"
                   style={{
                       paddingTop: "20px",
                   }}
                   gap={5}>
                <div
                    style={{
                        ...(gameData?.cover?.url && {
                                backgroundImage: `url(${gameData.cover.url.replace('t_thumb', 't_cover_big')})`,
                            }),
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(20px) brightness(50%)',
                        position: 'absolute',
                        top: '9.5%',
                        left: '23.5rem',
                        width: `72.5rem`,
                        height: `${backgroundHeight}px`,
                        zIndex: 0,
                    }}
                />
                <div ref={cardRef}>
                    <Card data-bs-theme="dark" style={{width: '15rem', opacity: '98%'}} className="text-center">
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
                            ) : gameStatus ? (
                                <GameControls/>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={() => {
                                        addUserGame(igdbId.id).then(() => setGameStatus(true));
                                    }}
                                >
                                    {t('add_game')}
                                </Button>
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
                    <Button style={{width: '15rem', marginTop: '10px'}} onClick={handleShowUserNotes}>
                        {t('notes')}
                    </Button>
                </div>

                <Stack style={{maxWidth: '34rem', zIndex: 0, color: 'white'}}>
                    <div style={{maxWidth: '34rem'}}>
                        {/*height: '20rem'*/}
                        <h2> {t('description')}:</h2>
                        {isLoading ? (
                            <Skeleton width="34rem" height="10rem"/>
                        ) : (
                            <span className={`game__description ${expanded ? "expanded" : ""}`}
                                  ref={descriptionTextRef}>
                            {gameData === undefined ?
                                "" :
                                gameData?.summary}</span>
                        )}
                        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                            {isOverflowing && (
                                <Button variant='plain' style={{color: 'white', background: 'none'}} className='game__description-button' onClick={() => setExpanded(!expanded)}>
                                    {expanded ? t('hide') : t('more')}
                                </Button>
                            )}
                        </div>
                    </div>

                    <AccordionGroup variant='plain'
                                    size="lg"
                                    transition={{
                                        initial: "0.3s ease-out",
                                        expanded: "0.2s ease",
                                    }}
                    >
                        <Accordion
                            style={{display: 'flex', flexDirection: 'column', padding: '0px 0px 0px 0px'}}>
                            {franchiseGames != null ? (
                                    franchiseGames.map((franchise, index: number) => (
                                        <div key={index}>
                                            <AccordionSummary
                                                color="neutral"
                                                variant="plain"
                                                sx={{
                                                    '--Icon-color': 'white',
                                                    '--joy-palette-text-primary': 'white',
                                                    '--joy-palette-text-secondary': 'white',
                                                    '--joy-palette-text-icon': 'white',
                                                    '--joy-palette-neutral-plainColor': 'white',
                                                    color: 'white',
                                                }}>
                                                {t('franchise')}: {franchise.name}
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <h2>
                                                    <Link style={{textDecoration: "none", fontSize: "1.2rem"}}
                                                          to={`/series/${franchise.slug}`}>{t('read_more')}</Link>
                                                </h2>
                                                <SwiperGames franchiseGames={franchise.games}/>
                                            </AccordionDetails>
                                        </div>)
                                    )
                                ) :
                                <></>
                            }
                        </Accordion>
                    </AccordionGroup>
                </Stack>
                <div style={{opacity: '98%'}}>
                    {gameStatus ? (<UserGameInfo/>) : <></>}
                    <Card data-bs-theme="dark" style={{width: '16rem'}}>
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
                                                  key={company.company.name}>
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
                                    gameData?.platforms.map((platform, index) =>
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
                                            <Chip style={{marginBottom: '0.4rem', marginRight: '0.3rem'}}
                                                  key={company.company.name}>
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
                                    {gameData?.game_type != null ? t(CategoryIGDB[gameData?.game_type]) : null}
                                </Chip>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                        </Card.Footer>
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
                        deleteGameReview(igdbId.id, reviewContent).then(() => handleCloseUserReview())
                    }}>{t('review_delete')}</Button>
                    <Button color="primary" onClick={() => {
                        updateGameReview(igdbId.id, reviewContent).then(() => handleCloseUserReview())
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
                                (на основе отзывов с оценкой: {reviewsWithScores.length})
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
                                    gameReviews.map((gameReview: GameReview) => (
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

            {/*<Container style={{display: "flex", justifyContent: "center", textAlign: "center"}}>*/}
            {/*    <Form.Group controlId="formFile" className="mb-3" style={{width: "290px"}}>*/}
            {/*        <Form.Label>Upload screenshots</Form.Label>*/}
            {/*        <Form.Control type="file" style={{ width: "auto", maxWidth: "290px" }}/>*/}
            {/*        <Button variant="primary" type="submit">*/}
            {/*            Save*/}
            {/*        </Button>*/}
            {/*    </Form.Group>*/}
            {/*</Container>*/}
        </GameProvider>
    );
}

export default GamePage;
