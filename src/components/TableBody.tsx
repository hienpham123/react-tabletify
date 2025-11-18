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
  
  // Virtual scrolling
  enableVirtualScroll?: boolean;
  scrollTop?: number;
  containerHeight?: number;
  isLoadingMore?: boolean;
  
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
 * Uses windowing approach like Fluent UI - only renders items in viewport + small buffer
 * Merges ranges to prevent flickering
 */
const ROW_HEIGHT = 48; // Estimated row height in pixels (adjust based on your CSS)
const OVERSCAN_ROWS = 50; // Buffer for smooth scrolling (increased to prevent blank screen)
const SCROLL_THRESHOLD = ROW_HEIGHT * 2; // Update threshold for scroll (reduced for more frequent updates)
const MAX_RANGE_SIZE = 200; // Maximum rows to keep in range (increased to prevent blank screen)
const SKELETON_ROWS_COUNT = 1; // Only show 1 skeleton row (the next row to be loaded)

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
  enableVirtualScroll = false,
  scrollTop = 0,
  containerHeight = 0,
  isLoadingMore = false,
}: TableBodyProps<T>) {
  // Find column label for groupBy
  const groupByColumn = currentGroupBy ? columns.find(c => c.key === currentGroupBy) : null;
  const groupByLabel = groupByColumn?.label || (currentGroupBy ? String(currentGroupBy) : '');

  // Windowing approach with range merging to prevent flickering
  const prevScrollTopRef = React.useRef<number>(scrollTop);
  const stableRangeRef = React.useRef<{ start: number; end: number } | null>(null);
  const prevDataLengthRef = React.useRef<number>(pagedData.length);
  
  // Reset range when data length changes significantly (e.g., load more)
  // But preserve scroll position and expand range to include new data
  React.useEffect(() => {
    if (pagedData.length !== prevDataLengthRef.current) {
      const dataLengthDelta = pagedData.length - prevDataLengthRef.current;
      // If data increased (load more), expand range to include new data
      if (dataLengthDelta > 0 && stableRangeRef.current) {
        // Expand range to include new data at the end
        const currentEnd = stableRangeRef.current.end;
        const newEnd = Math.min(pagedData.length, currentEnd + dataLengthDelta + OVERSCAN_ROWS);
        stableRangeRef.current = {
          start: stableRangeRef.current.start,
          end: newEnd
        };
        prevDataLengthRef.current = pagedData.length;
      } else if (dataLengthDelta < 0) {
        // Data decreased - reset range
        stableRangeRef.current = null;
        prevDataLengthRef.current = pagedData.length;
      } else {
        prevDataLengthRef.current = pagedData.length;
      }
    }
  }, [pagedData.length]);

  // Calculate virtual scrolling range using windowing approach with range merging
  const virtualScrollRange = React.useMemo(() => {
    if (!enableVirtualScroll || currentGroupBy || pagedData.length === 0) {
      stableRangeRef.current = null;
      return null;
    }
    
    // Use default height if containerHeight is 0
    const effectiveHeight = containerHeight > 0 ? containerHeight : 600;
    const totalHeight = pagedData.length * ROW_HEIGHT;
    
    // Calculate ideal visible range based on scroll position
    const visibleStartIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT));
    const visibleEndIndex = Math.min(
      pagedData.length,
      Math.ceil((scrollTop + effectiveHeight) / ROW_HEIGHT)
    );
    
    // Add buffer for smooth scrolling
    const idealStart = Math.max(0, visibleStartIndex - OVERSCAN_ROWS);
    const idealEnd = Math.min(pagedData.length, visibleEndIndex + OVERSCAN_ROWS);

    // Merge with previous range to keep existing rows and prevent blank screen
    if (stableRangeRef.current) {
      const stableStart = stableRangeRef.current.start;
      const stableEnd = stableRangeRef.current.end;
      
      // Calculate scroll direction to prioritize keeping rows in scroll direction
      const scrollDelta = scrollTop - prevScrollTopRef.current;
      const scrollingDown = scrollDelta > 0;
      
      // Always merge ranges to keep existing rows in DOM
      // This prevents blank screen by ensuring old rows are not unmounted immediately
      const mergedStart = Math.min(stableStart, idealStart);
      const mergedEnd = Math.max(stableEnd, idealEnd);
      
      const mergedSize = mergedEnd - mergedStart;
      
      // Always use merged range if it's within limit
      // This ensures we never shrink the range, only grow it
      if (mergedSize <= MAX_RANGE_SIZE) {
        stableRangeRef.current = { start: mergedStart, end: mergedEnd };
        prevScrollTopRef.current = scrollTop;
        
        return {
          start: mergedStart,
          end: mergedEnd,
          totalHeight,
          visibleItems: pagedData.slice(mergedStart, mergedEnd),
          offsetY: mergedStart * ROW_HEIGHT,
        };
      } else {
        // Range too large - but only trim if viewport moved significantly
        // Keep existing range if viewport is still within it
        const viewportInRange = visibleStartIndex >= stableStart && visibleEndIndex <= stableEnd;
        
        if (viewportInRange) {
          // Viewport still in range - keep existing range to prevent blank screen
          return {
            start: stableStart,
            end: stableEnd,
            totalHeight,
            visibleItems: pagedData.slice(stableStart, stableEnd),
            offsetY: stableStart * ROW_HEIGHT,
          };
        }
        
        // Viewport moved outside range - trim from the side furthest from viewport
        // But keep more buffer in scroll direction to prevent blank screen
        let trimmedStart = mergedStart;
        let trimmedEnd = mergedEnd;
        
        if (scrollingDown) {
          // Scrolling down - prioritize keeping rows below viewport
          // Calculate end first to ensure we have enough rows below
          trimmedEnd = Math.min(pagedData.length, idealEnd + OVERSCAN_ROWS * 2);
          // Then calculate start to fit within MAX_RANGE_SIZE
          trimmedStart = Math.max(0, trimmedEnd - MAX_RANGE_SIZE);
          // But ensure we don't cut off rows above viewport if possible
          if (trimmedStart > idealStart) {
            trimmedStart = Math.max(0, idealStart - OVERSCAN_ROWS);
            trimmedEnd = Math.min(pagedData.length, trimmedStart + MAX_RANGE_SIZE);
          }
        } else {
          // Scrolling up - prioritize keeping rows above viewport
          // Calculate start first to ensure we have enough rows above
          trimmedStart = Math.max(0, idealStart - OVERSCAN_ROWS * 2);
          // Then calculate end to fit within MAX_RANGE_SIZE
          trimmedEnd = Math.min(pagedData.length, trimmedStart + MAX_RANGE_SIZE);
          // But ensure we don't cut off rows below viewport if possible
          if (trimmedEnd < idealEnd) {
            trimmedEnd = Math.min(pagedData.length, idealEnd + OVERSCAN_ROWS);
            trimmedStart = Math.max(0, trimmedEnd - MAX_RANGE_SIZE);
          }
        }
        
        stableRangeRef.current = { start: trimmedStart, end: trimmedEnd };
        prevScrollTopRef.current = scrollTop;
        
        return {
          start: trimmedStart,
          end: trimmedEnd,
          totalHeight,
          visibleItems: pagedData.slice(trimmedStart, trimmedEnd),
          offsetY: trimmedStart * ROW_HEIGHT,
        };
      }
    }

    // First time - initialize range
    const initialStart = Math.max(0, idealStart);
    const initialEnd = Math.min(pagedData.length, idealEnd);
    
    stableRangeRef.current = { start: initialStart, end: initialEnd };
    prevScrollTopRef.current = scrollTop;

    return {
      start: initialStart,
      end: initialEnd,
      totalHeight,
      visibleItems: pagedData.slice(initialStart, initialEnd),
      offsetY: initialStart * ROW_HEIGHT,
    };
  }, [enableVirtualScroll, currentGroupBy, pagedData, scrollTop, containerHeight]);

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
        // Use virtual scrolling if enabled and conditions are met
        (() => {
          if (virtualScrollRange) {
            // Virtual scrolling mode
            return (
              <>
                {/* Spacer for rows before visible range */}
                {virtualScrollRange.start > 0 && (
                  <tr style={{ height: virtualScrollRange.offsetY }}>
                    <td colSpan={columns.length + (selectionMode !== 'none' ? 1 : 0) + (rowActions ? 1 : 0)} style={{ padding: 0, border: 'none' }} />
                  </tr>
                )}
                {/* Visible rows - keys are handled inside renderRow */}
                {virtualScrollRange.visibleItems.map((row, relativeIndex) => {
                  const i = virtualScrollRange.start + relativeIndex;
                  return renderRow(row, i);
                })}
                {/* Spacer for rows after visible range - only if not loading more */}
                {!isLoadingMore && virtualScrollRange.end < pagedData.length && (
                  <tr style={{ height: (pagedData.length - virtualScrollRange.end) * ROW_HEIGHT }}>
                    <td colSpan={columns.length + (selectionMode !== 'none' ? 1 : 0) + (rowActions ? 1 : 0)} style={{ padding: 0, border: 'none' }} />
                  </tr>
                )}
                {/* Skeleton rows at the end when loading more (SharePoint-like: 20-30 rows) */}
                {isLoadingMore && Array.from({ length: SKELETON_ROWS_COUNT }).map((_, skeletonIndex) => (
                  <tr key={`skeleton-${skeletonIndex}`} className="hh-skeleton-loading-row">
                    {selectionMode !== 'none' && (
                      <td className="hh-selection-column">
                        <div className="hh-skeleton-cell" style={{ width: '48px', height: ROW_HEIGHT + 'px', margin: '0 auto' }} />
                      </td>
                    )}
                    {columns.map((col, colIndex) => {
                      const skeletonWidth = colIndex % 3 === 0 ? '80%' : colIndex % 3 === 1 ? '60%' : '90%';
                      return (
                        <td key={colIndex} style={{ padding: '10px 12px' }}>
                          <div className="hh-skeleton-cell" style={{ 
                            width: skeletonWidth, 
                            height: '20px'
                          }} />
                        </td>
                      );
                    })}
                    {rowActions && (
                      <td style={{ width: '48px', padding: 0 }}>
                        <div className="hh-skeleton-cell" style={{ width: '48px', height: ROW_HEIGHT + 'px', margin: '0 auto' }} />
                      </td>
                    )}
                  </tr>
                ))}
              </>
            );
          }
          
          // Normal mode - render all rows
          return (
            <>
              {pagedData.map((row, i) => renderRow(row, i))}
              {/* Skeleton rows at the end when loading more (SharePoint-like: 20-30 rows) */}
              {isLoadingMore && Array.from({ length: SKELETON_ROWS_COUNT }).map((_, skeletonIndex) => (
                <tr key={`skeleton-${skeletonIndex}`} className="hh-skeleton-loading-row">
                  {selectionMode !== 'none' && (
                    <td className="hh-selection-column">
                      <div className="hh-skeleton-cell" style={{ width: '48px', height: ROW_HEIGHT + 'px', margin: '0 auto' }} />
                    </td>
                  )}
                  {columns.map((col, colIndex) => {
                    const skeletonWidth = colIndex % 3 === 0 ? '80%' : colIndex % 3 === 1 ? '60%' : '90%';
                    return (
                      <td key={colIndex} style={{ padding: '10px 12px' }}>
                        <div className="hh-skeleton-cell" style={{ 
                          width: skeletonWidth, 
                          height: '20px'
                        }} />
                      </td>
                    );
                  })}
                  {rowActions && (
                    <td style={{ width: '48px', padding: 0 }}>
                      <div className="hh-skeleton-cell" style={{ width: '48px', height: ROW_HEIGHT + 'px', margin: '0 auto' }} />
                    </td>
                  )}
                </tr>
              ))}
            </>
          );
        })()
      )}
    </tbody>
  );

  // Helper function to render a single row
  function renderRow(row: T, i: number) {
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
  }
}

