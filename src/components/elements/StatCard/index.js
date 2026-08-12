export default function StatusCard({ onClick, title, count, subtitle, color, icon }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl ${color} p-4 sm:p-5 text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer active:scale-[0.98]`}
      onClick={onClick}
    >
      {/* Dekorasi Background */}
      <div className="absolute -right-6 -top-6 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute -bottom-10 right-8 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-black/10 pointer-events-none" />

      {/* Bagian Atas: Judul & Ikon */}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-white/80 truncate">
            {title}
          </p>
          <p className="mt-2 sm:mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
            {count}
          </p>
        </div>

        <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-white/20 text-xl sm:text-2xl shadow-inner">
          {icon}
        </div>
      </div>

      {/* Bagian Bawah: Subtitle */}
      <p className="relative mt-3 sm:mt-4 text-xs sm:text-sm leading-relaxed text-white/85 line-clamp-2">
        {subtitle}
      </p>
    </div>
  );
}