import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { pickLanguage, useUiLanguage } from '@/lib/ui-language';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { locale } = useUiLanguage();

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <span className="eyebrow">{pickLanguage(locale, 'Account settings', 'Pengaturan akun')}</span>
                    <h2 className="mt-3 display-title text-4xl leading-tight text-slate-900">
                        {pickLanguage(locale, 'Profile', 'Profil')}
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                        {pickLanguage(
                            locale,
                            'Manage your personal details, password, and account security in one place.',
                            'Kelola detail pribadi, kata sandi, dan keamanan akunmu di satu tempat.',
                        )}
                    </p>
                </div>
            }
        >
            <Head title={pickLanguage(locale, 'Profile', 'Profil')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="glass-panel-strong p-4 shadow sm:rounded-[2rem] sm:p-8">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="glass-panel p-4 shadow sm:rounded-[2rem] sm:p-8">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="glass-panel p-4 shadow sm:rounded-[2rem] sm:p-8">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
