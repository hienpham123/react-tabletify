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
}: TableRowProps<T>) {
  const rowClassName = [
    isSelected ? 'th-row-selected' : '',
    isActive ? 'th-row-active' : '',
    isFocused ? 'th-row-focused' : '',
    canDrag ? 'th-row-draggable' : '',
    isDragging ? 'th-row-dragging' : '',
    isDragOver ? 'th-row-drag-over' : '',
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

