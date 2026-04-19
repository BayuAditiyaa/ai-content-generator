import { pickLanguage } from '@/lib/ui-language';

export default function HistoryHeader({ locale }) {
    return (
        <div>
            <span className="eyebrow">{pickLanguage(locale, 'Video history', 'Riwayat video')}</span>
            <h1 className="display-title mt-3 text-4xl text-slate-900">
                {pickLanguage(locale, 'Review, filter, and reopen past video plans.', 'Tinjau, filter, dan buka lagi video plan sebelumnya.')}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                {pickLanguage(
                    locale,
                    'Use this page to manage saved scripts and storyboards while keeping the generator dashboard focused on creation.',
                    'Gunakan halaman ini untuk mengelola skrip dan storyboard tersimpan sambil menjaga dashboard generator tetap fokus pada pembuatan.',
                )}
            </p>
        </div>
    );
}
