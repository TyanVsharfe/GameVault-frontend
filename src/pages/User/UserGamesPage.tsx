import React, {ChangeEvent, useMemo, useState} from "react";
import Container from "react-bootstrap/Container";
import {Alert, Spinner} from "react-bootstrap";
import "../../assets/styles/account.css"
import UserGameList from "../../components/game/list/UserGameList";
import {useTranslation} from "react-i18next";
import useSWR from "swr";
import PaginationComponent from "../../components/ui/PaginationComponent";
import AccountTabs from "../../components/nav/AccountTabs";
import {
    Button,
    buttonClasses,
    ToggleButtonGroup,
    Option,
    IconButton, Stack,
    Typography,
    Input,
} from "@mui/joy";
import {useTheme} from "next-themes";
import {UserGame, UserMode} from "../../types/user.game.types";
import { userGameService } from "../../api/services/userGamesService";
import {PageResponse} from "../../types/types";
import Select, {selectClasses} from "@mui/joy/Select";
import { FilterModal } from "../../components/modal/FilterModal";
import ViewCompactIcon from '@mui/icons-material/ViewCompact';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import SortIcon from '@mui/icons-material/Sort';
import {useLocalStorage} from "../../store/localStorage";
import {DEFAULT_FILTERS, FILTERS_STORAGE_KEY, FilterState} from "../../types/filters";
import debounce from "lodash/debounce";
import {igdbGamesService} from "../../api/services/igdbGamesService";

function UserGamesPage() {
    const { t } = useTranslation();
    const { theme } = useTheme();

    const [ showFilterModal, setShowFilterModal ] = useState(false);

    const USER_LIST_TYPE_STORAGE_KEY = 'user_list_type';
    const [ listType, setListType ] = useLocalStorage(USER_LIST_TYPE_STORAGE_KEY, '0');
    const [filters, setFilters] = useLocalStorage<FilterState>(FILTERS_STORAGE_KEY, DEFAULT_FILTERS);

    const [activeFilterButtonIndex, setActiveFilterButton] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    //const [listType, setListType] = useState('0');

    const gamesPerPage = listType === '0' ? 21 : 36;

    const url = userGameService.buildUserGamesUrl(currentPage - 1, gamesPerPage, filters);

    const { data, error, isLoading } = useSWR<PageResponse<UserGame>>(
        url,
        userGameService.fetchUserGames,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 2000,
        }
    );

    const handleApplyFilters = (newFilters: FilterState) => {
        setFilters(newFilters);
        setCurrentPage(1);
        setShowFilterModal(false);
    };

    const handleQuickStatusFilter = (status: string | null) => {
        setFilters(prev => ({
            ...prev,
            status: status
        }));
        setCurrentPage(1);
    };

    const handleSortByFilter = (sortBy: string | null) => {
        if (!sortBy) return;

        setFilters(prev => ({
            ...prev,
            sort: {
                sortBy,
                direction: 'asc',
            },
        }));
        setCurrentPage(1);
    };

    const handleSortDirectionFilter = () => {
        setFilters(prev => ({
            ...prev,
            sort: {
                ...prev.sort,
                direction: prev.sort.direction == 'asc' ? 'desc' : 'asc',
            },
        }));
        setCurrentPage(1);
    };

    const handleSearchByTitle = useMemo(() =>
            debounce((value: ChangeEvent<HTMLInputElement>) => {
                if (value !== null) {
                    setFilters(prev => ({
                        ...prev,
                        title: value.target.value
                    }));
                }
            }, 850)
        , []);

    const handleResetFilters = () => {
        setFilters({
            status: null,
            minRating: null,
            maxRating: null,
            hasReview: null,
            isFullyCompleted: null,
            title: '',
            createdAfter: null,
            createdBefore: null,
            sort: {sortBy: "createdAt", direction: 'asc'}
        });
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                <UserGameList games={data.content} listType={listType} />

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
                <Stack
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '40.5rem',
                        paddingBottom: '1rem',
                        margin: 'auto'
                    }}>
                    <h1>{t('user_games')}</h1>
                    <ToggleButtonGroup
                        sx={{
                            p: '0.5rem 0',
                            width: '40.5rem',
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
                                key={index}
                                disabled={index === activeFilterButtonIndex}
                                style={{color: theme === 'dark' ? 'white' : 'black'}}
                                onClick={() => {
                                setActiveFilterButton(index);
                                handleQuickStatusFilter(statusItem.status);
                            }}>
                                {statusItem.label}
                            </Button>
                            )
                        )}
                    </ToggleButtonGroup>
                    <div style={{width: '100%',   alignItems: 'center', display: 'flex', justifyContent: 'space-between'}}>
                        <ToggleButtonGroup
                            sx={{
                                borderRadius: 'xl',
                                display: 'flex',

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
                            <IconButton
                                style={{color: theme === 'dark' ? 'white' : 'black'}}
                                disabled={listType == '0'}
                                sx={{
                                    width: '2rem',
                                    height: '2rem',
                                    alignItems: 'center',
                                }}
                                onClick={() => {
                                    setListType('0')
                                }}>
                                <ViewModuleIcon/>
                            </IconButton>
                            <IconButton
                                style={{color: theme === 'dark' ? 'white' : 'black'}}
                                disabled={listType == '1'}
                                sx={{
                                    width: '2rem',
                                    height: '2rem',
                                    alignItems: 'center',
                                }}
                                onClick={() => {
                                    setListType('1')
                                }}>
                                <ViewCompactIcon/>
                            </IconButton>
                        </ToggleButtonGroup>
                        <Stack
                            direction="row"
                            sx={{
                                width: '40.5rem',
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Input
                                placeholder="Type in here…"
                                onChange={handleSearchByTitle}
                                sx={{marginRight: '2rem'}}
                            />
                            <Stack
                                direction="row"
                                sx={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingRight: '1rem'
                                }}>
                                <Typography component="div" sx={{color: 'black'}}>
                                    {t('sort_by')}
                                </Typography>
                                <IconButton
                                    onClick={handleSortDirectionFilter}
                                    sx={{
                                        transform: filters.sort.direction == 'asc' ? 'scaleY(1)' : 'scaleY(-1)',
                                        transition: 'transform 0.15s ease-in-out',
                                        transformOrigin: 'center',
                                    }}
                                >
                                    <SortIcon/>
                                </IconButton>
                                <Select
                                    placeholder={t('status')}
                                    value={filters?.sort?.sortBy}
                                    onChange={(_, value) => handleSortByFilter(value)}
                                    sx={{
                                        width: '8rem'
                                    }}
                                >
                                    <Option value="createdAt">{t('created_at')}</Option>
                                    <Option value="updatedAt">{t('updated_at')}</Option>
                                    <Option value="userRating">{t('rating')}</Option>
                                    <Option value="status">{t('status')}</Option>
                                    <Option value="title">{t('filter_title')}</Option>
                                </Select>
                            </Stack>
                            <Button onClick={() => setShowFilterModal(true)}
                                    sx={{
                                        width: '5rem',
                                        fontSize: '1rem',
                                        fontWeight: 'normal',
                                        borderRadius: '2rem'
                                    }}
                            >
                                {t('filter')}
                            </Button>
                        </Stack>
                    </div>
                </Stack>
                {renderUserGames()}
            </Container>

            <FilterModal
                show={showFilterModal}
                handleClose={() => setShowFilterModal(false)}
                initialFilters={filters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
            />
        </Container>
    );
}

export default UserGamesPage;