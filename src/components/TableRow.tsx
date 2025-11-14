import * as React from "react";
import type { Column } from "../types";
import { SelectionCell } from "./SelectionCell";
import { TableCell } from "./TableCell";

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
}: TableRowProps<T>) {
  const rowClassName = [
    isSelected ? 'th-row-selected' : '',
    isActive ? 'th-row-active' : '',
    isFocused ? 'th-row-focused' : '',
    canDrag ? 'th-row-draggable' : '',
    isDragging ? 'th-row-dragging' : '',
    isDragOver ? 'th-row-drag-over' : '',
  ].filter(Boolean).join(' ');

  return (
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
          onItemClick(item, index, ev);
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
      {columns.map((col, colIndex) => {
        const colKeyStr = String(col.key);
        const resizedWidth = columnWidths[colKeyStr];
        const pinPosition = pinnedColumns[colKeyStr] || col.pinned || null;
        const sortedIndex = columns.findIndex(c => String(c.key) === colKeyStr);
        const leftOffset = pinPosition === 'left' ? getLeftOffset(col, sortedIndex) : 0;
        const rightOffset = pinPosition === 'right' ? getRightOffset(col, sortedIndex) : 0;

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
          />
        );
      })}
    </tr>
  );
}

