import { pickLanguage } from '@/lib/ui-language';

export default function HistoryHeader({ locale }) {
    return (
        <div>
            <span className="eyebrow">{pickLanguage(locale, 'Generation history', 'Riwayat generasi')}</span>
            <h1 className="display-title mt-3 text-4xl text-slate-900">
                {pickLanguage(locale, 'Review, filter, and reopen past content.', 'Tinjau, filter, dan buka lagi konten sebelumnya.')}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                {pickLanguage(
                    locale,
                    'Use this page to manage saved results while keeping the generator dashboard focused on writing.',
                    'Gunakan halaman ini untuk mengelola hasil tersimpan sambil menjaga dashboard generator tetap fokus pada proses menulis.',
                )}
            </p>
        </div>
    );
}
