import Link from "next/link";
import { FiChevronRight, FiHome } from "react-icons/fi";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isHome = index === 0;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="group inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-slate-500 transition hover:bg-[#fbf7ec] hover:text-brand"
                >
                  {isHome && <FiHome className="h-4 w-4" />}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fbf7ec] px-2.5 py-1 text-brand">
                  {isHome && <FiHome className="h-4 w-4" />}
                  <span>{item.label}</span>
                </span>
              )}

              {!isLast && (
                <FiChevronRight className="h-4 w-4 text-slate-300" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}