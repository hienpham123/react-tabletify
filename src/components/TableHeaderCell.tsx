import * as React from "react";
import { HeaderCallout } from "./HeaderCallout";
import type { Column } from "../types";
import { ChevronDownIcon, PinIcon, FilterIcon } from "../icons";

interface TableHeaderCellProps<T extends Record<string, any>> {
  column: Column<T>;
  columnIndex: number;
  resizedWidth?: number;
  pinPosition: 'left' | 'right' | null;
  leftOffset: number;
  rightOffset: number;
  lastLeftPinnedColumnKey?: keyof T;
  firstRightPinnedColumnKey?: keyof T;
  stickyHeader: boolean;
  enableColumnReorder: boolean;
  isDragOver: boolean;
  sortKey: keyof T | null;
  sortDir: 'asc' | 'desc';
  hasFilter: boolean;
  anchorRef: (el: HTMLDivElement | null) => void;
  anchorRefForCallout: React.RefObject<HTMLDivElement>;
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
  onSortAsc: () => void;
  onSortDesc: () => void;
  onFilter: () => void;
  onClearFilter: () => void;
  onPinLeft: () => void;
  onPinRight: () => void;
  onUnpin: () => void;
  onToggleVisibility: () => void;
  onHideColumn?: () => void;
  onGroupBy: () => void;
  isGrouped: boolean;
  enableColumnVisibility: boolean;
  groupable?: boolean;
  settingsable?: boolean;
  totalsable?: boolean;
  onTotalsChange: (value: 'none' | 'count') => void;
  totalsValue: 'none' | 'count';
  onDismiss: () => void;
  enableCellSelection?: boolean;
  isInRangeColumn?: boolean;
  isLeftColInRange?: boolean;
  isRightColInRange?: boolean;
  isCopied?: boolean;
}

/**
 * TableHeaderCell - Renders a single table header cell with sorting, filtering, and actions
 */
