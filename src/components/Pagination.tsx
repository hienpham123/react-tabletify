import React from "react";
import '../styles/pagination.css'

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
  itemsPerPageOptions?: number[];
  onItemsPerPageChange?: (itemsPerPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  maxVisible = 5,
  itemsPerPageOptions,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    onPageChange(p);
  };

  // If no pagination buttons and no itemsPerPageOptions, return null
  if (totalPages <= 0 && !(itemsPerPageOptions && onItemsPerPageChange)) {
    return null;
  }

  return (
    <div className="hh-pagination">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="hh-pagination-btn hh-pagination-arrow"
        aria-label="Previous page"
      >
        &lt;
      </button>

      {start > 1 && (
        <>
          <button className="hh-pagination-btn" onClick={() => goToPage(1)}>
            1
          </button>
          {start > 2 && <span className="hh-pagination-ellipsis">...</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          className={`hh-pagination-btn ${p === currentPage ? 'hh-page-active' : ''}`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="hh-pagination-ellipsis">...</span>}
          <button className="hh-pagination-btn" onClick={() => goToPage(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="hh-pagination-btn hh-pagination-arrow"
        aria-label="Next page"
      >
        &gt;
      </button>

      {itemsPerPageOptions && onItemsPerPageChange && (
        <div className="hh-pagination-items-per-page">
          <label htmlFor="hh-items-per-page-select" style={{ marginRight: '8px' }}>
            Rows per page:
          </label>
          <select
            id="hh-items-per-page-select"
            value={itemsPerPage}
            onChange={(e) => {
              const newItemsPerPage = Number(e.target.value);
              onItemsPerPageChange(newItemsPerPage);
              // Reset to page 1 when changing items per page
              onPageChange(1);
            }}
            className="hh-pagination-select"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};
