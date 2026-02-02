import React, { useState } from 'react';
import {AspectRatio, Button, Chip, Link, Skeleton, Snackbar} from "@mui/joy";
import {useTranslation} from "react-i18next";
import {PlatformBadge} from "../game/badge/PlatformBadge";
import {CategoryIGDB} from "../../utils/Enums";
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem'
import {userGameListService} from "../../api/services/userGameListService";
import DoneIcon from '@mui/icons-material/Done';
import ErrorIcon from '@mui/icons-material/Error';
import { IgdbGame } from '../../types/igdb.game.types';
import { UserGameList } from '../../types/user.game.list.types';
import {Toast} from "../toast/Toast";

export interface NavSearchDropdownProps {
    games: IgdbGame[];
    isListPage: boolean;
    listId: string;
    onChange?: (updatedGameList: UserGameList) => void;
}

const NavSearchDropdown: React.FC<NavSearchDropdownProps> = ({ games, isListPage, listId, onChange }) => {
    const { t } = useTranslation();
    if (games.length === 0) return null;

    const [showSuccessNotification, setShowSuccessNotification] = React.useState(false);
    const [showErrorNotification, setShowErrorNotification] = React.useState(false);

    const handleAddToList = async (game: IgdbGame) => {
        if (!listId || !onChange) return;

        try {
            const updatedList = await userGameListService.updateUserGameList(
                { games: Array.from([game.id]) },
                listId
            );

            if (updatedList && onChange) {
                onChange(updatedList);
            }

            setShowSuccessNotification(true);
        } catch (error) {
            console.error('Error while adding game: ', error);
            setShowErrorNotification(true);
        }
    };

    return (
        <>
            <List
                variant = 'soft'
                style={{
                    // display: "flex",
                    // justifyContent: "flex-start",
                    position: 'absolute',
                    zIndex: 10000,
                    maxHeight: '300px',
                    overflowY: 'auto',
                    width: '100%'
            }}>
                {games.filter(game => game.cover?.url != null).map((game, index: number) => (
                    <ListItem
                        key={index}
                        className="mb-3 d-flex"
                        style={{width:'100%'}}
                    >
                        {game.cover?.url && (
                            <AspectRatio
                                ratio="3/4"
                                sx={{
                                    width: '3.5rem',
                                    height: '4.5rem'
                            }}
                            >
                                <img
                                    src={game.cover?.url.replace('t_thumb', 't_cover_big')}
                                    alt={game.name}
                                    style={{width: '3rem', height: '4rem', objectFit: 'cover', borderRadius: '0.25rem'}}
                                />
                            </AspectRatio>
                        )}
                        <Link
                            href={`/games/${game.id}`}
                            style={{width: '11rem', textDecoration: "none"}}
                            underline="none"
                            level="title-md"
                            sx={{
                                '--Link-gap': '0.5rem',
                                pl: 1,
                                py: 0.5,
                                borderRadius: 'md',
                                color: 'black',
                        }}
                        >
                            {game.name}
                        </Link>
                        {isListPage && (
                            <Button onClick={() => handleAddToList(game)}>
                                Add to list
                            </Button>
                        )}
                    </ListItem>
                ))}

                <Toast
                    module="List"
                    message="The game has been added to the list."
                    isSuccess={true}
                    open={showSuccessNotification}
                />
                <Toast
                    module="List"
                    message="Could not add the game. Please try again."
                    isSuccess={false}
                    open={showErrorNotification}
                />
                {/*<Snackbar*/}
                {/*    variant="soft"*/}
                {/*    color="success"*/}
                {/*    autoHideDuration={4000}*/}
                {/*    open={showSuccessNotification}*/}
                {/*    onClose={() => setShowSuccessNotification(false)}*/}
                {/*    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}*/}
                {/*    startDecorator={<DoneIcon/>}*/}
                {/*>*/}
                {/*    The game has been added to the list.*/}
                {/*</Snackbar>*/}
                {/*<Snackbar*/}
                {/*    variant="soft"*/}
                {/*    color="warning"*/}
                {/*    autoHideDuration={4000}*/}
                {/*    open={showErrorNotification}*/}
                {/*    onClose={() => setShowErrorNotification(false)}*/}
                {/*    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}*/}
                {/*    startDecorator={<ErrorIcon/>}*/}
                {/*>*/}
                {/*    Could not add the game. Please try again.*/}
                {/*</Snackbar>*/}
            </List>
        </>
    );
};

export default NavSearchDropdown;

