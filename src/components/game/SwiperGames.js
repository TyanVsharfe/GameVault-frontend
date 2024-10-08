import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import {Alert} from "react-bootstrap";
import {Swiper, SwiperSlide} from "swiper/react";
import React from "react";
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../../assets/styles/custom-swiper.css'

function SwiperGames({franchiseGames}) {
    const renderUserGames = () => {
        let gamesResultsOut = franchiseGames;
        console.log(gamesResultsOut);

        if (Array.isArray(gamesResultsOut)) {
            return (
                <Swiper
                    direction="horizontal"
                    slidesPerView={3}
                    spaceBetween={25}
                    //onSlideChange={() => console.log()}
                    onSwiper={(swiper) => console.log(swiper)}
                    modules={[Navigation, Pagination, Autoplay]}
                    navigation
                    // pagination
                    autoplay={{ delay:3500 }}
                    className="mySwiper"

                    style={{width: "800px", display: "flex", justifyContent: "center", paddingBottom: "20px"}}
                >
                    {
                        gamesResultsOut.map((game) => (
                            <SwiperSlide>
                                <Card data-bs-theme="dark" style={{ width: '95%', height: '30%'}}  className="text-center" border='secondary'>
                                    <Card.Img variant="top" src={game.cover?.url?.replace('t_thumb', 't_cover_big') || ''}/>
                                    <Card.Body style={{ height: '90%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                                        {/*<Card.Title style={{fontSize: '80%'}}>*/}
                                        {/*    <a href={`/game/${game.id}`}>{game.name}</a>*/}
                                        {/*</Card.Title>*/}
                                        {/*<Card.Text style={{fontSize: '100%'}}>*/}
                                        {/*    <Container>*/}
                                        {/*        /!*{game.platforms && (*!/*/}
                                        {/*        /!*    game.platforms.map((platform) => `${platform.abbreviation?.replace(' ', '-') || ''} `)*!/*/}
                                        {/*        /!*)}*!/*/}
                                        {/*    </Container>*/}
                                        {/*</Card.Text>*/}
                                        <Card.Link style={{textDecoration: "none", color: "white"}} href={`/game/${game.id}`}>{game.name}</Card.Link>
                                    </Card.Body>
                                    {/*<Card.Footer className="text-muted">*/}
                                    {/*    /!*{game.first_release_date*!/*/}
                                    {/*    /!*    ? new Date(game.first_release_date * 1000).toLocaleDateString()*!/*/}
                                    {/*    /!*    : game.release_dates && game.release_dates[0].y}*!/*/}
                                    {/*</Card.Footer>*/}
                                </Card>
                            </SwiperSlide>)
                        )
                    }
                </Swiper>
            )
        }
        else {
            return (
                <Container style={{textAlign: "center", maxWidth: "500px"}}>
                    <Alert>Games not found</Alert>
                </Container>
            )
        }
    };

    return (
        renderUserGames()
    );
}

export default SwiperGames;