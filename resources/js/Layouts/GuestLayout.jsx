import ApplicationLogo from '@/Components/ApplicationLogo';
import LanguageToggle from '@/Components/LanguageToggle';
import { pickLanguage, useUiLanguage } from '@/lib/ui-language';
import ThemeToggle from '@/Components/ThemeToggle';
import { useUiTheme } from '@/lib/ui-theme';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { locale, setLocale } = useUiLanguage();
    const { theme, setTheme } = useUiTheme();

    return (
        <div className="guest-page relative flex min-h-screen items-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
            <div className="mesh-orb animate-float-slow left-[-6rem] top-10 h-40 w-40 bg-amber-300/50" />
            <div className="mesh-orb animate-float-slow bottom-10 right-[-5rem] h-48 w-48 bg-teal-300/40" />

            <div className="guest-shell mx-auto grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/55 shadow-[0_24px_120px_rgba(21,32,51,0.16)] backdrop-blur-2xl lg:grid-cols-[1.1fr_0.9fr]">
                <div className="guest-aside relative hidden min-h-full overflow-hidden bg-slate-950 px-8 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-12">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.32),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.28),_transparent_28%),linear-gradient(160deg,_#08111f_0%,_#0f172a_52%,_#111827_100%)]" />
<div className="relative z-10 w-full flex items-center justify-between">
    {/* --- Kiri: Branding --- */}
    <Link href="/" className="inline-flex items-center gap-3">
        <ApplicationLogo className="h-12 w-12" />
        <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/65">
                                    ProseAI
                                </p>
                                <p className="display-title text-xl text-stone-50">
                                    AI Content Generator
                                </p>
        </div>
    </Link>

    {/* --- Kanan: Pengaturan (Toggles) --- */}
    {/* Menyusun toggle secara horizontal (menyamping) dengan jarak yang rapi */}
    <div className="flex items-center gap-6">
        <LanguageToggle
            locale={locale}
            onChange={setLocale}
        />
        <ThemeToggle
            theme={theme}
            onChange={setTheme}
        />
    </div>
</div>

                    <div className="relative z-10 space-y-8">
                        <div className="space-y-4">
                            <span className="eyebrow border-white/10 bg-white/10 text-amber-200">
                                Laravel 12 + Inertia React
                            </span>
                            <h1 className="display-title text-balance text-4xl leading-tight text-stone-50 xl:text-5xl">
                                {pickLanguage(
                                    locale,
                                    'A focused foundation for shipping polished AI workflows fast.',
                                    'Fondasi yang fokus untuk merilis alur kerja AI yang rapi dengan cepat.',
                                )}
                            </h1>
                            <p className="max-w-md text-sm leading-7 text-slate-300">
                                {pickLanguage(
                                    locale,
                                    'Responsive auth flows, a modern dashboard shell, and a visual system that already feels like a product instead of a starter kit.',
                                    'Alur autentikasi responsif, kerangka dasbor modern, dan sistem visual yang sudah terasa seperti produk, bukan starter kit.',
                                )}
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                [
                                    pickLanguage(locale, 'Fast setup', 'Setup cepat'),
                                    pickLanguage(
                                        locale,
                                        'Breeze auth, Inertia routing, React pages, Vite build.',
                                        'Auth Breeze, routing Inertia, halaman React, dan build Vite.',
                                    ),
                                ],
                                [
                                    pickLanguage(locale, 'UI ready', 'UI siap pakai'),
                                    pickLanguage(
                                        locale,
                                        'Warm editorial palette, glass cards, and mobile-friendly spacing.',
                                        'Palet editorial hangat, glass card, dan spacing yang ramah mobile.',
                                    ),
                                ],
                            ].map(([title, description]) => (
                                <div key={title} className="rounded-3xl border border-white/10 bg-white/8 p-5 backdrop-blur">
                                    <p className="text-sm font-semibold text-stone-50">{title}</p>
                                    <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="guest-form-panel glass-panel-strong relative flex min-h-[40rem] items-center px-5 py-8 sm:px-8 lg:px-10">
                    <div className="mx-auto w-full max-w-md animate-rise">
                        <div className="mb-8 lg:hidden">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <Link href="/" className="inline-flex items-center gap-3">
                                    <ApplicationLogo className="h-11 w-11" />
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-800/70">
                                            ProseAI
                                        </p>
                                        <p className="display-title text-2xl text-slate-900">
                                            AI Content Generator & Marketing Copywriter
                                        </p>
                                    </div>
                                </Link>
                                <div className="flex flex-wrap gap-2">
                                    <ThemeToggle theme={theme} onChange={setTheme} />
                                    <LanguageToggle locale={locale} onChange={setLocale} />
                                </div>
                            </div>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
