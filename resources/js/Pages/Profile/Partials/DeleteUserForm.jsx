import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { pickLanguage, useUiLanguage } from '@/lib/ui-language';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const { locale } = useUiLanguage();
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    {pickLanguage(locale, 'Delete Account', 'Hapus Akun')}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    {pickLanguage(
                        locale,
                        'Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.',
                        'Setelah akunmu dihapus, semua resource dan data akan dihapus permanen. Sebelum menghapus akun, pastikan kamu sudah menyimpan data atau informasi yang ingin dipertahankan.',
                    )}
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                {pickLanguage(locale, 'Delete Account', 'Hapus Akun')}
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900">
                        {pickLanguage(
                            locale,
                            'Are you sure you want to delete your account?',
                            'Yakin ingin menghapus akunmu?',
                        )}
                    </h2>

                    <p className="mt-1 text-sm text-gray-600">
                        {pickLanguage(
                            locale,
                            'Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.',
                            'Setelah akunmu dihapus, semua resource dan data akan dihapus permanen. Masukkan kata sandimu untuk mengonfirmasi bahwa kamu benar-benar ingin menghapus akun ini.',
                        )}
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value={pickLanguage(locale, 'Password', 'Kata sandi')}
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-3/4"
                            isFocused
                            placeholder={pickLanguage(locale, 'Password', 'Kata sandi')}
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={closeModal}>
                            {pickLanguage(locale, 'Cancel', 'Batal')}
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            {pickLanguage(locale, 'Delete Account', 'Hapus Akun')}
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
