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
import { HeaderCallout } from "./HeaderCallout";
import { FilterPanel } from "./FilterPanel";
import { TableSkeleton } from "./TableSkeleton";
import { TableEmptyState } from "./TableEmptyState";
import type { ReactTabletifyProps, Column } from "../types";
import { getTheme, applyTheme } from "../utils/theme";
import "./../styles/table.css";

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
            <thead>
              <tr>
                {selectionMode !== 'none' && (
                  <th className="th-selection-column">
                    {selectionMode === 'multiple' ? (
                      <div className="th-selection-checkbox-wrapper">
                        <input
                          type="checkbox"
                          className="th-selection-checkbox"
                          checked={isAllSelected}
                          ref={(input) => {
                            if (input) input.indeterminate = isIndeterminate;
                          }}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ) : (
                      <div className="th-selection-checkbox-wrapper"></div>
                    )}
                  </th>
                )}
                {sortedColumns.map((col, colIndex) => {
                  const colKeyStr = String(col.key);
                  const resizedWidth = columnWidths[colKeyStr];
                  const pinPosition = internalPinnedColumns[String(col.key)] || col.pinned || null;
                  const leftOffset = pinPosition === 'left' ? getLeftOffset(col, colIndex) : 0;
                  const rightOffset = pinPosition === 'right' ? getRightOffset(col, colIndex) : 0;
                  const headerStyle: React.CSSProperties = {
                    ...col.style,
                    width: resizedWidth ? `${resizedWidth}px` : col.width,
                    minWidth: col.minWidth,
                    maxWidth: col.maxWidth,
                    textAlign: col.align,
                    position: pinPosition ? 'sticky' : 'relative',
                    ...(pinPosition === 'left' ? { left: `${leftOffset}px`, zIndex: stickyHeader ? 15 : 5 } : {}),
                    ...(pinPosition === 'right' ? { right: `${rightOffset}px`, zIndex: stickyHeader ? 15 : 5 } : {}),
                  };
                  const headerClassName = col.className
                    ? `th-header-cell ${pinPosition ? `th-header-pinned th-pinned-${pinPosition}` : ''} ${col.className}`
                    : pinPosition ? `th-header-cell th-header-pinned th-pinned-${pinPosition}` : 'th-header-cell';

                  return (
                    <th
                      key={colKeyStr}
                      style={headerStyle}
                      draggable={enableColumnReorder}
                      onDragStart={() => handleColumnDragStart(col.key)}
                      onDragOver={(e) => handleColumnDragOver(e, col.key)}
                      onDrop={() => handleColumnDrop(col.key)}
                      onDragLeave={() => {
                        // dragOverColumn is managed by useColumnManagement hook
                      }}
                      className={`${dragOverColumn === col.key ? 'th-drag-over' : ''} ${pinPosition ? `th-pinned-${pinPosition}` : ''} ${pinPosition === 'left' && col.key === lastLeftPinnedColumnKey ? 'th-pinned-last-left' : ''} ${pinPosition === 'right' && col.key === firstRightPinnedColumnKey ? 'th-pinned-first-right' : ''}`.trim()}
                    >
                      {onRenderHeader ? (
                        onRenderHeader(col, colIndex)
                      ) : (
                        <div
                          className={headerClassName}
                          ref={(el) => {
                            if (el) anchorRefs.current[String(col.key)] = el;
                          }}
                          onMouseEnter={() => callout.handleHeaderMouseEnter(String(col.key))}
                          onMouseLeave={callout.handleHeaderMouseLeave}
                          onClick={(ev) => onColumnHeaderClick?.(col, ev)}
                        >
                          <span className="th-header-label">
                            {col.label}
                            <span className="th-header-chevron-icon" role="presentation" aria-hidden="true">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" fill="currentColor">
                                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
                              </svg>
                            </span>
                          </span>
                          <div className="th-header-icons">
                            {pinPosition && (
                              <span className="th-header-pin-icon" title={`Pinned ${pinPosition}`}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 2048 2048"
                                  fill="currentColor"
                                >
                                  <path d="M1990 748q-33 33-64 60t-66 47-73 29-89 11q-34 0-65-6l-379 379q13 38 19 78t6 80q0 65-13 118t-37 100-60 89-79 87l-386-386-568 569-136 45 45-136 569-568-386-386q44-44 86-79t89-59 100-38 119-13q40 0 80 6t78 19l379-379q-6-31-6-65 0-49 10-88t30-74 46-65 61-65l690 690z" />
                                </svg>
                              </span>
                            )}
                            {table.filters[String(col.key)] && table.filters[String(col.key)].length > 0 && (
                              <span className="th-header-filter-icon" title="Filtered" role="presentation" aria-hidden="true">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 2048 2048"
                                  fill="currentColor"
                                >
                                  <path d="M2048 128v219l-768 768v805H768v-805L0 347V128h2048z" />
                                </svg>
                              </span>
                            )}
                            {table.sortKey === col.key && (
                              <span className="th-header-sort-icon">
                                {table.sortDir === "asc" ? (
                                  <span className="th-sort-arrow">↑</span>
                                ) : (
                                  <span className="th-sort-arrow">↓</span>
                                )}
                              </span>
                            )}
                          </div>
                          <span className="th-header-action">⋮</span>
                        </div>
                      )}
                      {col.resizable !== false && (
                        <div
                          className="th-resize-handle"
                          onMouseDown={(e) => handleResizeStart(String(col.key), e)}
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
                      {callout.calloutKey === col.key && !resizingColumn && (
                        <HeaderCallout
                          anchorRef={{ current: anchorRefs.current[String(col.key)] }}
                          onSortAsc={() => {
                            if (col.sortable !== false) {
                              table.handleSort(col.key, "asc");
                              callout.dismissCallout();
                            }
                          }}
                          onSortDesc={() => {
                            if (col.sortable !== false) {
                              table.handleSort(col.key, "desc");
                              callout.dismissCallout();
                            }
                          }}
                          onFilter={() => {
                            if (col.filterable !== false) {
                              handleOpenFilter(col.key);
                            }
                          }}
                          onClearFilter={() => {
                            if (col.filterable !== false) {
                              table.setFilter(String(col.key), []);
                              callout.dismissCallout();
                            }
                          }}
                          onPinLeft={() => {
                            handleColumnPin(col.key, 'left');
                            callout.dismissCallout();
                          }}
                          onPinRight={() => {
                            handleColumnPin(col.key, 'right');
                            callout.dismissCallout();
                          }}
                          onUnpin={() => {
                            handleColumnPin(col.key, null);
                            callout.dismissCallout();
                          }}
                          onToggleVisibility={() => {
                            if (enableColumnVisibility) {
                              handleToggleColumnVisibility(col.key);
                              callout.dismissCallout();
                            }
                          }}
                          onGroupBy={() => {
                            // Toggle groupBy: if already grouped by this column, ungroup; otherwise group by it
                            if (currentGroupBy === col.key) {
                              setInternalGroupBy(undefined);
                            } else {
                              setInternalGroupBy(col.key);
                            }
                            callout.dismissCallout();
                          }}
                          isGrouped={currentGroupBy === col.key}
                          onColumnSettings={(onColumnPin || enableColumnVisibility) ? true : undefined}
                          onTotalsChange={(value) => {
                            setColumnTotals(prev => ({
                              ...prev,
                              [String(col.key)]: value
                            }));
                            callout.dismissCallout();
                          }}
                          totalsValue={columnTotals[String(col.key)] || 'none'}
                          columnLabel={col.label}
                          onDismiss={() => callout.dismissCallout()}
                          onMouseEnter={() => callout.handleHeaderMouseEnter(String(col.key))}
                          onMouseLeave={callout.handleHeaderMouseLeave}
                          sortable={col.sortable !== false}
                          filterable={col.filterable !== false}
                          hasFilter={table.filters[String(col.key)] && table.filters[String(col.key)].length > 0}
                          pinned={internalPinnedColumns[String(col.key)] || col.pinned || null}
                          visible={visibleColumns.has(col.key)}
                          enableColumnVisibility={enableColumnVisibility}
                          enableColumnReorder={enableColumnReorder}
                          enableGroupBy={true}
                          enableTotals={true}
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {currentGroupBy && paginatedGroups ? (
                paginatedGroups.map(([groupKey, rows]) => {
                  const isExpanded = expandedGroups.has(groupKey);
                  // Find the column label for the groupBy column
                  const groupByColumn = columns.find(c => c.key === currentGroupBy);
                  const groupByLabel = groupByColumn?.label || String(currentGroupBy);
                  return (
                    <React.Fragment key={groupKey}>
                      <tr className="th-group-header">
                        <td colSpan={sortedColumns.length + (selectionMode !== 'none' ? 1 : 0)} className="th-group-header-cell">
                          <button
                            className="th-group-toggle"
                            onClick={() => toggleGroup(groupKey)}
                            aria-expanded={isExpanded}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className={isExpanded ? "expanded" : ""}
                            >
                              <path
                                d="M6 4L10 8L6 12"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                              />
                            </svg>
                            <span className="th-group-label">
                              {groupByLabel}: {groupKey}
                            </span>
                            <span className="th-group-count">({rows.length})</span>
                          </button>
                        </td>
                      </tr>
                      {isExpanded &&
                        rows.map((row, i) => {
                          // Find actual index in original data array (not filtered) for correct key calculation
                          const dataIndex = data.findIndex(d => d === row);
                          // Use dataIndex for key calculation to ensure consistency
                          const rowIndexForKey = dataIndex >= 0 ? dataIndex : table.filtered.findIndex(d => d === row);
                          // Use dataIndex for selection operations to ensure correct key calculation
                          const rowIndexForSelection = dataIndex >= 0 ? dataIndex : (rowIndexForKey >= 0 ? rowIndexForKey : i);
                          const itemKey = getItemKey(row, rowIndexForSelection);
                          const isSelected = selectedItems.has(itemKey);
                          // Use dataIndex for activeItemIndex comparison
                          const isActive = dataIndex >= 0 && activeItemIndex === dataIndex;

                          if (onRenderRow) {
                            return (
                              <React.Fragment key={itemKey}>
                                {onRenderRow(row, rowIndexForSelection, columns)}
                              </React.Fragment>
                            );
                          }

                          // Get actual index in filtered data for drag & drop
                          const actualIndex = table.filtered.findIndex(item => item === row);
                          const dragIndex = actualIndex >= 0 ? actualIndex : rowIndexForSelection;
                          const canDrag = enableRowReorder && !currentGroupBy;
                          
                          return (
                            <tr
                              key={itemKey}
                              className={`th-group-row ${isSelected ? 'th-row-selected' : ''} ${isActive ? 'th-row-active' : ''} ${canDrag ? 'th-row-draggable' : ''} ${draggedRowIndex === dragIndex ? 'th-row-dragging' : ''} ${dragOverRowIndex === dragIndex ? 'th-row-drag-over' : ''}`}
                              draggable={canDrag}
                              onDragStart={(e) => handleRowDragStart(e, dragIndex)}
                              onDragOver={(e) => handleRowDragOver(e, dragIndex)}
                              onDragLeave={handleRowDragLeave}
                              onDrop={(e) => handleRowDrop(e, dragIndex)}
                              onDragEnd={handleRowDragEnd}
                              onClick={(ev) => {
                                if (!isDragging) {
                                  handleItemClick(row, rowIndexForSelection, ev);
                                }
                              }}
                              onContextMenu={(ev) => onItemContextMenu?.(row, rowIndexForSelection, ev)}
                            >
                              {selectionMode !== 'none' && (
                                <td className="th-selection-column">
                                  <div className="th-selection-checkbox-wrapper">
                                    <input
                                      type={selectionMode === 'single' ? 'radio' : 'checkbox'}
                                      className="th-selection-checkbox"
                                      checked={isSelected}
                                      onChange={(e) => handleCheckboxChange(row, rowIndexForSelection, e.target.checked)}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                </td>
                              )}
                              {sortedColumns.map((col) => {
                                const colKeyStr = String(col.key);
                                const resizedWidth = columnWidths[colKeyStr];
                                const pinPosition = internalPinnedColumns[String(col.key)] || col.pinned || null;
                                // Find the index of this column in sortedColumns
                                const sortedIndex = sortedColumns.findIndex(c => String(c.key) === colKeyStr);
                                const leftOffset = pinPosition === 'left' ? getLeftOffset(col, sortedIndex) : 0;
                                const rightOffset = pinPosition === 'right' ? getRightOffset(col, sortedIndex) : 0;
                                const cellStyle: React.CSSProperties = {
                                  ...col.cellStyle,
                                  textAlign: col.align,
                                  width: resizedWidth ? `${resizedWidth}px` : col.width,
                                  position: pinPosition ? 'sticky' : 'relative',
                                  ...(pinPosition === 'left' ? { left: `${leftOffset}px`, zIndex: 3 } : {}),
                                  ...(pinPosition === 'right' ? { right: `${rightOffset}px`, zIndex: 3 } : {}),
                                };
                                const cellClassName = col.cellClassName
                                  ? `${col.cellClassName} ${col.editable ? 'th-cell-editable' : ''} ${pinPosition ? `th-cell-pinned th-pinned-${pinPosition}` : ''} ${pinPosition === 'left' && col.key === lastLeftPinnedColumnKey ? 'th-pinned-last-left' : ''} ${pinPosition === 'right' && col.key === firstRightPinnedColumnKey ? 'th-pinned-first-right' : ''}`
                                  : `${col.editable ? 'th-cell-editable' : ''} ${pinPosition ? `th-cell-pinned th-pinned-${pinPosition}` : ''} ${pinPosition === 'left' && col.key === lastLeftPinnedColumnKey ? 'th-pinned-last-left' : ''} ${pinPosition === 'right' && col.key === firstRightPinnedColumnKey ? 'th-pinned-first-right' : ''}`.trim();
                                const cellText = showTooltip ? getCellText(row, col) : undefined;
                                return (
                                  <td
                                    key={colKeyStr}
                                    style={cellStyle}
                                    className={cellClassName}
                                    onDoubleClick={() => handleCellEditStart(row, col, rowIndexForSelection)}
                                    title={cellText || undefined}
                                  >
                                    {renderCell(row, col, rowIndexForSelection)}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })
              ) : (
                table.paged.map((row, i) => {
                  const itemKey = getItemKey(row, i);
                  const isSelected = selectedItems.has(itemKey);
                  const isActive = activeItemIndex === i;

                  if (onRenderRow) {
                    return (
                      <React.Fragment key={itemKey}>
                        {onRenderRow(row, i, columns)}
                      </React.Fragment>
                    );
                  }

                  // Get actual index in filtered data for drag & drop
                  const actualIndex = table.filtered.findIndex(item => item === row);
                  const dragIndex = actualIndex >= 0 ? actualIndex : i;
                  const canDrag = enableRowReorder && !currentGroupBy;
                  
                  return (
                    <tr
                      key={itemKey}
                      className={`${isSelected ? 'th-row-selected' : ''} ${isActive ? 'th-row-active' : ''} ${focusedRowIndex === i ? 'th-row-focused' : ''} ${canDrag ? 'th-row-draggable' : ''} ${draggedRowIndex === dragIndex ? 'th-row-dragging' : ''} ${dragOverRowIndex === dragIndex ? 'th-row-drag-over' : ''}`}
                      draggable={canDrag}
                      onDragStart={(e) => handleRowDragStart(e, dragIndex)}
                      onDragOver={(e) => handleRowDragOver(e, dragIndex)}
                      onDragLeave={handleRowDragLeave}
                      onDrop={(e) => handleRowDrop(e, dragIndex)}
                      onDragEnd={handleRowDragEnd}
                      onClick={(ev) => {
                        if (!isDragging) {
                          handleItemClick(row, i, ev);
                        }
                      }}
                      onContextMenu={(ev) => onItemContextMenu?.(row, i, ev)}
                    >
                      {selectionMode !== 'none' && (
                        <td className="th-selection-column">
                          <div className="th-selection-checkbox-wrapper">
                            <input
                              type={selectionMode === 'single' ? 'radio' : 'checkbox'}
                              className="th-selection-checkbox"
                              checked={isSelected}
                              onChange={(e) => handleCheckboxChange(row, i, e.target.checked)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </td>
                      )}
                      {sortedColumns.map((col) => {
                        const colKeyStr = String(col.key);
                        const resizedWidth = columnWidths[colKeyStr];
                        const pinPosition = internalPinnedColumns[String(col.key)] || col.pinned || null;
                        // Find the index of this column in sortedColumns
                        const sortedIndex = sortedColumns.findIndex(c => String(c.key) === colKeyStr);
                        const leftOffset = pinPosition === 'left' ? getLeftOffset(col, sortedIndex) : 0;
                        const rightOffset = pinPosition === 'right' ? getRightOffset(col, sortedIndex) : 0;
                        const cellStyle: React.CSSProperties = {
                          ...col.cellStyle,
                          textAlign: col.align,
                          width: resizedWidth ? `${resizedWidth}px` : col.width,
                          position: pinPosition ? 'sticky' : 'relative',
                          ...(pinPosition === 'left' ? { left: `${leftOffset}px`, zIndex: 3 } : {}),
                          ...(pinPosition === 'right' ? { right: `${rightOffset}px`, zIndex: 3 } : {}),
                        };
                        const cellClassName = col.cellClassName
                          ? `${col.cellClassName} ${col.editable ? 'th-cell-editable' : ''} ${pinPosition ? `th-cell-pinned th-pinned-${pinPosition}` : ''} ${pinPosition === 'left' && col.key === lastLeftPinnedColumnKey ? 'th-pinned-last-left' : ''} ${pinPosition === 'right' && col.key === firstRightPinnedColumnKey ? 'th-pinned-first-right' : ''}`
                          : `${col.editable ? 'th-cell-editable' : ''} ${pinPosition ? `th-cell-pinned th-pinned-${pinPosition}` : ''} ${pinPosition === 'left' && col.key === lastLeftPinnedColumnKey ? 'th-pinned-last-left' : ''} ${pinPosition === 'right' && col.key === firstRightPinnedColumnKey ? 'th-pinned-first-right' : ''}`.trim();
                        const cellText = showTooltip ? getCellText(row, col) : undefined;
                        return (
                          <td
                            key={colKeyStr}
                            style={cellStyle}
                            className={cellClassName}
                            onDoubleClick={() => handleCellEditStart(row, col, i)}
                            title={cellText || undefined}
                          >
                            {renderCell(row, col, i)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
            {Object.values(columnTotals).some(v => v === 'count') && (
              <tfoot className="th-totals-sticky">
                <tr className="th-totals-row">
                  {selectionMode !== 'none' && (
                    <td className="th-selection-column"></td>
                  )}
                  {sortedColumns.map((col) => {
                    const colKeyStr = String(col.key);
                    const totalsValue = columnTotals[colKeyStr] || 'none';
                    const pinPosition = internalPinnedColumns[colKeyStr] || col.pinned || null;
                    const sortedIndex = sortedColumns.findIndex(c => String(c.key) === colKeyStr);
                    const leftOffset = pinPosition === 'left' ? getLeftOffset(col, sortedIndex) : 0;
                    const rightOffset = pinPosition === 'right' ? getRightOffset(col, sortedIndex) : 0;
                    const resizedWidth = columnWidths[colKeyStr];
                    const cellStyle: React.CSSProperties = {
                      textAlign: col.align,
                      width: resizedWidth ? `${resizedWidth}px` : col.width,
                      position: pinPosition ? 'sticky' : 'relative',
                      ...(pinPosition === 'left' ? { left: `${leftOffset}px`, zIndex: 11 } : {}),
                      ...(pinPosition === 'right' ? { right: `${rightOffset}px`, zIndex: 11 } : {}),
                    };
                    const cellClassName = `${pinPosition ? `th-cell-pinned th-pinned-${pinPosition}` : ''} ${pinPosition === 'left' && col.key === lastLeftPinnedColumnKey ? 'th-pinned-last-left' : ''} ${pinPosition === 'right' && col.key === firstRightPinnedColumnKey ? 'th-pinned-first-right' : ''}`.trim();

                    let cellContent: React.ReactNode = '';
                    if (totalsValue === 'count') {
                      // Calculate count for this column
                      const count = table.filtered.length;
                      cellContent = count.toLocaleString();
                    }

                    return (
                      <td
                        key={colKeyStr}
                        style={cellStyle}
                        className={cellClassName}
                      >
                        {cellContent ? `Count: ${cellContent}` : ''}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            )}
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
