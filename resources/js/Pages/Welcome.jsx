import ApplicationLogo from '@/Components/ApplicationLogo';
import LanguageToggle from '@/Components/LanguageToggle';
import { pickLanguage, useUiLanguage } from '@/lib/ui-language';
import ThemeToggle from '@/Components/ThemeToggle';
import { useUiTheme } from '@/lib/ui-theme';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const { locale, setLocale } = useUiLanguage();
    const { theme, setTheme } = useUiTheme();
    const seoDescription = pickLanguage(
        locale,
        'Generate articles, ad copy, and emails in seconds with ProseAI. The best AI Content Generator for marketers and professional writers.',
        'Hasilkan artikel, copy iklan, dan email dalam hitungan detik dengan ProseAI. AI Content Generator terbaik untuk marketer dan penulis profesional',
    );
    const seoKeywords = pickLanguage(
        locale,
        'ProseAI, AI Content Generator, Marketing Copywriter, How to create ad copywriting automatically, Fast blog article generator tool built with Laravel, Best AI recommendation for writing office emails',
        'ProseAI, AI Content Generator, Marketing Copywriter, Cara membuat copywriting iklan otomatis, Alat pembuat artikel blog cepat dengan Laravel, Rekomendasi AI untuk menulis email kantor',
    );
    const features = [
        {
            title: pickLanguage(
                locale,
                'Multi-variation generation',
                'Generasi multi-variasi',
            ),
            description: pickLanguage(
                locale,
                'Generate up to three writing angles from one brief so the user can compare hooks quickly.',
                'Hasilkan hingga tiga sudut penulisan dari satu brief agar pengguna bisa membandingkan hook dengan cepat.',
            ),
        },
        {
            title: pickLanguage(
                locale,
                'Saved content history',
                'Riwayat konten tersimpan',
            ),
            description: pickLanguage(
                locale,
                'Every result is stored in the database and can be searched, revisited, copied, or removed.',
                'Setiap hasil disimpan ke database dan bisa dicari, dibuka lagi, disalin, atau dihapus.',
            ),
        },
        {
            title: pickLanguage(
                locale,
                'Responsive demo shell',
                'Tampilan demo responsif',
            ),
            description: pickLanguage(
                locale,
                'The interface is structured to look intentional on mobile and desktop before production polish.',
                'Antarmuka ini dirancang agar terlihat rapi di perangkat seluler dan desktop sebelum tahap penyempurnaan akhir.',
            ),
        },
    ];

    return (
        <>
            <Head title="ProseAI">
                <meta
                    name="description"
                    content={seoDescription}
                />
                <meta
                    name="keywords"
                    content={seoKeywords}
                />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:locale" content={locale === 'id' ? 'id_ID' : 'en_US'} />
            </Head>

            <div className="welcome-page relative overflow-hidden">
                <div className="mesh-orb animate-float-slow left-[-4rem] top-20 h-48 w-48 bg-amber-300/45" />
                <div className="mesh-orb animate-float-slow right-[-5rem] top-16 h-56 w-56 bg-teal-300/35" />
                <div className="mesh-orb animate-float-slow bottom-10 left-[40%] h-44 w-44 bg-cyan-200/30" />

                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <header className="welcome-header glass-panel mx-auto flex max-w-6xl flex-col gap-4 rounded-[2rem] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:rounded-full sm:px-6 sm:py-3">
                        <Link href="/" className="inline-flex min-w-0 items-center gap-3">
                            <div className="rounded-2xl bg-white/80 p-1.5">
                                <ApplicationLogo className="h-11 w-11" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-800/70">
                                    ProseAI
                                </p>
                                <p className="display-title truncate text-lg text-slate-900 sm:text-xl">
                                    AI Content Generator
                                </p>
                            </div>
                        </Link>

                        <nav className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
                            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                                <ThemeToggle theme={theme} onChange={setTheme} />
                                <LanguageToggle locale={locale} onChange={setLocale} />
                            </div>
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-flex items-center justify-center rounded-full border border-teal-700/20 bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-900 transition hover:bg-teal-100"
                                >
                                    {pickLanguage(locale, 'Open dashboard', 'Buka dasbor')}
                                </Link>
                            ) : (
                                <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center justify-center rounded-full border border-transparent px-4 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-white/70 hover:text-slate-900"
                                    >
                                        {pickLanguage(locale, 'Log in', 'Masuk')}
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center justify-center rounded-full bg-slate-950 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-slate-800"
                                    >
                                        {pickLanguage(locale, 'Register', 'Daftar')}
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </header>

                    <main className="mx-auto max-w-6xl py-10 sm:py-14">
                        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
                            <div className="animate-rise space-y-6">
                                {/* <span className="eyebrow">
                                    Laravel 12 + Inertia React
                                </span> */}
                                <div>
                                    <h1 className="display-title text-balance text-5xl leading-[0.94] text-slate-900 sm:text-6xl lg:text-7xl">
                                        {pickLanguage(
                                            locale,
                                            'Build stronger content faster, then compare the best variations side by side.',
                                            'Buat konten yang lebih kuat lebih cepat, lalu bandingkan variasi terbaik secara berdampingan.',
                                        )}
                                    </h1>
                                    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
                                        {pickLanguage(
                                            locale,
                                            'ProseAI helps you generate articles, ad copy, and emails in seconds with an AI Content Generator and Marketing Copywriter workflow built for modern teams.',
                                            'ProseAI membantu Anda membuat artikel, teks iklan, dan email dalam hitungan detik berkat Generator Konten AI dan alur kerja Penulis Iklan Pemasaran yang dirancang khusus untuk tim modern.',
                                        )}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <Link
                                        href={
                                            auth.user
                                                ? route('dashboard')
                                                : route('register')
                                        }
                                        className="inline-flex items-center justify-center rounded-full bg-teal-700 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:-translate-y-0.5 hover:bg-teal-800"
                                    >
                                        {auth.user
                                            ? pickLanguage(locale, 'Go to generator', 'Buka generator')
                                            : pickLanguage(locale, 'Create account', 'Buat akun')}
                                    </Link>
                                    {!auth.user && (
                                        <Link
                                            href={route('login')}
                                            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white/70 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-800 transition hover:bg-white"
                                        >
                                            {pickLanguage(locale, 'Explore demo flow', 'Lihat alur demo')}
                                        </Link>
                                    )}
                                </div>

                                <div className="grid gap-3 sm:grid-cols-3">
                                    {features.map((feature) => (
                                        <div
                                            key={feature.title}
                                            className="welcome-feature-card rounded-[1.5rem] border border-white/60 bg-white/65 p-4 text-sm leading-6 text-slate-700 shadow-[0_14px_40px_rgba(21,32,51,0.08)]"
                                        >
                                            <p className="font-semibold text-slate-900">
                                                {feature.title}
                                            </p>
                                            <p className="mt-2">
                                                {feature.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="animate-rise lg:self-start">
                                <div className="welcome-preview relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_100px_rgba(15,23,42,0.34)] sm:p-8">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.35),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.3),_transparent_32%)]" />
                                    <div className="relative z-10 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200">
                                                {pickLanguage(locale, 'Demo preview', 'Pratinjau demo')}
                                            </span>
                                        </div>
                                        <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                                            <p className="text-sm text-slate-300">
                                                {pickLanguage(locale, 'Suggested prompt', 'Prompt contoh')}
                                            </p>
                                            <h2 className="mt-3 display-title text-3xl text-stone-50">
                                                {pickLanguage(
                                                    locale,
                                                    'Write three launch email variations for a productivity app.',
                                                    'Tulis tiga variasi email peluncuran untuk aplikasi produktivitas.',
                                                )}
                                            </h2>
                                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                                {[
                                                    [
                                                        pickLanguage(locale, 'Audience', 'Audiens'),
                                                        pickLanguage(locale, 'Startup founders', 'Pendiri startup'),
                                                    ],
                                                    [
                                                        pickLanguage(locale, 'Tone', 'Gaya'),
                                                        pickLanguage(locale, 'Clear and persuasive', 'Jelas dan persuasif'),
                                                    ],
                                                    [
                                                        pickLanguage(locale, 'Format', 'Format'),
                                                        pickLanguage(locale, 'Email copy', 'Copy email'),
                                                    ],
                                                    [
                                                        pickLanguage(locale, 'Variations', 'Variasi'),
                                                        pickLanguage(locale, '3 versions', '3 versi'),
                                                    ],
                                                ].map(([label, value]) => (
                                                    <div
                                                        key={label}
                                                        className="rounded-2xl border border-white/10 bg-slate-900/40 p-4"
                                                    >
                                                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                                            {label}
                                                        </p>
                                                        <p className="mt-2 text-sm font-medium text-stone-50">
                                                            {value}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        
                                    </div>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
}
