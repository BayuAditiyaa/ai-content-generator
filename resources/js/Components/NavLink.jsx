import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-teal-700/20 bg-teal-50 text-teal-900'
                    : 'border-transparent text-slate-600 hover:border-slate-300/80 hover:bg-white/80 hover:text-slate-900') +
                className
            }
        >
            {children}
        </Link>
    );
}
