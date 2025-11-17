import * as React from "react";
import { GroupHeaderRow } from "./GroupHeaderRow";
import { TableRow } from "./TableRow";
import type { Column } from "../types";

interface TableBodyProps<T extends Record<string, any>> {
  // Data
  data: T[];
  columns: Column<T>[];
  paginatedGroups?: [string, T[]][] | null;
  currentGroupBy?: keyof T;
  expandedGroups: Set<string>;
  
  // Selection
  selectionMode: 'none' | 'single' | 'multiple';
  selectedItems: Set<string | number>;
  activeItemIndex: number | undefined | null;
  focusedRowIndex: number | undefined;
  
  // Drag & Drop
  enableRowReorder: boolean;
  draggedRowIndex: number | null | undefined;
  dragOverRowIndex: number | null | undefined;
  isDragging: boolean;
  
  // Column management
  columnWidths: Record<string, number>;
  pinnedColumns: Record<string, 'left' | 'right'>;
  lastLeftPinnedColumnKey?: keyof T | null;
  firstRightPinnedColumnKey?: keyof T | null;
  
  // Display
  showTooltip: boolean;
  onRenderRow?: (item: T, index: number, columns: Column<T>[]) => React.ReactNode;
  
  // Callbacks
  getItemKey: (item: T, index: number) => string | number;
  onItemClick: (item: T, index: number, ev: React.MouseEvent) => void;
  onItemContextMenu?: (item: T, index: number, ev: React.MouseEvent) => void;
  onCheckboxChange: (item: T, index: number, checked: boolean) => void;
  onCellEditStart: (item: T, column: Column<T>, index: number) => void;
  onRowDragStart: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
  onRowDragOver: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
  onRowDragLeave: (e: React.DragEvent<HTMLTableRowElement>) => void;
  onRowDrop: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
  onRowDragEnd: (e: React.DragEvent<HTMLTableRowElement>) => void;
  renderCell: (item: T, column: Column<T>, index: number) => React.ReactNode;
  getCellText?: (item: T, column: Column<T>) => string;
  getLeftOffset: (column: Column<T>, index: number) => number;
  getRightOffset: (column: Column<T>, index: number) => number;
  toggleGroup: (groupKey: string) => void;
  filteredData: T[];
  pagedData: T[];
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
  isCellSelected?: (rowIndex: number, colKey: string) => boolean;
  getCellRangeInfo?: (rowIndex: number, colKey: string) => { isStart: boolean; isEnd: boolean; isInRange: boolean; isTopRow?: boolean; isBottomRow?: boolean; isLeftCol?: boolean; isRightCol?: boolean };
  isRowAboveRange?: (rowIndex: number) => boolean;
  isColumnInRange?: (colKey: string) => boolean;
  getColumnRangeInfo?: (colKey: string) => { isInRange: boolean; isLeftCol: boolean; isRightCol: boolean };
  onCellMouseDown?: (rowIndex: number, colKey: string, e: React.MouseEvent) => void;
  onCellMouseEnter?: (rowIndex: number, colKey: string, e: React.MouseEvent) => void;
  onCellMouseUp?: (rowIndex: number, colKey: string, e: React.MouseEvent) => void;
}

/**
 * TableBody - Renders the table body with rows (grouped or ungrouped)
 */
