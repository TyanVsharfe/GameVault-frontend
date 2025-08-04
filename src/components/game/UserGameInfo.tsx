import React, {useContext, useEffect} from 'react';
import Card from "react-bootstrap/Card";
import {useGameContext} from "./GameProdiver";
import {getScoreClass, statusColors} from "../../utils/Utils";
import {useTranslation} from "react-i18next";
import {Chip} from "@mui/joy";

function UserGameInfo() {
    const { t } = useTranslation();

    const { userRating, gameStatus } = useGameContext();

    return (
        <Card data-bs-theme="dark" style={{width: '16rem', marginBottom: '1rem'}} className="text-center">
            <Card.Header>{t('user_informaton')}:</Card.Header>
            <Card.Body style={{display: 'flex', justifyContent: 'space-between'}}>
                <h4 style={{margin: '0px'}}>
                    {t('status')}:
                </h4>
                <Chip size='lg' variant='solid' style={{backgroundColor: statusColors[gameStatus]}}>
                    {gameStatus == null ? t('none_status') : t(`status_${gameStatus.toLowerCase()}`)}
                </Chip>
            </Card.Body>
            <Card.Footer style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: "1.2rem"}}>
                <h4>
                    {t('score')}:
                </h4>
                {
                (userRating == null)
                    ?
                    <h4 style={{display: 'flex', justifyContent: 'center'}}>
                        {t('none_score')}
                    </h4>
                    :
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div className={getScoreClass(userRating)} style={{width: '3rem', height: '3rem', fontSize: "1rem", borderRadius: '10%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{userRating}</div>
                    </div>
               }
            </Card.Footer>
        </Card>
    );
}

export default UserGameInfo;