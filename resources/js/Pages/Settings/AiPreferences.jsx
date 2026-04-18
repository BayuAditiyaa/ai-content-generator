import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { pickLanguage, useUiLanguage } from '@/lib/ui-language';
import { Head, useForm } from '@inertiajs/react';

export default function AiPreferences({ preferences, providers }) {
    const { locale } = useUiLanguage();
    const { data, setData, patch, processing, errors } = useForm({
        preferred_ai_provider: preferences.preferred_ai_provider ?? '',
        preferred_output_language: preferences.preferred_output_language ?? 'en',
    });

    const submit = (event) => {
        event.preventDefault();
        patch(route('settings.ai.update'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <span className="eyebrow">
                        {pickLanguage(locale, 'AI Preferences', 'Preferensi AI')}
                    </span>
                    <h1 className="display-title mt-3 text-4xl text-slate-900">
                        {pickLanguage(locale, 'Choose your default AI flow', 'Pilih alur AI default kamu')}
                    </h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                        {pickLanguage(
                            locale,
                            'Set the provider priority and output language you want to use by default when generating new content.',
                            'Atur prioritas provider dan bahasa output yang ingin dipakai secara default saat membuat konten baru.',
                        )}
                    </p>
                </div>
            }
        >
            <Head title={pickLanguage(locale, 'AI Settings', 'Pengaturan AI')} />

            <div className="pb-12">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <section className="glass-panel-strong rounded-[2rem] p-6 sm:p-8">
                        <form onSubmit={submit} className="space-y-6">
                            <label className="block">
                                <span className="text-sm font-semibold text-slate-800">
                                    {pickLanguage(locale, 'Preferred AI provider', 'Provider AI pilihan')}
                                </span>
                                <select
                                    value={data.preferred_ai_provider}
                                    onChange={(event) =>
                                        setData('preferred_ai_provider', event.target.value)
                                    }
                                    className="mt-2 w-full rounded-2xl border border-stone-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                                >
                                    <option value="">
                                        {pickLanguage(locale, 'Use system default order', 'Gunakan urutan default sistem')}
                                    </option>
                                    {providers.map((provider) => (
                                        <option key={provider} value={provider}>
                                            {String(provider).toUpperCase()}
                                        </option>
                                    ))}
                                </select>
                                {errors.preferred_ai_provider && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.preferred_ai_provider}
                                    </p>
                                )}
                            </label>

                            <label className="block">
                                <span className="text-sm font-semibold text-slate-800">
                                    {pickLanguage(locale, 'Preferred output language', 'Bahasa output pilihan')}
                                </span>
                                <select
                                    value={data.preferred_output_language}
                                    onChange={(event) =>
                                        setData('preferred_output_language', event.target.value)
                                    }
                                    className="mt-2 w-full rounded-2xl border border-stone-200/80 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                                >
                                    <option value="en">English</option>
                                    <option value="id">Bahasa Indonesia</option>
                                </select>
                                {errors.preferred_output_language && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.preferred_output_language}
                                    </p>
                                )}
                            </label>

                            <div className="rounded-[1.5rem] border border-teal-100 bg-teal-50/80 p-4 text-sm leading-6 text-teal-900">
                                {pickLanguage(
                                    locale,
                                    'Tip: your preferred provider is tried first for new generations. If it fails, the configured fallback provider can still be used automatically.',
                                    'Tip: provider pilihanmu akan dicoba lebih dulu untuk generasi baru. Jika gagal, provider fallback yang dikonfigurasi tetap bisa dipakai otomatis.',
                                )}
                            </div>

                            <div className="flex justify-end">
                                <PrimaryButton disabled={processing}>
                                    {pickLanguage(locale, 'Save preferences', 'Simpan preferensi')}
                                </PrimaryButton>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
