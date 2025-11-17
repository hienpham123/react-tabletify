import * as React from "react";
import type { Column } from "../types";
import { SelectionCell } from "./SelectionCell";
import { TableCell } from "./TableCell";
import { RowActionsCell } from "./RowActionsCell";
import { RowActionsMenu } from "./RowActionsMenu";

interface TableRowProps<T extends Record<string, any>> {
  item: T;
  index: number;
  itemKey: string | number;
  columns: Column<T>[];
  selectionMode: 'none' | 'single' | 'multiple';
  isSelected: boolean;
  isActive: boolean;
  isFocused?: boolean;
  isDragging?: boolean;
  isDragOver?: boolean;
  canDrag: boolean;
  columnWidths: Record<string, number>;
  pinnedColumns: Record<string, 'left' | 'right'>;
  lastLeftPinnedColumnKey?: keyof T | null;
  firstRightPinnedColumnKey?: keyof T | null;
  showTooltip: boolean;
  onItemClick: (item: T, index: number, ev: React.MouseEvent) => void;
  onItemContextMenu?: (item: T, index: number, ev: React.MouseEvent) => void;
  onCheckboxChange: (item: T, index: number, checked: boolean) => void;
  onCellEditStart: (item: T, column: Column<T>, index: number) => void;
  onDragStart: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
  onDragLeave: (e: React.DragEvent<HTMLTableRowElement>) => void;
  onDrop: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLTableRowElement>) => void;
  renderCell: (item: T, column: Column<T>, index: number) => React.ReactNode;
  getCellText?: (item: T, column: Column<T>) => string;
  getLeftOffset: (column: Column<T>, index: number) => number;
  getRightOffset: (column: Column<T>, index: number) => number;
  isDraggingState: boolean;
  rowActions?: (item: T, index: number) => Array<{
    key: string;
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T, index: number) => void;
    disabled?: boolean;
  }>;
  openMenuKey: string | null;
  onMenuToggle: (item: T, index: number) => void;
  onMenuDismiss: () => void;
  enableCellSelection?: boolean;
  cellSelectionIndex?: number; // Index in paged data for cell selection operations
  isCellSelected?: (rowIndex: number, colKey: string) => boolean;
  getCellRangeInfo?: (rowIndex: number, colKey: string) => { isStart: boolean; isEnd: boolean; isInRange: boolean; isTopRow?: boolean; isBottomRow?: boolean; isLeftCol?: boolean; isRightCol?: boolean; isCopied?: boolean; isFocused?: boolean };
  isRowAboveRange?: boolean;
  isColumnInRange?: (colKey: string) => boolean;
  getColumnRangeInfo?: (colKey: string) => { isInRange: boolean; isLeftCol: boolean; isRightCol: boolean };
  onCellMouseDown?: (rowIndex: number, colKey: string, e: React.MouseEvent) => void;
  onCellMouseEnter?: (rowIndex: number, colKey: string, e: React.MouseEvent) => void;
  onCellMouseUp?: (rowIndex: number, colKey: string, e: React.MouseEvent) => void;
}

/**
 * TableRow - Renders a single table row with cells
 */
