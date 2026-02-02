import Container from "react-bootstrap/Container";
import "../../assets/styles/style.css"
import "../../assets/styles/game-card.css"
import React, {useEffect, useState} from "react";
import {format, parseISO} from "date-fns";
import {ru} from "date-fns/locale";
import {achievementService} from "../../api/services/achievementService";
import {useTranslation} from "react-i18next";
import AccountTabs from "../../components/nav/AccountTabs";
import UserAchievementCard from "../../components/game/card/AchievementCard";
import {Button, Grid, Modal, ModalClose, ModalDialog} from "@mui/joy";
import {UserAchievment} from "../../types/achievement.types";
import AchievementModal from "../../components/modal/AchievementModal";

function UserAchievementsPage() {
    const { t, i18n } = useTranslation();
    const [ userAchievements, setUserAchievements ] = useState<UserAchievment[]>();
    const [ show, setShow ] = useState<boolean>(false);
    const [ selectedAchievement, setSelectedAchievement ] = useState<UserAchievment | null>(null);

    useEffect(() => {
        const userAchievments = achievementService.getUserAchievements(i18n.language);
        userAchievments.then((data: UserAchievment[]) => {
            setUserAchievements(data)
            console.log(data)
        })
    }, [i18n.language]);

    const formatDate = (dateString: string) => {
        try {
            return format(parseISO(dateString), "d MMMM yyyy", { locale: ru });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <AccountTabs/>
            <Grid className="mt-4"
                  container
                  spacing={2}
                  sx={{
                      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  }}
            >
                {userAchievements?.map((userAchievment, index) => {
                    return (
                        <Grid key={index} xs={12} sm={6} md={4} lg={3}>
                            <UserAchievementCard
                                handleShow={(achievement) => {
                                    setShow(true);
                                    setSelectedAchievement(achievement);
                                }}
                                uAchievement={userAchievment} t={t} />
                        </Grid>
                    );
                })}
            </Grid>

            <AchievementModal show={show} handleClose={() => setShow(false)} uAchievement={selectedAchievement} t={t}/>
        </Container>
    );
}

export default UserAchievementsPage;