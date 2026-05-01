import React, {useEffect, useState} from 'react';
import "../../../assets/styles/style.css"
import "../../../assets/styles/game-card.css"
import {useTranslation} from "react-i18next";
import GameCard from "../card/GameCard";
import {UserGameListItem} from "../../../types/user.game.list.types";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import {Box, Stack} from "@mui/joy";

export interface UserGameListItemProps {
    games: UserGameListItem[];
    listId: string;
    editMode: boolean;
    onReorder?: (reorderedGames: UserGameListItem[]) => void;
}

const UserGameCollectionList: React.FC<UserGameListItemProps> = ({ games, editMode, listId, onReorder }) => {
    const { t } = useTranslation();
    const [items, setItems] = useState(games || []);
    const [activeId, setActiveId] = useState<number | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as number);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) {
            setActiveId(null);
            return;
        }

        setItems(prev => {
            const oldIndex = prev.findIndex(
                item => item.game.igdbId === active.id
            );
            const newIndex = prev.findIndex(
                item => item.game.igdbId === over.id
            );

            const moved = arrayMove(prev, oldIndex, newIndex);

            const reordered = moved.map((item, index) => ({
                ...item,
                order: index,
            }));

            onReorder?.(reordered);
            setActiveId(null);
            return reordered;
        });
    };

    useEffect(() => {
        if (!editMode) {
            setItems(games);
        }
    }, [games, editMode]);

    const activeGame = activeId
        ? items.find((item) => item.game.igdbId === activeId)
        : null;

    if (!editMode) {
        return (
            <div className="justify-content-start align-items-center game-list">
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: 'repeat(auto-fill, minmax(11.5rem, 1fr))',
                            sm: 'repeat(auto-fill, minmax(10.75rem, 1fr))',
                            md: 'repeat(auto-fill, minmax(11.5rem, 1fr))'
                        },
                        width: '100%',
                        mx: 'auto',
                        pb: '0.75rem',
                        gap: { xs: 1, sm: 1.5, md: 2 },
                        justifyItems: 'center'
                    }}
                >
                    {items?.map((game: UserGameListItem) => (
                        <GameCard
                            key={game.game.igdbId}
                            game={game.game}
                            editMode={false}
                            listId={listId}
                            t={t}
                        />
                    ))}
                </Box>
            </div>
        );
    }

    return (
        <div className="justify-content-start align-items-center game-list">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map((item) => item.game.igdbId)}
                    strategy={rectSortingStrategy}
                >
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: 'repeat(auto-fill, minmax(11.5rem, 1fr))',
                                sm: 'repeat(auto-fill, minmax(10.75rem, 1fr))',
                                md: 'repeat(auto-fill, minmax(11.5rem, 1fr))'
                            },
                            width: '100%',
                            mx: 'auto',
                            pb: '0.75rem',
                            gap: { xs: 1, sm: 1.5, md: 2 },
                            justifyItems: 'center'
                        }}
                    >
                        {items?.map((game: UserGameListItem, index: number) => (
                            <GameCard
                                key={game.game.igdbId || index}
                                game={game.game}
                                editMode={editMode}
                                listId={listId}
                                t={t}
                            />
                        ))}
                    </Box>
                </SortableContext>
                <DragOverlay>
                    {activeGame ? (
                        <GameCard
                            game={activeGame.game}
                            editMode={false}
                            listId={listId}
                            t={t}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

export default UserGameCollectionList;

