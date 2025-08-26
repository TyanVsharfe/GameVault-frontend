import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ReactComponent as Logout } from '../assets/icons/logout.svg';
import "../assets/styles/nav.css"

import "bootstrap-icons/font/bootstrap-icons.css";

import React, {useEffect, useMemo, useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../store/store";
import {logout} from "../store/authSlice";
import Badge from "react-bootstrap/Badge";
import Modal from "react-bootstrap/Modal";
import {ListGroup} from "react-bootstrap";
import debounce from 'lodash/debounce';

import { useTranslation } from 'react-i18next';
import {LanguageSwitcher} from "./LanguageSwitcher";
import {getIdgbGames} from "../services/igdbGamesService";
import NavSearchDropdown from './game/list/NavSearchDropdown';

const Navigation: React.FC = () => {
    const { t } = useTranslation();

    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLogin = useSelector((state: RootState) => state.auth.isLogin)
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

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

    const handleSearch = useMemo(() =>
            debounce((value: string) => {
                if (value !== null && value !== "") {
                    getIdgbGames(value).then(results => {
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
            <Navbar style={{width:'100%', zIndex: 1,}} data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
                <Container style={{paddingRight: "0px"}}>
                    <Navbar.Brand href="/main"><h1>gamevault</h1></Navbar.Brand>
                    <Navbar id="basic-navbar-nav">
                        <Nav className="container-fluid">
                            <Nav.Link className='nav__link' href="/main">{t('main')}</Nav.Link>
                            <Nav.Link className='nav__link' href="/search"
                                      style={{textAlign: 'center'}}>{t('search')}</Nav.Link>
                            {isLogin ? (
                                <Nav.Link className='nav__link' href="/account/games">{t('account')}</Nav.Link>
                            ) : (
                                <Nav.Link className='nav__link' href="/login">{t('login')}</Nav.Link>
                            )}
                            {/*<Nav.Link href="/search"><i className="bi bi-search" style={{fontSize: '2rem'}}></i></Nav.Link>
                        <Nav.Link href="/account"><i className="bi bi-person-circle" style={{fontSize: '2rem'}}></i></Nav.Link>*/}
                            <div ref={wrapperRef} style={{display: 'flex', justifyContent: 'space-around'}}>
                                <Form onSubmit={handleSubmit} style={{paddingLeft: '5px'}}>
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
                                        {/*<Col xs="auto">*/}
                                        {/*    <Button type="submit" id={"submitButton"}>искать</Button>*/}
                                        {/*</Col>*/}
                                    </Row>
                                    {isDropdownVisible && searchResults.length > 0 && (
                                        <NavSearchDropdown games={searchResults} />
                                    )}
                                </Form>
                                {isLogin ? (
                                    <button style={{
                                        display: 'flex', justifyContent: 'center',
                                        alignItems: 'center', background: 'transparent', border: 'none'
                                    }} onClick={handleLogout}><Logout/></button>
                                ) : (
                                    <div style={{width: '36px', height: '26px'}}></div>
                                )}
                            </div>
                            <LanguageSwitcher/>
                        </Nav>
                    </Navbar>
                </Container>
            </Navbar>
        </>
    );
}

export default React.memo(Navigation);