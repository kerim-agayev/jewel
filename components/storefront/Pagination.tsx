import { Link } from "@/i18n/navigation";
import { buildPageHref } from "@/lib/category-filters";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  rawSearchParams: Record<string, string | string[] | undefined>;
}

export function Pagination({ page, pageSize, total, rawSearchParams }: PaginationProps) {
  const pageCount = Math.ceil(total / pageSize);
  if (pageCount <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={buildPageHref(rawSearchParams, p)}
          aria-current={p === page ? "page" : undefined}
          className={`w-9 h-9 flex items-center justify-center rounded-sm text-label-md ${
            p === page ? "bg-secondary text-on-secondary" : "text-on-surface-variant hover:bg-surface-container"
          }`}
        >
          {p}
        </Link>
      ))}
    </nav>
  );
}
