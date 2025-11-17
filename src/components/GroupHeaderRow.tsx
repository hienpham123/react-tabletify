import * as React from "react";

interface GroupHeaderRowProps {
  groupKey: string;
  groupLabel: string;
  rowCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  colSpan: number;
}

/**
 * GroupHeaderRow - Renders a group header row with expand/collapse functionality
 */
export function GroupHeaderRow({
  groupKey,
  groupLabel,
  rowCount,
  isExpanded,
  onToggle,
  colSpan,
}: GroupHeaderRowProps) {
  return (
    <tr className="hh-group-header">
      <td colSpan={colSpan} className="hh-group-header-cell">
        <button
          className="hh-group-toggle"
          onClick={onToggle}
          aria-expanded={isExpanded}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={isExpanded ? "expanded" : ""}
          >
            <path
              d="M6 4L10 8L6 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <span className="hh-group-label">
            {groupLabel}: {groupKey}
          </span>
          <span className="hh-group-count">({rowCount})</span>
        </button>
      </td>
    </tr>
  );
}

