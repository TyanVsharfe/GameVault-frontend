import React from "react";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import { useMediaQuery } from "react-responsive";
import {useTranslation} from "react-i18next";

function AccountNav() {
    const { t } = useTranslation();
    const isMobile = useMediaQuery({ maxWidth: 500 });

    const navItems = [
        { href: "/account", label: t('profile') },
        { href: "/account/games", label: t('my_games') },
        { href: "/account/achievements", label: t('achievements') },
        { href: "/account/settings", label: t('settings') }
    ];

    if (isMobile) {
        return (
            <Dropdown style={{ margin: "10px" }}>
                <Dropdown.Toggle variant="primary" id="account-nav-dropdown">
                    Меню аккаунта
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {navItems.map((item, idx) => (
                        <Dropdown.Item key={idx} href={item.href}>
                            {item.label}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    return (
        <Nav variant="tabs" className="justify-content-center" defaultActiveKey="" style={{ width: "75%", textAlign: "center", marginBottom: "10px" }}>
            {navItems.map((item, idx) => (
                <Nav.Item key={idx}>
                    <Nav.Link style={{ margin: "0 20px", textDecoration: "none" }} href={item.href}>
                        {item.label}
                    </Nav.Link>
                </Nav.Item>
            ))}
        </Nav>
    );
}

export default AccountNav;
