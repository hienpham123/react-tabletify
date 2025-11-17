import * as React from "react";
import { SelectionCell } from "./SelectionCell";
import { TableHeaderCell } from "./TableHeaderCell";
import type { Column } from "../types";

interface TableHeaderProps<T extends Record<string, any>> {
  columns: Column<T>[];
  selectionMode: 'none' | 'single' | 'multiple';
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onSelectAll: (checked: boolean) => void;
  columnWidths: Record<string, number>;
  pinnedColumns: Record<string, 'left' | 'right'>;
  lastLeftPinnedColumnKey?: keyof T | null;
  firstRightPinnedColumnKey?: keyof T | null;
  stickyHeader: boolean;
  enableColumnReorder: boolean;
  dragOverColumn: keyof T | null;
  sortKey: keyof T | null;
  sortDir: 'asc' | 'desc';
  filters: Record<string, string[]>;
  anchorRefs: React.RefObject<Record<string, HTMLDivElement>>;
  calloutKey: string | null;
  resizingColumn: string | null;
  onRenderHeader?: (column: Column<T>, index: number) => React.ReactNode;
  onColumnHeaderClick?: (column: Column<T>, ev?: React.MouseEvent) => void;
  onHeaderMouseEnter: (key: string) => void;
  onHeaderMouseLeave: () => void;
  onCalloutMouseEnter: () => void;
  onCalloutMouseLeave: () => void;
  onColumnDragStart: (key: keyof T) => void;
  onColumnDragOver: (e: React.DragEvent, key: keyof T) => void;
  onColumnDrop: (key: keyof T) => void;
  onResizeStart: (key: string, e: React.MouseEvent) => void;
  onSortAsc: (column: Column<T>) => void;
  onSortDesc: (column: Column<T>) => void;
  onFilter: (column: Column<T>) => void;
  onClearFilter: (column: Column<T>) => void;
  onPinLeft: (column: Column<T>) => void;
  onPinRight: (column: Column<T>) => void;
  onUnpin: (column: Column<T>) => void;
  onToggleVisibility: (column: Column<T>) => void;
  onGroupBy: (column: Column<T>) => void;
  currentGroupBy?: keyof T;
  enableColumnVisibility: boolean;
  onTotalsChange: (column: Column<T>, value: 'none' | 'count') => void;
  columnTotals: Record<string, 'none' | 'count'>;
  getLeftOffset: (column: Column<T>, index: number) => number;
  getRightOffset: (column: Column<T>, index: number) => number;
  dismissCallout: () => void;
  enableRowActions?: boolean;
  enableCellSelection?: boolean;
  isRangeFromFirstRow?: boolean;
  isColumnInRange?: (colKey: string) => boolean;
  getColumnRangeInfo?: (colKey: string) => { isInRange: boolean; isLeftCol: boolean; isRightCol: boolean };
  isCopied?: boolean;
}

/**
 * TableHeader - Renders the table header with all column headers
 */
