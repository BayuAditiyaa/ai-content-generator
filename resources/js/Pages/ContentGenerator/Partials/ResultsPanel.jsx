import { pickLanguage } from '@/lib/ui-language';
import { useEffect, useState } from 'react';
import {
    formatDurationSeconds,
    formatGenerationDuration,
    formatProvider,
    formatTemplateKey,
    getSceneCount,
    translateVideoFormat,
    translateVideoType,
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
                            {pickLanguage(locale, 'Selected video plan', 'Video plan terpilih')}
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
                                download
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
                            'Create your first video brief on the left to see the generated output here.',
                            'Buat brief video pertamamu di sisi kiri untuk melihat hasil generate di sini.',
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
    const [isContentExpanded, setIsContentExpanded] = useState(false);
    const selectedScript = selectedVariation?.script ?? selectedVariation?.content ?? '';
    const shouldShowContentToggle = String(selectedScript).length > 420;
    const sceneCount = getSceneCount(selectedVariation);
    const estimatedDuration = selectedVariation?.estimated_duration_seconds || selectedGeneration.duration_seconds;

    useEffect(() => {
        setIsContentExpanded(false);
    }, [selectedGeneration.id, selectedVariationIndex]);

    return (
        <div className="mt-8 space-y-6">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetaPill label={pickLanguage(locale, 'Video type', 'Jenis video')} value={translateVideoType(locale, selectedGeneration.video_type)} />
                <MetaPill label={pickLanguage(locale, 'Tone', 'Gaya')} value={translateTone(locale, selectedGeneration.tone)} />
                <MetaPill label={pickLanguage(locale, 'Audience', 'Audiens')} value={selectedGeneration.target_audience} />
                <MetaPill label={pickLanguage(locale, 'Variations', 'Variasi')} value={String(selectedGeneration.variation_count ?? selectedGeneration.variations.length)} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetaPill label={pickLanguage(locale, 'Template', 'Template')} value={formatTemplateKey(selectedGeneration.template_key)} />
                <MetaPill
                    label={pickLanguage(locale, 'Duration', 'Durasi')}
                    value={formatDurationSeconds(selectedGeneration.duration_seconds, locale)}
                />
                <MetaPill label={pickLanguage(locale, 'Video format', 'Format video')} value={translateVideoFormat(locale, selectedGeneration.video_format)} />
                <MetaPill
                    label={pickLanguage(locale, 'Provider', 'Provider')}
                    value={`${formatProvider(selectedGeneration.provider)} / ${selectedGeneration.model}`}
                />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetaPill
                    label={pickLanguage(locale, 'Video goal', 'Tujuan video')}
                    value={selectedGeneration.video_goal}
                />
                <MetaPill
                    label={pickLanguage(locale, 'Estimated duration', 'Estimasi durasi')}
                    value={formatDurationSeconds(estimatedDuration, locale)}
                />
                <MetaPill
                    label={pickLanguage(locale, 'Scene count', 'Jumlah adegan')}
                    value={String(sceneCount)}
                />
                <MetaPill
                    label={pickLanguage(locale, 'Generation time', 'Waktu generasi')}
                    value={formatGenerationDuration(selectedGeneration.generation_duration_ms, locale)}
                />
            </div>

            <div className="result-topic-card rounded-[1.5rem] border border-stone-200/80 bg-white/85 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {pickLanguage(locale, 'Video idea', 'Ide video')}
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
                        {selectedVariation?.summary && (
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                                {selectedVariation.summary}
                            </p>
                        )}
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
                    {selectedScript}
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
                        {pickLanguage(locale, 'Storyboard stats', 'Statistik storyboard')}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                        <StatsBadge
                            label={pickLanguage(locale, 'Scenes', 'Adegan')}
                            value={sceneCount}
                        />
                        <StatsBadge
                            label={pickLanguage(locale, 'Duration', 'Durasi')}
                            value={formatDurationSeconds(estimatedDuration, locale)}
                        />
                        {selectedVariation?.hook && (
                            <StatsBadge
                                label={pickLanguage(locale, 'Hook', 'Hook')}
                                value={pickLanguage(locale, 'Ready', 'Siap')}
                            />
                        )}
                    </div>
                </div>

                {(selectedVariation?.hook || selectedVariation?.cta) && (
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                        <StoryCard
                            title={pickLanguage(locale, 'Hook', 'Hook')}
                            value={selectedVariation?.hook || pickLanguage(locale, 'No hook provided', 'Belum ada hook')}
                        />
                        <StoryCard
                            title={pickLanguage(locale, 'Call to action', 'Call to action')}
                            value={selectedVariation?.cta || pickLanguage(locale, 'No CTA provided', 'Belum ada CTA')}
                        />
                    </div>
                )}

                <div className="mt-5 border-t border-stone-200 pt-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {pickLanguage(locale, 'Scene-by-scene storyboard', 'Storyboard per adegan')}
                    </p>
                    <div className="mt-4 grid gap-3">
                        {sceneCount ? (
                            selectedVariation.scenes.map((scene) => (
                                <SceneCard key={`${selectedVariation.title}-${scene.scene_number}`} locale={locale} scene={scene} />
                            ))
                        ) : (
                            <EmptyState
                                title={pickLanguage(locale, 'No scene breakdown yet', 'Belum ada breakdown adegan')}
                                description={pickLanguage(
                                    locale,
                                    'This variation only returned a script. Try regenerating or another provider for richer storyboard output.',
                                    'Variasi ini hanya mengembalikan skrip. Coba generate ulang atau provider lain untuk storyboard yang lebih kaya.',
                                )}
                            />
                        )}
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

function VariationCard({
    locale,
    variation,
    index,
    active,
    onClick,
    isBest = false,
}) {
    const sceneCount = getSceneCount(variation);
    const estimatedDuration = variation.estimated_duration_seconds;

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
                    label={pickLanguage(locale, 'Scenes', 'Adegan')}
                    value={sceneCount}
                />
                <StatsBadge
                    label={pickLanguage(locale, 'Duration', 'Durasi')}
                    value={formatDurationSeconds(estimatedDuration, locale)}
                />
            </div>
            <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-600">
                {variation.summary || variation.script || variation.content}
            </p>
        </button>
    );
}

function StoryCard({ title, value }) {
    return (
        <div className="rounded-[1.25rem] border border-stone-200/80 bg-stone-50/80 px-4 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{title}</p>
            <p className="mt-2 text-sm leading-7 text-slate-700">{value}</p>
        </div>
    );
}

function SceneCard({ locale, scene }) {
    return (
        <div className="rounded-[1.35rem] border border-stone-200/80 bg-white/85 p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">
                    {pickLanguage(locale, `Scene ${scene.scene_number}`, `Adegan ${scene.scene_number}`)}
                </p>
                <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                    {formatDurationSeconds(scene.duration_seconds, locale)}
                </span>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
                <SceneMeta label={pickLanguage(locale, 'Visual', 'Visual')} value={scene.visual} />
                <SceneMeta label={pickLanguage(locale, 'Voiceover', 'Voiceover')} value={scene.voiceover} />
                <SceneMeta label={pickLanguage(locale, 'On-screen text', 'Teks layar')} value={scene.onscreen_text} />
                <SceneMeta label={pickLanguage(locale, 'Transition', 'Transisi')} value={scene.transition} />
            </div>
        </div>
    );
}

function SceneMeta({ label, value }) {
    return (
        <div className="rounded-2xl border border-stone-200/80 bg-stone-50/70 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-700">{value || '-'}</p>
        </div>
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
