import * as React from "react";
import { ChevronRightIcon } from "../icons";

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
          <ChevronRightIcon 
            width={16} 
            height={16} 
            className={isExpanded ? "expanded" : ""} 
          />
          <span className="hh-group-label">
            {groupLabel}: {groupKey}
          </span>
          <span className="hh-group-count">({rowCount})</span>
        </button>
      </td>
    </tr>
  );
}