export function TableBody<T extends Record<string, any>>({
  data,
  columns,
  paginatedGroups,
  currentGroupBy,
  expandedGroups,
  selectionMode,
  selectedItems,
  activeItemIndex,
  focusedRowIndex,
  enableRowReorder,
  draggedRowIndex,
  dragOverRowIndex,
  isDragging,
  columnWidths,
  pinnedColumns,
  lastLeftPinnedColumnKey,
  firstRightPinnedColumnKey,
  showTooltip,
  onRenderRow,
  getItemKey,
  onItemClick,
  onItemContextMenu,
  onCheckboxChange,
  onCellEditStart,
  onRowDragStart,
  onRowDragOver,
  onRowDragLeave,
  onRowDrop,
  onRowDragEnd,
  renderCell,
  getCellText,
  getLeftOffset,
  getRightOffset,
  toggleGroup,
  filteredData,
  pagedData,
  rowActions,
  openMenuKey,
  onMenuToggle,
  onMenuDismiss,
  enableCellSelection = false,
  isCellSelected,
  getCellRangeInfo,
  isRowAboveRange,
  isColumnInRange,
  getColumnRangeInfo,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp,
}: TableBodyProps<T>) {
  // Find column label for groupBy
  const groupByColumn = currentGroupBy ? columns.find(c => c.key === currentGroupBy) : null;
  const groupByLabel = groupByColumn?.label || (currentGroupBy ? String(currentGroupBy) : '');

  return (
    <tbody>
      {currentGroupBy && paginatedGroups ? (
        // Grouped rows
        paginatedGroups.map(([groupKey, rows]) => {
          const isExpanded = expandedGroups.has(groupKey);
          return (
            <React.Fragment key={groupKey}>
              <GroupHeaderRow
                groupKey={groupKey}
                groupLabel={groupByLabel}
                rowCount={rows.length}
                isExpanded={isExpanded}
                onToggle={() => toggleGroup(groupKey)}
                colSpan={columns.length + (selectionMode !== 'none' ? 1 : 0) + (rowActions ? 1 : 0)}
              />
              {isExpanded &&
                rows.map((row, i) => {
                  // Find actual index in original data array
                  const dataIndex = data.findIndex(d => d === row);
                  const rowIndexForKey = dataIndex >= 0 ? dataIndex : filteredData.findIndex(d => d === row);
                  const rowIndexForSelection = dataIndex >= 0 ? dataIndex : (rowIndexForKey >= 0 ? rowIndexForKey : i);
                  // For cell selection, use index in paged data (same as useCellSelection uses table.paged)
                  const rowIndexInPagedData = pagedData.findIndex(d => d === row);
                  const rowIndexForCellSelection = rowIndexInPagedData >= 0 ? rowIndexInPagedData : i;
                  const itemKey = getItemKey(row, rowIndexForSelection);
                  const isSelected = selectedItems.has(itemKey);
                  const isActive = dataIndex >= 0 && activeItemIndex === dataIndex;
                  
                  // Get actual index in filtered data for drag & drop
                  const actualIndex = filteredData.findIndex(item => item === row);
                  const dragIndex = actualIndex >= 0 ? actualIndex : rowIndexForSelection;
                  const canDrag = enableRowReorder && !currentGroupBy;

                  if (onRenderRow) {
                    return (
                      <React.Fragment key={itemKey}>
                        {onRenderRow(row, rowIndexForSelection, columns)}
                      </React.Fragment>
                    );
                  }

                  return (
                    <TableRow
                      key={itemKey}
                      item={row}
                      index={rowIndexForSelection}
                      itemKey={itemKey}
                      columns={columns}
                      selectionMode={selectionMode}
                      isSelected={isSelected}
                      isActive={isActive}
                      isFocused={false}
                      isDragging={draggedRowIndex === dragIndex}
                      isDragOver={dragOverRowIndex === dragIndex}
                      canDrag={canDrag}
                      columnWidths={columnWidths}
                      pinnedColumns={pinnedColumns}
                      lastLeftPinnedColumnKey={lastLeftPinnedColumnKey}
                      firstRightPinnedColumnKey={firstRightPinnedColumnKey}
                      showTooltip={showTooltip}
                      onItemClick={onItemClick}
                      onItemContextMenu={onItemContextMenu}
                      onCheckboxChange={onCheckboxChange}
                      onCellEditStart={onCellEditStart}
                      onDragStart={onRowDragStart}
                      onDragOver={onRowDragOver}
                      onDragLeave={onRowDragLeave}
                      onDrop={onRowDrop}
                      onDragEnd={onRowDragEnd}
                      dragIndex={dragIndex}
                      renderCell={renderCell}
                      getCellText={getCellText}
                      getLeftOffset={getLeftOffset}
                      getRightOffset={getRightOffset}
                      isDraggingState={isDragging}
                      rowActions={rowActions}
                      openMenuKey={openMenuKey}
                      onMenuToggle={onMenuToggle}
                      onMenuDismiss={onMenuDismiss}
                      enableCellSelection={enableCellSelection}
                      cellSelectionIndex={rowIndexForCellSelection}
                      isCellSelected={isCellSelected}
                      getCellRangeInfo={getCellRangeInfo}
                      isRowAboveRange={isRowAboveRange ? isRowAboveRange(rowIndexForCellSelection) : false}
                      isColumnInRange={isColumnInRange}
                      getColumnRangeInfo={getColumnRangeInfo}
                      onCellMouseDown={onCellMouseDown}
                      onCellMouseEnter={onCellMouseEnter}
                      onCellMouseUp={onCellMouseUp}
                    />
                  );
                })}
            </React.Fragment>
          );
        })
      ) : (
        // Non-grouped rows
        // Memoize drag index calculation for better performance
        pagedData.map((row, i) => {
          const itemKey = getItemKey(row, i);
          const isSelected = selectedItems.has(itemKey);
          const isActive = activeItemIndex === i;
          
          // Get actual index in filtered data for drag & drop
          // Use reference equality check first (faster)
          const actualIndex = row === filteredData[i] ? i : filteredData.findIndex(item => item === row);
          const dragIndex = actualIndex >= 0 ? actualIndex : i;
          const canDrag = enableRowReorder && !currentGroupBy;

          if (onRenderRow) {
            return (
              <React.Fragment key={itemKey}>
                {onRenderRow(row, i, columns)}
              </React.Fragment>
            );
          }

          return (
            <TableRow
              key={itemKey}
              item={row}
              index={i}
              itemKey={itemKey}
              columns={columns}
              selectionMode={selectionMode}
              isSelected={isSelected}
              isActive={isActive}
              isFocused={focusedRowIndex === i}
              isDragging={draggedRowIndex === dragIndex}
              isDragOver={dragOverRowIndex === dragIndex}
              canDrag={canDrag}
              columnWidths={columnWidths}
              pinnedColumns={pinnedColumns}
              lastLeftPinnedColumnKey={lastLeftPinnedColumnKey}
              firstRightPinnedColumnKey={firstRightPinnedColumnKey}
              showTooltip={showTooltip}
              onItemClick={onItemClick}
              onItemContextMenu={onItemContextMenu}
              onCheckboxChange={onCheckboxChange}
              onCellEditStart={onCellEditStart}
              onDragStart={onRowDragStart}
              onDragOver={onRowDragOver}
              onDragLeave={onRowDragLeave}
              onDrop={onRowDrop}
              onDragEnd={onRowDragEnd}
              dragIndex={dragIndex}
              renderCell={renderCell}
              getCellText={getCellText}
              getLeftOffset={getLeftOffset}
              getRightOffset={getRightOffset}
              isDraggingState={isDragging}
              rowActions={rowActions}
              openMenuKey={openMenuKey}
              onMenuToggle={onMenuToggle}
              onMenuDismiss={onMenuDismiss}
              enableCellSelection={enableCellSelection}
              cellSelectionIndex={i}
              isCellSelected={isCellSelected}
              getCellRangeInfo={getCellRangeInfo}
              isRowAboveRange={isRowAboveRange ? isRowAboveRange(i) : false}
              isColumnInRange={isColumnInRange}
              getColumnRangeInfo={getColumnRangeInfo}
              onCellMouseDown={onCellMouseDown}
              onCellMouseEnter={onCellMouseEnter}
              onCellMouseUp={onCellMouseUp}
            />
          );
        })
      )}
    </tbody>
  );
}

