import "../../assets/styles/style.css"
import "../../assets/styles/game-card.css"
import React, {useEffect, useState} from "react";
import {format, parseISO} from "date-fns";
import {ru} from "date-fns/locale";
import {achievementService} from "../../api/services/achievementService";
import {useTranslation} from "react-i18next";
import AccountTabs from "../../components/nav/AccountTabs";
import UserAchievementCard from "../../components/game/card/UserAchievementCard";
import {Box, Button, Grid, Modal, ModalClose, ModalDialog} from "@mui/joy";
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
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                maxWidth: '80rem',
                mx: "auto",
            }}
        >
            <AccountTabs/>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(auto-fill, minmax(15.5rem, 1fr))',
                        sm: 'repeat(auto-fill, minmax(15.75rem, 1fr))',
                        md: 'repeat(auto-fill, minmax(15.5rem, 1fr))'
                    },
                    width: '100%',
                    mx: 'auto',
                    mt: '1rem',
                    pb: '0.75rem',
                    gap: { xs: 1, sm: 1.5, md: 2 },
                    justifyItems: 'center'
                }}
            >
                {userAchievements?.map((userAchievment, index) => {
                    return (
                        <UserAchievementCard
                            handleShow={(achievement) => {
                                setShow(true);
                                setSelectedAchievement(achievement);
                            }}
                            uAchievement={userAchievment} t={t} />
                    );
                })}
            </Box>

            <AchievementModal show={show} handleClose={() => setShow(false)} uAchievement={selectedAchievement} t={t}/>
        </Box>
    );
}

export default UserAchievementsPage;