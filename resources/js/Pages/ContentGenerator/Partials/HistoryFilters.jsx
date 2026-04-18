import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { pickLanguage } from '@/lib/ui-language';

export default function HistoryFilters({
    locale,
    search,
    setSearch,
    providerFilter,
    setProviderFilter,
    favoritesOnly,
    setFavoritesOnly,
    providers,
    submitSearch,
    isFiltering,
}) {
    return (
        <section className="glass-panel-strong rounded-[2rem] p-6 sm:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-800/70">
                        {pickLanguage(locale, 'Filter history', 'Filter riwayat')}
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                        {pickLanguage(locale, 'Find the result you want to continue', 'Temukan hasil yang ingin kamu lanjutkan')}
                    </h2>
                </div>

                <form onSubmit={submitSearch} className="w-full max-w-2xl">
                    <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_auto_auto]">
                        <TextInput
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={pickLanguage(locale, 'Search topic, template, tone...', 'Cari topik, template, gaya...')}
                        />
                        <select
                            value={providerFilter}
                            onChange={(event) => setProviderFilter(event.target.value)}
                            className="w-full rounded-2xl border border-stone-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                        >
                            <option value="">{pickLanguage(locale, 'All providers', 'Semua provider')}</option>
                            {providers.map((provider) => (
                                <option key={provider} value={provider}>
                                    {String(provider).toUpperCase()}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => setFavoritesOnly((current) => !current)}
                            disabled={isFiltering}
                            className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                                favoritesOnly
                                    ? 'border-amber-300 bg-amber-50 text-amber-800'
                                    : 'border-stone-200 bg-white text-slate-700'
                            } ${isFiltering ? 'cursor-not-allowed opacity-60' : ''}`}
                        >
                            {pickLanguage(locale, 'Favorites', 'Favorit')}
                        </button>
                        <PrimaryButton type="submit" disabled={isFiltering}>
                            {isFiltering
                                ? pickLanguage(locale, 'Applying...', 'Menerapkan...')
                                : pickLanguage(locale, 'Apply', 'Terapkan')}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </section>
    );
}
