import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import HeaderBlock from '@/Pages/ContentGenerator/Partials/HeaderBlock';
import PromptPanel from '@/Pages/ContentGenerator/Partials/PromptPanel';
import ResultsPanel from '@/Pages/ContentGenerator/Partials/ResultsPanel';
import StatCard from '@/Pages/ContentGenerator/Partials/StatCard';
import Toast from '@/Pages/ContentGenerator/Partials/Toast';
import { limitCharacters } from '@/Pages/ContentGenerator/Partials/helpers';
import { pickLanguage, useUiLanguage } from '@/lib/ui-language';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

const emptyToast = { type: '', text: '' };

export default function Index({
    formOptions,
    generations,
    latestStats,
    selectedGenerationId = null,
    selectedGeneration: selectedGenerationProp = null,
    prefillGeneration = null,
}) {
    const { locale } = useUiLanguage();
    const { flash, ai, errors, preferences } = usePage().props;
    const seoDescription = pickLanguage(
        locale,
        'Generate articles, ad copy, and emails faster with ProseAI. AI Content Generator and Marketing Copywriter for modern teams.',
        'Buat artikel, konten iklan, dan email lebih cepat dengan ProseAI. AI Content Generator dan Marketing Copywriter untuk tim modern.',
    );
    const seoKeywords = pickLanguage(
        locale,
        'ProseAI, AI Content Generator, Marketing Copywriter, How to create ad copywriting automatically, Fast blog article generator tool built with Laravel, Best AI recommendation for writing office emails',
        'ProseAI, AI Content Generator, Marketing Copywriter, Cara membuat copywriting iklan otomatis, Alat pembuat artikel blog cepat dengan Laravel, Rekomendasi AI untuk menulis email kantor',
    );
    const generationList = generations.data ?? [];
    const templates = formOptions.templates ?? [];

    const [selectedId, setSelectedId] = useState(selectedGenerationId ?? generationList[0]?.id ?? null);
    const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);
    const [toast, setToast] = useState(emptyToast);

    const { data, setData, post, processing, reset } = useForm({
        template_key: templates[0]?.key ?? 'blank',
        ui_language: preferences.preferred_output_language ?? locale,
        content_type: formOptions.contentTypes[0] ?? 'Blog Post',
        topic: '',
        keywords: '',
        target_audience: '',
        tone: formOptions.tones[0] ?? 'Professional',
        content_goal: formOptions.contentGoals?.[0] ?? 'Awareness',
        output_format: formOptions.outputFormats?.[0] ?? 'Paragraph',
        cta_style: formOptions.ctaStyles?.[0] ?? 'Soft',
        custom_instruction: '',
        variation_count: formOptions.variationCounts?.[1] ?? 2,
        length_control_type: formOptions.lengthControlTypes?.[0] ?? 'words',
        length_control_value: formOptions.lengthControlPresets?.[2] ?? 250,
    });
    const topicCharacterCount = String(data.topic ?? '').length;

    const selectedTemplate = useMemo(
        () => templates.find((template) => template.key === data.template_key) ?? templates[0] ?? null,
        [data.template_key, templates],
    );

    const selectedGeneration = useMemo(() => {
        if (selectedId === null) {
            return generationList[0] ?? null;
        }

        return (
            generationList.find((generation) => generation.id === selectedId) ??
            (selectedGenerationProp?.id === selectedId ? selectedGenerationProp : null) ??
            generationList[0] ??
            null
        );
    }, [generationList, selectedGenerationProp, selectedId]);

    const selectedVariation =
        selectedGeneration?.variations?.[selectedVariationIndex] ??
        selectedGeneration?.variations?.[0] ??
        null;

    useEffect(() => {
        if (!generationList.length) {
            setSelectedId(null);
            return;
        }

        if (
            selectedGenerationId &&
            (generationList.some((generation) => generation.id === selectedGenerationId) ||
                selectedGenerationProp?.id === selectedGenerationId)
        ) {
            setSelectedId(selectedGenerationId);
            return;
        }

        if (!generationList.some((generation) => generation.id === selectedId)) {
            setSelectedId(generationList[0].id);
        }
    }, [generationList, selectedGenerationId, selectedGenerationProp, selectedId]);

    useEffect(() => {
        setSelectedVariationIndex(0);
    }, [selectedId]);

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
        const closeToast = () => setToast(emptyToast);
        window.addEventListener('proseai:close-toast', closeToast);

        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('proseai:close-toast', closeToast);
        };
    }, [toast]);

    useEffect(() => {
        setData('ui_language', locale);
    }, [locale, setData]);

    useEffect(() => {
        if (!selectedTemplate) {
            return;
        }

        const localizedTopic =
            locale === 'id'
                ? selectedTemplate.topic_id ?? selectedTemplate.topic ?? ''
                : selectedTemplate.topic ?? '';
        const localizedKeywords =
            locale === 'id'
                ? selectedTemplate.keywords_id ?? selectedTemplate.keywords ?? ''
                : selectedTemplate.keywords ?? '';
        const localizedAudience =
            locale === 'id'
                ? selectedTemplate.target_audience_id ?? selectedTemplate.target_audience ?? ''
                : selectedTemplate.target_audience ?? '';

        setData((current) => ({
            ...current,
            content_type: selectedTemplate.content_type ?? current.content_type,
            topic: limitCharacters(localizedTopic, 200),
            keywords: localizedKeywords,
            target_audience: localizedAudience,
            tone: selectedTemplate.tone ?? current.tone,
        }));
    }, [locale, selectedTemplate, setData]);

    useEffect(() => {
        if (!prefillGeneration) {
            return;
        }

        setData((current) => ({
            ...current,
            template_key: prefillGeneration.template_key ?? templates[0]?.key ?? 'blank',
            ui_language: prefillGeneration.ui_language ?? locale,
            content_type: prefillGeneration.content_type,
            topic: limitCharacters(prefillGeneration.topic, 200),
            keywords: (prefillGeneration.keywords ?? []).join(', '),
            target_audience: prefillGeneration.target_audience,
            tone: prefillGeneration.tone,
            content_goal: prefillGeneration.content_goal ?? formOptions.contentGoals?.[0] ?? 'Awareness',
            output_format: prefillGeneration.output_format ?? formOptions.outputFormats?.[0] ?? 'Paragraph',
            cta_style: prefillGeneration.cta_style ?? formOptions.ctaStyles?.[0] ?? 'Soft',
            custom_instruction: prefillGeneration.custom_instruction ?? '',
            variation_count: prefillGeneration.variation_count ?? formOptions.variationCounts?.[1] ?? 2,
            length_control_type: prefillGeneration.length_control_type ?? 'words',
            length_control_value: prefillGeneration.length_control_value ?? 250,
        }));

        if (prefillGeneration.id) {
            setSelectedId(prefillGeneration.id);
        }
    }, [formOptions, locale, prefillGeneration, setData, templates]);

    const submit = (event) => {
        event.preventDefault();
        setToast(emptyToast);

        post(route('generations.store'), {
            preserveScroll: true,
            onError: () => {
                setToast({
                    type: 'error',
                    text: pickLanguage(
                        locale,
                        'Generation failed. Review the highlighted fields or try another provider.',
                        'Generate gagal. Periksa field yang ditandai atau coba provider lain.',
                    ),
                });
            },
            onSuccess: () => {
                reset(
                    'topic',
                    'keywords',
                    'target_audience',
                    'custom_instruction',
                    'variation_count',
                    'length_control_type',
                    'length_control_value',
                );

                setData((current) => ({
                    ...current,
                    template_key: templates[0]?.key ?? 'blank',
                    ui_language: locale,
                    content_type: formOptions.contentTypes[0] ?? 'Blog Post',
                    tone: formOptions.tones[0] ?? 'Professional',
                    content_goal: formOptions.contentGoals?.[0] ?? 'Awareness',
                    output_format: formOptions.outputFormats?.[0] ?? 'Paragraph',
                    cta_style: formOptions.ctaStyles?.[0] ?? 'Soft',
                    custom_instruction: '',
                    variation_count: formOptions.variationCounts?.[1] ?? 2,
                    length_control_type: formOptions.lengthControlTypes?.[0] ?? 'words',
                    length_control_value: formOptions.lengthControlPresets?.[2] ?? 250,
                }));
            },
        });
    };

    const copyContent = async () => {
        if (!selectedVariation?.content) return;

        await navigator.clipboard.writeText(selectedVariation.content);
        setToast({
            type: 'success',
            text: pickLanguage(
                locale,
                `${selectedVariation.title} copied to clipboard.`,
                `${selectedVariation.title} disalin ke clipboard.`,
            ),
        });
    };

    const copyAllVariations = async () => {
        if (!selectedGeneration?.variations?.length) return;

        const combined = selectedGeneration.variations
            .map(
                (variation, index) =>
                    `${pickLanguage(locale, `Variation ${index + 1}`, `Variasi ${index + 1}`)}: ${variation.title}\n\n${variation.content}`,
            )
            .join('\n\n--------------------\n\n');

        await navigator.clipboard.writeText(combined);
        setToast({
            type: 'success',
            text: pickLanguage(locale, 'All variations copied.', 'Semua variasi disalin.'),
        });
    };

    const exportHref = selectedGeneration
        ? route('generations.export', {
              contentGeneration: selectedGeneration.id,
              variation: selectedVariationIndex,
          })
        : '#';

    const loadGenerationIntoForm = (generation) => {
        setData((current) => ({
            ...current,
            template_key: generation.template_key ?? templates[0]?.key ?? 'blank',
            ui_language: generation.ui_language ?? locale,
            content_type: generation.content_type,
            topic: limitCharacters(generation.topic, 200),
            keywords: (generation.keywords ?? []).join(', '),
            target_audience: generation.target_audience,
            tone: generation.tone,
            content_goal: generation.content_goal ?? formOptions.contentGoals?.[0] ?? 'Awareness',
            output_format: generation.output_format ?? formOptions.outputFormats?.[0] ?? 'Paragraph',
            cta_style: generation.cta_style ?? formOptions.ctaStyles?.[0] ?? 'Soft',
            custom_instruction: generation.custom_instruction ?? '',
            variation_count: generation.variation_count ?? formOptions.variationCounts?.[1] ?? 2,
            length_control_type: generation.length_control_type ?? 'words',
            length_control_value: generation.length_control_value ?? 250,
        }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setToast({
            type: 'success',
            text: pickLanguage(locale, 'Brief loaded into the form.', 'Brief dimuat ke form.'),
        });
    };

    const favoriteVariation = (generationId, variationIndex) => {
        router.post(
            route('generations.favorite', generationId),
            { variation_index: variationIndex },
            { preserveScroll: true },
        );
    };

    const regenerateGeneration = (generationId) => {
        router.post(
            route('generations.regenerate', generationId),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <AuthenticatedLayout
            header={<HeaderBlock locale={locale} ai={ai} />}
        >
            <Head title={pickLanguage(locale, 'Content Generator', 'Generator Konten')}>
                <meta name="description" content={seoDescription} />
                <meta name="keywords" content={seoKeywords} />
                <meta property="og:description" content={seoDescription} />
                <meta property="og:locale" content={locale === 'id' ? 'id_ID' : 'en_US'} />
            </Head>

            <div className="dashboard-page pb-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {toast.text && <Toast toast={toast} />}

                    <div className="grid gap-4 md:grid-cols-3">
                        <StatCard
                            label={pickLanguage(locale, 'Total generations', 'Total generasi')}
                            value={String(latestStats.total_generations ?? 0)}
                            detail={pickLanguage(locale, 'Saved in the database for this user', 'Disimpan di database untuk user ini')}
                        />
                        <StatCard
                            label={pickLanguage(locale, 'Latest topic', 'Topik terbaru')}
                            value={latestStats.latest_topic ?? pickLanguage(locale, 'No generations yet', 'Belum ada generasi')}
                            detail={pickLanguage(locale, 'Most recent content brief', 'Brief konten paling terbaru')}
                        />
                        <StatCard
                            label={pickLanguage(locale, 'Last activity', 'Aktivitas terakhir')}
                            value={latestStats.latest_created_at ?? pickLanguage(locale, 'Waiting for first result', 'Menunggu hasil pertama')}
                            detail={pickLanguage(locale, 'Updated automatically after each generation', 'Diperbarui otomatis setelah setiap generasi')}
                        />
                        <StatCard
                            label={pickLanguage(locale, 'Favorites', 'Favorit')}
                            value={String(latestStats.favorite_count ?? 0)}
                            detail={pickLanguage(locale, 'Marked as best variations', 'Ditandai sebagai variasi terbaik')}
                        />
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
                        <PromptPanel
                            locale={locale}
                            ai={ai}
                            errors={errors}
                            templates={templates}
                            formOptions={formOptions}
                            data={data}
                            setData={setData}
                            topicCharacterCount={topicCharacterCount}
                            submit={submit}
                            processing={processing}
                            selectedTemplate={selectedTemplate}
                        />

                        <ResultsPanel
                            locale={locale}
                            selectedGeneration={selectedGeneration}
                            selectedVariation={selectedVariation}
                            selectedVariationIndex={selectedVariationIndex}
                            setSelectedVariationIndex={setSelectedVariationIndex}
                            exportHref={exportHref}
                            copyContent={copyContent}
                            copyAllVariations={copyAllVariations}
                            loadGenerationIntoForm={loadGenerationIntoForm}
                            favoriteVariation={favoriteVariation}
                            regenerateGeneration={regenerateGeneration}
                        />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
