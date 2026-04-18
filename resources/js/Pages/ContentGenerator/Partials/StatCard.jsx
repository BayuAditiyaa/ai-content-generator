export default function StatCard({ label, value, detail }) {
    return (
        <div className="glass-panel animate-rise rounded-[1.75rem] p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
        </div>
    );
}
