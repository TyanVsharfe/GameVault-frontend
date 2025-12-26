import Container from "react-bootstrap/Container";

import "../../assets/styles/style.css"
import "../../assets/styles/game-card.css"
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import AccountTabs from "../../components/nav/AccountTabs";
import {AspectRatio, Box, Card, CardContent, CardCover, CardOverflow, Divider, Grid, Link, Stack} from "@mui/joy";
import IgdbGameTypeBadge from "../../components/game/badge/IgdbGameTypeBadge";
import {useTheme} from "next-themes";
import {CardImg} from "react-bootstrap";
import UserGameCollectionsGrid from "../../components/game/collections/UserGameCollectionsGrid";
import UserGameCollectionCreateModal from "../../components/game/collections/UserGameCollectionCreateModal";
import useSWR, {mutate} from "swr";
import {PageResponse} from "../../api/services/userGamesService";
import {userGameListService} from "../../api/services/userGameListService";
import {Helmet} from "react-helmet-async";
import {UserGameList, UserGameListForm} from "../../types/user.game.list.types";

function UserCollectionsPage() {
    const { t, i18n } = useTranslation();
    const { theme } = useTheme();

    const [open, setOpen] = React.useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreating, setIsCreating] = useState(false);

    const url = userGameListService.buildUserGameListsUrl(currentPage - 1, 20);

    const { data, error, isLoading } = useSWR<PageResponse<UserGameList>>(
        url,
        userGameListService.fetchUserGameLists,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 2000,
        }
    );

    const refreshLists = () => {
        mutate(url);
    }

    const handleCreateList = async (formData: UserGameListForm) => {
        setIsCreating(true);
        try {
            console.log('New list:', formData);
            const newList = await userGameListService.createUserGameList(formData);
            console.log('A new list has been created:', newList);

            if (data) {
                const updatedContent = [newList, ...data.content];
                mutate({
                    ...data,
                    content: updatedContent
                }, false);
            }

            refreshLists();

            setOpen(false);
        } catch (error) {
            console.error('Error when creating the list:', error);
            refreshLists();
        } finally {
            setIsCreating(false);
        }
    };


    return (
        <>
            <Helmet>
                <title>{t('lists')}</title>
            </Helmet>
            <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                <AccountTabs/>
                <UserGameCollectionsGrid
                    collections={data?.content}
                    onCreateClick={() => setOpen(true)}
                />

                <UserGameCollectionCreateModal
                    open={open}
                    onClose={() => setOpen(false)}
                    onSubmit={handleCreateList}
                    isSubmitting={isCreating}
                />
            </Container>
        </>
    );
}

export default UserCollectionsPage;