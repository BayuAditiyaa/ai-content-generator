import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { pickLanguage } from '@/lib/ui-language';
import {
    limitCharacters,
    translateTone,
    translateVideoFormat,
    translateVideoType,
} from './helpers';

export default function PromptPanel({
    locale,
    ai,
    errors,
    templates,
    formOptions,
    data,
    setData,
    topicCharacterCount,
    submit,
    processing,
    selectedTemplate,
}) {
    return (
        <section className="prompt-surface glass-panel-strong relative rounded-[2rem] p-6 sm:p-8">
            {processing && (
                <div className="absolute inset-0 z-10 rounded-[2rem] bg-white/75 backdrop-blur-sm">
                    <div className="flex h-full items-center justify-center px-6 text-center">
                            <div className="max-w-sm rounded-[1.5rem] border border-teal-100 bg-white/90 p-6 shadow-lg">
                            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />
                            <p className="mt-4 text-base font-semibold text-slate-900">
                                {pickLanguage(locale, 'Generating your video plan...', 'Sedang membuat video plan...')}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                {pickLanguage(
                                    locale,
                                    'Please wait while we prepare your script, scenes, and save them to history.',
                                    'Tunggu sebentar saat kami menyiapkan skrip, adegan, dan menyimpannya ke riwayat.',
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-800/70">
                        {pickLanguage(locale, 'Video brief', 'Brief video')}
                    </p>
                    <h2 className="display-title mt-3 text-3xl text-slate-900">
                        {pickLanguage(locale, 'Create a fresh video generation', 'Buat generasi video baru')}
                    </h2>
                </div>
                <div className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">
                    {pickLanguage(locale, 'Template ready', 'Template siap')}
                </div>
            </div>

            <form onSubmit={submit} className="mt-8 space-y-5">
                <div className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                {pickLanguage(locale, 'Video template', 'Template video')}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                {selectedTemplate
                                    ? pickLanguage(
                                          locale,
                                          selectedTemplate.description,
                                          selectedTemplate.description_id,
                                      )
                                    : ''}
                            </p>
                        </div>
                        <div className="w-full lg:max-w-sm">
                            <select
                                value={data.template_key}
                                onChange={(event) => setData('template_key', event.target.value)}
                                className="w-full rounded-2xl border border-stone-200/80 bg-white/90 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            >
                                {templates.map((template) => (
                                    <option key={template.key} value={template.key}>
                                        {pickLanguage(locale, template.name, template.name_id)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <SelectField
                        label={pickLanguage(locale, 'Video type', 'Jenis video')}
                        value={data.video_type}
                        onChange={(event) => setData('video_type', event.target.value)}
                        options={formOptions.videoTypes}
                        locale={locale}
                        type="videoType"
                    />
                    <SelectField
                        label={pickLanguage(locale, 'Tone', 'Gaya')}
                        value={data.tone}
                        onChange={(event) => setData('tone', event.target.value)}
                        options={formOptions.tones}
                        locale={locale}
                        type="tone"
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                    <SelectField
                        label={pickLanguage(locale, 'Video goal', 'Tujuan video')}
                        value={data.video_goal}
                        onChange={(event) => setData('video_goal', event.target.value)}
                        options={formOptions.videoGoals}
                        locale={locale}
                        type="goal"
                    />
                    <SelectField
                        label={pickLanguage(locale, 'Video format', 'Format video')}
                        value={data.video_format}
                        onChange={(event) => setData('video_format', event.target.value)}
                        options={formOptions.videoFormats}
                        locale={locale}
                        type="videoFormat"
                    />
                    <SelectField
                        label={pickLanguage(locale, 'CTA style', 'Gaya CTA')}
                        value={data.cta_style}
                        onChange={(event) => setData('cta_style', event.target.value)}
                        options={formOptions.ctaStyles}
                        locale={locale}
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-[1.3fr_0.7fr]">
                    <FormField
                        label={pickLanguage(locale, 'Topic or subject', 'Topik atau subjek')}
                        hint={pickLanguage(
                            locale,
                            'Describe the video idea clearly. Maximum 200 characters.',
                            'Jelaskan ide videonya dengan jelas. Maksimal 200 karakter.',
                        )}
                        error={errors.topic}
                    >
                        <textarea
                            value={data.topic}
                            onChange={(event) => setData('topic', limitCharacters(event.target.value, 200))}
                            rows={5}
                            maxLength={200}
                            className="w-full rounded-2xl border border-stone-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            placeholder={pickLanguage(
                                locale,
                                'e.g. Create a 30-second launch video for a productivity app that highlights time-saving features and ends with a clear CTA.',
                                'contoh: Buat video peluncuran 30 detik untuk aplikasi produktivitas yang menonjolkan fitur penghemat waktu dan diakhiri CTA yang jelas.',
                            )}
                        />
                        <div className="mt-2 flex justify-end">
                            <span className={`text-xs font-medium ${topicCharacterCount >= 180 ? 'text-amber-700' : 'text-slate-500'}`}>
                                {topicCharacterCount}/200 {pickLanguage(locale, 'characters', 'karakter')}
                            </span>
                        </div>
                    </FormField>

                    <FormField
                        label={pickLanguage(locale, 'Duration', 'Durasi')}
                        hint={pickLanguage(
                            locale,
                            'Pick the approximate duration for each generated video variation.',
                            'Pilih perkiraan durasi untuk setiap variasi video yang dihasilkan.',
                        )}
                        error={errors.duration_seconds}
                    >
                        <TextInput
                            type="number"
                            min="15"
                            max="180"
                            value={data.duration_seconds}
                            onChange={(event) => setData('duration_seconds', Number(event.target.value) || '')}
                            placeholder="30"
                        />
                    </FormField>

                    <div className="rounded-[1.5rem] border border-teal-100 bg-teal-50/80 p-4">
                        <p className="text-sm font-semibold text-teal-900">
                            {pickLanguage(locale, 'Duration presets', 'Preset durasi')}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {formOptions.durationPresets.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setData('duration_seconds', preset)}
                                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                                        Number(data.duration_seconds) === preset
                                            ? 'bg-teal-700 text-white'
                                            : 'bg-white text-teal-800 hover:bg-teal-100'
                                    }`}
                                >
                                    {pickLanguage(locale, `${preset}s`, `${preset} dtk`)}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <SelectField
                        label={pickLanguage(locale, 'Variations', 'Variasi')}
                        value={data.variation_count}
                        onChange={(event) => setData('variation_count', Number(event.target.value))}
                        options={formOptions.variationCounts}
                        locale={locale}
                    />

                <FormField
                    label={pickLanguage(locale, 'Keywords', 'Kata kunci')}
                    hint={pickLanguage(locale, 'Separate keywords with commas.', 'Pisahkan kata kunci dengan koma.')}
                    error={errors.keywords}
                >
                    <TextInput
                        value={data.keywords}
                        onChange={(event) => setData('keywords', event.target.value)}
                        placeholder="productivity, focus, launch"
                    />
                </FormField>

                <FormField
                    label={pickLanguage(locale, 'Target audience', 'Target audiens')}
                    error={errors.target_audience}
                >
                    <TextInput
                        value={data.target_audience}
                        onChange={(event) => setData('target_audience', event.target.value)}
                        placeholder={pickLanguage(
                            locale,
                            'Startup founders, students, busy professionals',
                            'Pendiri startup, mahasiswa, profesional sibuk',
                        )}
                    />
                </FormField>
                </div>

                <FormField
                    label={pickLanguage(locale, 'Custom instruction', 'Instruksi tambahan')}
                    hint={pickLanguage(locale, 'Optional: add special direction for the script or scene style.', 'Opsional: tambahkan arahan khusus untuk skrip atau gaya adegan.')}
                    error={errors.custom_instruction}
                >
                    <textarea
                        value={data.custom_instruction}
                        onChange={(event) => setData('custom_instruction', event.target.value)}
                        rows={4}
                        className="w-full rounded-2xl border border-stone-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                        placeholder={pickLanguage(
                            locale,
                            'Example: Make the first scene visually bold and keep the voiceover concise.',
                            'Contoh: Buat adegan pertama terlihat kuat secara visual dan voiceover tetap ringkas.',
                        )}
                    />
                </FormField>

                <div className="rounded-[1.5rem] border border-teal-100 bg-teal-50/80 p-4">
                    <p className="text-sm font-semibold text-teal-900">
                        {pickLanguage(locale, 'Smart video controls', 'Kontrol video pintar')}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-teal-800/80">
                        {pickLanguage(
                            locale,
                            'Templates speed up common use cases, while duration and format controls help keep the storyboard focused.',
                            'Template mempercepat use case umum, sementara kontrol durasi dan format membantu menjaga storyboard tetap fokus.',
                        )}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-md text-sm leading-6 text-slate-500">
                        {pickLanguage(
                            locale,
                            'Every successful video plan is saved to history together with its template, duration, and storyboard.',
                            'Setiap video plan yang berhasil akan disimpan ke riwayat bersama template, durasi, dan storyboard-nya.',
                        )}
                    </p>

                    <PrimaryButton type="submit" disabled={processing || !ai.configured} className="sm:min-w-44">
                        {processing
                            ? pickLanguage(locale, 'Generating...', 'Sedang membuat...')
                            : pickLanguage(locale, 'Generate video', 'Generate video')}
                    </PrimaryButton>
                </div>

                {errors.generation && (
                    <div className="rounded-[1.25rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {errors.generation}
                    </div>
                )}
            </form>
        </section>
    );
}

function FormField({ label, hint, error, children }) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-slate-800">{label}</span>
            {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
            <div className="mt-2">{children}</div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </label>
    );
}

function SelectField({ label, value, onChange, options, locale, type }) {
    return (
        <label className="block">
            <span className="text-sm font-semibold text-slate-800">{label}</span>
            <select
                value={value}
                onChange={onChange}
                className="mt-2 w-full rounded-2xl border border-stone-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {type === 'videoType'
                            ? translateVideoType(locale, option)
                            : type === 'tone'
                              ? translateTone(locale, option)
                              : type === 'videoFormat'
                                ? translateVideoFormat(locale, option)
                                : option}
                    </option>
                ))}
            </select>
        </label>
    );
}
