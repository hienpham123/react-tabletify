import * as React from "react";
import type { Column } from "../types";

interface TableFooterProps<T extends Record<string, any>> {
  columns: Column<T>[];
  selectionMode: 'none' | 'single' | 'multiple';
  columnTotals: Record<string, 'none' | 'count'>;
  pinnedColumns: Record<string, 'left' | 'right'>;
  columnWidths: Record<string, number>;
  lastLeftPinnedColumnKey?: keyof T | null;
  firstRightPinnedColumnKey?: keyof T | null;
  totalCount: number;
  getLeftOffset: (column: Column<T>, index: number) => number;
  getRightOffset: (column: Column<T>, index: number) => number;
}

/**
 * TableFooter - Renders the table footer with totals row
 */
export function TableFooter<T extends Record<string, any>>({
  columns,
  selectionMode,
  columnTotals,
  pinnedColumns,
  columnWidths,
  lastLeftPinnedColumnKey,
  firstRightPinnedColumnKey,
  totalCount,
  getLeftOffset,
  getRightOffset,
}: TableFooterProps<T>) {
  const hasTotals = Object.values(columnTotals).some(v => v === 'count');
  
  if (!hasTotals) {
    return null;
  }

  return (
    <tfoot className="th-totals-sticky">
      <tr className="th-totals-row">
        {selectionMode !== 'none' && (
          <td className="th-selection-column"></td>
        )}
        {columns.map((col) => {
          const colKeyStr = String(col.key);
          const totalsValue = columnTotals[colKeyStr] || 'none';
          const pinPosition = pinnedColumns[colKeyStr] || col.pinned || null;
          const sortedIndex = columns.findIndex(c => String(c.key) === colKeyStr);
          const leftOffset = pinPosition === 'left' ? getLeftOffset(col, sortedIndex) : 0;
          const rightOffset = pinPosition === 'right' ? getRightOffset(col, sortedIndex) : 0;
          const resizedWidth = columnWidths[colKeyStr];
          
          const cellStyle: React.CSSProperties = {
            textAlign: col.align,
            width: resizedWidth ? `${resizedWidth}px` : col.width,
            position: pinPosition ? 'sticky' : 'relative',
            ...(pinPosition === 'left' ? { left: `${leftOffset}px`, zIndex: 11 } : {}),
            ...(pinPosition === 'right' ? { right: `${rightOffset}px`, zIndex: 11 } : {}),
          };
          
          const cellClassName = [
            pinPosition ? `th-cell-pinned th-pinned-${pinPosition}` : '',
            pinPosition === 'left' && col.key === lastLeftPinnedColumnKey ? 'th-pinned-last-left' : '',
            pinPosition === 'right' && col.key === firstRightPinnedColumnKey ? 'th-pinned-first-right' : '',
          ].filter(Boolean).join(' ');

          let cellContent: React.ReactNode = '';
          if (totalsValue === 'count') {
            cellContent = `Count: ${totalCount.toLocaleString()}`;
          }

          return (
            <td
              key={colKeyStr}
              style={cellStyle}
              className={cellClassName}
            >
              {cellContent}
            </td>
          );
        })}
      </tr>
    </tfoot>
  );
}

