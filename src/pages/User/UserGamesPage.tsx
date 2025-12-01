import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import {Alert, Spinner, Stack} from "react-bootstrap";;
import "../../assets/styles/account.css"
import {buildUserGamesUrl, fetchUserGames, PageResponse, UserGame} from "../../services/userGamesService";
import UserGameList from "../../components/game/list/UserGameList";
import {useTranslation} from "react-i18next";
import useSWR from "swr";
import PaginationComponent from "../../components/PaginationComponent";
import AccountTabs from "../../components/nav/AccountTabs";
import {Button, buttonClasses, ToggleButtonGroup} from "@mui/joy";
import {useTheme} from "next-themes";

function UserGamesPage() {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const [displayedGames, setDisplayedGames] = useState<UserGame[]>([]);
    const [gameListData, setGameListData] = useState<null>();
    const [filterStatus, setFilterStatus] = useState("");
    const [activeFilterButtonIndex, setActiveFilterButton] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const url = buildUserGamesUrl(currentPage - 1, 20, filterStatus || undefined);

    const { data, error, isLoading } = useSWR<PageResponse<UserGame>>(
        url,
        fetchUserGames,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 2000,
        }
    );

    const handleFilterChange = (index: number, status: string) => {
        setActiveFilterButton(index);
        setFilterStatus(status);
        setCurrentPage(1); // Сбрасываем на первую страницу при смене фильтра
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // useEffect(() => {
    //     fetchData();
    // }, [filterStatus]);
    //
    // const fetchData = () => {
    //     getUserGames(filterStatus).then((data) => {
    //         setDisplayedGames(data.content);
    //         setGameListData(data);
    //     });
    // };

    const statusItems = [
        { status: "", label: t('all_games') },
        { status: "Completed", label: t('status_completed') },
        { status: "Playing", label: t('status_playing') },
        { status: "Planned", label: t('status_planned') },
        { status: "Abandoned", label: t('status_abandoned') },
        { status: "None", label: t('status_none') }
    ];

    const renderUserGames = () => {
        if (isLoading) {
            return (
                <Container style={{ textAlign: "center", padding: "50px" }}>
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            );
        }

        if (error) {
            return (
                <Container style={{ textAlign: "center", maxWidth: "500px" }}>
                    <Alert variant="danger">
                        {error.response?.status === 401
                            ? t('error_unauthorized')
                            : t('error_loading')}
                    </Alert>
                </Container>
            );
        }

        if (!data || data.content.length === 0) {
            return (
                <Container style={{ textAlign: "center", maxWidth: "500px" }}>
                    <Alert>{t('not_found')}</Alert>
                </Container>
            );
        }

        return (
            <>
                <UserGameList games={data.content} />

                {data.totalPages > 1 && (
                    <PaginationComponent
                        currentPage={currentPage}
                        totalPages={data.totalPages}
                        onPageChange={handlePageChange}
                        disabled={isLoading}
                    />
                )}
            </>
        );
    };

    return (
        <Container style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <AccountTabs/>

            <Container>
                <Stack className=".d-flex justify-content-center align-items-center">
                    <h1>{t('user_games')}</h1>
                    <ToggleButtonGroup
                        sx={{
                            p: 0.75,
                            borderRadius: 'xl',

                            [`& .${buttonClasses.root}[aria-pressed="true"]`]: {
                                bgcolor: theme === 'dark' ? 'neutral.700' : 'background.surface',
                                color: theme === 'dark' ? 'white' : 'black',
                            },

                            [`& .${buttonClasses.root}:hover`]: {
                                bgcolor: theme === 'dark' ? 'neutral.600' : 'neutral.200',
                                color: theme === 'dark' ? 'white' : 'black',
                            },
                        }}
                    >
                        {statusItems.map((statusItem, index) => (
                            <Button
                                style={{color: theme === 'dark' ? 'white' : 'black'}}
                                onClick={() => {
                                setActiveFilterButton(index)
                                setFilterStatus(statusItem.status)
                            }}>
                                {statusItem.label}
                            </Button>
                            )
                        )}
                    </ToggleButtonGroup>
                </Stack>
                <br/>
                {renderUserGames()}
            </Container>
        </Container>
    );
}

export default UserGamesPage;