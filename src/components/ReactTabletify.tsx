import * as React from "react";
import { useTable } from "../hooks/useTable";
import { useColumnManagement } from "../hooks/useColumnManagement";
import { useRowSelection } from "../hooks/useRowSelection";
import { useColumnResize } from "../hooks/useColumnResize";
import { useInlineEditing } from "../hooks/useInlineEditing";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { useHeaderCallout } from "../hooks/useHeaderCallout";
import { useRowReorder } from "../hooks/useRowReorder";
import { Pagination } from "./Pagination";
import { FilterPanel } from "./FilterPanel";
import { TableSkeleton } from "./TableSkeleton";
import { TableEmptyState } from "./TableEmptyState";
import { TableHeader } from "./TableHeader";
import { TableBody } from "./TableBody";
import { TableFooter } from "./TableFooter";
import { ExportButton } from "./ExportButton";
import type { ReactTabletifyProps, Column } from "../types";
import { getTheme, applyTheme } from "../utils/theme";
import "./../styles/table.css";
import "./../styles/row-actions.css";

/**
 * ReactTabletify - A powerful, customizable data table component for React
 * 
 * Features:
 * - Sorting (ascending/descending)
 * - Filtering (per column with search)
 * - Pagination
 * - Row grouping with expand/collapse
 * - Row selection (single/multiple)
 * - Custom cell/row/header rendering
 * - Fluent UI styled components
 * 
 * @template T - The type of data items (must be an object/record)
 * @param props - Component props
 * @returns React component
 * 
 * @example
 * ```tsx
 * interface User {
 *   id: number;
 *   name: string;
 *   age: number;
 *   role: string;
 * }
 * 
 * const data: User[] = [
 *   { id: 1, name: "Alice", age: 25, role: "Dev" },
 *   { id: 2, name: "Bob", age: 29, role: "PM" },
 * ];
 * 
 * <ReactTabletify
 *   data={data}
 *   columns={[
 *     { key: "id", label: "ID" },
 *     { key: "name", label: "Name" },
 *     { key: "age", label: "Age" },
 *     { key: "role", label: "Role" },
 *   ]}
 *   itemsPerPage={10}
 *   selectionMode="multiple"
 *   onSelectionChanged={(selected) => console.log(selected)}
 * />
 * ```
 */
