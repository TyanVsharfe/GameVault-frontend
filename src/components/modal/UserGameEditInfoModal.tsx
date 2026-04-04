import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Button,
    FormControl,
    FormLabel,
    FormHelperText,
    Modal,
    ModalClose,
    ModalDialog,
    Stack,
    Switch,
    Typography,
    Sheet,
    Select,
    Option,
    Input,
    Box,
    Divider, Slider, Card,
    CardContent
} from "@mui/joy";
import PersonIcon from '@mui/icons-material/Person';
import GroupsIcon from '@mui/icons-material/Groups';
import { calculateUserRating, userGameService } from "../../api/services/userGamesService";
import { enumStatus } from "../../utils/Enums";
import { UserMode } from "../../types/user.game.types";
import { GameMode } from '../../types/igdb.game.types';
import { useGameContext } from "../game/provider/GameProdiver";

export interface GameControlsProps {
    gameModes: (UserMode | GameMode)[];
    isOverallRating: boolean;
    isOverallStatus: boolean;
    open: boolean;
    handleClose: () => void;
}

const UserGameEditInfoModal: React.FC<GameControlsProps> = ({
                                                                gameModes,
                                                                isOverallRating,
                                                                isOverallStatus,
                                                                open,
                                                                handleClose
                                                            }) => {
    const {t} = useTranslation();
    const {id: igdbId} = useParams<{id: string}>();

    const {userRating, setUserRating, gameStatus, setGameStatus} = useGameContext();

    const [tempUserRating, setTempUserRating] = useState(userRating);
    const [tempModesChanges, setTempModesChanges] = useState<Record<string, {status?: string; userRating?: number}>>({});

    const [checkedOverallRating, setCheckedOverallRating] = useState<boolean>(isOverallRating);
    const [checkedOverallStatus, setCheckedOverallStatus] = useState<boolean>(isOverallStatus);

    const [graphicsRating, setGraphicsRating] = useState(5);
    const [storyRating, setStoryRating] = useState(5);
    const [gameplayRating, setGameplayRating] = useState(5);

    const graphicsSliderChange = (e: Event, newValue: number | number[]) => setGraphicsRating(newValue as number);
    const storySliderChange = (e: Event, newValue: number | number[]) => setStoryRating(newValue as number);
    const gameplaySliderChange = (e: Event, newValue: number | number[]) => setGameplayRating(newValue as number);

    const getTempValue = (modeName: string, field: 'status' | 'userRating', fallback: any) =>
        tempModesChanges[modeName]?.[field] ?? fallback;

    const setTempValue = (modeName: string, field: 'status' | 'userRating', value: any) =>
        setTempModesChanges(prev => ({
            ...prev,
            [modeName]: { ...prev[modeName], [field]: value }
        }));

    const isUserMode = (mode: any): mode is UserMode => 'mode' in mode;

    const resetInfo = () => {
        setGraphicsRating(5);
        setStoryRating(5);
        setGameplayRating(5);
    }

    useEffect(() => {
        setTempModesChanges(
            Object.fromEntries(
                gameModes
                    .filter(isUserMode)
                    .map(mode => [mode.mode, { status: mode.status, userRating: mode.userRating }])
            )
        );
    }, [gameModes]);

    useEffect(() => {
        let rat = calculateUserRating(graphicsRating, storyRating, gameplayRating);
        setTempUserRating(rat);
    }, [graphicsRating, storyRating, gameplayRating]);

    return (
        <Modal open={open}
               onClose={() => {
                   resetInfo();
                   handleClose();
               }}
        >
            <ModalDialog sx={{ minWidth: 775, p: 0, borderRadius: 'md' }}>
                {/* Header */}
                <Box
                    sx={{
                        px: 2,
                        py: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box>
                        <Typography level="h3">
                            {t('edit_user_game_info_modal.title')}
                        </Typography>
                        <Typography level="body-sm" textColor="text.tertiary">
                            {t('edit_user_game_info_modal.description')}
                        </Typography>
                    </Box>
                    <ModalClose />
                </Box>

                <Box
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        maxHeight: '70vh',
                        overflowY: 'auto'
                    }}
                >

                    {/* Overall Settings */}
                    <Sheet
                        variant="soft"
                        sx={{
                            p: 3,
                            borderRadius: 'xl',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <Typography level="title-sm" sx={{ textTransform: 'uppercase', opacity: 0.6 }}>
                            {t('edit_user_game_info_modal.global_configuration')}
                        </Typography>

                        {/* Overall Status Toggle */}
                        <Box>
                            <Stack direction='row' sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography fontWeight="lg">
                                        {t('overall_status')}
                                    </Typography >
                                    <Typography level="body-sm" textColor="text.tertiary">
                                        {t('overall_status_hint')}
                                    </Typography >
                                </Box>
                                <Switch
                                    checked={checkedOverallStatus}
                                    onChange={(e) => setCheckedOverallStatus(e.target.checked)}
                                />
                            </Stack>

                            {checkedOverallStatus && (
                                <Sheet
                                    variant="outlined"
                                    sx={{ p: 1.25, marginTop: '0.5rem', borderRadius: 'lg' }}
                                >
                                    <FormControl>
                                        <Select
                                            placeholder={t('select_status')}
                                            value={gameStatus}
                                            onChange={(_, value) => {
                                                userGameService.updateGameStatus(igdbId, value as any).then(() => setGameStatus(value));
                                            }}
                                        >
                                            {Object.values(enumStatus).map((s) => (
                                                <Option key={s} value={s.toLowerCase()}>{t(`status_${s.toLowerCase()}`)}</Option>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Sheet>
                            )}
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        {/* Overall Rating Toggle */}
                        <Box>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography fontWeight="lg">
                                        {t('overall_rating')}
                                    </Typography>
                                    <Typography level="body-sm" textColor="text.tertiary">
                                        {t('overall_rating_hint')}
                                    </Typography>
                                </Box>
                                <Switch
                                    checked={checkedOverallRating}
                                    onChange={(e) => setCheckedOverallRating(e.target.checked)}
                                />
                            </Stack>

                            {checkedOverallRating && (
                                <Sheet variant="outlined" sx={{ p: 3, marginTop: '0.5rem', borderRadius: 'xl' }}>
                                    <FormControl>
                                        <Stack gap={2}>
                                            <Stack direction='row' justifyContent="space-between">
                                                <Stack direction='row' gap={5}>
                                                    <Box>
                                                        <Typography level="body-xs" textColor="text.tertiary">
                                                            {t('previous_score')}
                                                        </Typography>
                                                        <Typography level="title-md">{userRating || 0}</Typography>
                                                    </Box>

                                                    <Divider orientation="vertical" />

                                                    <Box>
                                                        <Typography level="body-xs" color="primary">
                                                            {t('new_score')}
                                                        </Typography>
                                                        <Typography level="h2">
                                                            {tempUserRating || 0}
                                                            <Typography component="span" level="body-sm" ml={1}>
                                                                / 100
                                                            </Typography>
                                                        </Typography>
                                                    </Box>
                                                </Stack>

                                                <Button
                                                    variant="plain"
                                                    sx={{width: '5rem', height: '2rem', fontSize: '1rem', fontWeight: 'normal'}}
                                                    onClick={() => {
                                                        handleClose();
                                                        userGameService.updateGameRating(igdbId, {resetUserRating: true})
                                                            .then(() => setUserRating(undefined));
                                                    }}
                                                    color="danger">
                                                    {t('reset')}
                                                </Button>
                                            </Stack>

                                            <Stack gap={3}>
                                                <Stack direction="row" gap={4} alignItems="center">
                                                    <Typography sx={{ width: '6rem' }}>{t('graphics')}: {graphicsRating}</Typography>
                                                    <Slider
                                                        marks
                                                        value={graphicsRating}
                                                        max={10}
                                                        onChange={graphicsSliderChange}
                                                        sx={{ width: '70%' }}
                                                    />
                                                </Stack>

                                                <Stack direction="row" gap={4} alignItems="center">
                                                    <Typography sx={{ width: '6rem' }}>{t('story')}: {storyRating}</Typography>
                                                    <Slider
                                                        marks
                                                        value={storyRating}
                                                        max={10}
                                                        onChange={storySliderChange}
                                                        sx={{ width: '70%' }}
                                                    />
                                                </Stack>

                                                <Stack direction="row" gap={4} alignItems="center">
                                                    <Typography sx={{ width: '6rem' }}>{t('gameplay')}: {gameplayRating}</Typography>
                                                    <Slider
                                                        marks
                                                        value={gameplayRating}
                                                        max={10}
                                                        onChange={gameplaySliderChange}
                                                        sx={{ width: '70%' }}
                                                    />
                                                </Stack>
                                            </Stack>
                                        </Stack>
                                    </FormControl>
                                </Sheet>
                            )}
                        </Box>
                    </Sheet>

                    {/* Individual Modes */}
                    {!(checkedOverallStatus && checkedOverallRating) && (
                        <Stack gap={1}>
                            <Typography level="title-sm" sx={{ mt: 1 }}>Individual Modes</Typography>
                            <Stack gap={2}>
                                {gameModes.map((mode, index) => {
                                    const modeName = isUserMode(mode) ? mode.mode : mode.slug;
                                    const currentStatus = isUserMode(mode) ? mode.status : 'none';
                                    const currentScore = isUserMode(mode) ? mode.userRating : 0;

                                    return (
                                        <Sheet key={index} variant="outlined" sx={{ p: 2, borderRadius: 'md' }}>
                                            <Typography
                                                level="title-sm"
                                                startDecorator={modeName.includes('multiplayer')
                                                    ? <GroupsIcon color="primary" />
                                                    : <PersonIcon color="primary" />}
                                                sx={{ mb: 2 }}
                                            >
                                                {t(`${modeName.replace('-', '_')}`)}
                                            </Typography>

                                            <Stack direction='row'
                                                   sx={{ gap: 2, display: 'flex', justifyContent: 'space-between' }}
                                                // sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}
                                            >
                                                <Stack direction='row' gap={2}>
                                                    {!checkedOverallStatus && (
                                                        <FormControl size="sm" disabled={checkedOverallStatus} sx={{width: '10rem'}}>
                                                            <FormLabel style={{textTransform: 'uppercase'}}>{t('status')}</FormLabel>
                                                            <Select
                                                                value={tempModesChanges[modeName]?.status ?? currentStatus}
                                                                onChange={(_, value) => setTempModesChanges(prev => ({
                                                                    ...prev,
                                                                    [modeName]: { ...prev[modeName], status: value as string }
                                                                }))}
                                                            >
                                                                {Object.values(enumStatus).map((s) => (
                                                                    <Option key={s} value={s.toLowerCase()}>{t(`status_${s.toLowerCase()}`)}</Option>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                    {!checkedOverallRating && (
                                                        <FormControl size="sm" disabled={checkedOverallRating}>
                                                            <FormLabel style={{textTransform: 'uppercase'}}>{t('score')}</FormLabel>
                                                            <Input
                                                                type="number"
                                                                sx={{width: '6rem'}}
                                                                endDecorator={<Typography level="body-xs" sx={{margin: 0}}>/100</Typography>}
                                                                value={tempModesChanges[modeName]?.userRating ?? currentScore ?? ''}
                                                                onChange={(e) => setTempModesChanges(prev => ({
                                                                    ...prev,
                                                                    [modeName]: { ...prev[modeName], userRating: Number(e.target.value) }
                                                                }))}
                                                            />
                                                        </FormControl>
                                                    )}
                                                </Stack>

                                                <Stack direction="row" sx={{display: 'flex', justifyContent: 'space-between', width: '14rem', alignItems: 'end'}}>
                                                    <Button variant="plain" color="neutral"
                                                            sx={{width: '12.5rem', fontSize: '1rem', fontWeight: 'normal', padding: 0, margin: 0}}
                                                            onClick={() => {
                                                                const original = gameModes.find(m => isUserMode(m) && m.mode === modeName) as UserMode;
                                                                if (original) {
                                                                    setTempModesChanges(prev => ({
                                                                        ...prev,
                                                                        [modeName]: { status: original.status, userRating: original.userRating }
                                                                    }));
                                                                }
                                                                resetInfo();
                                                                // handleClose();
                                                            }}
                                                    >
                                                        {t('cancel')}
                                                    </Button>
                                                    <Button variant="solid"
                                                            sx={{width: '12.5rem', fontSize: '1rem', fontWeight: 'normal', padding: 0, margin: 0}}
                                                            onClick={() => {
                                                                const changes = tempModesChanges[modeName];
                                                                userGameService.updateUserGame(igdbId, modeName, {status: changes.status, ratingParams: {rating: changes.userRating}})
                                                                setTempModesChanges(prev => { const next = {...prev}; delete next[modeName]; return next; });
                                                                // handleClose();
                                                            }}
                                                    >
                                                        {t('save')}
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        </Sheet>
                                    );
                                })}
                            </Stack>
                        </Stack>
                    )}
                </Box>

                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Button variant="plain" color="neutral"
                            onClick={() => {
                                resetInfo();
                                handleClose();
                            }}
                    >
                        {t('cancel')}
                    </Button>
                    <Button variant="solid"
                            onClick={() => {
                                if (tempUserRating != userRating)
                                    userGameService.updateGameRating(igdbId, {rating: tempUserRating})
                                        .then(() => setUserRating(tempUserRating));
                                handleClose();
                            }}
                    >
                        {t('save_changes')}
                    </Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
};

export default UserGameEditInfoModal;