import React from "react";
import { useMediaQuery } from "react-responsive";
import {useTranslation} from "react-i18next";
import {Link, Tab, tabClasses, TabList, Tabs, Option} from "@mui/joy";
import {useTheme} from "next-themes";
import { useLocation } from "react-router-dom";
import Select from "@mui/joy/Select";

function AccountTabs() {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const location = useLocation();
    const isMobile = useMediaQuery({ maxWidth: 675 });

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
            <Select placeholder={`Меню аккаунта`} style={{width: "25rem", margin: "10px"}}>
                {navItems.map((item, idx) => (
                    <Option component={Link} key={idx} href={item.href} disabled={idx === activeTabIndex}
                            style={{width: "25rem"}}
                    >
                        {item.label}
                    </Option>
                ))}
            </Select>
        );
    }

    return (
        <Tabs aria-label="tabs" value={activeTabIndex} sx={{ bgcolor: 'transparent'}}>
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
