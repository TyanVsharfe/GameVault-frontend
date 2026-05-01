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
import AddIcon from '@mui/icons-material/Add';
import {name} from "@vitejs/plugin-react";

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
    const [addedGame, setAddedGame] = React.useState<{id: number, name: string}>();

    const handleAddToList = async (game: IgdbGame) => {
        if (!listId || !onChange) return;

        try {
            setAddedGame({id: game.id, name: game.name});
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
                    maxHeight: '300px',
                    overflowY: 'auto',
                    width: '100%'
            }}>
                {games.filter(game => game.cover?.url != null).map((game, index: number) => (
                    <ListItem
                        key={index}
                        className="mb-2 d-flex"
                        style={{width:'100%'}}
                    >
                        {game.cover?.url && (
                            <AspectRatio
                                ratio="3/4"
                                sx={{
                                    width: '3.75rem',
                                    height: '5rem'
                                }}
                            >
                                <img
                                    src={game.cover?.url.replace('t_thumb', 't_cover_big')}
                                    alt={game.name}
                                    style={{objectFit: 'cover', borderRadius: '0.25rem'}}
                                />
                            </AspectRatio>
                        )}
                        <div style={{display: 'flex', justifyContent: 'space-between',
                            width: '80%', alignItems: 'center'}}>
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
                                <Button key={index} style={{height: '60%'}} onClick={() => handleAddToList(game)}>
                                    {addedGame?.id === game.id ? <DoneIcon /> : <AddIcon />}
                                </Button>
                            )}
                        </div>
                    </ListItem>
                ))}
            </List>

            <Toast
                module="List"
                message={`${addedGame?.name} has been added to the list.`}
                isSuccess={true}
                open={showSuccessNotification}
                onClose={() => setShowSuccessNotification(false)}
            />
            <Toast
                module="List"
                message="Could not add the game. Please try again."
                isSuccess={false}
                open={showErrorNotification}
                onClose={() => setShowErrorNotification(false)}
            />
        </>
    );
};

export default NavSearchDropdown;

