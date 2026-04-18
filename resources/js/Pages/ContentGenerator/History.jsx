import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import HistoryFilters from '@/Pages/ContentGenerator/Partials/HistoryFilters';
import HistoryHeader from '@/Pages/ContentGenerator/Partials/HistoryHeader';
import HistoryList, { HistorySkeleton } from '@/Pages/ContentGenerator/Partials/HistoryList';
import Toast from '@/Pages/ContentGenerator/Partials/Toast';
import { pickLanguage, useUiLanguage } from '@/lib/ui-language';
import { Head, router, usePage } from '@inertiajs/react';
import { startTransition, useEffect, useState } from 'react';

const emptyToast = { type: '', text: '' };

export default function History({ generations, filters, providers }) {
    const { locale } = useUiLanguage();
    const { flash } = usePage().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [providerFilter, setProviderFilter] = useState(filters.provider ?? '');
    const [favoritesOnly, setFavoritesOnly] = useState(Boolean(filters.favorites));
    const [toast, setToast] = useState(emptyToast);
    const [isFiltering, setIsFiltering] = useState(false);
    const [regeneratingId, setRegeneratingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        if (flash.success) {
            setToast({ type: 'success', text: flash.success });
        } else if (flash.error) {
            setToast({ type: 'error', text: flash.error });
        }
    }, [flash.error, flash.success]);

    useEffect(() => {
        if (!toast.text) {
            return undefined;
        }

        const timer = window.setTimeout(() => setToast(emptyToast), 4500);

        return () => window.clearTimeout(timer);
    }, [toast]);

    const submitSearch = (event) => {
        event.preventDefault();
        setIsFiltering(true);

        startTransition(() => {
            router.get(
                route('history.index'),
                { search, provider: providerFilter, favorites: favoritesOnly ? 1 : 0 },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    onFinish: () => setIsFiltering(false),
                },
            );
        });
    };

    const deleteGeneration = (generationId) => {
        if (
            !window.confirm(
                pickLanguage(
                    locale,
                    'Delete this saved generation? This action cannot be undone.',
                    'Hapus hasil tersimpan ini? Tindakan ini tidak bisa dibatalkan.',
                ),
            )
        ) {
            return;
        }

        setDeletingId(generationId);
        router.delete(route('generations.destroy', generationId), {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        });
    };

    const regenerateGeneration = (generationId) => {
        setRegeneratingId(generationId);
        router.post(route('generations.regenerate', generationId), {}, {
            preserveScroll: true,
            onFinish: () => setRegeneratingId(null),
        });
    };

    return (
        <AuthenticatedLayout header={<HistoryHeader locale={locale} />}>
            <Head title={pickLanguage(locale, 'History', 'Riwayat')} />

            <div className="pb-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {toast.text && <Toast toast={toast} />}

                    <HistoryFilters
                        locale={locale}
                        search={search}
                        setSearch={setSearch}
                        providerFilter={providerFilter}
                        setProviderFilter={setProviderFilter}
                        favoritesOnly={favoritesOnly}
                        setFavoritesOnly={setFavoritesOnly}
                        providers={providers}
                        submitSearch={submitSearch}
                        isFiltering={isFiltering}
                    />

                    {isFiltering ? (
                        <HistorySkeleton locale={locale} mode="filter" />
                    ) : (
                        <HistoryList
                            locale={locale}
                            generations={generations}
                            regeneratingId={regeneratingId}
                            deletingId={deletingId}
                            onRegenerate={regenerateGeneration}
                            onDelete={deleteGeneration}
                        />
                    )}

                    {generations.links?.length > 3 && (
                        <div className="flex flex-wrap gap-2">
                            {generations.links.map((link) => (
                                <button
                                    key={link.label}
                                    type="button"
                                    disabled={!link.url || isFiltering}
                                    onClick={() =>
                                        link.url &&
                                        router.visit(link.url, {
                                            preserveScroll: true,
                                            preserveState: true,
                                        })
                                    }
                                    className={`rounded-full px-4 py-2 text-sm transition ${
                                        link.active
                                            ? 'bg-slate-900 text-white'
                                            : 'border border-stone-300 bg-white text-slate-700 disabled:cursor-not-allowed disabled:opacity-40'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
