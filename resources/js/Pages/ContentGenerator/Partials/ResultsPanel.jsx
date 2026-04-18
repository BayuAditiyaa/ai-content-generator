import { pickLanguage } from '@/lib/ui-language';
import { useEffect, useState } from 'react';
import {
    assessLengthTarget,
    formatGenerationDuration,
    formatProvider,
    formatTemplateKey,
    getTextStats,
    translateContentType,
    translateTone,
} from './helpers';

export default function ResultsPanel({
    locale,
    selectedGeneration,
    selectedVariation,
    selectedVariationIndex,
    setSelectedVariationIndex,
    exportHref,
    copyContent,
    copyAllVariations,
    loadGenerationIntoForm,
    favoriteVariation,
    regenerateGeneration,
}) {
    return (
        <section className="space-y-6">
            <div className="result-surface glass-panel-strong rounded-[2rem] p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-800/70">
                            {pickLanguage(locale, 'Output', 'Hasil')}
                        </p>
                        <h2 className="display-title mt-3 text-3xl text-slate-900">
                            {pickLanguage(locale, 'Selected generation', 'Generasi terpilih')}
                        </h2>
                    </div>

                    {selectedGeneration && (
                        <div className="flex flex-wrap gap-2">
                            <ResultActionButton onClick={copyContent}>
                                {pickLanguage(locale, 'Copy', 'Salin')}
                            </ResultActionButton>
                            <ResultActionButton onClick={copyAllVariations}>
                                {pickLanguage(locale, 'Copy all', 'Salin semua')}
                            </ResultActionButton>
                            <ResultActionButton onClick={() => loadGenerationIntoForm(selectedGeneration)}>
                                {pickLanguage(locale, 'Edit brief', 'Edit brief')}
                            </ResultActionButton>
                            <ResultActionButton onClick={() => regenerateGeneration(selectedGeneration.id)}>
                                {pickLanguage(locale, 'Regenerate', 'Generate ulang')}
                            </ResultActionButton>
                            <a
                                href={exportHref}
                                className="inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-400 hover:bg-stone-50"
                            >
                                Export .txt
                            </a>
                        </div>
                    )}
                </div>

                {selectedGeneration ? (
                    <ResultDetails
                        locale={locale}
                        selectedGeneration={selectedGeneration}
                        selectedVariation={selectedVariation}
                        selectedVariationIndex={selectedVariationIndex}
                        setSelectedVariationIndex={setSelectedVariationIndex}
                        favoriteVariation={favoriteVariation}
                    />
                ) : (
                    <EmptyState
                        title={pickLanguage(locale, 'No generation selected yet', 'Belum ada generasi yang dipilih')}
                        description={pickLanguage(
                            locale,
                            'Create your first content brief on the left to see the generated output here.',
                            'Buat brief konten pertamamu di sisi kiri untuk melihat hasil generate di sini.',
                        )}
                    />
                )}
            </div>
        </section>
    );
}

