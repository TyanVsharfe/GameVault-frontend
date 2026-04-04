import React, {useEffect, useState} from 'react';
import Card from "react-bootstrap/Card";
import {useGameContext} from "./provider/GameProdiver";
import {getScoreClass, statusColors} from "../../utils/Utils";
import {useTranslation} from "react-i18next";
import { Button, Chip} from "@mui/joy";
import { Typography, Box } from '@mui/joy';

type Props = {
    isOverallStatus: boolean;
};

function UserGameInfo({isOverallStatus}: Props) {
    const { t } = useTranslation();

    const { userRating, gameStatus, userModes } = useGameContext();
    const [showStatuses, setShowStatuses] = useState(false);

    useEffect(() => {
        console.log(userModes);
    }, [isOverallStatus]);

    return (
        <Card data-bs-theme="dark" style={{width: '16rem', marginBottom: '1rem', border: '0px'}} className="text-center">
            <Card.Header>{t('user_informaton')}:</Card.Header>
            <Card.Body style={{fontSize: "1.2rem"}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', verticalAlign: 'middle'}}>
                    {((userModes?.length ?? 0) < 2 || isOverallStatus)
                        ? (
                            <>
                                <h4 style={{margin: "0px"}}>
                                    {t('status')}:
                                </h4>
                                <Chip size='lg' variant='solid' style={{backgroundColor: statusColors[gameStatus ?? "none"]}}
                                      sx={{
                                          fontSize: '1rem',
                                          padding: '0.2rem 1rem',
                                      }}
                                >
                                    {gameStatus == null ? t('none_status') : t(`status_${gameStatus.toLowerCase()}`)}
                                </Chip>
                            </>
                        )
                        : (
                            <>
                                <Button
                                    size="sm"
                                    variant="soft"
                                    onClick={() => setShowStatuses(!showStatuses)}
                                    style={{width:'100%'}}
                                >
                                    {showStatuses ? t('hide_statuses') : t('show_statuses')}
                                </Button>
                            </>
                        )
                    }
                </div>
                <Box>
                    {showStatuses && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, marginBottom: '1rem'}}>
                            {userModes?.map((mode, i) => (
                                <Box key={i} sx={{flexDirection: 'column', alignItems: 'center', gap: 1, textAlign: 'center'}}>

                                    <Typography sx={{ minWidth: '8.5rem', fontSize: '1.15rem', color: 'white'}}>
                                        {t(`${mode.mode.replace('-','_')}`)}
                                    </Typography>

                                    <Chip
                                        size="sm"
                                        variant="solid"
                                        style={{backgroundColor: statusColors[mode.status]}}
                                        sx={{
                                            fontSize: '0.95rem',
                                        }}
                                    >
                                        {mode.status == null
                                            ? t('none_status')
                                            : t(`status_${mode.status.toLowerCase()}`)}
                                    </Chip>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <h4 style={{margin: "0px"}}>
                        {t('score')}:
                    </h4>
                    {
                        (userRating == null)
                            ?
                            <h4 style={{display: 'flex', justifyContent: 'center'}}>
                                {t('none_score')}
                            </h4>
                            :
                            <Chip size='lg' variant='solid' className={getScoreClass(userRating)}
                                  sx={{
                                      fontSize: '1rem',
                                      padding: '0.2rem 1rem',
                                      maxWidth: 'none',
                                      whiteSpace: 'normal',
                                      width: '5rem'
                                  }}
                            >
                                {userRating}
                            </Chip>
                    }
                </div>
            </Card.Body>
            <Card.Footer
                style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: "1.2rem"}}>

            </Card.Footer>
        </Card>
    );
}

export default UserGameInfo;