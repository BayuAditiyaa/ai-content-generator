import { useEffect, useState } from 'react';

export const UI_LANGUAGE_STORAGE_KEY = 'promptpilot.ui-language';
const UI_LANGUAGE_EVENT = 'promptpilot:ui-language-changed';

export function normalizeLocale(value) {
    return value === 'id' ? 'id' : 'en';
}

export function getStoredLocale() {
    if (typeof window === 'undefined') {
        return 'en';
    }

    return normalizeLocale(window.localStorage.getItem(UI_LANGUAGE_STORAGE_KEY));
}

export function useUiLanguage() {
    const [locale, setLocaleState] = useState(getStoredLocale);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const normalized = normalizeLocale(locale);
        window.localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, normalized);
        document.documentElement.lang = normalized === 'id' ? 'id' : 'en';
    }, [locale]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return undefined;
        }

        const syncLocale = (value) => {
            setLocaleState(normalizeLocale(value));
        };

        const handleStorage = (event) => {
            if (event.key === UI_LANGUAGE_STORAGE_KEY) {
                syncLocale(event.newValue);
            }
        };

        const handleLocaleChange = (event) => {
            syncLocale(event.detail);
        };

        window.addEventListener('storage', handleStorage);
        window.addEventListener(UI_LANGUAGE_EVENT, handleLocaleChange);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener(UI_LANGUAGE_EVENT, handleLocaleChange);
        };
    }, []);

    const setLocale = (value) => {
        const normalized = normalizeLocale(value);
        setLocaleState(normalized);

        if (typeof window !== 'undefined') {
            window.localStorage.setItem(UI_LANGUAGE_STORAGE_KEY, normalized);
            window.dispatchEvent(new CustomEvent(UI_LANGUAGE_EVENT, { detail: normalized }));
        }
    };

    const toggleLocale = () => {
        setLocale(locale === 'id' ? 'en' : 'id');
    };

    return {
        locale,
        isIndonesian: locale === 'id',
        setLocale,
        toggleLocale,
    };
}

export function pickLanguage(locale, english, indonesian) {
    return normalizeLocale(locale) === 'id' ? indonesian : english;
}
