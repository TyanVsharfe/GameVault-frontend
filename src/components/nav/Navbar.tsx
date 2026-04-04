import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { useTheme } from "next-themes";
import debounce from 'lodash/debounce';
import {
    Box,
    Typography,
    Input,
    IconButton,
    Stack,
    Link,
    Container,
    Sheet, Divider
} from '@mui/joy';

import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightIcon from '@mui/icons-material/Nightlight';

import { RootState } from "../../store/store";
import { logout } from "../../store/authSlice";
import { igdbGamesService } from "../../api/services/igdbGamesService";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import NavSearchDropdown from './NavSearchDropdown';
import "../../assets/styles/nav.css";

const Navigation: React.FC = () => {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLogin = useSelector((state: RootState) => state.auth.isLogin);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleSearch = useMemo(() =>
        debounce((value: string) => {
            if (value?.trim()) {
                igdbGamesService.getIdgbGames(value).then(results => {
                    setSearchResults(results);
                    setIsDropdownVisible(true);
                });
            }
        }, 850), []
    );

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        handleSearch(value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
            setIsDropdownVisible(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout() as any).then(() => navigate('/login'));
    };

    if (!mounted) return null;

    return (
        <Sheet
            component="nav"
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // borderBottom: '1px solid',
                borderColor: 'divider',
                backgroundColor: 'background.surface',
                py: 1,
                marginBottom: '0.5rem'
            }}
        >
            <Container maxWidth="lg"
                       sx={{
                           px: { xs: 2, md: 0 },
                           maxWidth: {
                               xs: '100%',
                               md: '90%',
                               lg: '1200px'
                           },
                           display: 'flex',
                           alignItems: 'center'
                       }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ width: '100%' }}
                >
                    <Link
                        component={RouterLink}
                        to="/main"
                        underline="none"
                        sx={{ color: 'text.primary' }}
                    >
                        <Typography level="h1" sx={{ m: 0, fontSize: '1.75rem', fontWeight: 'bold' }}>
                            gamevault
                        </Typography>
                    </Link>

                    <Stack direction="row">
                        <Stack direction="row" spacing={2} alignItems="center" sx={{marginRight: '0.5rem'}}>
                            <Link component={RouterLink} to="/main" color="neutral" sx={{ fontWeight: 400 }}>
                                {t('main')}
                            </Link>
                            <Link component={RouterLink} to="/search" color="neutral" sx={{ fontWeight: 400 }}>
                                {t('search')}
                            </Link>
                            {isLogin ? (
                                <Link component={RouterLink} to="/account/games" color="neutral" sx={{ fontWeight: 400 }}>
                                    {t('account')}
                                </Link>
                            ) : (
                                <Link component={RouterLink} to="/login" color="neutral" sx={{ fontWeight: 400 }}>
                                    {t('login')}
                                </Link>
                            )}

                            <LanguageSwitcher />

                            {/*<IconButton*/}
                            {/*    variant="outlined"*/}
                            {/*    color="neutral"*/}
                            {/*    onClick={toggleTheme}*/}
                            {/*    size="sm"*/}
                            {/*>*/}
                            {/*    {theme === 'dark' ? <NightlightIcon /> : <WbSunnyIcon />}*/}
                            {/*</IconButton>*/}
                        </Stack>

                        <Stack direction="row" spacing={1} alignItems="center" ref={wrapperRef}>
                            <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
                                <Input
                                    placeholder={t('search')}
                                    value={searchTerm}
                                    onChange={onInputChange}
                                    onFocus={() => searchResults.length > 0 && setIsDropdownVisible(true)}
                                    startDecorator={<SearchIcon />}
                                    sx={{ width: 240 }}
                                />
                                {isDropdownVisible && searchResults.length > 0 && (
                                    <Box sx={{ position: 'absolute', top: '100%', left: 0, width: '100%', zIndex: 10 }}>
                                        <NavSearchDropdown games={searchResults} />
                                    </Box>
                                )}
                            </form>

                            {isLogin && (
                                <IconButton
                                    variant="plain"
                                    color="danger"
                                    onClick={handleLogout}
                                    title={t('logout')}
                                >
                                    <LogoutIcon />
                                </IconButton>
                            )}
                        </Stack>
                    </Stack>
                </Stack>
            </Container>
        </Sheet>
    );
}

export default React.memo(Navigation);