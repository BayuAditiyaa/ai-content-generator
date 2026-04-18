export default function Toast({ toast }) {
    return (
        <div
            className={`rounded-[1.5rem] border px-5 py-4 text-sm shadow-sm ${
                toast.type === 'error'
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                <p>{toast.text}</p>
                <button
                    type="button"
                    onClick={() => window.dispatchEvent(new CustomEvent('proseai:close-toast'))}
                    className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70 transition hover:opacity-100"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
