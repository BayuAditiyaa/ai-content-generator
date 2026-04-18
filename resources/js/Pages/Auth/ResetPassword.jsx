import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { pickLanguage, useUiLanguage } from '@/lib/ui-language';
import { Head, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { locale } = useUiLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={pickLanguage(locale, 'Reset Password', 'Reset Kata Sandi')} />

            <div className="mb-8 space-y-3">
                <span className="eyebrow">{pickLanguage(locale, 'New password', 'Kata sandi baru')}</span>
                <div>
                    <h1 className="display-title text-4xl text-slate-900">
                        {pickLanguage(locale, 'Create a fresh password.', 'Buat kata sandi baru.')}
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        {pickLanguage(
                            locale,
                            'Set a secure password for your account, then continue back into the app.',
                            'Atur kata sandi yang aman untuk akunmu, lalu lanjutkan kembali ke aplikasi.',
                        )}
                    </p>
                </div>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value={pickLanguage(locale, 'Email', 'Email')} />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value={pickLanguage(locale, 'Password', 'Kata sandi')} />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value={pickLanguage(locale, 'Confirm Password', 'Konfirmasi kata sandi')}
                    />

                    <TextInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        {pickLanguage(locale, 'Reset Password', 'Reset Kata Sandi')}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