export function TableRow<T extends Record<string, any>>({
  item,
  index,
  itemKey,
  columns,
  selectionMode,
  isSelected,
  isActive,
  isFocused = false,
  isDragging = false,
  isDragOver = false,
  canDrag,
  columnWidths,
  pinnedColumns,
  lastLeftPinnedColumnKey,
  firstRightPinnedColumnKey,
  showTooltip,
  onItemClick,
  onItemContextMenu,
  onCheckboxChange,
  onCellEditStart,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  renderCell,
  getCellText,
  getLeftOffset,
  getRightOffset,
  isDraggingState,
  rowActions,
  openMenuKey,
  onMenuToggle,
  onMenuDismiss,
  enableCellSelection = false,
  cellSelectionIndex,
  isCellSelected,
  getCellRangeInfo,
  isRowAboveRange = false,
  isColumnInRange,
  getColumnRangeInfo,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp,
}: TableRowProps<T>) {
  const rowClassName = [
    isSelected ? 'hh-row-selected' : '',
    // Disable row active/focused styling when cell selection is enabled
    !enableCellSelection && isActive ? 'hh-row-active' : '',
    !enableCellSelection && isFocused ? 'hh-row-focused' : '',
    canDrag ? 'hh-row-draggable' : '',
    isDragging ? 'hh-row-dragging' : '',
    isDragOver ? 'hh-row-drag-over' : '',
    enableCellSelection && isRowAboveRange ? 'hh-row-above-range' : '',
  ].filter(Boolean).join(' ');

  const actions = rowActions ? rowActions(item, index) : [];
  // Use a more unique key that includes both itemKey and index
  const menuKey = React.useMemo(() => `${String(itemKey)}-${index}`, [itemKey, index]);
  const isMenuOpen = openMenuKey === menuKey;
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <tr
        key={itemKey}
        className={rowClassName}
        draggable={canDrag}
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, index)}
        onDragEnd={onDragEnd}
        onClick={(ev) => {
          if (!isDraggingState) {
            // Disable row click behavior when cell selection is enabled
            if (!enableCellSelection) {
              onItemClick(item, index, ev);
            }
          }
        }}
        onContextMenu={(ev) => onItemContextMenu?.(item, index, ev)}
      >
        {selectionMode !== 'none' && (
          <SelectionCell
            selectionMode={selectionMode}
            checked={isSelected}
            onChange={(checked) => onCheckboxChange(item, index, checked)}
          />
        )}
        {actions.length > 0 && (
          <RowActionsCell
            item={item}
            index={index}
            actions={actions}
            onMenuToggle={onMenuToggle}
            isMenuOpen={isMenuOpen}
            buttonRef={buttonRef}
          />
        )}
        {columns.map((col, colIndex) => {
          const colKeyStr = String(col.key);
          const resizedWidth = columnWidths[colKeyStr];
          const pinPosition = pinnedColumns[colKeyStr] || col.pinned || null;
          const sortedIndex = columns.findIndex(c => String(c.key) === colKeyStr);
          const leftOffset = pinPosition === 'left' ? getLeftOffset(col, sortedIndex) : 0;
          const rightOffset = pinPosition === 'right' ? getRightOffset(col, sortedIndex) : 0;

          // Use cellSelectionIndex (index in paged data) for cell selection operations, fallback to index if not provided
          const cellIndex = cellSelectionIndex !== undefined ? cellSelectionIndex : index;
          const cellIsSelected = enableCellSelection && isCellSelected ? isCellSelected(cellIndex, colKeyStr) : false;
          const rangeInfo = enableCellSelection && getCellRangeInfo ? getCellRangeInfo(cellIndex, colKeyStr) : { isStart: false, isEnd: false, isInRange: false, isTopRow: false, isBottomRow: false, isLeftCol: false, isRightCol: false, isCopied: false, isFocused: false };
          const isCopied = rangeInfo.isCopied ?? false;
          const isFocused = rangeInfo.isFocused ?? false;
          // For row above range, check if this column is in range and get column range info
          const columnRangeInfo = enableCellSelection && isRowAboveRange && getColumnRangeInfo ? getColumnRangeInfo(colKeyStr) : { isInRange: false, isLeftCol: false, isRightCol: false };
          const isInRangeColumn = columnRangeInfo.isInRange;

          return (
            <TableCell
              key={colKeyStr}
              column={col}
              item={item}
              index={index}
              resizedWidth={resizedWidth}
              pinPosition={pinPosition}
              leftOffset={leftOffset}
              rightOffset={rightOffset}
              lastLeftPinnedColumnKey={lastLeftPinnedColumnKey}
              firstRightPinnedColumnKey={firstRightPinnedColumnKey}
              showTooltip={showTooltip}
              onDoubleClick={() => onCellEditStart(item, col, index)}
              renderCell={renderCell}
              getCellText={getCellText}
              enableCellSelection={enableCellSelection}
              isSelected={cellIsSelected}
              isFocused={isFocused}
              isRangeStart={rangeInfo.isStart}
              isRangeEnd={rangeInfo.isEnd}
              isInRange={rangeInfo.isInRange}
              isTopRow={rangeInfo.isTopRow}
              isBottomRow={rangeInfo.isBottomRow}
              isLeftCol={rangeInfo.isLeftCol}
              isRightCol={rangeInfo.isRightCol}
              isInRangeColumn={isInRangeColumn}
              isLeftColInRange={columnRangeInfo.isLeftCol}
              isRightColInRange={columnRangeInfo.isRightCol}
              isCopied={isCopied}
              rowIndex={cellIndex}
              colKey={colKeyStr}
              onMouseDown={enableCellSelection && onCellMouseDown ? (e) => onCellMouseDown(cellIndex, colKeyStr, e) : undefined}
              onMouseEnter={enableCellSelection && onCellMouseEnter ? (e) => onCellMouseEnter(cellIndex, colKeyStr, e) : undefined}
              onMouseUp={enableCellSelection && onCellMouseUp ? (e) => onCellMouseUp(cellIndex, colKeyStr, e) : undefined}
            />
          );
        })}
      </tr>
      {isMenuOpen && actions.length > 0 && (
        <RowActionsMenu
          anchorRef={buttonRef}
          actions={actions}
          item={item}
          index={index}
          onDismiss={onMenuDismiss}
        />
      )}
    </>
  );
}

