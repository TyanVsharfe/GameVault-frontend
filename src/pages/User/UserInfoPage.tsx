import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import {Stack} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import {importSteamGames} from "../../services/steamGamesService";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import AccountNav from "../../components/AccountNav";
import {UserStats, getUserStats} from "../../services/userStatsService";
import {Avatar, Box, Chip} from "@mui/joy";
import ButtonMaterial from '@mui/joy/Button';
import {useTranslation} from "react-i18next";
import GameStatusChart from "../../components/game/GameStatusChart";

function UserInfoPage() {
    const { t } = useTranslation();

    const [ show, setShow ] = useState(false);
    const [ steamId, setSteamId ] = useState(false);
    const [ userInfo, setUserInfo ] = useState<UserStats>();
    const [activeTab, setActiveTab] = useState("statistics");

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
        const data = await getUserStats("VladPrakop");
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
        <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <AccountNav />

            <Tab.Container id="user-tabs" defaultActiveKey="statistics" onSelect={(k) => setActiveTab(k)}>
                <Row className="mt-4" style={{display: "flex", justifyContent: "center"}}>
                    <Col lg={4} className="mb-4" style={{ display: "flex", justifyContent: "center", marginRight: "15px"  }}>
                        <Card className="shadow-sm" style={{ width: "110rem"}}>
                            <Card.Body className="text-center">
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
                                    justifyContent: "space-around",
                                    textAlign: "center",
                                    marginTop: "24px"
                                }}>
                                    <div>
                                        <h5>{t('total')}</h5>
                                        <div style={{fontSize: "24px", fontWeight: "bold"}}>
                                            {userInfo?.totalGames}
                                        </div>
                                    </div>
                                    <div>
                                        <h5>{t('notes_added')}</h5>
                                        <div style={{fontSize: "24px", fontWeight: "bold"}}>
                                            {userInfo?.totalNotes}
                                        </div>
                                    </div>
                                    <div>
                                        <h5>{t('status_completed')}</h5>
                                        <div style={{fontSize: "24px", fontWeight: "bold"}}>
                                            {userInfo?.gamesByStatus["Completed"]}
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
                                    <Chip size="lg" variant="soft" color="primary">{t('avg_rating')}: {userInfo?.averageRating.toFixed(1)}</Chip>
                                </div>
                            </Card.Body>

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
                    </Col>

                    <Col style={{display: 'contents'}}>
                        <Tab.Content>
                            <Tab.Pane eventKey="statistics">
                            </Tab.Pane>

                            <Tab.Pane eventKey="recommendations">
                                <Card className="shadow-sm">
                                    <Card.Header className="bg-white">
                                        <h5 className="mb-0">Рекомендации для вас</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        {/*<p className="text-muted">*/}
                                        {/*    Здесь будут отображаться персонализированные рекомендации книг на основе ваших предпочтений,*/}
                                        {/*    истории чтения и интересов.*/}
                                        {/*</p>*/}

                                        {/*<div style={{ marginTop: "15px" }}>*/}
                                        {/*    <h6>Что можно добавить в этот раздел:</h6>*/}
                                        {/*    <ul>*/}
                                        {/*        <li>Рекомендации на основе часто читаемых жанров</li>*/}
                                        {/*        <li>Книги, популярные среди пользователей с похожими интересами</li>*/}
                                        {/*        <li>Новинки в ваших любимых жанрах</li>*/}
                                        {/*        <li>Книги того же автора, что вы уже читали</li>*/}
                                        {/*    </ul>*/}
                                        {/*</div>*/}
                                        <>
                                        </>
                                    </Card.Body>
                                </Card>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
                {/*<ReadingGoals />*/}
            </Tab.Container>
            {userInfo != undefined && (<GameStatusChart stats={userInfo}/>)}
        </Container>
    );
}

export default UserInfoPage;