import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';
import { useState } from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import KeyboardArrowDown from '@mui/icons-material/KeyboardArrowDown';
import Select, {selectClasses} from "@mui/joy/Select";
import Option from '@mui/joy/Option';
import {useTheme} from "next-themes";

const LANGS = {
    en: 'ENG',
    ru: 'RUS',
};

export const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();

    const { theme } = useTheme();

    const current = i18n.language as keyof typeof LANGS;

    const handleSelect = async (event: any, lng: 'en' | 'ru' | null) => {
        if (!lng) return;

        try {
            await changeLanguage(lng);
        } catch (error) {
            console.error('Failed to change language:', error);
        }
    };

    const textColor = theme === 'dark' ? '#d9dbdf' : '#1f2937';
    const bgColor = theme === 'dark' ? '#2b3035' : '#ffffff';
    const hoverBgColor = theme === 'dark' ? '#3b4046' : '#d1d5db';
    const selectedBgColor = theme === 'dark' ? '#4b5563' : '#bfdbfe';

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <Select
                value={current}
                onChange={handleSelect}
                renderValue={(selected) => (
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                        <LanguageIcon sx={{ fontSize: '1.2rem' }}/>
                        <span>{LANGS[selected?.value as keyof typeof LANGS]}</span>
                    </div>
                )}
                indicator={<KeyboardArrowDown />}
                sx={{
                    backgroundColor: bgColor,
                    color: textColor,
                    borderRadius: '0.7rem',
                    border: 'none',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: hoverBgColor,
                        transform: 'translateY(-1px)',
                    },
                    '& .MuiSelect-button': {
                        color: textColor,
                    },
                    '& .MuiSvgIcon-root': {
                        color: textColor,
                    },
                    [`& .${selectClasses.indicator}`]: {
                        transition: '0.2s',
                        color: textColor,
                        [`&.${selectClasses.expanded}`]: {
                            transform: 'rotate(-180deg)',
                        },
                    },
                }}
                slotProps={{
                    listbox: {
                        sx: {
                            backgroundColor: bgColor,
                            color: textColor,
                            border: `1px solid ${theme === 'dark' ? '#3b4046' : '#d1d5db'}`,
                        },
                    },
                }}
            >
                {(Object.entries(LANGS) as [keyof typeof LANGS, string][]).map(
                    ([code, label]) => (
                        <Option
                            key={code}
                            value={code}
                            onClick={() => handleSelect(code)}
                            sx={{
                                color: textColor,
                                backgroundColor: 'transparent',
                                '&:hover': {
                                    backgroundColor: hoverBgColor,
                                },
                                '&.Mui-selected': {
                                    backgroundColor: selectedBgColor,
                                    color: textColor,
                                    '&:hover': {
                                        backgroundColor: hoverBgColor,
                                    },
                                },
                                // Убираем outline
                                '&:focus': {
                                    outline: 'none',
                                    backgroundColor: hoverBgColor,
                                },
                                '&.Mui-focusVisible': {
                                    outline: 'none',
                                    backgroundColor: hoverBgColor,
                                },
                            }}
                        >
                            {label}
                        </Option>
                    )
                )}
            </Select>
        </div>
    );
};
