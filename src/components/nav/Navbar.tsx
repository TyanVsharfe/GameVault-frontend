import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ReactComponent as Logout } from '../../assets/icons/logout.svg';
import "../../assets/styles/nav.css"
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightIcon from '@mui/icons-material/Nightlight';
import "bootstrap-icons/font/bootstrap-icons.css";
import React, {useEffect, useMemo, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {logout} from "../../store/authSlice";
import debounce from 'lodash/debounce';
import { useTranslation } from 'react-i18next';
import {LanguageSwitcher} from "../ui/LanguageSwitcher";
import {igdbGamesService} from "../../api/services/igdbGamesService";
import NavSearchDropdown from './NavSearchDropdown';
import {useTheme} from "next-themes";

const Navigation: React.FC = () => {
    const { t } = useTranslation();

    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLogin = useSelector((state: RootState) => state.auth.isLogin)
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
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
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleSearch = useMemo(() =>
            debounce((value: string) => {
                if (value !== null && value !== "") {
                    igdbGamesService.getIdgbGames(value).then(results => {
                        setSearchResults([]);
                        console.log(results);
                        setSearchResults(results);
                        setIsDropdownVisible(true);
                    });
                }
            }, 850)
        , []);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        handleSearch(value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    };

    const handleLogout = () => {
        dispatch(logout() as any).then(() => navigate('/login'));
    };

    const handleCloseNotifications = () => {
        setShowNotifications(false);
    };

    return (
        <>
            <Navbar className="main-nav" style={{margin: 'auto', zIndex: 1, paddingTop: '0'}}
                    data-bs-theme={theme === 'dark' ? 'dark' : 'light'}
                    expand="lg"
                    // className={theme === 'dark' ? 'bg-dark' : 'bg-light'}
            >
                <Container style={{paddingLeft: "0px", paddingRight: "0px"}}>
                    <Navbar.Brand href="/main"><h1>gamevault</h1></Navbar.Brand>
                    <Navbar id="basic-navbar-nav">
                        <Nav className="container-fluid" style={{paddingRight: '0'}}>
                            <Nav.Link className='nav__link' href="/main">{t('main')}</Nav.Link>
                            <Nav.Link className='nav__link' href="/search"
                                      style={{textAlign: 'center'}}>{t('search')}</Nav.Link>
                            {isLogin ? (
                                <Nav.Link className='nav__link' href="/account/games">{t('account')}</Nav.Link>
                            ) : (
                                <Nav.Link className='nav__link' href="/login">{t('login')}</Nav.Link>
                            )}
                            <LanguageSwitcher/>
                            {/*{mounted && (*/}
                            {/*    <button*/}
                            {/*        onClick={toggleTheme}*/}
                            {/*        style={{*/}
                            {/*            background: 'transparent',*/}
                            {/*            // border: '1px solid #6c757d',*/}
                            {/*            borderRadius: '8px',*/}
                            {/*            padding: '6px 10px',*/}
                            {/*            cursor: 'pointer',*/}
                            {/*            display: 'flex',*/}
                            {/*            alignItems: 'center',*/}
                            {/*            color: theme === 'dark' ? '#fbbf24' : '#3b82f6',*/}
                            {/*            height: '2.3rem'*/}
                            {/*        }}*/}
                            {/*        className="theme-btn"*/}
                            {/*        aria-label="Toggle theme"*/}
                            {/*    >*/}
                            {/*        {theme === 'dark'*/}
                            {/*            ? <NightlightIcon style={{fontSize: '1.3rem', color: "#ffffff"}}/>*/}
                            {/*            : <WbSunnyIcon style={{fontSize: '1.3rem'}}/>}*/}
                            {/*    </button>*/}
                            {/*)}*/}
                            <div ref={wrapperRef} style={{display: 'flex', justifyContent: 'space-around'}}>
                                <Form onSubmit={handleSubmit} style={{paddingLeft: '5px', position: "relative", width: "100%"}}>
                                    <Row>
                                        <Col xs="auto">
                                            <Form.Control
                                                style = {{width: '15rem'}}
                                                type="text"
                                                placeholder={t('search')}
                                                className=" mr-sm-2"
                                                id={"gameNameInput"}
                                                value={searchTerm}
                                                onChange={onInputChange}
                                                onFocus={() => {
                                                    if (searchResults.length > 0) setIsDropdownVisible(true);
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    {isDropdownVisible && searchResults.length > 0 && (
                                        <NavSearchDropdown games={searchResults} />
                                    )}
                                </Form>
                                {isLogin ? (
                                    <button
                                        style={{
                                        display: 'flex', justifyContent: 'center',
                                        alignItems: 'center', background: 'transparent', border: 'none'}}
                                        className="logout-btn"
                                        onClick={handleLogout}
                                    >
                                        <Logout/>
                                    </button>
                                ) : (
                                    <div style={{width: '36px', height: '26px'}}></div>
                                )}
                            </div>
                        </Nav>
                    </Navbar>
                </Container>
            </Navbar>
        </>
    );
}

export default React.memo(Navigation);