import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useMediaQuery } from "react-responsive";
import {useTranslation} from "react-i18next";
import {Link, Tab, tabClasses, TabList, Tabs} from "@mui/joy";
import {useTheme} from "next-themes";
import { useLocation } from "react-router-dom";

function AccountTabs() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const location = useLocation();
    const isMobile = useMediaQuery({ maxWidth: 550 });

    const currentPath = location.pathname;

    const navItems = [
        { href: "/account", label: t('profile') },
        { href: "/account/games", label: t('my_games') },
        { href: "/account/lists", label: t('lists') },
        { href: "/account/achievements", label: t('achievements') },
        { href: "/account/settings", label: t('settings') }
    ];

    const activeTabIndex = navItems.findIndex(item => {
        if (item.href === "/account") {
            return currentPath === "/account";
        }
        return currentPath.startsWith(item.href);
    });

    if (isMobile) {
        return (
            <Dropdown style={{width: "25rem", margin: "10px" }}>
                <Dropdown.Toggle style={{width: "25rem"}} variant="primary" id="account-nav-dropdown">
                    Меню аккаунта
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {navItems.map((item, idx) => (
                        <Dropdown.Item key={idx} href={item.href} active={idx === activeTabIndex}
                                       style={{width: "25rem"}}
                        >
                            {item.label}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    return (
        <Tabs aria-label="tabs" value={activeTabIndex} sx={{ bgcolor: 'transparent' }}>
            <TabList
                disableUnderline
                sx={{
                    p: 0.5,
                    gap: 0.5,
                    marginBottom: 1,
                    borderRadius: 'xl',
                    bgcolor: theme === 'dark' ? 'background.level4' : 'background.level1',
                    '--Tab-hoverBackground': theme === 'dark' ? 'neutral.600' : 'neutral.200',
                    [`& .${tabClasses.root}[aria-selected="true"]`]: {
                        boxShadow: 'sm',
                        bgcolor: theme === 'dark' ? 'neutral.700' : 'background.surface',
                    },
                    [`&& .${tabClasses.root}:hover`]: {
                        bgcolor: theme === 'dark' ? 'neutral.600' : 'neutral.200',
                        '& button': {
                            color: theme === 'dark' ? 'white' : 'black',
                        },
                    },
                }}
            >
                {navItems.map((item, idx) => (
                    <Tab key={idx}
                         disableIndicator
                         value={idx}
                         sx={{
                             p: 0.5,
                             gap: 0.5,
                             borderRadius: 'xl',
                         }}
                    >
                        <Link overlay={true} style={{ margin: "0 20px", textDecoration: "none", color: theme === 'dark' ? 'white' : 'black' }} href={item.href}>
                            {item.label}
                        </Link>
                    </Tab>
                ))}
            </TabList>
        </Tabs>
    );
}

export default AccountTabs;
