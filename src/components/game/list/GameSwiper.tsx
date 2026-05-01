import {Swiper, SwiperSlide} from "swiper/react";
import React from "react";
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import '../../../assets/styles/custom-swiper.css'
import '../../../assets/styles/game-card.css'
import {AspectRatio, Box, Card, CardContent, CardOverflow, Link, Typography} from "@mui/joy";
import { IgdbGame } from "../../../types/igdb.game.types";
import {useTheme} from "next-themes";
import {getCategoryName} from "../../../utils/Enums";

interface SwiperGamesProps {
    franchiseGames: IgdbGame;
    t: (key: string) => string;
}

const GameSwiper: React.FC<SwiperGamesProps> = ({franchiseGames, t}) => {
    let gamesResultsOut = franchiseGames;
    const { theme } = useTheme();

    if (Array.isArray(gamesResultsOut)) {
        return (
            <Swiper
                direction="horizontal"
                slidesPerView={3}
                spaceBetween={25}
                onSwiper={(swiper) => console.log(swiper)}
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                // pagination
                autoplay={{ delay:3500 }}
                className="mySwiper"

                style={{width: "100%", display: "flex", justifyContent: "center"}}
            >
                {
                    gamesResultsOut.filter(g => g.cover?.url != null).map((game, index: number) => (
                        <SwiperSlide key={index} style={{display: "flex", justifyContent: "center", paddingTop: '0.5rem'}}>
                            <Card
                                variant="black"
                                style={{
                                    overflow: "hidden",
                                    border: "0px",
                                }}

                                sx={{
                                    width: "8rem",
                                    height: "12rem",
                                    display: "grid",
                                    gap: "0.2rem"
                                }}
                                className={`user-game-list-game-card user-game-list-game-card-background position-relative ${theme === 'light' ? 'bg-dark text-white' : 'text-light'}`}
                            >
                                <CardOverflow sx={{ flex: "0 0 auto" }}>
                                    <AspectRatio ratio="3/4" className="game-card__img-wrapper"
                                                 sx={{
                                                     width: "10rem",
                                                 }}
                                    >
                                        {game.cover?.url ? (
                                            <img
                                                src={game.cover?.url.replace("t_thumb", "t_cover_big")}
                                                alt={game.name}
                                                style={{
                                                    objectPosition: 'top',
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '13.5rem'
                                            }}>
                                                {game.name}
                                            </div>
                                        )}
                                    </AspectRatio>
                                </CardOverflow>
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 5,
                                        left: 5,
                                        px: 1.5,

                                        borderRadius: "1rem",
                                        backgroundColor: "rgba(0,0,0,0.35)",
                                        backdropFilter: "blur(4px)",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.4)",

                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        textAlign: "center",
                                        zIndex: 2,
                                    }}
                                >
                                    <Typography
                                        level="body-md"
                                        sx={{
                                            color: "#fff",
                                            fontWeight: 700,
                                            fontSize: `0.95rem`,
                                            textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                                        }}
                                    >
                                        {t(`${getCategoryName(game?.game_type?.id)}`)}
                                    </Typography>
                                </Box>

                                <CardOverflow sx={{padding: '0 0'}}>
                                    <CardContent sx={{paddingTop: '0'}}>
                                        <div style={{textAlign: "center", color: "white"}}>
                                            {game.first_release_date
                                                ? new Date(game.first_release_date * 1000).getFullYear()
                                                : game.release_dates && game.release_dates[0].y}
                                        </div>
                                    </CardContent>
                                </CardOverflow>
                                <Link
                                    overlay
                                    href={`/games/${game.id}`}
                                    underline="none"
                                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
                                >
                                </Link>
                            </Card>
                        </SwiperSlide>)
                    )
                }
            </Swiper>
        )
    }
    else {
        return (
            <Box style={{textAlign: "center", maxWidth: "500px"}}>
                <h3>Games not found</h3>
            </Box>
        )
    }
};

export default GameSwiper;