function ResultDetails({
    locale,
    selectedGeneration,
    selectedVariation,
    selectedVariationIndex,
    setSelectedVariationIndex,
    favoriteVariation,
}) {
    const selectedVariationStats = getTextStats(selectedVariation?.content ?? '');
    const selectedLengthAssessment = assessLengthTarget(
        selectedVariationStats,
        selectedGeneration.length_control_type,
        selectedGeneration.length_control_value,
    );
    const [isContentExpanded, setIsContentExpanded] = useState(false);
    const shouldShowContentToggle = String(selectedVariation?.content ?? '').length > 420;

    useEffect(() => {
        setIsContentExpanded(false);
    }, [selectedGeneration.id, selectedVariationIndex]);

    return (
        <div className="mt-8 space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetaPill label={pickLanguage(locale, 'Type', 'Jenis')} value={translateContentType(locale, selectedGeneration.content_type)} />
                <MetaPill label={pickLanguage(locale, 'Tone', 'Gaya')} value={translateTone(locale, selectedGeneration.tone)} />
                <MetaPill label={pickLanguage(locale, 'Audience', 'Audiens')} value={selectedGeneration.target_audience} />
                <MetaPill label={pickLanguage(locale, 'Variations', 'Variasi')} value={String(selectedGeneration.variation_count ?? selectedGeneration.variations.length)} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetaPill label={pickLanguage(locale, 'Template', 'Template')} value={formatTemplateKey(selectedGeneration.template_key)} />
                <MetaPill
                    label={pickLanguage(locale, 'Length target', 'Target panjang')}
                    value={`${selectedGeneration.length_control_value} ${pickLanguage(
                        locale,
                        selectedGeneration.length_control_type === 'characters' ? 'characters' : 'words',
                        selectedGeneration.length_control_type === 'characters' ? 'karakter' : 'kata',
                    )}`}
                />
                <MetaPill label={pickLanguage(locale, 'Provider', 'Provider')} value={`${formatProvider(selectedGeneration.provider)} / ${selectedGeneration.model}`} />
                <MetaPill
                    label={pickLanguage(locale, 'Generation time', 'Waktu generasi')}
                    value={formatGenerationDuration(selectedGeneration.generation_duration_ms, locale)}
                />
            </div>

            <div className="result-topic-card rounded-[1.5rem] border border-stone-200/80 bg-white/85 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {pickLanguage(locale, 'Topic', 'Topik')}
                </p>
                <p className="mt-2 text-xl font-semibold text-slate-900">
                    {selectedGeneration.topic}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {selectedGeneration.keywords.length ? (
                        selectedGeneration.keywords.map((keyword) => (
                            <span key={keyword} className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
                                {keyword}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-slate-500">
                            {pickLanguage(locale, 'No keywords specified', 'Tidak ada kata kunci')}
                        </span>
                    )}
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
                {selectedGeneration.variations.map((variation, index) => (
                    <VariationCard
                        key={`${selectedGeneration.id}-${variation.title}-${index}`}
                        locale={locale}
                        variation={variation}
                        index={index}
                        active={selectedVariationIndex === index}
                        lengthControlType={selectedGeneration.length_control_type}
                        lengthControlValue={selectedGeneration.length_control_value}
                        isBest={selectedGeneration.best_variation_index === index}
                        onClick={() => setSelectedVariationIndex(index)}
                    />
                ))}
            </div>

            <div className="result-body-card rounded-[1.5rem] border border-stone-200/80 bg-white/85 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                            {pickLanguage(locale, 'Active variation', 'Variasi aktif')}
                        </p>
                        <p className="mt-2 text-xl font-semibold text-slate-900">
                            {selectedVariation?.title ?? pickLanguage(locale, 'Variation 1', 'Variasi 1')}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {selectedGeneration.best_variation_index === selectedVariationIndex && (
                            <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-800">
                                {pickLanguage(locale, 'Best variation', 'Variasi terbaik')}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => favoriteVariation(selectedGeneration.id, selectedVariationIndex)}
                            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.16)] transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                        >
                            {pickLanguage(locale, 'Use variation', 'Pakai variasi')}
                        </button>
                        <ProviderBadge provider={selectedGeneration.provider} model={selectedGeneration.model} locale={locale} />
                        <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                            {selectedGeneration.created_at_human}
                        </div>
                    </div>
                </div>
                <div
                    className={`mt-4 text-sm leading-8 text-slate-700 ${
                        isContentExpanded ? 'whitespace-pre-wrap' : 'line-clamp-6 whitespace-pre-line'
                    }`}
                >
                    {selectedVariation?.content}
                </div>
                {shouldShowContentToggle && (
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() => setIsContentExpanded((current) => !current)}
                            className="text-sm font-semibold text-teal-700 transition hover:text-teal-800"
                        >
                            {isContentExpanded
                                ? pickLanguage(locale, 'Show less', 'Tampilkan lebih sedikit')
                                : pickLanguage(locale, 'Read more', 'Baca selengkapnya')}
                        </button>
                    </div>
                )}
                <div className="mt-5 border-t border-stone-200 pt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {pickLanguage(locale, 'Content stats', 'Statistik konten')}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <StatsBadge
                            label={pickLanguage(locale, 'Words', 'Kata')}
                            value={selectedVariationStats.words}
                        />
                        <StatsBadge
                            label={pickLanguage(locale, 'Characters', 'Karakter')}
                            value={selectedVariationStats.characters}
                        />
                        <TargetBadge
                            locale={locale}
                            assessment={selectedLengthAssessment}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function EmptyState({ title, description }) {
    return (
        <div className="mt-8 rounded-[1.5rem] border border-dashed border-stone-300 bg-white/65 p-8 text-center">
            <p className="text-lg font-semibold text-slate-800">{title}</p>
            {description && <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>}
        </div>
    );
}

function ProviderBadge({ provider, model, locale, compact = false }) {
    const label = compact ? formatProvider(provider) : `${formatProvider(provider)} | ${model}`;

    return (
        <span className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-800">
            {pickLanguage(locale, `Provider ${label}`, `Provider ${label}`)}
        </span>
    );
}

function StatsBadge({ label, value }) {
    return (
        <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700">
            {label}: {value}
        </span>
    );
}

function TargetBadge({ locale, assessment }) {
    const styles = {
        near: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        short: 'border-amber-200 bg-amber-50 text-amber-700',
        long: 'border-rose-200 bg-rose-50 text-rose-700',
    };

    const labels = {
        near: pickLanguage(locale, 'Near target', 'Sesuai target'),
        short: pickLanguage(locale, 'Too short', 'Terlalu pendek'),
        long: pickLanguage(locale, 'Too long', 'Terlalu panjang'),
    };

    return (
        <span
            className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${styles[assessment.status]}`}
        >
            {labels[assessment.status]}
        </span>
    );
}

function VariationCard({
    locale,
    variation,
    index,
    active,
    onClick,
    lengthControlType,
    lengthControlValue,
    isBest = false,
}) {
    const stats = getTextStats(variation.content);
    const assessment = assessLengthTarget(
        stats,
        lengthControlType,
        lengthControlValue,
    );

    return (
        <button
            type="button"
            onClick={onClick}
            className={`variation-card rounded-[1.5rem] border p-4 text-left transition ${
                active
                    ? 'border-teal-600 bg-teal-50/80'
                    : 'border-stone-200/80 bg-white/85 hover:border-stone-300'
            }`}
        >
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {pickLanguage(locale, `Variation ${index + 1}`, `Variasi ${index + 1}`)}
                </p>
                {isBest && (
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-800">
                        {pickLanguage(locale, 'Best', 'Terbaik')}
                    </span>
                )}
            </div>
            <h3 className="mt-2 text-base font-semibold text-slate-900">
                {variation.title}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
                <StatsBadge
                    label={pickLanguage(locale, 'Words', 'Kata')}
                    value={stats.words}
                />
                <StatsBadge
                    label={pickLanguage(locale, 'Characters', 'Karakter')}
                    value={stats.characters}
                />
                <TargetBadge locale={locale} assessment={assessment} />
            </div>
            <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">
                {variation.content}
            </p>
        </button>
    );
}

function MetaPill({ label, value }) {
    return (
        <div className="rounded-[1.15rem] border border-stone-200/80 bg-white/85 px-4 py-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
            <p className="mt-1.5 line-clamp-2 text-sm font-semibold leading-6 text-slate-900">{value}</p>
        </div>
    );
}

function ResultActionButton({ children, className = '', type = 'button', ...props }) {
    return (
        <button
            {...props}
            type={type}
            className={`inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-400 hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${className}`}
        >
            {children}
        </button>
    );
}
