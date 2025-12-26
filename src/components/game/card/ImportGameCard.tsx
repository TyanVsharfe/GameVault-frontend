import {IgdbGame} from "../../../api/services/igdbGamesService";
import React from "react";
import {useTheme} from "next-themes";
import {Card, Col} from "react-bootstrap";
import {Checkbox, Chip, Divider, Link} from "@mui/joy";

interface ImportGameCardProps {
    game: IgdbGame;
    t: (key: string) => string;
    onSwitchChange: (gameId: number) => void;
}

export const ImportGameCard: React.FC<ImportGameCardProps> = ({ game, t, onSwitchChange }) => {
    const { theme } = useTheme();
    const coverUrl = game?.cover?.replace("t_thumb", "t_cover_big");

    return (
        <Col
            key={game.id}
            xs={6} sm={4} md={3} lg={2}
            className="mb-4 d-flex justify-content-center"
            style={{width:'12rem'}}
        >
            <Card data-bs-theme='dark' style={{ width: '9.5rem', height: '19rem' }} className='user-game-list-game-card text-center' border='light'>
                <Card.Img className='game__cover' variant='top' src={coverUrl} />
                <Card.Body className='game__body'>
                    <Card.Title className="user-game-list-game-card__title text-center">
                        <Link
                            href={`/games/${game.id}`}
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                cursor: 'pointer'}}
                        >
                            {game.name}
                        </Link>
                    </Card.Title>
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
                </Card.Body>
            </Card>
        </Col>
    );
};

export default ImportGameCard;