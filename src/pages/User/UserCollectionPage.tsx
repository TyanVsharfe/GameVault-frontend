import Container from "react-bootstrap/Container";

import "../../assets/styles/style.css"
import "../../assets/styles/game-card.css"
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useTheme} from "next-themes";
import {userGameListService} from "../../api/services/userGameListService";
import {useNavigate, useParams} from "react-router-dom";
import UserGameCollectionList from "../../components/game/collections/UserGameCollectionList";
import {Box, Button, Switch, Textarea, Typography} from "@mui/joy";
import NavSearchDropdown from "../../components/nav/NavSearchDropdown";
import debounce from "lodash/debounce";
import {igdbGamesService} from "../../api/services/igdbGamesService";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NotFoundPage from "../NotFoundPage";
import {Helmet} from "react-helmet-async";
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import Stack from '@mui/material/Stack';
import {UserGameList, UserGameListForm, UserGameListItem} from "../../types/user.game.list.types";

function UserCollectionPage() {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();

    const [gameListData, setGameListData] = useState<UserGameList>();
    const [reorderedGames, setReorderedGames] = useState<UserGameListItem[]>([]);

    const listId = useParams<{ id: string }>();
    const [error, setError] = useState<boolean>(false);
    const [editMode, setEditMode] = useState(false);

    const [originalTitle, setOriginalTitle] = useState('');
    const [originalDescription, setOriginalDescription] = useState('');
    const [originalIsPublic, setOriginalIsPublic] = useState(false);

    const [listTitle, setListTitle] = useState('');
    const [listDescription, setListDescription] = useState('');
    const [isPublic, setIsPublic] = useState<boolean>(false);

    useEffect(() => {
        userGameListService.getUserGameList(listId.id)
            .then(list => {
                setGameListData(list);

                setOriginalTitle(list.name || '');
                setOriginalDescription(list.description || '');
                setOriginalIsPublic(list.isPublic);

                setListTitle(list.name || '');
                setListDescription(list.description || '');
                setIsPublic(list.isPublic);

                console.log(list);
            })
            .catch(error => {
                const axiosError = error as any;
                console.log(axiosError.status);
                if (axiosError.status === 404) {
                    setError(true);
                }
                if (axiosError.status === 400) {
                    navigate("/account/lists", { replace: true })
                }
            });
    }, [listId]);

    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSearch = useMemo(() =>
            debounce((value: string) => {
                if (value !== null && value !== "") {
                    igdbGamesService.getIdgbGames(value).then(results => {
                        setSearchResults([]);
                        console.log(results);
                        setSearchResults(results);
                        setIsDropdownVisible(true);
                    });
                }
            }, 250)
        , []);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        handleSearch(value);
    };

    const handleEditSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let reorder = reorderedGames.map(game =>
            ({
                "igdb-id": game.game.igdbId,
                order: game.order
            }));
        console.log(reorder);
        try {
            const query: UserGameListForm = {
                ...(listTitle?.trim() && listTitle.trim() !== originalTitle && {
                    name: listTitle.trim()
                }),
                ...(listDescription?.trim() && listDescription.trim() !== originalDescription && {
                    description: listDescription.trim()
                }),
                ...(isPublic !== originalIsPublic && {
                    isPublic: isPublic
                }),
                ...(JSON.stringify(reorderedGames) !== JSON.stringify(gameListData?.items || []) && {
                    "new-order": reorder
                })
            };

            if (Object.keys(query).length === 0) {
                console.warn('No changes to save');
                return;
            }

            userGameListService.updateUserGameList(query, listId?.id).then(list => {
                console.log(list);
                setOriginalTitle(list.name || '');
                setOriginalDescription(list.description || '');
                setOriginalIsPublic(list.isPublic);

                setListTitle(list.name || '');
                setListDescription(list.description || '');
                setIsPublic(list.isPublic || false);
                setEditMode(false);
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleGameListUpdate = (updatedGameList: UserGameList) => {
        setGameListData(updatedGameList);
    };

    return (
        <>
            <Helmet>
                <title>{originalTitle} | GameVault</title>
            </Helmet>
            <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                {!error && (
                    <>
                        <h2>
                            {originalTitle}
                        </h2>
                        <Typography
                            // variant="body2" color="textSecondary"
                                    sx={{
                                        paddingBottom: "0.75rem",
                                    }}
                        >
                            {originalDescription}
                        </Typography>
                        <UserGameCollectionList games={gameListData?.items} editMode={editMode}
                                                listId={listId.id} onReorder={(reorderedGames) => {
                                                    console.log('New order:', reorderedGames);
                                                    setReorderedGames(reorderedGames);
                                                }}/>
                        {editMode && (
                            <>
                                <div ref={wrapperRef}>
                                    <Form style={{position: "relative", width: "100%", zIndex: '10'}}
                                          onSubmit={(e) => {
                                              e.preventDefault();
                                              setIsDropdownVisible(true);
                                          }}
                                    >
                                        <Row>
                                            <Col xs="auto">
                                                <Form.Control
                                                    style={{width: '25rem'}}
                                                    type="text"
                                                    placeholder={t('add_game')}
                                                    className=" mr-sm-2"
                                                    id={"gameNameInput"}
                                                    value={searchTerm}
                                                    onChange={onInputChange}
                                                    onFocus={() => {
                                                        if (searchResults.length > 0) setIsDropdownVisible(true);
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                        {isDropdownVisible && searchResults.length > 0 && (
                                            <NavSearchDropdown games={searchResults} isListPage={true} listId={listId.id}
                                                               onChange={handleGameListUpdate}
                                            />
                                        )}
                                    </Form>
                                </div>
                            </>
                        )}
                        <Stack
                            sx={{
                                display: 'flex',
                                margin: '1rem',
                                gap: 1
                            }}
                        >
                            {gameListData?.isOwned
                                ? (
                                <Button onClick={() => {
                                    setEditMode(!editMode);
                                }}>
                                    {t('edit_list')}
                                </Button>)
                                : (
                                    <Button onClick={() => {
                                        userGameListService.copyUserGameList(listId.id).then(data => {navigate(`/account/lists/${data.uuid}`)});
                                    }}>
                                        {t('copy_list')}
                                    </Button>
                                )
                            }
                            {editMode && (
                                <>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 5,
                                            width: '50rem'
                                        }}
                                    >

                                        <FormControl
                                            orientation="horizontal"
                                            sx={{width: '25rem', justifyContent: 'space-between', marginTop: "0.75rem"}}
                                        >
                                            <div>
                                                <FormLabel>{t('is_public_switch')}</FormLabel>
                                                <FormHelperText>{t('is_public_switch_hint')}</FormHelperText>
                                            </div>
                                            <Switch
                                                checked={isPublic}
                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                                                    setIsPublic(event.target.checked)}
                                                color={isPublic ? 'success' : 'neutral'}
                                                variant={isPublic ? 'solid' : 'outlined'}
                                                endDecorator={isPublic ?  t('on') :  t('off')}
                                                slotProps={{
                                                    endDecorator: {
                                                        sx: {
                                                            minWidth: 24,
                                                        },
                                                    },
                                                }}
                                            />
                                        </FormControl>
                                    </Box>
                                    <Box
                                        component="form"
                                        onSubmit={handleEditSubmit}
                                        sx={{
                                            marginTop: "0.5rem",
                                        }}
                                    >
                                        <FormControl>
                                            <FormLabel
                                                sx={{
                                                    marginTop: "0.5rem",
                                                }}
                                            >
                                                {t('change_list_title')}
                                            </FormLabel>
                                            <Input
                                                placeholder={t('list_title')}
                                                value={listTitle || ''}
                                                onChange={(event) => setListTitle(event.target.value)}
                                            />
                                        </FormControl>

                                        <FormControl sx={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
                                            <FormLabel>
                                                {t('change_list_description')}
                                            </FormLabel>
                                            <Textarea
                                                minRows={2}
                                                placeholder={t('description')}
                                                value={listDescription || ''}
                                                onChange={(event) => setListDescription(event.target.value)}
                                                sx={{height: "5rem"}}
                                            />
                                        </FormControl>
                                        <Button
                                            variant="solid"
                                            color="primary"
                                            type="submit"
                                            fullWidth
                                        >
                                            {t('save_changes')}
                                        </Button>
                                    </Box>
                                    <Button
                                        onClick={() => {
                                            userGameListService.deleteUserGameList(listId.id).then(() => navigate("/account/lists", {replace: true}))
                                        }}
                                    >
                                        {t('delete_list')}
                                    </Button>
                                </>
                            )}
                        </Stack>
                    </>
                )}
                {error && (
                    <NotFoundPage/>
                )}
            </Container>
        </>
    );
}

export default UserCollectionPage;