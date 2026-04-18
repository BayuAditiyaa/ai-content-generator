import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { pickLanguage } from '@/lib/ui-language';
import {
    limitCharacters,
    translateContentType,
    translateTone,
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
                                {pickLanguage(locale, 'Generating your content...', 'Sedang membuat kontenmu...')}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                {pickLanguage(
                                    locale,
                                    'Please wait while we prepare your variations and save them to history.',
                                    'Tunggu sebentar saat kami menyiapkan variasi dan menyimpannya ke riwayat.',
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-800/70">
                        {pickLanguage(locale, 'Prompt brief', 'Brief prompt')}
                    </p>
                    <h2 className="display-title mt-3 text-3xl text-slate-900">
                        {pickLanguage(locale, 'Create a fresh generation', 'Buat generasi baru')}
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
                                {pickLanguage(locale, 'Content template', 'Template konten')}
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
                        label={pickLanguage(locale, 'Content type', 'Jenis konten')}
                        value={data.content_type}
                        onChange={(event) => setData('content_type', event.target.value)}
                        options={formOptions.contentTypes}
                        locale={locale}
                        type="contentType"
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
                        label={pickLanguage(locale, 'Content goal', 'Tujuan konten')}
                        value={data.content_goal}
                        onChange={(event) => setData('content_goal', event.target.value)}
                        options={formOptions.contentGoals}
                        locale={locale}
                    />
                    <SelectField
                        label={pickLanguage(locale, 'Output format', 'Format output')}
                        value={data.output_format}
                        onChange={(event) => setData('output_format', event.target.value)}
                        options={formOptions.outputFormats}
                        locale={locale}
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
                            'Add a richer brief here. Maximum 200 characters.',
                            'Tambahkan brief yang lebih lengkap di sini. Maksimal 200 karakter.',
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
                                'e.g. Create a launch email for a productivity app aimed at busy professionals, highlighting time-saving features and a clear CTA.',
                                'contoh: Buat email peluncuran untuk aplikasi produktivitas yang ditujukan kepada profesional sibuk, menonjolkan fitur penghemat waktu dan CTA yang jelas.',
                            )}
                        />
                        <div className="mt-2 flex justify-end">
                            <span className={`text-xs font-medium ${topicCharacterCount >= 180 ? 'text-amber-700' : 'text-slate-500'}`}>
                                {topicCharacterCount}/200 {pickLanguage(locale, 'characters', 'karakter')}
                            </span>
                        </div>
                    </FormField>

                    <SelectField
                        label={pickLanguage(locale, 'Variations', 'Variasi')}
                        value={data.variation_count}
                        onChange={(event) => setData('variation_count', Number(event.target.value))}
                        options={formOptions.variationCounts}
                        locale={locale}
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                        label={pickLanguage(locale, 'Output length', 'Panjang output')}
                        hint={pickLanguage(
                            locale,
                            'Control the approximate response size for each variation.',
                            'Atur perkiraan panjang respons untuk setiap variasi.',
                        )}
                        error={errors.length_control_type ?? errors.length_control_value}
                    >
                        <div className="grid gap-3 sm:grid-cols-[0.85fr_1.15fr]">
                            <select
                                value={data.length_control_type}
                                onChange={(event) => setData('length_control_type', event.target.value)}
                                className="w-full rounded-2xl border border-stone-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                            >
                                {formOptions.lengthControlTypes.map((option) => (
                                    <option key={option} value={option}>
                                        {pickLanguage(
                                            locale,
                                            option === 'words' ? 'Words' : 'Characters',
                                            option === 'words' ? 'Kata' : 'Karakter',
                                        )}
                                    </option>
                                ))}
                            </select>

                            <TextInput
                                type="number"
                                min="50"
                                max="3000"
                                value={data.length_control_value}
                                onChange={(event) =>
                                    setData('length_control_value', Number(event.target.value) || '')
                                }
                                placeholder="250"
                            />
                        </div>
                    </FormField>

                    <div className="rounded-[1.5rem] border border-teal-100 bg-teal-50/80 p-4">
                        <p className="text-sm font-semibold text-teal-900">
                            {pickLanguage(locale, 'Length presets', 'Preset panjang')}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {formOptions.lengthControlPresets.map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setData('length_control_value', preset)}
                                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                                        Number(data.length_control_value) === preset
                                            ? 'bg-teal-700 text-white'
                                            : 'bg-white text-teal-800 hover:bg-teal-100'
                                    }`}
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

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

                <FormField
                    label={pickLanguage(locale, 'Custom instruction', 'Instruksi tambahan')}
                    hint={pickLanguage(locale, 'Optional: add special direction for the AI.', 'Opsional: tambahkan arahan khusus untuk AI.')}
                    error={errors.custom_instruction}
                >
                    <textarea
                        value={data.custom_instruction}
                        onChange={(event) => setData('custom_instruction', event.target.value)}
                        rows={4}
                        className="w-full rounded-2xl border border-stone-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                        placeholder={pickLanguage(
                            locale,
                            'Example: Keep the copy concise, premium, and suitable for B2B readers.',
                            'Contoh: Buat copy tetap ringkas, premium, dan cocok untuk pembaca B2B.',
                        )}
                    />
                </FormField>

                <div className="rounded-[1.5rem] border border-teal-100 bg-teal-50/80 p-4">
                    <p className="text-sm font-semibold text-teal-900">
                        {pickLanguage(locale, 'Smart generation controls', 'Kontrol generasi pintar')}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-teal-800/80">
                        {pickLanguage(
                            locale,
                            'Templates pre-fill common use cases, while word and character targets help keep the output on brief.',
                            'Template mengisi otomatis use case umum, sementara target kata dan karakter membantu menjaga hasil tetap sesuai brief.',
                        )}
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-md text-sm leading-6 text-slate-500">
                        {pickLanguage(
                            locale,
                            'Every successful generation is saved to history together with the selected template and length controls.',
                            'Setiap generasi yang berhasil akan disimpan ke riwayat bersama template terpilih dan kontrol panjang output.',
                        )}
                    </p>

                    <PrimaryButton type="submit" disabled={processing || !ai.configured} className="sm:min-w-44">
                        {processing
                            ? pickLanguage(locale, 'Generating...', 'Sedang membuat...')
                            : pickLanguage(locale, 'Generate', 'Generate')}
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
                        {type === 'contentType'
                            ? translateContentType(locale, option)
                            : type === 'tone'
                              ? translateTone(locale, option)
                              : option}
                    </option>
                ))}
            </select>
        </label>
    );
}