export function TableHeader<T extends Record<string, any>>({
  columns,
  selectionMode,
  isAllSelected,
  isIndeterminate,
  onSelectAll,
  columnWidths,
  pinnedColumns,
  lastLeftPinnedColumnKey,
  firstRightPinnedColumnKey,
  stickyHeader,
  enableColumnReorder,
  dragOverColumn,
  sortKey,
  sortDir,
  filters,
  anchorRefs,
  calloutKey,
  resizingColumn,
  onRenderHeader,
  onColumnHeaderClick,
  onHeaderMouseEnter,
  onHeaderMouseLeave,
  onCalloutMouseEnter,
  onCalloutMouseLeave,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDrop,
  onResizeStart,
  onSortAsc,
  onSortDesc,
  onFilter,
  onClearFilter,
  onPinLeft,
  onPinRight,
  onUnpin,
  onToggleVisibility,
  onGroupBy,
  currentGroupBy,
  enableColumnVisibility,
  onTotalsChange,
  columnTotals,
  getLeftOffset,
  getRightOffset,
  dismissCallout,
  enableRowActions = false,
  enableCellSelection = false,
  isRangeFromFirstRow = false,
  isColumnInRange,
  getColumnRangeInfo,
  isCopied = false,
}: TableHeaderProps<T>) {
  return (
    <thead>
      <tr>
        {selectionMode !== 'none' && (
          <SelectionCell
            selectionMode={selectionMode}
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onChange={() => {}}
            onSelectAll={onSelectAll}
          />
        )}
        {enableRowActions && (
          <th className="hh-row-actions-column">
            <div className="hh-header-cell">
              <span className="hh-header-label"></span>
            </div>
          </th>
        )}
        {columns.map((col, colIndex) => {
          const colKeyStr = String(col.key);
          const resizedWidth = columnWidths[colKeyStr];
          const pinPosition = pinnedColumns[colKeyStr] || col.pinned || null;
          const leftOffset = pinPosition === 'left' ? getLeftOffset(col, colIndex) : 0;
          const rightOffset = pinPosition === 'right' ? getRightOffset(col, colIndex) : 0;
          
          // Get column range info for header styling when range starts from first row
          const columnRangeInfo = enableCellSelection && isRangeFromFirstRow && getColumnRangeInfo ? getColumnRangeInfo(colKeyStr) : { isInRange: false, isLeftCol: false, isRightCol: false };
          const headerIsCopied = enableCellSelection && isRangeFromFirstRow && isCopied && columnRangeInfo.isInRange;
          
          // Callback ref to store in anchorRefs
          const anchorRefCallback = (el: HTMLDivElement | null) => {
            if (el) {
              anchorRefs.current[colKeyStr] = el;
            }
          };
          
          // Ref object for HeaderCallout (points to anchorRefs)
          const anchorRefForCallout: React.RefObject<HTMLDivElement> = {
            get current() {
              return anchorRefs.current[colKeyStr] || null;
            },
            set current(_value: HTMLDivElement | null) {
              // Read-only ref for callout
            }
          } as React.RefObject<HTMLDivElement>;

          return (
            <TableHeaderCell
              key={colKeyStr}
              column={col}
              columnIndex={colIndex}
              resizedWidth={resizedWidth}
              pinPosition={pinPosition}
              leftOffset={leftOffset}
              rightOffset={rightOffset}
              lastLeftPinnedColumnKey={lastLeftPinnedColumnKey ?? undefined}
              firstRightPinnedColumnKey={firstRightPinnedColumnKey ?? undefined}
              stickyHeader={stickyHeader}
              enableColumnReorder={enableColumnReorder}
              isDragOver={dragOverColumn === col.key}
              sortKey={sortKey}
              sortDir={sortDir}
              hasFilter={!!(filters[colKeyStr] && filters[colKeyStr].length > 0)}
              anchorRef={anchorRefCallback}
              anchorRefForCallout={anchorRefForCallout}
              calloutKey={calloutKey === col.key ? colKeyStr : null}
              resizingColumn={resizingColumn}
              onRenderHeader={onRenderHeader}
              onColumnHeaderClick={onColumnHeaderClick}
              onHeaderMouseEnter={onHeaderMouseEnter}
              onHeaderMouseLeave={onHeaderMouseLeave}
              onCalloutMouseEnter={onCalloutMouseEnter}
              onCalloutMouseLeave={onCalloutMouseLeave}
              onColumnDragStart={onColumnDragStart}
              onColumnDragOver={onColumnDragOver}
              onColumnDrop={onColumnDrop}
              onResizeStart={onResizeStart}
              enableCellSelection={enableCellSelection}
              isInRangeColumn={columnRangeInfo.isInRange}
              isLeftColInRange={columnRangeInfo.isLeftCol}
              isRightColInRange={columnRangeInfo.isRightCol}
              isCopied={headerIsCopied}
              onSortAsc={() => {
                if (col.sortable !== false) {
                  onSortAsc(col);
                  dismissCallout();
                }
              }}
              onSortDesc={() => {
                if (col.sortable !== false) {
                  onSortDesc(col);
                  dismissCallout();
                }
              }}
              onFilter={() => {
                if (col.filterable !== false) {
                  onFilter(col);
                }
              }}
              onClearFilter={() => {
                if (col.filterable !== false) {
                  onClearFilter(col);
                  dismissCallout();
                }
              }}
              onPinLeft={() => {
                onPinLeft(col);
                dismissCallout();
              }}
              onPinRight={() => {
                onPinRight(col);
                dismissCallout();
              }}
              onUnpin={() => {
                onUnpin(col);
                dismissCallout();
              }}
              onToggleVisibility={() => {
                if (enableColumnVisibility) {
                  onToggleVisibility(col);
                  dismissCallout();
                }
              }}
              onGroupBy={() => {
                if (col.groupable !== false) {
                  onGroupBy(col);
                  dismissCallout();
                }
              }}
              isGrouped={currentGroupBy === col.key}
              enableColumnVisibility={enableColumnVisibility}
              groupable={col.groupable}
              settingsable={col.settingsable}
              totalsable={col.totalsable}
              onTotalsChange={(value) => {
                if (col.totalsable !== false) {
                  onTotalsChange(col, value);
                  dismissCallout();
                }
              }}
              totalsValue={columnTotals[colKeyStr] || 'none'}
              onDismiss={dismissCallout}
            />
          );
        })}
      </tr>
    </thead>
  );
}

