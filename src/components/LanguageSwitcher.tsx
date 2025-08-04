import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';
import { useState } from 'react';
import {Button, ButtonGroup } from '@mui/joy';

const LANGS = {
    en: 'ENG',
    ru: 'RUS',
};

export const LanguageSwitcher = () => {
    const { i18n, t } = useTranslation();
    const [open, setOpen] = useState(false);

    const current = i18n.language as keyof typeof LANGS;

    const handleSelect = async (lng: 'en' | 'ru') => {
        await changeLanguage(lng);
        setOpen(false);
    };

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>

            <ButtonGroup
                variant="solid"
                color="neutral"
                >
                {(Object.entries(LANGS) as [keyof typeof LANGS, string][]).map(
                    ([code, label]) => (
                        <Button key={code} onClick={() => handleSelect(code)}>{label}</Button>
                    )
                )}
            </ButtonGroup>

        </div>
    );
};
