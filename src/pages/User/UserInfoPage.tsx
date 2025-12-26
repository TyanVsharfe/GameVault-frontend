import React, {useEffect, useState} from "react";
import {UserStats, userStatsService} from "../../api/services/userStatsService";
import {Avatar, Box, Card, CardContent, Chip, Stack, Tab, tabClasses, TabList, TabPanel, Tabs} from "@mui/joy";
import {useTranslation} from "react-i18next";
import GameStatusChart from "../../components/game/stats/GameStatusChart";
import AccountTabs from "../../components/nav/AccountTabs";
import {useTheme} from "next-themes";

function UserInfoPage() {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const [ show, setShow ] = useState(false);
    const [ steamId, setSteamId ] = useState(false);
    const [ userInfo, setUserInfo ] = useState<UserStats>();
    const [activeTab, setActiveTab] = useState(0);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const steamIdInputChange = (e) => setSteamId(e.target.value);

    useEffect(() => {
        getStats();
    }, []);

    const getStats = async () => {
        const response = await fetch('api/statistics', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await userStatsService.getOwnUserStats();
        console.log(data);
        setUserInfo(data);
    };

    const [avatarSrc, setAvatarSrc] = React.useState<string | undefined>(undefined);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <AccountTabs/>
             {/*onChange={(e, newValue) => setActiveEdit(newValue)}*/}
            <Box id="user-tabs"
            >
                <Stack className="mt-4"
                       direction="row"
                       spacing={2}
                       sx={{
                           justifyContent: "center",
                           alignItems: "center",
                       }}
                >
                    <Card className="mb-4 shadow-sm" style={{ display: "flex", justifyContent: "center", marginRight: "15px", width: "30rem", border: "none"}}
                          sx={{
                              gap: 0.5,
                              marginBottom: 1,
                              borderRadius: 'xl',
                              bgcolor: theme === 'dark' ? 'background.level1' : 'background.level1',
                          }}
                    >
                        <CardContent
                            className="text-center"
                        >
                            <div className="mb-3">
                                {/*<div style={{*/}
                                {/*    width: "80px",*/}
                                {/*    height: "80px",*/}
                                {/*    borderRadius: "50%",*/}
                                {/*    backgroundColor: "#8884d8",*/}
                                {/*    display: "flex",*/}
                                {/*    alignItems: "center",*/}
                                {/*    justifyContent: "center",*/}
                                {/*    color: "white",*/}
                                {/*    fontSize: "24px",*/}
                                {/*    margin: "0 auto 15px"*/}
                                {/*}}>*/}
                                {/*    {userInfo?.username}*/}
                                {/*</div>*/}
                                <div style={{display: 'flex', justifyContent: 'center', padding: '1rem'}}>
                                    <Avatar sx={{width: 64, height: 64}} alt="Upload new avatar" src={avatarSrc}/>
                                </div>
                                <h3>{userInfo?.username}</h3>
                                {/*<Badge bg={userInfo?.subscription === "Premium" ? "success" : "secondary"}*/}
                                {/*       className="px-3 py-2">*/}
                                {/*    {userInfo?.subscription}*/}
                                {/*</Badge>*/}
                            </div>

                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                textAlign: "left",
                                marginTop: "24px",
                                width: '80%',
                                margin: 'auto'
                            }}>
                                <div>
                                    <div>
                                        <h5>{t('total')}</h5>
                                        <div style={{fontSize: "24px", fontWeight: "bold"}}>
                                            {userInfo?.totalGames}
                                        </div>
                                    </div>
                                    <div>
                                        <h5>{t('total_achievements_completed')}</h5>
                                        <div style={{fontSize: "24px", fontWeight: "bold"}}>
                                            {userInfo?.totalCompletedAchievements}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <h5>{t('notes_added')}</h5>
                                        <div style={{fontSize: "24px", fontWeight: "bold"}}>
                                            {userInfo?.totalNotes}
                                        </div>
                                    </div>
                                    <div>
                                        <h5>{t('status_completed')}</h5>
                                        <div style={{fontSize: "24px", fontWeight: "bold"}}>
                                            {userInfo?.gamesByStatus["completed"]}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-around",
                                textAlign: "center",
                                marginTop: "24px"
                            }}>
                                {/*{Object.entries(userInfo?.gamesByStatus || {}).map(([status, count]) => (*/}
                                {/*    <div key={status}>*/}
                                {/*        <h5>*/}
                                {/*            {t(`status_${status.toLowerCase()}`)}*/}
                                {/*        </h5>*/}
                                {/*        <div style={{fontSize: "24px", fontWeight: "bold"}}>*/}
                                {/*            {count}*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*))}*/}
                                <Chip size="lg" variant="soft" color="primary">{t('avg_rating')}: {userInfo?.averageRating ? userInfo?.averageRating?.toFixed(1) : 0}</Chip>
                            </div>
                        </CardContent>

                        {/*<Card.Footer className="bg-white">*/}
                        {/*    <Nav variant="pills" className="flex-column">*/}
                        {/*        <Nav.Item>*/}
                        {/*            <Nav.Link eventKey="statistics">Статистика</Nav.Link>*/}
                        {/*        </Nav.Item>*/}
                        {/*        <Nav.Item>*/}
                        {/*            <Nav.Link eventKey="recommendations">Рекомендации</Nav.Link>*/}
                        {/*        </Nav.Item>*/}
                        {/*    </Nav>*/}
                        {/*</Card.Footer>*/}
                    </Card>
                </Stack>
            </Box>
            {userInfo != undefined && (<GameStatusChart stats={userInfo}/>)}
        </Box>
    );
}

export default UserInfoPage;