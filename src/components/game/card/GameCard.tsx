import {AspectRatio, Card, CardOverflow, IconButton, Link, Stack, Tooltip, Typography} from "@mui/joy";
import "../../../assets/styles/game-card.css"
import {useTheme} from "next-themes";
import RemoveIcon from '@mui/icons-material/Remove';
import {userGameListService} from "../../../api/services/userGameListService";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import {Game} from "../../../types/user.game.types";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import React from "react";

interface GameCardProps {
    game: Game;
    listId: string;
    editMode: boolean;
    t: (key: string) => string;
}

const GameCard: React.FC<GameCardProps> = ({ game, t, editMode, listId }) => {
    const { theme } = useTheme();
    const coverUrl = game?.coverUrl.replace("t_thumb", "t_cover_big");

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: game.igdbId,
        disabled: !editMode
    });

    const colStyle: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        touchAction: 'none',
        position: 'relative',
        willChange: 'transform',
        width: '14rem'
    };

    const cardStyle: React.CSSProperties = {
        backgroundColor: "rgba(30, 30, 30, 0.4)",
        overflow: "hidden",
        border: "0",
        cursor: editMode ? 'grab' : 'default',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transformOrigin: 'center',
        transform: isDragging ? 'scale(0.95)' : undefined,
        width: '12rem'
    };

    const dragHandleStyle: React.CSSProperties = {
        position: 'absolute',
        top: '8px',
        left: '8px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '6px 9px',
        borderRadius: '6px',
        fontSize: '18px',
        lineHeight: 1,
        pointerEvents: 'none',
        userSelect: 'none',
        opacity: 0.8,
        zIndex: 10,
        transition: 'opacity 0.2s ease',
    };

    const removeHandleStyle: React.CSSProperties = {
        position: 'absolute',
        top: '8px',
        right: '8px',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '6px 8px',
        borderRadius: '6px',
        fontSize: '18px',
        lineHeight: 1,
        pointerEvents: 'auto',
        userSelect: 'none',
        opacity: 0.8,
        zIndex: 10,
        transition: 'opacity 0.2s ease',
        backgroundColor: 'white',
        cursor: 'pointer',
    };

    return (
        <Stack
            direction="column"
            sx={{
                justifyContent: "center",
                alignItems: "center",
            }}
            style={colStyle}
            className="mb-4 d-flex justify-content-center"
        >
            <Card
                style={cardStyle}
                ref={setNodeRef}
                {...attributes}
                {...listeners}
                className={`user-game-list-game-card position-relative ${theme === 'light' ? 'bg-dark text-white' : 'text-light'}`}
            >
                {/*<IgdbGameTypeBadge*/}
                {/*    gameType={game.game_type.id}*/}
                {/*    t={t}*/}
                {/*/>*/}
                <CardOverflow>
                    {editMode && (
                        <div>
                            <div style={dragHandleStyle}>
                                <DragIndicatorIcon sx={{color: "white"}}/>
                            </div>
                            <div
                                style={{
                                    ...removeHandleStyle,
                                    transition: 'transform 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}>
                                <RemoveIcon
                                    sx={{color: "black",
                                        }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        userGameListService.deleteUserGameFromList(listId, game.igdbId)
                                            .then(() => window.location.reload());
                                    }}
                                />
                            </div>
                        </div>
                    )}
                    <AspectRatio ratio="3/3.95" className="game-card__img-wrapper">
                        {/*<div*/}
                        {/*    className="blur-top"*/}
                        {/*    style={{*/}
                        {/*        backgroundImage: `url(${coverUrl})`*/}
                        {/*    }}*/}
                        {/*/>*/}
                        <img
                            src={coverUrl}
                            alt={game.title}
                            className="game-card__img"
                            style={{objectPosition: 'top'}}
                        />
                    </AspectRatio>
                </CardOverflow>

                <div style={{height: '3rem'}}>
                    {/*<Typography className="text-center"*/}
                    {/*            style={{color: "white"}}*/}
                    {/*>*/}
                    {/*    {game.title}*/}
                    {/*</Typography>*/}
                    <Tooltip title={game.title} arrow placement="top">
                        <Typography
                            className="text-center"
                            sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                color: "white"
                            }}
                        >
                            {game.title}
                        </Typography>
                    </Tooltip>
                    <Link
                        overlay
                        href={`/games/${game.igdbId}`}
                        underline="none"
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
                    >
                    </Link>
                </div>
            </Card>
        </Stack>
    );
};

export default GameCard;