import Container from "react-bootstrap/Container";
import {Row} from "react-bootstrap";

import "../../assets/styles/style.css"
import "../../assets/styles/game-card.css"
import React, {useEffect, useState} from "react";
import {format, parseISO} from "date-fns";
import {ru} from "date-fns/locale";
import {getUserAchievements, UserAchievment} from "../../services/achievementService";
import {useTranslation} from "react-i18next";
import AccountTabs from "../../components/nav/AccountTabs";
import UserAchievementCard from "../../components/game/card/AchievementCard";
import {Grid, Stack} from "@mui/joy";

function UserAchievementsPage() {
    const { t, i18n } = useTranslation();
    const [userAchievments, setUserAchievments] = useState<UserAchievment[]>();

    useEffect(() => {
        const userAchievments = getUserAchievements(i18n.language);
        userAchievments.then((data: UserAchievment[]) => {
            setUserAchievments(data)
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
                {userAchievments?.map((userAchievment, index) => {
                    return (
                        <Grid key={index} xs={12} sm={6} md={4} lg={3}>
                            <UserAchievementCard uAchievement={userAchievment} t={t} />
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
}

export default UserAchievementsPage;