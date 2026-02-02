import {Accordion, AccordionDetails, AccordionGroup, Box,
    Checkbox,
    Chip,
    LinearProgress, Modal, ModalClose, ModalDialog, Stack, Typography} from "@mui/joy";
import React, {useEffect, useMemo, useState} from "react";
import {UserAchievment} from "../../types/achievement.types";
import BaseList from "../game/list/BaseList";
import AchievementGameCard from "../game/card/AchievementGameCard";
import AccordionSummary from "@mui/joy/AccordionSummary";
import { accordionClasses } from '@mui/joy/Accordion';
import {accordionDetailsClasses} from '@mui/joy/AccordionDetails'
import CircleIcon from '@mui/icons-material/Circle';
import CheckIcon from '@mui/icons-material/Check';

interface AchievementModalProps {
    show: boolean;
    handleClose: () => void;
    uAchievement: UserAchievment;
    t: (key: string) => string;
}

interface Game {
    id: number;
    name: string;
    coverUrl: string;
    releaseYear: number;
}

interface SeriesPart {
    id: number;
    games: Game[];
    completed: boolean;
}

function AchievementModal({show, handleClose, uAchievement, t}: AchievementModalProps) {

    const [hideCompleted, setHideCompleted] = useState(false);
    const [compactView, setCompactView] = useState(false);

    const unsortSeriesParts: SeriesPart[] = uAchievement?.achievement?.seriesParts ?? [];

    const seriesParts = [...unsortSeriesParts].sort((a, b) => a.id - b.id);

    const completedCount = useMemo(
        () => uAchievement?.currentProgress,
        [seriesParts]
    );

    const progress = seriesParts.length
        ? Math.round((completedCount / seriesParts.length) * 100)
        : Math.round((uAchievement?.currentProgress / uAchievement?.achievement?.requiredCount) * 100);

    const visibleParts = useMemo(() => {
        if (!hideCompleted) return seriesParts;
        return seriesParts.filter(p => !p.completed);
    }, [seriesParts, hideCompleted]);

    function CompactPartRow({ item }) {
        return (
            <Stack
                direction="row"
                spacing={1.5}
                alignItems="center"
                sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 'md',
                    mb: 1,
                }}
            >
                <Chip
                    size="sm"
                    color={item.completed ? 'success' : 'neutral'}
                    variant="soft"
                    sx={{height: '1.75rem', width: '1.75rem'}}
                >
                    {item.completed
                        ? <CheckIcon sx={{fontSize: '1rem', padding: '0', margin : '0'}}/>
                        : <div style={{height: '1.75rem', width: '1.75rem', fontSize: '0.5rem', padding: '0', margin : '0'}}></div>}
                </Chip>

                <Typography level="title-md" sx={{flexGrow: 1, color: 'black'}}>
                    {item?.games[0]?.name}
                </Typography>
            </Stack>
        );
    }

    function ExpandedPartAccordion({ item, t }) {
        return (
            <AccordionGroup
                key={item.id}
                size="lg"
                sx={{
                    mb: 1,
                    [`& .${accordionDetailsClasses.content}`]: {
                        paddingTop: '0.5rem',
                    },
                    [`& .${accordionClasses.root}.${accordionClasses.expanded}`]: {
                        bgcolor: 'background.level1',
                        borderRadius: 'md',
                    }
                }}
            >
                <Accordion>
                    <AccordionSummary>
                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            sx={{width: '100%'}}
                        >
                            <Chip
                                size="sm"
                                color={item.completed ? 'success' : 'neutral'}
                                variant="soft"
                                sx={{height: '1.75rem', width: '1.75rem'}}
                            >
                                {item.completed
                                    ? <CheckIcon sx={{fontSize: '1rem', padding: '0', margin : '0'}}/>
                                    : <div style={{height: '1.75rem', width: '1.75rem', fontSize: '0.5rem', padding: '0', margin : '0'}}></div>}
                            </Chip>

                            <Typography level="title-md" sx={{flexGrow: 1, color: 'black'}}>
                                {item?.games[0]?.name}
                            </Typography>
                        </Stack>
                    </AccordionSummary>

                    {!compactView && (
                        <AccordionDetails>
                            <BaseList
                                items={item.games}
                                itemsPerPage={3}
                                filterItem={(game) => game?.coverUrl != null}
                                renderItem={(game) => (
                                    <AchievementGameCard
                                        game={game}
                                        t={t}
                                    />
                                )}
                            />
                        </AccordionDetails>
                    )}
                </Accordion>
            </AccordionGroup>
        );
    }


    return (
        <Modal open={show}
               onClose={() => {
                   handleClose();
               }}
        >
            <ModalDialog
                style={{display: 'flex', gap: '1rem', height: "40rem", width: '55rem', minWidth: '22rem'}}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography level="h4">{t('achievement_info')}</Typography>
                    <ModalClose/>
                </Stack>

                <Typography level="body-sm">
                    {uAchievement?.achievement?.description}
                </Typography>

                <Box>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography level="body-sm">
                            {completedCount > uAchievement?.achievement?.requiredCount
                                ? uAchievement?.achievement?.requiredCount
                                : completedCount} / {uAchievement?.achievement?.requiredCount} {t('completed')}
                        </Typography>
                        <Typography level="body-sm">{progress > 100 ? 100 : progress}%</Typography>
                    </Stack>
                    <LinearProgress determinate value={progress > 100 ? 100 : progress}/>
                </Box>

                {seriesParts.length > 0 && (
                    <>
                        <Stack direction="row" spacing={3}>
                            <Checkbox
                                label={t('hide_completed')}
                                checked={hideCompleted}
                                onChange={(e) => setHideCompleted(e.target.checked)}
                            />
                            <Checkbox
                                label={t('compact_view')}
                                checked={compactView}
                                onChange={(e) => setCompactView(e.target.checked)}
                            />
                        </Stack>

                        <Box sx={{overflowY: 'auto'}}>
                            {visibleParts.length === 0 && (
                                <Typography level="body-md" sx={{textAlign: 'center', mt: 4}}>
                                    {t('all_completed')}
                                </Typography>
                            )}

                            {visibleParts.map((item) =>
                                compactView ? (
                                    <CompactPartRow key={item.id} item={item}/>
                                ) : (
                                    <ExpandedPartAccordion key={item.id} item={item} t={t}/>
                                )
                            )}
                        </Box>
                    </>
                )}
            </ModalDialog>
        </Modal>
    )
}

export default AchievementModal;