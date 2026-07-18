"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Builds a windowed page list with ellipses, e.g. [1, "...", 4, 5, 6, "...", 12]
function buildPageList(current: number, total: number): (number | "...")[] {
  const pages: (number | "...")[] = [];
  const windowSize = 1;

  const start = Math.max(2, current - windowSize);
  const end = Math.min(total - 1, current + windowSize);

  pages.push(1);
  if (start > 2) pages.push("...");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("...");
  if (total > 1) pages.push(total);

  return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-6" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-smooth-fast hover:bg-slate-50 hover:text-[#6366F1] disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={2.25} />
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-xs font-bold text-slate-300">
            ...
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-smooth-fast ${
              p === currentPage
                ? "bg-[#6366F1] text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-[#6366F1]"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-smooth-fast hover:bg-slate-50 hover:text-[#6366F1] disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" strokeWidth={2.25} />
      </button>
    </nav>
  );
}
