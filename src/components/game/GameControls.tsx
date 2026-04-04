import React, {useContext, useEffect, useState} from 'react';
import {enumStatus} from "../../utils/Enums"
import {userGameService} from "../../api/services/userGamesService";
import {useParams} from "react-router-dom";
import "../../assets/styles/game-card.css"
import {useGameContext} from "./provider/GameProdiver";
import {useTranslation} from "react-i18next";
import Select, {selectClasses} from '@mui/joy/Select';
import Option, { optionClasses } from '@mui/joy/Option';
import {
    Box,
    Button, Chip,
    Stack, Typography,
} from "@mui/joy";
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {statusColorsHard} from "../../utils/Utils";
import { GameMode } from '../../types/igdb.game.types';
import {UserMode} from "../../types/user.game.types";
import UserGameEditInfoModal from "../modal/UserGameEditInfoModal";

export interface GameControlsProps {
    gameModes: UserMode[] | GameMode[];
    isOverallRating: boolean;
    isOverallStatus: boolean;
    status: String;
}

const GameControls: React.FC<GameControlsProps> = ({ gameModes, isOverallRating, isOverallStatus, status: initStatus }) => {
    const { t } = useTranslation();

    const { userRating, setUserRating, gameStatus, setGameStatus, userModes } = useGameContext();
    const igdbId = useParams<{ id: string }>();
    const [show, setShow] = useState(false);
    const [status, setStatus] = useState(initStatus ?? "none");
    const [showStatuses, setShowStatuses] = useState(false);

    const [ checkedOverallStatus, setCheckedOverallStatus ] = React.useState<boolean>(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        setCheckedOverallStatus(isOverallStatus);
    }, [gameModes]);

    return (
        <>
            <Stack gap={2} style={{alignItems: 'flex-start'}}>
                {isOverallStatus || isOverallRating ? (
                    <Select
                        placeholder={checkedOverallStatus ? t(`status_${status}`) : t('change_status')}
                        indicator={<KeyboardArrowDown sx={{ color: '#fff' }}/>}
                        sx={{
                            width: '16rem',
                            fontWeight: 700,
                            transition: '0.2s',
                            backgroundColor: statusColorsHard[status],
                            color: '#fff !important',
                            border: 'none',
                            '--Select-placeholderOpacity': 1,
                            '--Icon-color': '#fff',
                            '&:hover': {
                                backgroundColor: statusColorsHard[status],
                                transform: 'scale(1.02)',
                            },
                            [`& .${selectClasses.indicator}`]: {
                                color: '#fff',
                                transition: '0.2s',
                                [`&.${selectClasses.expanded}`]: {
                                    transform: 'rotate(-180deg)',
                                },
                            },
                            [`& .${selectClasses.button}`]: {
                                color: '#fff !important',
                                '& > span': {
                                    color: '#fff !important',
                                    opacity: 1,
                                }
                            },
                            '& [class*="placeholder"]': {
                                color: '#fff !important',
                                opacity: '1 !important',
                            },
                        }}
                    >
                        {[
                            { id: 'completed', enum: enumStatus.Completed },
                            { id: 'playing', enum: enumStatus.Playing },
                            { id: 'planned', enum: enumStatus.Planned },
                            { id: 'abandoned', enum: enumStatus.Abandoned },
                        ].map((item) => (
                            <Option
                                key={item.id}
                                value={t(`status_${item.id}`)}
                                onClick={() => userGameService.updateGameStatus(igdbId.id, item.enum).then(() => {
                                    setGameStatus(item.id);
                                    setStatus(item.id);
                                })}
                                sx={{
                                    borderLeft: `4px solid ${statusColorsHard[item.id]}`,
                                    margin: '2px 4px',
                                    borderRadius: 'sm',
                                    color: statusColorsHard[item.id],
                                    '&:hover': {
                                        backgroundColor: `${statusColorsHard[item.id]}95`,
                                    },
                                    [`&.${optionClasses.selected}`]: {
                                        backgroundColor: statusColorsHard[item.id],
                                        color: '#fff',
                                    }
                                }}
                            >
                                {t(`status_${item.id}`)}
                            </Option>
                        ))}
                    </Select>
                ) : (
                    <>
                        <Button
                            size="sm"
                            variant="soft"
                            onClick={() => setShowStatuses(!showStatuses)}
                            style={{width:'100%'}}
                        >
                            {showStatuses ? t('hide_statuses') : t('show_statuses')}
                        </Button>
                        {showStatuses && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 0.5}}>
                                {userModes?.map((mode, i) => (
                                    <Stack direction='row' key={i} sx={{justifyContent: 'space-between', alignItems: 'center', gap: 1, textAlign: 'center'}}>

                                        <Typography sx={{fontSize: '1rem', color: 'black'}}>
                                            {t(`${mode.mode.replace('-','_')}`)}
                                        </Typography>

                                        <Chip
                                            size="sm"
                                            variant="solid"
                                            style={{backgroundColor: statusColorsHard[mode.status]}}
                                            sx={{
                                                fontSize: '0.95rem',
                                            }}
                                        >
                                            {mode.status == null
                                                ? t('none_status')
                                                : t(`status_${mode.status.toLowerCase()}`)}
                                        </Chip>
                                    </Stack>
                                ))}
                            </Box>
                        )}
                    </>
                )}
                <Stack style={{width: '14rem', maxWidth: '15rem', gap: '1rem'}} direction="row">
                    <Button style={{minWidth: '7.5rem'}} startDecorator={<EditIcon/>} onClick={handleShow}>
                        {t('edit')}
                    </Button>
                    <Button style={{minWidth: '7.5rem'}} startDecorator={<DeleteIcon/>} onClick={() => {userGameService.deleteUserGame(igdbId.id).then(() => window.location.reload())}}>
                        {t('remove')}
                    </Button>
                </Stack>
            </Stack>

            <UserGameEditInfoModal open={show} handleClose={handleClose} gameModes={gameModes} isOverallRating={isOverallRating} isOverallStatus={isOverallStatus} />
        </>
    );
}

export default GameControls;