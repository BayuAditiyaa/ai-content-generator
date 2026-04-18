import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { pickLanguage, useUiLanguage } from '@/lib/ui-language';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { locale } = useUiLanguage();
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title={pickLanguage(locale, 'Email Verification', 'Verifikasi Email')} />

            <div className="mb-8 space-y-3">
                <span className="eyebrow">{pickLanguage(locale, 'One last step', 'Satu langkah lagi')}</span>
                <div>
                    <h1 className="display-title text-4xl text-slate-900">
                        {pickLanguage(locale, 'Verify your email address.', 'Verifikasi alamat emailmu.')}
                    </h1>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                        {pickLanguage(
                            locale,
                            "Thanks for signing up. Before getting started, please verify your email address by clicking the link we just sent you. If you didn't receive it, we can send another.",
                            'Terima kasih sudah mendaftar. Sebelum mulai, silakan verifikasi alamat emailmu dengan mengklik link yang baru kami kirim. Jika kamu belum menerimanya, kami bisa mengirim ulang.',
                        )}
                    </p>
                </div>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {pickLanguage(
                        locale,
                        'A new verification link has been sent to the email address you provided during registration.',
                        'Link verifikasi baru telah dikirim ke alamat email yang kamu gunakan saat registrasi.',
                    )}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        {pickLanguage(locale, 'Resend Verification Email', 'Kirim Ulang Verifikasi Email')}
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        {pickLanguage(locale, 'Log Out', 'Keluar')}
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
