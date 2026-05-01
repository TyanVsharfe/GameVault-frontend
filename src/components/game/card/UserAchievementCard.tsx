import React from "react";
import {Box, Card, CardContent, LinearProgress, Tooltip} from "@mui/joy";
import {formatDate } from "../../../utils/Utils";
import "../../../assets/styles/game-card.css"
import {useTheme} from "next-themes";
import {UserAchievment} from "../../../types/achievement.types";

interface UserAchievementCardProps {
    handleShow: (achievement: UserAchievment) => void;
    uAchievement: UserAchievment;
    t: (key: string) => string;
}

const UserAchievementCard: React.FC<UserAchievementCardProps> = ({ uAchievement, handleShow, t }) => {
    const { name, requiredCount, iconUrl, description, id } = uAchievement.achievement;
    const { currentProgress, achievedAt } = uAchievement;
    const percentage = Math.min(Math.round((currentProgress / requiredCount) * 100), 100);
    const { theme } = useTheme();

    return (
        <Card
            style={{
                width: "100%", height: "9.5rem", maxWidth: "15.625rem",
                textAlign: "center", padding: "10px"
            }}
            className={`${theme === 'dark' ? 'bg-dark text-white' : ''}`}
        >
            {/*{iconUrl && <Card.Img variant="top" src={iconUrl} styles={{ maxHeight: "80px", objectFit: "contain" }} />}*/}
            <CardContent style={{justifyContent: "space-between"}}>
                <div id="card-title" style={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    height: "2.8rem",
                }}>
                    <Tooltip title={description} arrow size="lg" variant="plain" placement="bottom"
                             onClick={() => handleShow(uAchievement)}
                    >
                        <div className="user-game-list-game-card__title text-center"
                             style={{ cursor: 'pointer' }}>
                            {name}
                        </div>
                    </Tooltip>
                </div>
                {achievedAt ? (
                        <div style={{fontSize: "0.9rem", color: "#666", padding: "0.5rem", paddingTop: "0", height: "2rem"}}>
                            Получено: {formatDate(achievedAt)}
                        </div>)
                    : (<div style={{padding: "0.5rem", paddingTop: "0", height: "2rem"}}></div>)}
                <div>
                    <LinearProgress
                        determinate
                        variant="soft"
                        size="lg"
                        value={percentage}
                        style={{marginBottom: "10px"}}
                    />
                    <div style={{fontSize: "0.9rem", color: "#666"}}>
                        {currentProgress > requiredCount ? (`${requiredCount} / ${requiredCount}`) : (`${currentProgress} / ${requiredCount}`)}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserAchievementCard;