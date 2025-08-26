import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const language = localStorage.getItem('language') || 'en';

const loadResources = async () => {
    const { en } = await import('./resources/en');
    const { ru } = await import('./resources/ru');

    return {
        en: { translation: en.translation },
        ru: { translation: ru.translation },
    };
};

const initI18n = async () => {
    const resources = await loadResources();

    await i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: language,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
        });

    return i18n;
};

export const changeLanguage = async (lng: 'en' | 'ru') => {
    const resources = await loadResources();
    i18n.addResourceBundle(lng, 'translation', resources[lng].translation, true, true);
    await i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
};

export default initI18n;
