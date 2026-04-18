import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { pickLanguage, useUiLanguage } from '@/lib/ui-language';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { locale } = useUiLanguage();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title={pickLanguage(locale, 'Forgot Password', 'Lupa Kata Sandi')} />

            <div className="mb-8 space-y-3">
                <span className="eyebrow">{pickLanguage(locale, 'Account recovery', 'Pemulihan akun')}</span>
                <div>
                    <h1 className="display-title text-4xl text-slate-900">
                        {pickLanguage(locale, 'Reset your password.', 'Reset kata sandimu.')}
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        {pickLanguage(
                            locale,
                            'Forgot your password? No problem. Enter your email address and we will send you a reset link so you can choose a new one.',
                            'Lupa kata sandi? Tidak masalah. Masukkan alamat emailmu dan kami akan mengirimkan link reset agar kamu bisa membuat kata sandi baru.',
                        )}
                    </p>
                </div>
            </div>

            {status && (
                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {pickLanguage(locale, 'Email Password Reset Link', 'Kirim Link Reset Kata Sandi')}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
