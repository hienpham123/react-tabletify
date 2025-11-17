import * as React from "react";

interface RowActionsCellProps<T extends Record<string, any>> {
  item: T;
  index: number;
  actions: Array<{
    key: string;
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T, index: number) => void;
    disabled?: boolean;
  }>;
  onMenuToggle: (item: T, index: number) => void;
  isMenuOpen: boolean;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

export function RowActionsCell<T extends Record<string, any>>({
  item,
  index,
  actions,
  onMenuToggle,
  isMenuOpen,
  buttonRef,
}: RowActionsCellProps<T>) {
  if (!actions || actions.length === 0) {
    return <td className="hh-row-actions-column"></td>;
  }

  return (
    <td className="hh-row-actions-column">
      <button
        ref={buttonRef}
        type="button"
        className={`hh-row-actions-button ${isMenuOpen ? 'hh-row-actions-button-active' : ''}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onMenuToggle(item, index);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        aria-label="Row actions"
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: 'block' }}
        >
          <circle cx="4" cy="8" r="1.5" fill="currentColor" />
          <circle cx="8" cy="8" r="1.5" fill="currentColor" />
          <circle cx="12" cy="8" r="1.5" fill="currentColor" />
        </svg>
      </button>
    </td>
  );
}

