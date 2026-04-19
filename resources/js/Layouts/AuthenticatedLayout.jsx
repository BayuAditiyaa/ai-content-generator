import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import LanguageToggle from '@/Components/LanguageToggle';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { pickLanguage, useUiLanguage } from '@/lib/ui-language';
import ThemeToggle from '@/Components/ThemeToggle';
import { useUiTheme } from '@/lib/ui-theme';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const { locale, setLocale } = useUiLanguage();
    const { theme, setTheme } = useUiTheme();

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen">
            <div className="mesh-orb animate-float-slow left-[-3rem] top-24 h-36 w-36 bg-amber-300/40" />
            <div className="mesh-orb animate-float-slow bottom-12 right-[-4rem] h-40 w-40 bg-teal-300/40" />

            <nav className="sticky top-0 z-40 border-b border-white/60 bg-[#fcfaf6]/80 backdrop-blur-xl">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className="inline-flex items-center gap-3">
                                    <ApplicationLogo className="block h-11 w-11" />
                                    <div className="hidden sm:block">
                                        <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-800/70">
                                            ProseAI
                                        </div>
                                        <div className="display-title text-xl text-slate-900">
                                            AI Video Planner
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            <div className="hidden items-center space-x-3 sm:ms-8 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    {pickLanguage(locale, 'Dashboard', 'Dasbor')}
                                </NavLink>
                                <NavLink
                                    href={route('history.index')}
                                    active={route().current('history.*')}
                                >
                                    {pickLanguage(locale, 'History', 'Riwayat')}
                                </NavLink>
                                <NavLink
                                    href={route('settings.ai.edit')}
                                    active={route().current('settings.ai.*')}
                                >
                                    {pickLanguage(locale, 'AI Settings', 'Pengaturan AI')}
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <ThemeToggle theme={theme} onChange={setTheme} className="me-3" />
                            <LanguageToggle
                                locale={locale}
                                onChange={setLocale}
                                className="me-3"
                            />
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-medium leading-4 text-slate-600 transition duration-150 ease-in-out hover:border-slate-300 hover:text-slate-900 focus:outline-none"
                                            >
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-teal-700 to-amber-500 text-xs font-semibold text-white">
                                                    {user.name.charAt(0)}
                                                </span>
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            {pickLanguage(locale, 'Profile', 'Profil')}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('history.index')}>
                                            {pickLanguage(locale, 'History', 'Riwayat')}
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('settings.ai.edit')}>
                                            {pickLanguage(locale, 'AI Settings', 'Pengaturan AI')}
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            {pickLanguage(locale, 'Log Out', 'Keluar')}
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/70 p-2 text-slate-500 transition duration-150 ease-in-out hover:bg-white hover:text-slate-700 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 border-t border-white/70 px-4 pb-4 pt-4">
                        <div className="mb-3">
                            <ThemeToggle theme={theme} onChange={setTheme} className="mb-3" />
                            <LanguageToggle locale={locale} onChange={setLocale} />
                        </div>
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            {pickLanguage(locale, 'Dashboard', 'Dasbor')}
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('history.index')}
                            active={route().current('history.*')}
                        >
                            {pickLanguage(locale, 'History', 'Riwayat')}
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('settings.ai.edit')}
                            active={route().current('settings.ai.*')}
                        >
                            {pickLanguage(locale, 'AI Settings', 'Pengaturan AI')}
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-slate-200/80 pb-4 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-slate-900">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-slate-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                {pickLanguage(locale, 'Profile', 'Profil')}
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('history.index')}>
                                {pickLanguage(locale, 'History', 'Riwayat')}
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('settings.ai.edit')}>
                                {pickLanguage(locale, 'AI Settings', 'Pengaturan AI')}
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                {pickLanguage(locale, 'Log Out', 'Keluar')}
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="relative">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
