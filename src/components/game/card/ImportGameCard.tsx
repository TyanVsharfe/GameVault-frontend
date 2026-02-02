import React from "react";
import {useTheme} from "next-themes";
import {Col} from "react-bootstrap";
import {Card, CardContent, Checkbox, Chip, Divider, Link} from "@mui/joy";
import { IgdbGame } from "../../../types/igdb.game.types";

interface ImportGameCardProps {
    game: IgdbGame;
    t: (key: string) => string;
    onSwitchChange: (gameId: number) => void;
}

export const ImportGameCard: React.FC<ImportGameCardProps> = ({ game, t, onSwitchChange }) => {
    const { theme } = useTheme();
    const coverUrl = game?.cover?.replace("t_thumb", "t_cover_big");

    return (
        <Card data-bs-theme='dark' className='user-game-list-game-card text-center'
              style={{
                  width: '9.5rem',
                  height: '18.25rem',
                  backgroundColor: "rgba(30, 30, 30, 1)",
                  overflow: "hidden",
                  border: "0px",
                  padding: "0px",

                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.25rem'
              }}
        >
            <img className='game__cover' variant='top' src={coverUrl} />
            <CardContent
                className='game__body'
                sx={{
                    alignItems: 'center'
                }}
            >
                <div>
                    <Link
                        href={`/games/${game.id}`}
                        style={{
                            textDecoration: 'none',
                            color: 'white',
                            cursor: 'pointer',

                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '0 0.4rem',
                            height: "3rem",
                        }}
                    >
                        {game.name}
                    </Link>
                </div>
                {/*<Chip style={{width:'200%'}}*/}
                {/*      onClick={() => ""}*/}
                {/*>*/}
                {/*    {game.game_type != null ? t(CategoryIGDB[game.game_type.id]) : null}*/}
                {/*</Chip>*/}

                <Chip
                    sx={{
                        width: '100px',
                        minWidth: '100px',
                        justifyContent: 'center'
                    }}
                >
                    <Checkbox
                        variant="outlined"
                        disableIcon
                        overlay
                        label={game.isChecked ? t('selected') : t('select')}
                        checked={game.isChecked}
                        onChange={() => onSwitchChange(game.id)}
                    />
                </Chip>
                {/*<Link*/}
                {/*   overlay*/}
                {/*   href={`/games/${game.id}`}*/}
                {/*   underline="none"*/}
                {/*   sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}*/}
                {/*>*/}
                {/*</Link>*/}
            </CardContent>
        </Card>
    );
};

export default ImportGameCard;