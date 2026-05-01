import React, {useEffect, useState} from "react";
import {UserStats, userStatsService} from "../../api/services/userStatsService";
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    Stack,
    Tab,
    tabClasses,
    TabList,
    TabPanel,
    Tabs,
    Typography
} from "@mui/joy";
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
            <Stack id="user-tabs"
                   direction="row"
                   sx={{paddingTop: '0.5rem'}}
            >
                <Stack
                    direction="column"
                    sx={{
                        justifyContent: "start",
                        alignItems: "center",
                    }}
                >
                    <Card className="mb-4"
                          style={{ display: "flex", justifyContent: "center", marginRight: "15px", width: "20rem"}}
                          sx={{
                              height: '17.5rem',
                              gap: 0.5,
                              marginBottom: 1,
                              borderRadius: 'xl'
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
                                    <Avatar variant="plain" sx={{width: 64, height: 64}} src={avatarSrc}/>
                                </div>
                                <h3 style={{textAlign: 'center'}}>{userInfo?.username}</h3>
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
                                <Chip size="lg" variant="outlined">
                                    {t('avg_rating')}: {userInfo?.averageRating ? userInfo?.averageRating?.toFixed(1) : 0}
                                </Chip>
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

                <Stack direction="column"
                       spacing={2}
                >
                    <Stack direction="row"
                           spacing={2}
                           sx={{justifyContent: 'space-between', paddingBottom: '1.5rem'}}
                    >
                        <Card sx={{width: '10rem', height: '6rem'}}>
                            <CardContent>
                                <Typography level="h2">
                                    {userInfo?.totalGames}
                                </Typography>
                                <h6>{t('total')}</h6>
                            </CardContent>
                        </Card>
                        <Card sx={{width: '10rem', height: '6rem'}}>
                            <CardContent>
                                <Typography level="h2">
                                    {userInfo?.totalCompletedAchievements}
                                </Typography>
                                <h6>{t('total_achievements_completed')}</h6>
                            </CardContent>
                        </Card>
                        <Card sx={{width: '10rem', height: '6rem'}}>
                            <CardContent>
                                <Typography level="h2">
                                    {userInfo?.totalNotes}
                                </Typography>
                                <h6>{t('notes_added')}</h6>
                            </CardContent>
                        </Card>
                        <Card sx={{width: '10rem', height: '6rem'}}>
                            <CardContent>
                                <Typography level="h2">
                                    {userInfo?.gamesByStatus["completed"]}
                                </Typography>
                                <h6>{t('status_completed')}</h6>
                            </CardContent>
                        </Card>
                    </Stack>
                    {userInfo != undefined && (<GameStatusChart stats={userInfo}/>)}
                </Stack>
            </Stack>
        </Box>
    );
}

export default UserInfoPage;