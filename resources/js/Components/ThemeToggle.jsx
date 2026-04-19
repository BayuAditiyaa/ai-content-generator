export default function ThemeToggle({ theme, onChange, className = '' }) {
    return (
        <div
            className={`inline-flex items-center rounded-full border border-stone-200 bg-white/85 p-1 shadow-sm ${className}`}
        >
            <button
                type="button"
                onClick={() => onChange('light')}
                className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition sm:px-3 sm:text-[11px] sm:tracking-[0.18em] ${
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
                className={`whitespace-nowrap rounded-full px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] transition sm:px-3 sm:text-[11px] sm:tracking-[0.18em] ${
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
