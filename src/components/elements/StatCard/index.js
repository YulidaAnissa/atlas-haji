export default function StatusCard({ title, count, subtitle, color, icon }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl ${color} p-5 text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg`}
    >
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 right-8 h-28 w-28 rounded-full bg-black/10" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white/80">
            {title}
          </p>
          <p className="mt-3 text-4xl font-bold tracking-tight">
            {count}
          </p>
        </div>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl shadow-inner">
          {icon}
        </div>
      </div>

      <p className="relative mt-4 min-h-10 text-sm leading-5 text-white/85">
        {subtitle}
      </p>
    </div>
  );
}