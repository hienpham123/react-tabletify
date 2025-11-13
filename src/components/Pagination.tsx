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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        marginTop: "1rem",
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        style={btnStyle}
      >
         Prev
      </button>

      {start > 1 && (
        <>
          <button style={btnStyle} onClick={() => goToPage(1)}>
            1
          </button>
          {start > 2 && <span style={{ color: "#999" }}>...</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => goToPage(p)}
          style={{
            ...btnStyle,
            ...(p === currentPage
              ? {
                  background: "#6ABE28",
                  color: "#fff",
                  fontWeight: 600,
                  borderColor: "#6ABE28",
                }
              : {}),
          }}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span style={{ color: "#999" }}>...</span>}
          <button style={btnStyle} onClick={() => goToPage(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={btnStyle}
      >
        Next
      </button>
    </div>
  );
};

const btnStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: 4,
  padding: "4px 10px",
  cursor: "pointer",
  background: "#fff",
  transition: "0.2s",
  fontSize: 14,
};