export function TableHeaderCell<T extends Record<string, any>>({
  column,
  columnIndex,
  resizedWidth,
  pinPosition,
  leftOffset,
  rightOffset,
  lastLeftPinnedColumnKey,
  firstRightPinnedColumnKey,
  stickyHeader,
  enableColumnReorder,
  isDragOver,
  sortKey,
  sortDir,
  hasFilter,
  anchorRef,
  anchorRefForCallout,
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
  onHideColumn,
  onGroupBy,
  isGrouped,
  enableColumnVisibility,
  groupable,
  settingsable,
  totalsable,
  onTotalsChange,
  totalsValue,
  onDismiss,
  enableCellSelection = false,
  isInRangeColumn = false,
  isLeftColInRange = false,
  isRightColInRange = false,
  isCopied = false,
}: TableHeaderCellProps<T>) {
  const colKeyStr = String(column.key);
  
  const headerStyle: React.CSSProperties = {
    ...column.style,
    width: resizedWidth ? `${resizedWidth}px` : column.width,
    minWidth: column.minWidth,
    maxWidth: column.maxWidth,
    textAlign: column.align,
    position: pinPosition ? 'sticky' : 'relative',
    ...(pinPosition === 'left' ? { left: `${leftOffset}px`, zIndex: stickyHeader ? 15 : 5 } : {}),
    ...(pinPosition === 'right' ? { right: `${rightOffset}px`, zIndex: stickyHeader ? 15 : 5 } : {}),
  };

  const headerClassName = column.className
    ? `hh-header-cell ${pinPosition ? `hh-header-pinned hh-pinned-${pinPosition}` : ''} ${column.className}`
    : pinPosition ? `hh-header-cell hh-header-pinned hh-pinned-${pinPosition}` : 'hh-header-cell';

  const thClassName = [
    isDragOver ? 'hh-drag-over' : '',
    pinPosition ? `hh-pinned-${pinPosition}` : '',
    pinPosition === 'left' && column.key === lastLeftPinnedColumnKey ? 'hh-pinned-last-left' : '',
    pinPosition === 'right' && column.key === firstRightPinnedColumnKey ? 'hh-pinned-first-right' : '',
    enableCellSelection && isCopied ? 'hh-cell-copied' : '',
  ].filter(Boolean).join(' ');

  return (
    <th
      key={colKeyStr}
      style={headerStyle}
      draggable={enableColumnReorder}
      onDragStart={() => onColumnDragStart(column.key)}
      onDragOver={(e) => onColumnDragOver(e, column.key)}
      onDrop={() => onColumnDrop(column.key)}
      onDragLeave={() => {
        // dragOverColumn is managed by useColumnManagement hook
      }}
      className={thClassName}
      data-in-range-column={enableCellSelection && isInRangeColumn ? 'true' : undefined}
      data-left-col-in-range={enableCellSelection && isLeftColInRange ? 'true' : undefined}
      data-right-col-in-range={enableCellSelection && isRightColInRange ? 'true' : undefined}
    >
      {onRenderHeader ? (
        onRenderHeader(column, columnIndex)
      ) : (
        <div
          className={headerClassName}
          ref={(el) => {
            anchorRef(el);
          }}
          onMouseEnter={() => onHeaderMouseEnter(colKeyStr)}
          onMouseLeave={onHeaderMouseLeave}
          onClick={(ev) => onColumnHeaderClick?.(column, ev)}
        >
          <span className="hh-header-label">
            {column.label}
            {column.showCallout !== false && (
              <span className="hh-header-chevron-icon" role="presentation" aria-hidden="true">
                <ChevronDownIcon />
              </span>
            )}
          </span>
          <div className="hh-header-icons">
            {pinPosition && (
              <span className="hh-header-pin-icon" title={`Pinned ${pinPosition}`}>
                <PinIcon width={14} height={14} />
              </span>
            )}
            {hasFilter && (
              <span className="hh-header-filter-icon" title="Filtered" role="presentation" aria-hidden="true">
                <FilterIcon width={14} height={14} />
              </span>
            )}
            {sortKey === column.key && (
              <span className="hh-header-sort-icon">
                {sortDir === "asc" ? (
                  <span className="hh-sort-arrow">↑</span>
                ) : (
                  <span className="hh-sort-arrow">↓</span>
                )}
              </span>
            )}
          </div>
          <span className="hh-header-action">⋮</span>
        </div>
      )}
      {column.resizable !== false && (
        <div
          className="hh-resize-handle"
          onMouseDown={(e) => onResizeStart(colKeyStr, e)}
          style={{
            cursor: 'col-resize',
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            zIndex: 10,
            userSelect: 'none',
          }}
        />
      )}
      {calloutKey === colKeyStr && !resizingColumn && column.showCallout !== false && (
        <HeaderCallout
          anchorRef={anchorRefForCallout}
          onSortAsc={onSortAsc}
          onSortDesc={onSortDesc}
          onFilter={onFilter}
          onClearFilter={onClearFilter}
          onPinLeft={onPinLeft}
          onPinRight={onPinRight}
          onUnpin={onUnpin}
          onToggleVisibility={onToggleVisibility}
          onHideColumn={onHideColumn}
          onGroupBy={onGroupBy}
          isGrouped={isGrouped}
          onColumnSettings={settingsable ? (!!onUnpin || enableColumnVisibility || !!onHideColumn) : undefined}
          onTotalsChange={onTotalsChange}
          totalsValue={totalsValue}
          columnLabel={column.label}
          onDismiss={onDismiss}
          onMouseEnter={onCalloutMouseEnter}
          onMouseLeave={onCalloutMouseLeave}
          sortable={column.sortable !== false}
          filterable={column.filterable !== false}
          hasFilter={hasFilter}
          pinned={pinPosition}
          visible={true}
          enableColumnVisibility={enableColumnVisibility}
          groupable={groupable}
          settingsable={settingsable}
          totalsable={totalsable}
        />
      )}
    </th>
  );
}

