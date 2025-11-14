import * as React from "react";
import type { Column } from "../types";

interface TableCellProps<T extends Record<string, any>> {
  column: Column<T>;
  item: T;
  index: number;
  resizedWidth?: number;
  pinPosition: 'left' | 'right' | null;
  leftOffset: number;
  rightOffset: number;
  lastLeftPinnedColumnKey?: keyof T | null;
  firstRightPinnedColumnKey?: keyof T | null;
  showTooltip: boolean;
  onDoubleClick?: () => void;
  renderCell: (item: T, column: Column<T>, index: number) => React.ReactNode;
  getCellText?: (item: T, column: Column<T>) => string;
}

/**
 * TableCell - Renders a single table cell
 */
export function TableCell<T extends Record<string, any>>({
  column,
  item,
  index,
  resizedWidth,
  pinPosition,
  leftOffset,
  rightOffset,
  lastLeftPinnedColumnKey,
  firstRightPinnedColumnKey,
  showTooltip,
  onDoubleClick,
  renderCell,
  getCellText,
}: TableCellProps<T>) {
  const colKeyStr = String(column.key);
  
  const cellStyle: React.CSSProperties = {
    ...column.cellStyle,
    textAlign: column.align,
    width: resizedWidth ? `${resizedWidth}px` : column.width,
    position: pinPosition ? 'sticky' : 'relative',
    ...(pinPosition === 'left' ? { left: `${leftOffset}px`, zIndex: 3 } : {}),
    ...(pinPosition === 'right' ? { right: `${rightOffset}px`, zIndex: 3 } : {}),
  };

  const cellClassName = column.cellClassName
    ? `${column.cellClassName} ${column.editable ? 'th-cell-editable' : ''} ${pinPosition ? `th-cell-pinned th-pinned-${pinPosition}` : ''} ${pinPosition === 'left' && column.key === lastLeftPinnedColumnKey ? 'th-pinned-last-left' : ''} ${pinPosition === 'right' && column.key === firstRightPinnedColumnKey ? 'th-pinned-first-right' : ''}`
    : `${column.editable ? 'th-cell-editable' : ''} ${pinPosition ? `th-cell-pinned th-pinned-${pinPosition}` : ''} ${pinPosition === 'left' && column.key === lastLeftPinnedColumnKey ? 'th-pinned-last-left' : ''} ${pinPosition === 'right' && column.key === firstRightPinnedColumnKey ? 'th-pinned-first-right' : ''}`.trim();

  const cellText = showTooltip && getCellText ? getCellText(item, column) : undefined;

  return (
    <td
      key={colKeyStr}
      style={cellStyle}
      className={cellClassName}
      onDoubleClick={onDoubleClick}
      title={cellText || undefined}
    >
      {renderCell(item, column, index)}
    </td>
  );
}

