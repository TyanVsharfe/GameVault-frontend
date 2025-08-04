import React, { useState } from 'react';
import "../../../assets/styles/style.css"
import "../../../assets/styles/game-card.css"
import {IgdbGame} from "../../../services/igdbGamesService";
import {Chip, Link, Skeleton} from "@mui/joy";
import {useTranslation} from "react-i18next";
import {PlatformBadge} from "../../PlatformBadge";
import {CategoryIGDB} from "../../../utils/Enums";
import {IgdbGamesListProps} from "./IgdbGameList";
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem'

const NavSearchDropdown: React.FC<IgdbGamesListProps> = ({ games }) => {
    const { t } = useTranslation();
    if (games.length === 0) return null;

    return (
        <>
            <List
                variant = 'soft'
                style={{
                    // display: "flex",
                    // justifyContent: "flex-start",
                    position: 'absolute',
                    zIndex: 1000,
                    maxHeight: '300px',
                    overflowY: 'auto',

            }}>
                {games.filter(game => game.cover?.url != null).map((game, index: number) => (
                    <ListItem
                        key={index}
                        className="mb-4 d-flex"
                        style={{width:'15rem'}}
                    >
                        {game.cover?.url && (
                            <img
                                src={game.cover?.url}
                                alt={game.name}
                                style={{ width: '3rem', height: '4rem', objectFit: 'cover' }}
                            />
                        )}
                        <Link
                            href={`/games/${game.id}`}
                            style={{width: '9rem'}}
                        >
                            {game.name}
                        </Link>

                        {/*<Card data-bs-theme='dark' style={{ width: '15rem' }} className='text-center' border='light'>*/}
                        {/*    <Card.Img className='game__cover' variant='top' src={game.cover?.url?.replace('t_thumb', 't_cover_big') || ''} />*/}
                        {/*    <Card.Body className='game__body'>*/}
                        {/*        <Card.Title className="user-game-list-game-card__title text-center">*/}
                        {/*            {game.name}*/}
                        {/*        </Card.Title>*/}
                        {/*        */}
                        {/*        /!*<Link*!/*/}
                        {/*        /!*    overlay*!/*/}
                        {/*        /!*    href={`/games/${game.id}`}*!/*/}
                        {/*        /!*    underline="none"*!/*/}
                        {/*        /!*    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}*!/*/}
                        {/*        /!*>*!/*/}
                        {/*        /!*</Link>*!/*/}

                        {/*        /!*<Button*!/*/}
                        {/*        /!*    style={{width: "80%"}}*!/*/}
                        {/*        /!*    variant="primary"*!/*/}
                        {/*        /!*    size="sm"*!/*/}
                        {/*        /!*    href={`/games/${game.id}`}*!/*/}
                        {/*        /!*    className="mt-2"*!/*/}
                        {/*        /!*>*!/*/}
                        {/*        /!*    {t('read_more')}*!/*/}
                        {/*        /!*</Button>*!/*/}
                        {/*    </Card.Body>*/}
                        {/*    <Card.Footer className="text-muted">*/}
                        {/*        {game.first_release_date*/}
                        {/*            ? new Date(game.first_release_date * 1000).toLocaleDateString()*/}
                        {/*            : game.release_dates && game.release_dates[0].y}*/}
                        {/*    </Card.Footer>*/}
                        {/*</Card>*/}
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default NavSearchDropdown;