export function ReactTabletify<T extends Record<string, any>>({
  columns,
  data,
  itemsPerPage = 10,
  groupBy,
  onRenderCell,
  onRenderRow,
  onRenderHeader,
  onItemInvoked,
  onColumnHeaderClick,
  getKey,
  onActiveItemChanged,
  onItemContextMenu,
  className,
  styles,
  selectionMode = 'none',
  onSelectionChanged,
  showPagination = true,
  itemsPerPageOptions,
  onItemsPerPageChange,
  theme,
  maxHeight,
  onCellEdit,
  pinnedColumns,
  onColumnPin,
  showTooltip = true,
  loading = false,
  onRenderLoading,
  emptyMessage,
  onRenderEmpty,
  stickyHeader = false,
  enableColumnVisibility,
  onColumnVisibilityChange,
  enableColumnReorder,
  onColumnReorder,
  enableKeyboardNavigation = true,
  enableRowReorder = false,
  onRowReorder,
  enableExport = false,
  exportFormat = 'both',
  exportFileName = 'export',
  onBeforeExport,
  onAfterExport,
  rowActions,
  ...otherProps
}: ReactTabletifyProps<T>) {
  // Core table hook for sorting, filtering, pagination
  // Manage itemsPerPage state internally if onItemsPerPageChange is provided
  const [internalItemsPerPage, setInternalItemsPerPage] = React.useState(itemsPerPage);

  // Update internalItemsPerPage when itemsPerPage prop changes
  React.useEffect(() => {
    setInternalItemsPerPage(itemsPerPage);
  }, [itemsPerPage]);

  // Auto-set default itemsPerPageOptions when showPagination is true
  const defaultItemsPerPageOptions = [10, 25, 50, 100];
  const effectiveItemsPerPageOptions = showPagination
    ? (itemsPerPageOptions || defaultItemsPerPageOptions)
    : itemsPerPageOptions;

  // Auto-create handler for itemsPerPageChange if not provided and showPagination is true
  const handleItemsPerPageChange = React.useCallback((newItemsPerPage: number) => {
    setInternalItemsPerPage(newItemsPerPage);
    onItemsPerPageChange?.(newItemsPerPage);
  }, [onItemsPerPageChange]);

  // When showPagination is false, show all items (set itemsPerPage to a very large number)
  const effectiveItemsPerPage = showPagination ? internalItemsPerPage : Number.MAX_SAFE_INTEGER;

  // Temporary: use data for initial table setup, will be updated after useRowReorder
  const table = useTable<T>(data, effectiveItemsPerPage);

  // Refs
  const anchorRefs = React.useRef<Record<string, HTMLDivElement>>({});
  const tableRef = React.useRef<HTMLDivElement>(null);

  // Track totals configuration for each column
  const [columnTotals, setColumnTotals] = React.useState<Record<string, 'none' | 'count'>>({});

  // Filter panel state
  const [filterField, setFilterField] = React.useState<string | null>(null);

  // Row actions menu state
  const [openMenuKey, setOpenMenuKey] = React.useState<string | null>(null);

  // Internal groupBy state (use prop if provided, otherwise use internal state)
  const [internalGroupBy, setInternalGroupBy] = React.useState<keyof T | undefined>(groupBy);
  
  // Sync internalGroupBy when prop changes
  React.useEffect(() => {
    if (groupBy !== undefined) {
      setInternalGroupBy(groupBy);
    }
  }, [groupBy]);
  
  // Use prop if provided, otherwise use internal state
  const currentGroupBy = groupBy !== undefined ? groupBy : internalGroupBy;

  // Grouping state
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());

  // Column management hook (visibility, reordering, pinning)
  const {
    internalPinnedColumns,
    visibleColumns,
    columnOrder,
    draggedColumn,
    dragOverColumn,
    sortedColumns,
    handleToggleColumnVisibility,
    handleColumnPin,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDrop,
  } = useColumnManagement(
    columns,
    pinnedColumns,
    enableColumnVisibility,
    onColumnVisibilityChange,
    enableColumnReorder,
    onColumnReorder,
    onColumnPin
  );

  // Row selection hook
  const {
    selectedItems,
    activeItemIndex,
    isAllSelected,
    isIndeterminate,
    getItemKey,
    handleCheckboxChange,
    handleItemClick,
    handleSelectAll,
    isItemSelected,
    setSelectedItems,
  } = useRowSelection(
    data,
    selectionMode,
    onSelectionChanged,
    onActiveItemChanged,
    getKey
  );

  // Row actions menu handlers (after getItemKey is defined)
  const handleMenuToggle = React.useCallback((item: T, index: number) => {
    const itemKey = getItemKey(item, index);
    const menuKey = `${String(itemKey)}-${index}`;
    setOpenMenuKey(prev => prev === menuKey ? null : menuKey);
  }, [getItemKey]);

  const handleMenuDismiss = React.useCallback(() => {
    setOpenMenuKey(null);
  }, []);

  // Column resize hook
  const {
    columnWidths,
    resizingColumn,
    handleResizeStart,
  } = useColumnResize(anchorRefs);

  // Header callout hook (after resize to get resizingColumn state)
  const callout = useHeaderCallout(resizingColumn);

  // Inline editing hook
  const {
    editingCell,
    editValue,
    editInputRef,
    setEditValue,
    handleCellEditStart,
    handleCellEditSave,
    handleCellEditCancel,
  } = useInlineEditing(onCellEdit);

  // Row drag & drop hook
  const {
    draggedRowIndex,
    dragOverRowIndex,
    isDragging,
    effectiveData,
    handleRowDragStart,
    handleRowDragOver,
    handleRowDragLeave,
    handleRowDrop,
    handleRowDragEnd,
  } = useRowReorder(
    enableRowReorder,
    data,
    table.filtered,
    currentGroupBy,
    onRowReorder
  );

  /**
   * Open filter panel for a column
   */
  const handleOpenFilter = (key: keyof T) => {
    setFilterField(String(key));
    callout.dismissCallout();
  };

  /**
   * Apply filter values to a column
   */
  const handleApplyFilter = (values: string[]) => {
    table.setFilter(filterField!, values);
    setFilterField(null);
  };

  /**
   * Get unique values for filter field
   */
  const uniqueValues = React.useMemo(() => {
    if (!filterField) return [];
    return Array.from(new Set(data.map((d) => String(d[filterField as keyof T]))));
  }, [filterField, data]);

  // Reset page when groupBy changes
  React.useEffect(() => {
    if (currentGroupBy) {
      table.setCurrentPage(1);
    }
  }, [currentGroupBy]);

  // Group rows logic - group sorted data, then paginate groups
  const groupedData = React.useMemo(() => {
    if (!currentGroupBy) return null;

    const groups: Record<string, T[]> = {};
    const sortedData = table.sortKey
      ? [...table.filtered].sort((a, b) => {
        const aVal = a[table.sortKey!];
        const bVal = b[table.sortKey!];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (aVal === bVal) return 0;
        const compare = String(aVal).localeCompare(String(bVal), undefined, {
          numeric: true,
          sensitivity: "base",
        });
        return table.sortDir === "asc" ? compare : -compare;
      })
      : table.filtered;

    sortedData.forEach((row) => {
      const groupKey = String(row[currentGroupBy]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(row);
    });

    return groups;
  }, [table.filtered, table.sortKey, table.sortDir, currentGroupBy]);

  // Reset page when number of groups changes (due to filter)
  React.useEffect(() => {
    if (currentGroupBy && groupedData) {
      const totalGroups = Object.keys(groupedData).length;
      const totalPages = Math.ceil(totalGroups / table.itemsPerPage);
      if (table.currentPage > totalPages && totalPages > 0) {
        table.setCurrentPage(1);
      }
    }
  }, [groupedData, currentGroupBy, table.itemsPerPage, table.currentPage, table.setCurrentPage]);

  // Paginate groups - sort groups by key first
  const paginatedGroups = React.useMemo(() => {
    if (!currentGroupBy || !groupedData) return null;

    const groupEntries = Object.entries(groupedData);
    // Sort groups by key for consistent ordering
    groupEntries.sort(([a], [b]) => a.localeCompare(b));

    const start = (table.currentPage - 1) * table.itemsPerPage;
    const end = start + table.itemsPerPage;

    return groupEntries.slice(start, end);
  }, [groupedData, table.currentPage, table.itemsPerPage, currentGroupBy]);

  // Expand all groups by default when groupBy changes
  React.useEffect(() => {
    if (currentGroupBy && groupedData) {
      setExpandedGroups(new Set(Object.keys(groupedData)));
    } else if (!currentGroupBy) {
      setExpandedGroups(new Set());
    }
  }, [currentGroupBy, groupedData]);

  // Get cell text content for tooltip
  const getCellText = React.useCallback((item: T, column: Column<T>) => {
    if (column.onRenderCell) {
      const rendered = column.onRenderCell(item, column.key, 0);
      if (typeof rendered === 'string' || typeof rendered === 'number') {
        return String(rendered);
      }
      // For React nodes, try to extract text
      return String(item[column.key] ?? '');
    }
    if (onRenderCell) {
      const rendered = onRenderCell(item, column.key, 0);
      if (typeof rendered === 'string' || typeof rendered === 'number') {
        return String(rendered);
      }
      return String(item[column.key] ?? '');
    }
    return String(item[column.key] ?? '');
  }, [onRenderCell]);

  // Render cell content
  const renderCell = React.useCallback((item: T, column: Column<T>, index: number) => {
    const isEditing = editingCell?.rowIndex === index && editingCell?.columnKey === column.key;

    // If editing, show input
    if (isEditing && column.editable && onCellEdit) {
      return (
        <input
          ref={editInputRef}
          type="text"
          className="th-cell-edit-input"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => handleCellEditSave(item, column.key, index)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCellEditSave(item, column.key, index);
            } else if (e.key === 'Escape') {
              handleCellEditCancel();
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />
      );
    }

    // Column-specific render
    if (column.onRenderCell) {
      return column.onRenderCell(item, column.key, index);
    }
    // Global onRenderCell
    if (onRenderCell) {
      return onRenderCell(item, column.key, index);
    }
    // Default render
    return String(item[column.key] ?? '');
  }, [onRenderCell, editingCell, editValue, handleCellEditSave, handleCellEditCancel]);

  /**
   * Get and apply theme
   */
  const tableTheme = React.useMemo(() => getTheme(theme), [theme]);
  const themeStyles = React.useMemo(() => applyTheme(tableTheme), [tableTheme]);

  /**
   * Get current items for keyboard navigation (grouped or paginated)
   */
  const currentItemsForKeyboard = React.useMemo(() => {
    if (currentGroupBy && paginatedGroups) {
      return paginatedGroups.flatMap(([_, rows]) => rows);
    }
    return table.paged;
  }, [currentGroupBy, paginatedGroups, table.paged]);

  /**
   * Keyboard navigation hook
   */
  const { focusedRowIndex, setFocusedRowIndex } = useKeyboardNavigation(
    tableRef as React.RefObject<HTMLDivElement>,
    enableKeyboardNavigation,
    loading,
    currentItemsForKeyboard,
    selectionMode,
    getItemKey,
    (selectedKeys) => setSelectedItems(selectedKeys)
  );

  /**
   * Toggle group expand/collapse
   */
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  /**
   * Determine display state
   */
  const hasData = data.length > 0;
  const showEmpty = !loading && !hasData;
  const showTable = !loading && hasData;

  // Calculate left offset for pinned columns
  const getLeftOffset = React.useCallback((col: Column<T>, colIndex: number) => {
    const colKeyStr = String(col.key);
    const pinPosition = internalPinnedColumns[colKeyStr] || col.pinned || null;
    if (pinPosition !== 'left') return 0;

    let offset = 0;
    if (selectionMode !== 'none') {
      offset += 48; // Selection column width
    }

    // Only calculate offset for columns BEFORE this one in sortedColumns
    for (let i = 0; i < colIndex; i++) {
      const c = sortedColumns[i];
      const pos = internalPinnedColumns[String(c.key)] || c.pinned || null;
      if (pos === 'left') {
        const width = columnWidths[String(c.key)] ||
          (typeof c.width === 'number' ? c.width : parseFloat(c.width || '0')) ||
          (typeof c.width === 'string' && c.width.includes('px') ? parseFloat(c.width) : 100);
        offset += width;
      }
    }

    return offset;
  }, [sortedColumns, internalPinnedColumns, columnWidths, selectionMode]);

  // Calculate right offset for pinned columns
  const getRightOffset = React.useCallback((col: Column<T>, colIndex: number) => {
    const colKeyStr = String(col.key);
    const pinPosition = internalPinnedColumns[colKeyStr] || col.pinned || null;
    if (pinPosition !== 'right') return 0;

    let offset = 0;

    // Only calculate offset for columns AFTER this one in sortedColumns
    for (let i = colIndex + 1; i < sortedColumns.length; i++) {
      const c = sortedColumns[i];
      const pos = internalPinnedColumns[String(c.key)] || c.pinned || null;
      if (pos === 'right') {
        const width = columnWidths[String(c.key)] ||
          (typeof c.width === 'number' ? c.width : parseFloat(c.width || '0')) ||
          (typeof c.width === 'string' && c.width.includes('px') ? parseFloat(c.width) : 100);
        offset += width;
      }
    }

    return offset;
  }, [sortedColumns, internalPinnedColumns, columnWidths]);

  // Find the last left-pinned column (the rightmost column in the left-pinned group)
  const lastLeftPinnedColumnKey = React.useMemo(() => {
    let lastLeftPinned: keyof T | null = null;
    for (let i = 0; i < sortedColumns.length; i++) {
      const col = sortedColumns[i];
      const pinPosition = internalPinnedColumns[String(col.key)] || col.pinned || null;
      if (pinPosition === 'left') {
        lastLeftPinned = col.key;
      } else if (lastLeftPinned !== null) {
        // We've reached the end of left-pinned columns
        break;
      }
    }
    return lastLeftPinned;
  }, [sortedColumns, internalPinnedColumns]);

  // Find the first right-pinned column
  const firstRightPinnedColumnKey = React.useMemo(() => {
    for (let i = 0; i < sortedColumns.length; i++) {
      const col = sortedColumns[i];
      const pinPosition = internalPinnedColumns[String(col.key)] || col.pinned || null;
      if (pinPosition === 'right') {
        return col.key;
      }
    }
    return null;
  }, [sortedColumns, internalPinnedColumns]);

  return (
    <div
      ref={tableRef}
      className={`th-table ${className || ''} th-theme-${tableTheme.mode || 'light'} ${resizingColumn ? 'resizing' : ''} ${stickyHeader ? 'th-sticky-header' : ''}`}
      style={{
        ...themeStyles,
        ...styles,
        ...(maxHeight ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight, overflow: 'auto' } : {}),
        ...(resizingColumn ? { cursor: 'col-resize' } : {}),
      }}
      tabIndex={enableKeyboardNavigation ? 0 : undefined}
    >
      {enableExport && (
        <div className="th-export-toolbar">
          <ExportButton
            data={table.filtered}
            columns={sortedColumns}
            format={exportFormat}
            filename={exportFileName}
            onBeforeExport={onBeforeExport}
            onAfterExport={onAfterExport}
          />
        </div>
      )}
      {loading && (
        <TableSkeleton
          columns={sortedColumns}
          itemsPerPage={itemsPerPage}
          selectionMode={selectionMode}
          onRenderLoading={onRenderLoading}
        />
      )}
      {showEmpty && (
        <TableEmptyState
          emptyMessage={emptyMessage}
          onRenderEmpty={onRenderEmpty}
        />
      )}
      {showTable && (
        <div style={{
          overflowX: 'auto',
          overflowY: stickyHeader && !maxHeight ? 'auto' : 'visible',
          width: '100%',
          ...(stickyHeader && !maxHeight ? { maxHeight: 'calc(100vh - 200px)' } : {})
        }}>
          <table>
            <TableHeader
              columns={sortedColumns}
              selectionMode={selectionMode}
              isAllSelected={isAllSelected}
              isIndeterminate={isIndeterminate}
              onSelectAll={handleSelectAll}
              columnWidths={columnWidths}
              pinnedColumns={internalPinnedColumns}
              lastLeftPinnedColumnKey={lastLeftPinnedColumnKey}
              firstRightPinnedColumnKey={firstRightPinnedColumnKey}
              stickyHeader={stickyHeader}
              enableColumnReorder={enableColumnReorder || false}
              dragOverColumn={dragOverColumn}
              sortKey={table.sortKey}
              sortDir={table.sortDir}
              filters={table.filters}
              anchorRefs={anchorRefs}
              calloutKey={callout.calloutKey}
              resizingColumn={resizingColumn}
              onRenderHeader={onRenderHeader}
              onColumnHeaderClick={onColumnHeaderClick}
              onHeaderMouseEnter={callout.handleHeaderMouseEnter}
              onHeaderMouseLeave={callout.handleHeaderMouseLeave}
              onCalloutMouseEnter={callout.handleCalloutMouseEnter}
              onCalloutMouseLeave={callout.handleCalloutMouseLeave}
              onColumnDragStart={handleColumnDragStart}
              onColumnDragOver={handleColumnDragOver}
              onColumnDrop={handleColumnDrop}
              onResizeStart={handleResizeStart}
              onSortAsc={(col) => {
                            if (col.sortable !== false) {
                              table.handleSort(col.key, "asc");
                            }
                          }}
              onSortDesc={(col) => {
                            if (col.sortable !== false) {
                              table.handleSort(col.key, "desc");
                            }
                          }}
              onFilter={(col) => {
                            if (col.filterable !== false) {
                              handleOpenFilter(col.key);
                            }
                          }}
              onClearFilter={(col) => {
                            if (col.filterable !== false) {
                              table.setFilter(String(col.key), []);
                }
              }}
              onPinLeft={(col) => handleColumnPin(col.key, 'left')}
              onPinRight={(col) => handleColumnPin(col.key, 'right')}
              onUnpin={(col) => handleColumnPin(col.key, null)}
              onToggleVisibility={(col) => {
                            if (enableColumnVisibility) {
                              handleToggleColumnVisibility(col.key);
                            }
                          }}
              onGroupBy={(col) => {
                            if (currentGroupBy === col.key) {
                              setInternalGroupBy(undefined);
                            } else {
                              setInternalGroupBy(col.key);
                            }
              }}
              currentGroupBy={currentGroupBy}
              enableColumnVisibility={enableColumnVisibility || false}
              enableGroupBy={true}
              enableTotals={true}
              onTotalsChange={(col, value) => {
                            setColumnTotals(prev => ({
                              ...prev,
                              [String(col.key)]: value
                            }));
              }}
              columnTotals={columnTotals}
              getLeftOffset={getLeftOffset}
              getRightOffset={getRightOffset}
              dismissCallout={callout.dismissCallout}
              enableRowActions={!!rowActions}
            />
            <TableBody
              data={data}
              columns={sortedColumns}
              paginatedGroups={paginatedGroups || undefined}
              currentGroupBy={currentGroupBy}
              expandedGroups={expandedGroups}
              selectionMode={selectionMode}
              selectedItems={selectedItems}
              activeItemIndex={activeItemIndex}
              focusedRowIndex={focusedRowIndex ?? undefined}
              enableRowReorder={enableRowReorder}
              draggedRowIndex={draggedRowIndex}
              dragOverRowIndex={dragOverRowIndex}
              isDragging={isDragging}
              columnWidths={columnWidths}
              pinnedColumns={internalPinnedColumns}
              lastLeftPinnedColumnKey={lastLeftPinnedColumnKey || undefined}
              firstRightPinnedColumnKey={firstRightPinnedColumnKey || undefined}
              showTooltip={showTooltip}
              onRenderRow={onRenderRow}
              getItemKey={getItemKey}
              onItemClick={handleItemClick}
              onItemContextMenu={onItemContextMenu}
              onCheckboxChange={handleCheckboxChange}
              onCellEditStart={handleCellEditStart}
              onRowDragStart={handleRowDragStart}
              onRowDragOver={handleRowDragOver}
              onRowDragLeave={handleRowDragLeave}
              onRowDrop={handleRowDrop}
              onRowDragEnd={handleRowDragEnd}
              renderCell={renderCell}
              getCellText={getCellText}
              getLeftOffset={getLeftOffset}
              getRightOffset={getRightOffset}
              toggleGroup={toggleGroup}
              filteredData={table.filtered}
              pagedData={table.paged}
              rowActions={rowActions}
              openMenuKey={openMenuKey}
              onMenuToggle={handleMenuToggle}
              onMenuDismiss={handleMenuDismiss}
            />
            <TableFooter
              columns={sortedColumns}
              selectionMode={selectionMode}
              columnTotals={columnTotals}
              pinnedColumns={internalPinnedColumns}
              columnWidths={columnWidths}
              lastLeftPinnedColumnKey={lastLeftPinnedColumnKey || undefined}
              firstRightPinnedColumnKey={firstRightPinnedColumnKey || undefined}
              totalCount={table.filtered.length}
              getLeftOffset={getLeftOffset}
              getRightOffset={getRightOffset}
            />
          </table>
        </div>
      )}

      {showTable && showPagination && (
        <Pagination
          totalItems={currentGroupBy && groupedData ? Object.keys(groupedData).length : table.filtered.length}
          itemsPerPage={table.itemsPerPage}
          currentPage={table.currentPage}
          onPageChange={table.setCurrentPage}
          itemsPerPageOptions={effectiveItemsPerPageOptions}
          onItemsPerPageChange={(newItemsPerPage) => {
            handleItemsPerPageChange(newItemsPerPage);
            table.setCurrentPage(1); // Reset to page 1 when changing items per page
          }}
        />
      )}

      {filterField && (
        <FilterPanel
          field={filterField}
          values={uniqueValues}
          selected={table.filters[filterField] || []}
          onApply={handleApplyFilter}
          onDismiss={() => setFilterField(null)}
        />
      )}
    </div>
  );
}
