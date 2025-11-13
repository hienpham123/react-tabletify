import React from "react";
import '../styles/pagination.css'

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  maxVisible = 5,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
  };

  return (
    <div className="th-pagination">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="th-pagination-btn"
      >
        Prev
      </button>

      {start > 1 && (
        <>
          <button className="th-pagination-btn" onClick={() => goToPage(1)}>
            1
          </button>
          {start > 2 && <span className="th-pagination-ellipsis">...</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`th-pagination-btn ${p === currentPage ? 'th-page-active' : ''}`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="th-pagination-ellipsis">...</span>}
          <button className="th-pagination-btn" onClick={() => goToPage(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="th-pagination-btn"
      >
        Next
      </button>
    </div>
  );
};
