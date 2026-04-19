import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    const stats = [
        {
            label: 'Video briefs',
            value: '12',
            detail: 'Ready to turn into storyboard templates',
        },
        {
            label: 'Saved video plans',
            value: '48',
            detail: 'Video history will live here',
        },
        {
            label: 'Average delivery time',
            value: '8s',
            detail: 'Great target for the AI workflow',
        },
    ];

    const steps = [
        {
            title: 'Collect prompt details',
            description:
                'Add form inputs for video type, audience, tone, keywords, and duration with clean validation.',
        },
        {
            title: 'Generate video scripts',
            description:
                'Connect your API call, loading state, scene breakdown, and storyboard formatting inside Inertia pages.',
        },
        {
            title: 'Save and reuse',
            description:
                'Store video plans, add search, copy actions, and lightweight export options.',
        },
    ];

    return (
        <AuthenticatedLayout
            header={
                <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
                    <div className="space-y-4">
                        <span className="eyebrow">Project cockpit</span>
                        <div>
                            <h1 className="display-title text-balance text-4xl text-slate-900 sm:text-5xl">
                                Your AI video generator now has a
                                production-ready shell.
                            </h1>
                            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                                Auth is wired up, Inertia React is ready, and
                                the interface already supports a strong demo
                                story. Next we can plug in generation flows,
                                history, storyboard previews, and exports.
                            </p>
                        </div>
                    </div>

                    <div className="glass-panel rounded-[1.75rem] p-5">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-800/70">
                            Suggested next milestone
                        </p>
                        <p className="mt-3 text-lg font-semibold text-slate-900">
                            Build the video generation form page
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            This will unlock the strongest demo path fastest:
                            input, generate, save, revisit.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="pb-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-4 md:grid-cols-3">
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className="glass-panel animate-rise rounded-[1.75rem] p-5"
                                style={{ animationDelay: `${index * 120}ms` }}
                            >
                                <p className="text-sm text-slate-500">
                                    {stat.label}
                                </p>
                                <p className="mt-4 text-4xl font-semibold text-slate-900">
                                    {stat.value}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    {stat.detail}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
                        <section className="glass-panel-strong rounded-[2rem] p-6 sm:p-8">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-800/70">
                                        Build queue
                                    </p>
                                    <h2 className="display-title mt-3 text-3xl text-slate-900">
                                        What this starter is optimized for next
                                    </h2>
                                </div>
                                <div className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
                                    Designed for the 3-day assignment pace
                                </div>
                            </div>

                            <div className="mt-8 grid gap-4">
                                {steps.map((step, index) => (
                                    <div
                                        key={step.title}
                                        className="rounded-[1.5rem] border border-stone-200/80 bg-white/80 p-5"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                                                0{index + 1}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    {step.title}
                                                </h3>
                                                <p className="mt-2 text-sm leading-7 text-slate-600">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <aside className="space-y-6">
                            <div className="glass-panel rounded-[2rem] p-6">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-800/70">
                                    Demo flow
                                </p>
                                <div className="mt-5 space-y-4">
                                    {[
                                        'Register',
                                        'Fill prompt',
                                        'Generate video',
                                        'Save result',
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="flex items-center justify-between rounded-2xl border border-stone-200/80 bg-white/85 px-4 py-3"
                                        >
                                            <span className="text-sm font-medium text-slate-700">
                                                {item}
                                            </span>
                                            <span className="h-2.5 w-2.5 rounded-full bg-teal-600" />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.35)]">
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300/80">
                                    UI note
                                </p>
                                <h3 className="display-title mt-3 text-3xl text-stone-50">
                                    Built to feel presentable on day one.
                                </h3>
                                <p className="mt-4 text-sm leading-7 text-slate-300">
                                    The warm editorial palette and glass
                                    surfaces are meant to help your final
                                    prototype look intentional before the
                                    feature layer is complete.
                                </p>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
