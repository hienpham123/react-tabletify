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
  isSelected?: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  isInRange?: boolean;
  isTopRow?: boolean;
  isBottomRow?: boolean;
  isLeftCol?: boolean;
  isRightCol?: boolean;
  isInRangeColumn?: boolean;
  isLeftColInRange?: boolean;
  isRightColInRange?: boolean;
  isCopied?: boolean;
  isFocused?: boolean;
  rowIndex?: number;
  colKey?: string;
  onMouseDown?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseUp?: (e: React.MouseEvent) => void;
  enableCellSelection?: boolean;
}

/**
 * TableCell - Renders a single table cell
 * Memoized to prevent unnecessary re-renders
 */
function TableCellComponent<T extends Record<string, any>>({
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
  isSelected = false,
  isRangeStart = false,
  isRangeEnd = false,
  isInRange = false,
  isTopRow = false,
  isBottomRow = false,
  isLeftCol = false,
  isRightCol = false,
  isInRangeColumn = false,
  isLeftColInRange = false,
  isRightColInRange = false,
  isCopied = false,
  isFocused = false,
  rowIndex,
  colKey,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
  enableCellSelection = false,
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

  const cellClassName = [
    column.cellClassName,
    column.editable ? 'hh-cell-editable' : '',
    pinPosition ? `hh-cell-pinned hh-pinned-${pinPosition}` : '',
    pinPosition === 'left' && column.key === lastLeftPinnedColumnKey ? 'hh-pinned-last-left' : '',
    pinPosition === 'right' && column.key === firstRightPinnedColumnKey ? 'hh-pinned-first-right' : '',
    enableCellSelection && isSelected ? 'hh-cell-selected' : '',
    enableCellSelection && isFocused ? 'hh-cell-focused' : '',
    enableCellSelection && isRangeStart ? 'hh-cell-range-start' : '',
    enableCellSelection && isRangeEnd ? 'hh-cell-range-end' : '',
    enableCellSelection && isInRange ? 'hh-cell-in-range' : '',
    enableCellSelection && isTopRow ? 'hh-cell-range-top' : '',
    enableCellSelection && isBottomRow ? 'hh-cell-range-bottom' : '',
    enableCellSelection && isLeftCol ? 'hh-cell-range-left' : '',
    enableCellSelection && isRightCol ? 'hh-cell-range-right' : '',
    enableCellSelection && isCopied ? 'hh-cell-copied' : '',
    showTooltip ? 'hh-cell-with-tooltip' : 'hh-cell-no-tooltip',
  ].filter(Boolean).join(' ');

  const cellText = showTooltip && getCellText ? getCellText(item, column) : undefined;

  return (
    <td
      key={colKeyStr}
      style={cellStyle}
      className={cellClassName}
      onDoubleClick={onDoubleClick}
      title={cellText || undefined}
      onMouseDown={enableCellSelection ? onMouseDown : undefined}
      onMouseEnter={enableCellSelection ? onMouseEnter : undefined}
      onMouseUp={enableCellSelection ? onMouseUp : undefined}
      data-in-range-column={enableCellSelection && isInRangeColumn ? 'true' : undefined}
      data-left-col-in-range={enableCellSelection && isLeftColInRange ? 'true' : undefined}
      data-right-col-in-range={enableCellSelection && isRightColInRange ? 'true' : undefined}
      data-row-index={enableCellSelection && rowIndex !== undefined ? rowIndex : undefined}
      data-col-key={enableCellSelection && colKey ? colKey : undefined}
    >
      {renderCell(item, column, index)}
    </td>
  );
};

// Memoize TableCell to prevent unnecessary re-renders
// IMPORTANT: renderCell callback changes when editingCell changes (for inline editing)
// So we MUST compare renderCell to allow re-render when editing starts/stops
export const TableCell = React.memo(TableCellComponent, (prevProps, nextProps) => {
  // Only re-render if these props change
  // We compare renderCell by reference - when editingCell changes, renderCell changes
  // and TableCell will re-render to show/hide the input
  const propsEqual = (
    prevProps.item === nextProps.item &&
    prevProps.index === nextProps.index &&
    prevProps.column.key === nextProps.column.key &&
    prevProps.resizedWidth === nextProps.resizedWidth &&
    prevProps.pinPosition === nextProps.pinPosition &&
    prevProps.leftOffset === nextProps.leftOffset &&
    prevProps.rightOffset === nextProps.rightOffset &&
    prevProps.showTooltip === nextProps.showTooltip &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isFocused === nextProps.isFocused &&
    prevProps.isRangeStart === nextProps.isRangeStart &&
    prevProps.isRangeEnd === nextProps.isRangeEnd &&
    prevProps.isInRange === nextProps.isInRange &&
    prevProps.isTopRow === nextProps.isTopRow &&
    prevProps.isBottomRow === nextProps.isBottomRow &&
    prevProps.isLeftCol === nextProps.isLeftCol &&
    prevProps.isRightCol === nextProps.isRightCol &&
    prevProps.isInRangeColumn === nextProps.isInRangeColumn &&
    prevProps.isLeftColInRange === nextProps.isLeftColInRange &&
    prevProps.isRightColInRange === nextProps.isRightColInRange &&
    prevProps.isCopied === nextProps.isCopied &&
    prevProps.enableCellSelection === nextProps.enableCellSelection &&
    prevProps.renderCell === nextProps.renderCell
    // Note: onMouseDown, onMouseEnter, onMouseUp are not compared as they are
    // created fresh each render and don't affect visual rendering
    // onDoubleClick is also not compared for the same reason
  );
  
  // Always allow re-render if renderCell changes (for inline editing)
  // onDoubleClick is created fresh each render, so we don't compare it
  return propsEqual;
}) as typeof TableCellComponent;

