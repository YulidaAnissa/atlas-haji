import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center text-sm font-medium mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.href ? (
              <Link
                href={item.href}
                className="relative group text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <span className="bg-linear-to-r from-primary via-blue-700 to-brand bg-clip-text text-transparent">
                  {item.label}
                </span>
                {/* efek underline animasi */}
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            ) : (
              <span className="text-gray-400">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <FaChevronRight className="mx-2 text-gray-400 w-3 h-3" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}