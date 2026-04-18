import DangerButton from '@/Components/DangerButton';
import { Link } from '@inertiajs/react';
import { pickLanguage } from '@/lib/ui-language';
import {
    formatGenerationDuration,
    formatProvider,
    formatTemplateKey,
    translateContentType,
} from './helpers';

export default function HistoryList({
    locale,
    generations,
    regeneratingId,
    deletingId,
    onRegenerate,
    onDelete,
}) {
    const generationList = generations.data ?? [];

    return (
        <section className="space-y-4">
            {generationList.length ? (
                generationList.map((generation) => (
                    <article key={generation.id} className="glass-panel relative overflow-hidden rounded-[1.75rem] p-5">
                        {(regeneratingId === generation.id || deletingId === generation.id) && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/12 backdrop-blur-[2px]">
                                <div className="flex min-w-[14rem] items-center gap-3 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-lg shadow-slate-900/10">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-teal-200 border-t-teal-700" />
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-900">
                                            {deletingId === generation.id
                                                ? pickLanguage(locale, 'Deleting content...', 'Menghapus konten...')
                                                : pickLanguage(locale, 'Regenerating content...', 'Sedang generate ulang konten...')}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {deletingId === generation.id
                                                ? pickLanguage(locale, 'Please wait a moment.', 'Mohon tunggu sebentar.')
                                                : pickLanguage(locale, 'Preparing a fresh version.', 'Sedang menyiapkan versi baru.')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Tag>{translateContentType(locale, generation.content_type)}</Tag>
                                    <Tag tone="warm">
                                        {generation.length_control_value}{' '}
                                        {pickLanguage(
                                            locale,
                                            generation.length_control_type === 'characters' ? 'characters' : 'words',
                                            generation.length_control_type === 'characters' ? 'karakter' : 'kata',
                                        )}
                                    </Tag>
                                    <Tag>{formatProvider(generation.provider)}</Tag>
                                    {generation.best_variation_index !== null && (
                                        <Tag tone="favorite">{pickLanguage(locale, 'Favorite', 'Favorit')}</Tag>
                                    )}
                                </div>

                                <h3 className="mt-4 text-2xl font-semibold text-slate-900">
                                    {generation.topic}
                                </h3>
                                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-500">
                                    <span>{formatTemplateKey(generation.template_key)}</span>
                                    <span>{generation.created_at_human}</span>
                                    <span>{formatGenerationDuration(generation.generation_duration_ms, locale)}</span>
                                </div>
                                <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">
                                    {generation.generated_content}
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {generation.keywords.slice(0, 4).map((keyword) => (
                                        <span key={keyword} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600">
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex w-full flex-wrap gap-2 lg:w-auto lg:max-w-[20rem] lg:justify-end">
                                <HistoryActionLink href={route('dashboard', { generation: generation.id })}>
                                    {pickLanguage(locale, 'Open result', 'Buka hasil')}
                                </HistoryActionLink>
                                <HistoryActionLink href={route('dashboard', { generation: generation.id, prefill: generation.id })}>
                                    {pickLanguage(locale, 'Edit in generator', 'Edit di generator')}
                                </HistoryActionLink>
                                <HistoryActionButton
                                    onClick={() => onRegenerate(generation.id)}
                                    disabled={regeneratingId === generation.id || deletingId === generation.id}
                                >
                                    {regeneratingId === generation.id
                                        ? pickLanguage(locale, 'Regenerating...', 'Sedang generate ulang...')
                                        : pickLanguage(locale, 'Regenerate', 'Generate ulang')}
                                </HistoryActionButton>
                                <HistoryActionLink
                                    href={route('generations.export', {
                                        contentGeneration: generation.id,
                                        variation: generation.best_variation_index ?? 0,
                                    })}
                                >
                                    Export .txt
                                </HistoryActionLink>
                                <DangerButton
                                    type="button"
                                    disabled={deletingId === generation.id || regeneratingId === generation.id}
                                    onClick={() => onDelete(generation.id)}
                                >
                                    {deletingId === generation.id
                                        ? pickLanguage(locale, 'Deleting...', 'Menghapus...')
                                        : pickLanguage(locale, 'Delete', 'Hapus')}
                                </DangerButton>
                            </div>
                        </div>
                    </article>
                ))
            ) : (
                <EmptyState
                    title={pickLanguage(locale, 'No saved generations match this filter.', 'Tidak ada generasi tersimpan yang cocok dengan filter ini.')}
                    description={pickLanguage(
                        locale,
                        'Try a different search, remove the provider filter, or generate a new brief from the dashboard.',
                        'Coba pencarian lain, hapus filter provider, atau buat brief baru dari dashboard.',
                    )}
                />
            )}
        </section>
    );
}

export function HistorySkeleton({ locale, mode = 'filter' }) {
    return (
        <section className="glass-panel-strong rounded-[2rem] p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-teal-200 border-t-teal-700" />
                <p className="text-sm font-semibold text-slate-700">
                    {mode === 'delete'
                        ? pickLanguage(locale, 'Deleting content...', 'Menghapus konten...')
                        : mode === 'regenerate'
                          ? pickLanguage(locale, 'Regenerating content...', 'Sedang generate ulang konten...')
                          : pickLanguage(locale, 'Applying filters...', 'Menerapkan filter...')}
                </p>
            </div>
            <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="animate-pulse rounded-[1.75rem] border border-stone-200/80 bg-white/85 p-5">
                        <div className="flex flex-wrap gap-2">
                            <div className="h-6 w-24 rounded-full bg-stone-200" />
                            <div className="h-6 w-32 rounded-full bg-stone-200" />
                            <div className="h-6 w-20 rounded-full bg-stone-200" />
                        </div>
                        <div className="mt-4 h-7 w-2/3 rounded-lg bg-stone-200" />
                        <div className="mt-3 h-4 w-1/2 rounded bg-stone-200" />
                        <div className="mt-4 space-y-2">
                            <div className="h-4 w-full rounded bg-stone-200" />
                            <div className="h-4 w-11/12 rounded bg-stone-200" />
                            <div className="h-4 w-9/12 rounded bg-stone-200" />
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                            <div className="h-10 w-28 rounded-xl bg-stone-200" />
                            <div className="h-10 w-36 rounded-xl bg-stone-200" />
                            <div className="h-10 w-28 rounded-xl bg-stone-200" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function HistoryActionButton({ children, className = '', type = 'button', ...props }) {
    return (
        <button
            {...props}
            type={type}
            className={`inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-400 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 ${className}`}
        >
            {children}
        </button>
    );
}

function HistoryActionLink({ href, children }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-400 hover:bg-stone-50"
        >
            {children}
        </Link>
    );
}

function Tag({ children, tone = 'default' }) {
    const styles = {
        default: 'border-stone-200 bg-white text-slate-700',
        warm: 'border-amber-200 bg-amber-50 text-amber-800',
        favorite: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    };

    return (
        <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${styles[tone]}`}>
            {children}
        </span>
    );
}

function EmptyState({ title, description }) {
    return (
        <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white/65 p-8 text-center">
            <p className="text-lg font-semibold text-slate-800">{title}</p>
            {description && <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>}
        </div>
    );
}
