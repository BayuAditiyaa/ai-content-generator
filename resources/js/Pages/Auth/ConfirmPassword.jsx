import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { pickLanguage, useUiLanguage } from '@/lib/ui-language';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { locale } = useUiLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title={pickLanguage(locale, 'Confirm Password', 'Konfirmasi Kata Sandi')} />

            <div className="mb-6 space-y-3">
                <span className="eyebrow">{pickLanguage(locale, 'Security check', 'Pemeriksaan keamanan')}</span>
                <div>
                    <h1 className="display-title text-4xl text-slate-900">
                        {pickLanguage(locale, 'Confirm your password.', 'Konfirmasi kata sandimu.')}
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        {pickLanguage(
                            locale,
                            'This is a secure area of the application. Please confirm your password before continuing.',
                            'Ini adalah area aplikasi yang aman. Silakan konfirmasi kata sandimu sebelum melanjutkan.',
                        )}
                    </p>
                </div>
            </div>

            <form onSubmit={submit}>
                <div className="mt-4">
                    <InputLabel htmlFor="password" value={pickLanguage(locale, 'Password', 'Kata sandi')} />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {pickLanguage(locale, 'Confirm', 'Konfirmasi')}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
