export default function ThemeToggle({ theme, onChange, className = '' }) {
    return (
        <div
            className={`inline-flex items-center rounded-full border border-stone-200 bg-white/85 p-1 shadow-sm ${className}`}
        >
            <button
                type="button"
                onClick={() => onChange('light')}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                    theme === 'light'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-stone-100'
                }`}
            >
                Light
            </button>
            <button
                type="button"
                onClick={() => onChange('dark')}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                    theme === 'dark'
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-stone-100'
                }`}
            >
                Dark
            </button>
        </div>
    );
}
