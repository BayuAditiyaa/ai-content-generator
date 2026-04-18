import { useEffect, useState } from 'react';

export const UI_THEME_STORAGE_KEY = 'promptpilot.ui-theme';

export function normalizeTheme(value) {
    return value === 'dark' ? 'dark' : 'light';
}

export function getStoredTheme() {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return normalizeTheme(window.localStorage.getItem(UI_THEME_STORAGE_KEY));
}

export function useUiTheme() {
    const [theme, setThemeState] = useState(getStoredTheme);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const normalized = normalizeTheme(theme);
        window.localStorage.setItem(UI_THEME_STORAGE_KEY, normalized);
        document.documentElement.dataset.theme = normalized;
    }, [theme]);

    const setTheme = (value) => {
        setThemeState(normalizeTheme(value));
    };

    const toggleTheme = () => {
        setThemeState((current) => (current === 'dark' ? 'light' : 'dark'));
    };

    return {
        theme,
        isDark: theme === 'dark',
        setTheme,
        toggleTheme,
    };
}
