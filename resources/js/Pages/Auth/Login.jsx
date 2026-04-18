import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { pickLanguage, useUiLanguage } from '@/lib/ui-language';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { locale } = useUiLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title={pickLanguage(locale, 'Log in', 'Masuk')} />

            {status && (
                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {status}
                </div>
            )}

            <div className="mb-8 space-y-3">
                <span className="eyebrow">{pickLanguage(locale, 'Welcome back', 'Selamat datang kembali')}</span>
                <div>
                    <h1 className="display-title text-4xl text-slate-900">
                        {pickLanguage(locale, 'Log in to keep building.', 'Masuk untuk melanjutkan pekerjaanmu.')}
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        {pickLanguage(
                            locale,
                            'Continue shaping your AI content workflow with a focused, responsive dashboard.',
                            'Lanjutkan membangun alur kerja konten AI kamu dengan dasbor yang fokus dan responsif.',
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
                        className="mt-2 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        placeholder={pickLanguage(
                            locale,
                            'name@example.com',
                            'nama@contoh.com',
                        )}
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
                        className="mt-2 block w-full"
                        autoComplete="current-password"
                        placeholder={pickLanguage(
                            locale,
                            'Enter your password',
                            'Masukkan kata sandi Anda',
                        )}
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-slate-600">
                            {pickLanguage(locale, 'Remember me', 'Ingat saya')}
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <Link
                        href={route('register')}
                        className="rounded-md text-sm text-slate-600 underline underline-offset-4 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                        {pickLanguage(locale, "Don't have an account yet?", 'Belum punya akun?')}
                    </Link>

                    <div className="flex items-center gap-4">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-slate-600 underline underline-offset-4 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                        >
                            {pickLanguage(locale, 'Forgot your password?', 'Lupa kata sandi?')}
                        </Link>
                    )}

                        <PrimaryButton disabled={processing}>
                            {pickLanguage(locale, 'Log in', 'Masuk')}
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
