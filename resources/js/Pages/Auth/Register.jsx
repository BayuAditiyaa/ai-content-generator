import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { pickLanguage, useUiLanguage } from '@/lib/ui-language';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { locale } = useUiLanguage();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={pickLanguage(locale, 'Register', 'Daftar')} />

            <div className="mb-8 space-y-3">
                <span className="eyebrow">{pickLanguage(locale, 'Create account', 'Buat akun')}</span>
                <div>
                    <h1 className="display-title text-4xl text-slate-900">
                        {pickLanguage(locale, 'Start with a polished foundation.', 'Mulai dengan fondasi yang rapi.')}
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        {pickLanguage(
                            locale,
                            'Create your workspace and move straight into building the AI content generator.',
                            'Buat workspace-mu lalu langsung lanjut membangun AI content generator.',
                        )}
                    </p>
                </div>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value={pickLanguage(locale, 'Name', 'Nama')} />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-2 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        placeholder={pickLanguage(
                            locale,
                            'Your full name',
                            'Nama lengkap Anda',
                        )}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value={pickLanguage(locale, 'Email', 'Email')} />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-2 block w-full"
                        autoComplete="username"
                        placeholder={pickLanguage(
                            locale,
                            'name@example.com',
                            'nama@contoh.com',
                        )}
                        onChange={(e) => setData('email', e.target.value)}
                        required
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
                        autoComplete="new-password"
                        placeholder={pickLanguage(
                            locale,
                            'Create a password',
                            'Buat kata sandi',
                        )}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value={pickLanguage(locale, 'Confirm Password', 'Konfirmasi kata sandi')}
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-2 block w-full"
                        autoComplete="new-password"
                        placeholder={pickLanguage(
                            locale,
                            'Repeat your password',
                            'Ulangi kata sandi Anda',
                        )}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-slate-600 underline underline-offset-4 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                    >
                        {pickLanguage(locale, 'Already registered?', 'Sudah punya akun?')}
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        {pickLanguage(locale, 'Register', 'Daftar')}
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
