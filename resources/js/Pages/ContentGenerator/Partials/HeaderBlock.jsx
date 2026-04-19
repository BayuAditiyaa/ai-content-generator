import { pickLanguage } from '@/lib/ui-language';

export default function HeaderBlock({ locale, ai }) {
    return (
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div className="space-y-4">
                <span className="eyebrow">AI Video Planner</span>
                <div>
                    <h1 className="display-title text-balance text-4xl text-slate-900 sm:text-5xl">
                        {pickLanguage(
                            locale,
                            'Generate scripts, storyboard scenes, and multiple video angles in one place.',
                            'Buat skrip, adegan storyboard, dan beberapa sudut video dalam satu tempat.',
                        )}
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                        {pickLanguage(
                            locale,
                            'Use ready-made templates, set duration and format, then save, copy, and export the best video plan.',
                            'Gunakan template siap pakai, atur durasi dan format, lalu simpan, salin, dan ekspor video plan terbaik.',
                        )}
                    </p>
                </div>
            </div>

            <div className="glass-panel rounded-[1.75rem] p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-800/70">
                    {pickLanguage(locale, 'AI configuration', 'Konfigurasi AI')}
                </p>
                <p className="mt-3 text-lg font-semibold text-slate-900">
                    {ai.configured
                        ? `${ai.provider} / ${ai.model}`
                        : pickLanguage(locale, 'API key not configured yet', 'API key belum dikonfigurasi')}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    {!ai.configured
                        ? pickLanguage(
                              locale,
                              'Add AI_CONTENT_API_KEY in .env before generating video plans.',
                              'Tambahkan AI_CONTENT_API_KEY di .env sebelum membuat video plan.',
                          )
                        : pickLanguage(
                              locale,
                              'The generator is ready for storyboard requests, video scripts, and fallback providers.',
                              'Generator siap untuk request storyboard, skrip video, dan provider fallback.',
                          )}
                </p>
                {ai.fallback_enabled && (
                    <p className="mt-2 text-xs font-medium text-slate-500">
                        {pickLanguage(
                            locale,
                            `Fallback ready: ${ai.fallback_provider} / ${ai.fallback_model}`,
                            `Fallback siap: ${ai.fallback_provider} / ${ai.fallback_model}`,
                        )}
                    </p>
                )}
            </div>
        </div>
    );
}
