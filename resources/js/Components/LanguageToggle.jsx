export default function LanguageToggle({ locale, onChange, className = '' }) {
    return (
        <div
            className={`inline-flex items-center rounded-full border border-stone-200 bg-white/85 p-1 shadow-sm ${className}`}
        >
            <button
                type="button"
                onClick={() => onChange('en')}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                    locale === 'en'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-stone-100'
                }`}
            >
                EN
            </button>
            <button
                type="button"
                onClick={() => onChange('id')}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                    locale === 'id'
                        ? 'bg-teal-700 text-white'
                        : 'text-slate-600 hover:bg-stone-100'
                }`}
            >
                ID
            </button>
        </div>
    );
}
