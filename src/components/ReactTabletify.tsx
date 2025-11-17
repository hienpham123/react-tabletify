import * as React from "react";
import { useTable } from "../hooks/useTable";
import { useColumnManagement } from "../hooks/useColumnManagement";
import { useRowSelection } from "../hooks/useRowSelection";
import { useColumnResize } from "../hooks/useColumnResize";
import { useInlineEditing } from "../hooks/useInlineEditing";
import { useKeyboardNavigation } from "../hooks/useKeyboardNavigation";
import { useHeaderCallout } from "../hooks/useHeaderCallout";
import { useRowReorder } from "../hooks/useRowReorder";
import { useCellSelection, type CellPosition } from "../hooks/useCellSelection";
import { useClipboard } from "../hooks/useClipboard";
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
import { CheckIcon, CloseIcon } from "../icons";
import "./../styles/table.css";
import "./../styles/row-actions.css";
import "./../styles/cell-selection.css";

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
  enableCellSelection = false,
  ...otherProps
}: ReactTabletifyProps<T>) {
  // Core table hook for sorting, filtering, pagination
  // Manage itemsPerPage state internally if onItemsPerPageChange is provided
  const [internalItemsPerPage, setInternalItemsPerPage] = React.useState(itemsPerPage);

  // Internal data state for cell editing when enableCellSelection is true and no onCellEdit is provided
  const [internalData, setInternalData] = React.useState<T[]>(data);

  // Update internal data when data prop changes
  React.useEffect(() => {
    setInternalData(data);
  }, [data]);

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

  // Use internal data if no onCellEdit is provided (for automatic data management)
  // Otherwise use the data prop (parent manages data)
  const dataToUse = internalData;

  // Temporary: use dataToUse for initial table setup, will be updated after useRowReorder
  const table = useTable<T>(dataToUse, effectiveItemsPerPage);

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

  // Create row number column when enableCellSelection is true
  const rowNumberColumn: Column<T> = React.useMemo(() => ({
    key: '__rowNumber__' as keyof T,
    label: 'STT',
    width: '80px',
    align: 'center',
    sortable: false,
    filterable: false,
    resizable: false,
    editable: false,
    pinned: 'left',
    showCallout: false,
    onRenderCell: (item: T, columnKey: keyof T, index: number) => {
      // Calculate row number based on current page and index
      const pageStartIndex = (table.currentPage - 1) * table.itemsPerPage;
      const rowNumber = pageStartIndex + index + 1;
      return rowNumber;
    }
  }), [table.currentPage, table.itemsPerPage]);

  // Add row number column to columns when enableCellSelection is true
  const columnsWithRowNumber = React.useMemo(() => {
    if (enableCellSelection) {
      // Check if row number column already exists
      const hasRowNumber = columns.some(col => String(col.key) === '__rowNumber__');
      if (!hasRowNumber) {
        return [rowNumberColumn, ...columns];
      }
    }
    return columns;
  }, [enableCellSelection, columns, rowNumberColumn]);

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
    columnsWithRowNumber,
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
    dataToUse,
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

  // Helper function to validate a value for a column
  const validateCellValue = React.useCallback((value: any, item: T, columnKey: keyof T): string | null => {
    const column = columns.find(col => col.key === columnKey);
    if (column?.validate) {
      return column.validate(value, item, columnKey) || null;
    }
    return null;
  }, [columns]);

  // Cell edit handler - updates internal state or calls onCellEdit callback
  // This is used for paste operations - validation is handled separately for inline editing
  const handleCellEdit = React.useCallback((item: T, columnKey: keyof T, newValue: any, index: number) => {
      // Validate the value before editing (for paste operations)
      const error = validateCellValue(newValue, item, columnKey);
      if (error) {
        // If validation fails during paste, we could show a notification or skip the edit
        // For now, we'll skip invalid values during paste to prevent bad data
        console.warn(`Validation failed for column ${String(columnKey)}: ${error}`);
        return;
      }

      // If no onCellEdit callback, automatically update internal state
      // Note: index might be from pagedData, so we need to find the actual item in dataToUse
      setInternalData(prev => {
        const newData = [...prev];
        // Try to find the item by reference first (faster)
        const itemIndex = newData.findIndex(d => d === item);
        const actualIndex = itemIndex >= 0 ? itemIndex : index;
        
        if (actualIndex >= 0 && actualIndex < newData.length) {
          newData[actualIndex] = { ...newData[actualIndex], [columnKey]: newValue };
        }
        return newData;
      });
      onCellEdit?.(item, columnKey, newValue, index);
  }, [internalData, validateCellValue, onCellEdit]);

  // Inline editing hook
  const {
    editingCell,
    editValue,
    editInputRef,
    setEditValue,
    validationError,
    handleCellEditStart: handleCellEditStartOriginal,
    handleCellEditSave,
    handleCellEditCancel,
  } = useInlineEditing(handleCellEdit, columns);

  // Wrap handleCellEditStart to skip row number column
  const handleCellEditStart = React.useCallback((item: T, column: { key: keyof T; editable?: boolean }, rowIndex: number) => {
    // Skip row number column
    if (String(column.key) === '__rowNumber__') return;
    handleCellEditStartOriginal(item, column, rowIndex);
  }, [handleCellEditStartOriginal]);

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
    dataToUse,
    table.filtered,
    currentGroupBy,
    onRowReorder
  );

  // Cell selection hook (Excel-like selection)
  const cellSelection = useCellSelection(
    table.paged,
    sortedColumns,
    enableCellSelection
  );

  // Clear cell selection and focus when page changes (cells are no longer visible)
  // Use a ref to track previous page to avoid clearing on initial mount
  const prevPageRef = React.useRef(table.currentPage);
  React.useEffect(() => {
    if (enableCellSelection && prevPageRef.current !== table.currentPage) {
      cellSelection.clearSelection();
      cellSelection.clearFocus();
      prevPageRef.current = table.currentPage;
    }
  }, [table.currentPage, enableCellSelection, cellSelection.clearSelection, cellSelection.clearFocus]);

  // Clipboard hook (copy, cut, paste)
  const clipboard = useClipboard<T>();

  // Cell selection handlers - skip row number column
  const handleCellMouseDown = React.useCallback((rowIndex: number, colKey: string, e: React.MouseEvent) => {
    if (!enableCellSelection) return;
    // Skip row number column
    if (colKey === '__rowNumber__') return;
    e.stopPropagation();
    const isShift = e.shiftKey;
    cellSelection.startSelection(rowIndex, colKey, isShift);
    cellSelection.setFocusedCell(rowIndex, colKey);
    // Clear copied state when starting new selection
    cellSelection.setCopied(false);
  }, [enableCellSelection, cellSelection]);

  const handleCellMouseEnter = React.useCallback((rowIndex: number, colKey: string, e: React.MouseEvent) => {
    if (!enableCellSelection || !cellSelection.isSelecting) return;
    // Skip row number column
    if (colKey === '__rowNumber__') return;
    cellSelection.updateSelection(rowIndex, colKey);
  }, [enableCellSelection, cellSelection]);

  const handleCellMouseUp = React.useCallback((rowIndex: number, colKey: string, e: React.MouseEvent) => {
    if (!enableCellSelection) return;
    // Skip row number column
    if (colKey === '__rowNumber__') return;
    cellSelection.endSelection();
  }, [enableCellSelection, cellSelection]);

  // Get cell range info for visual feedback
  const getCellRangeInfo = React.useCallback((rowIndex: number, colKey: string) => {
    if (!enableCellSelection) {
      return { isStart: false, isEnd: false, isInRange: false, isTopRow: false, isBottomRow: false, isLeftCol: false, isRightCol: false, isCopied: false, isFocused: false };
    }
    
    // Check if cell is focused
    const isFocused = cellSelection.focusedCell?.rowIndex === rowIndex && cellSelection.focusedCell?.colKey === colKey;
    
    if (!cellSelection.selectedRange) {
      return { isStart: false, isEnd: false, isInRange: false, isTopRow: false, isBottomRow: false, isLeftCol: false, isRightCol: false, isCopied: false, isFocused };
    }
    
    const range = cellSelection.selectedRange;
    const startRow = Math.min(range.start.rowIndex, range.end.rowIndex);
    const endRow = Math.max(range.start.rowIndex, range.end.rowIndex);
    
    // Find column indices
    const startColIndex = sortedColumns.findIndex(c => String(c.key) === range.start.colKey);
    const endColIndex = sortedColumns.findIndex(c => String(c.key) === range.end.colKey);
    const minColIndex = Math.min(startColIndex >= 0 ? startColIndex : 0, endColIndex >= 0 ? endColIndex : sortedColumns.length - 1);
    const maxColIndex = Math.max(startColIndex >= 0 ? startColIndex : 0, endColIndex >= 0 ? endColIndex : sortedColumns.length - 1);
    const currentColIndex = sortedColumns.findIndex(c => String(c.key) === colKey);
    
    const isStart = range.start.rowIndex === rowIndex && range.start.colKey === colKey;
    const isEnd = range.end.rowIndex === rowIndex && range.end.colKey === colKey;
    const isInRange = cellSelection.isCellSelected(rowIndex, colKey);
    
    // Check if cell is on the edge of the range
    const isTopRow = rowIndex === startRow;
    const isBottomRow = rowIndex === endRow;
    const isLeftCol = currentColIndex === minColIndex;
    const isRightCol = currentColIndex === maxColIndex;
    
    return { 
      isStart, 
      isEnd, 
      isInRange,
      isTopRow,
      isBottomRow,
      isLeftCol,
      isRightCol,
      isCopied: cellSelection.isCopied,
      isFocused,
    };
  }, [enableCellSelection, cellSelection, sortedColumns]);

  // Check if a row is immediately above the range
  const isRowAboveRange = React.useCallback((rowIndex: number): boolean => {
    if (!enableCellSelection || !cellSelection.selectedRange) {
      return false;
    }
    const range = cellSelection.selectedRange;
    const startRow = Math.min(range.start.rowIndex, range.end.rowIndex);
    // Row is above range if it's one row before the start row (and startRow > 0)
    return startRow > 0 && rowIndex === startRow - 1;
  }, [enableCellSelection, cellSelection]);

  // Check if range starts from first row (row 0) - need to style header
  const isRangeFromFirstRow = React.useCallback((): boolean => {
    if (!enableCellSelection || !cellSelection.selectedRange) {
      return false;
    }
    const range = cellSelection.selectedRange;
    const startRow = Math.min(range.start.rowIndex, range.end.rowIndex);
    return startRow === 0;
  }, [enableCellSelection, cellSelection]);

  // Check if a column is in the range (for styling row above)
  const isColumnInRange = React.useCallback((colKey: string): boolean => {
    if (!enableCellSelection || !cellSelection.selectedRange) {
      return false;
    }
    const range = cellSelection.selectedRange;
    const startColIndex = sortedColumns.findIndex(c => String(c.key) === range.start.colKey);
    const endColIndex = sortedColumns.findIndex(c => String(c.key) === range.end.colKey);
    const minColIndex = Math.min(startColIndex >= 0 ? startColIndex : 0, endColIndex >= 0 ? endColIndex : sortedColumns.length - 1);
    const maxColIndex = Math.max(startColIndex >= 0 ? startColIndex : 0, endColIndex >= 0 ? endColIndex : sortedColumns.length - 1);
    const currentColIndex = sortedColumns.findIndex(c => String(c.key) === colKey);
    return currentColIndex >= minColIndex && currentColIndex <= maxColIndex;
  }, [enableCellSelection, cellSelection, sortedColumns]);

  // Get column range info for row above range
  const getColumnRangeInfo = React.useCallback((colKey: string) => {
    if (!enableCellSelection || !cellSelection.selectedRange) {
      return { isInRange: false, isLeftCol: false, isRightCol: false };
    }
    const range = cellSelection.selectedRange;
    const startColIndex = sortedColumns.findIndex(c => String(c.key) === range.start.colKey);
    const endColIndex = sortedColumns.findIndex(c => String(c.key) === range.end.colKey);
    const minColIndex = Math.min(startColIndex >= 0 ? startColIndex : 0, endColIndex >= 0 ? endColIndex : sortedColumns.length - 1);
    const maxColIndex = Math.max(startColIndex >= 0 ? startColIndex : 0, endColIndex >= 0 ? endColIndex : sortedColumns.length - 1);
    const currentColIndex = sortedColumns.findIndex(c => String(c.key) === colKey);
    const isInRange = currentColIndex >= minColIndex && currentColIndex <= maxColIndex;
    const isLeftCol = currentColIndex === minColIndex;
    const isRightCol = currentColIndex === maxColIndex;
    return { isInRange, isLeftCol, isRightCol };
  }, [enableCellSelection, cellSelection, sortedColumns]);

  // Clear selection and focus when focus leaves table
  React.useEffect(() => {
    if (!enableCellSelection) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (!tableRef.current) return;
      
      const target = e.target as Node | null;
      if (target && !tableRef.current.contains(target)) {
        // Clear selection and focus when clicking outside table
        cellSelection.clearSelection();
        cellSelection.clearFocus();
      }
    };

    // Use mousedown instead of click to catch all clicks
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [enableCellSelection, cellSelection]);

  // Handle focus out events separately to ensure tableRef is available
  React.useEffect(() => {
    if (!enableCellSelection || !tableRef.current) return;

    const handleFocusOut = (e: FocusEvent) => {
      if (!tableRef.current) return;
      
      // Check if the new focus target is outside the table
      const relatedTarget = e.relatedTarget as Node | null;
      if (relatedTarget && !tableRef.current.contains(relatedTarget)) {
        // Clear selection and focus when focus leaves table
        cellSelection.clearSelection();
        cellSelection.clearFocus();
      }
    };

    const tableElement = tableRef.current;
    tableElement.addEventListener('focusout', handleFocusOut);

    return () => {
      tableElement.removeEventListener('focusout', handleFocusOut);
    };
  }, [enableCellSelection, cellSelection]);

  // Keyboard handlers for copy/paste
  React.useEffect(() => {
    if (!enableCellSelection) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if table container or cells are focused
      const activeElement = document.activeElement;
      if (!tableRef.current || !activeElement) return;
      
      // Check if active element is within the table
      const isInTable = tableRef.current.contains(activeElement);
      
      // Don't handle if focus is outside table
      if (!isInTable) {
        return;
      }

      // Don't handle keyboard shortcuts if user is editing a cell (typing in input)
      // Check if active element is an input, textarea, or contenteditable
      if (activeElement.tagName === 'INPUT' || 
          activeElement.tagName === 'TEXTAREA' || 
          activeElement.getAttribute('contenteditable') === 'true') {
        // Allow normal typing (including Space) in input fields
        // Only prevent shortcuts that might conflict
        if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x' || e.key === 'v')) {
          // Allow copy/cut/paste in input fields
          return;
        }
        // For all other keys when editing, don't interfere
        return;
      }

      // Ctrl+C or Cmd+C - Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        const selectedCells = cellSelection.getSelectedCells();
        // Filter out row number column
        const cellsWithoutRowNumber = selectedCells.filter(cell => cell.colKey !== '__rowNumber__');
        if (cellsWithoutRowNumber.length > 0) {
          e.preventDefault();
          // Convert cell indices from paged to sorted data
          const dataForCopy = currentGroupBy ? table.filtered : table.sorted;
          const pageStartIndex = (table.currentPage - 1) * table.itemsPerPage;
          const cellsInSortedData = cellsWithoutRowNumber.map(cell => {
            // Convert rowIndex from paged to sorted index
            const sortedRowIndex = pageStartIndex + cell.rowIndex;
            // Find the actual item in sorted data to ensure correct index
            const pagedItem = table.paged[cell.rowIndex];
            if (pagedItem) {
              const itemIndexInSorted = dataForCopy.findIndex((item: T) => {
                if (item === pagedItem) return true;
                return getItemKey(item, -1) === getItemKey(pagedItem, -1);
              });
              if (itemIndexInSorted >= 0) {
                return { rowIndex: itemIndexInSorted, colKey: cell.colKey };
              }
            }
            // Fallback to calculated index
            return { rowIndex: sortedRowIndex, colKey: cell.colKey };
          });
          // Filter out row number column from columns passed to clipboard
          const columnsForClipboard = sortedColumns.filter(col => String(col.key) !== '__rowNumber__').map(col => ({ key: col.key, label: col.label }));
          clipboard.copyCells(cellsInSortedData, dataForCopy, columnsForClipboard);
          // Mark selection as copied to show dashed border
          cellSelection.setCopied(true);
        }
      }
      // Ctrl+X or Cmd+X - Cut
      else if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        const selectedCells = cellSelection.getSelectedCells();
        // Filter out row number column
        const cellsWithoutRowNumber = selectedCells.filter(cell => cell.colKey !== '__rowNumber__');
        if (cellsWithoutRowNumber.length > 0) {
          e.preventDefault();
          // Convert cell indices from paged to sorted data
          const dataForCut = currentGroupBy ? table.filtered : table.sorted;
          const pageStartIndex = (table.currentPage - 1) * table.itemsPerPage;
          const cellsInSortedData = cellsWithoutRowNumber.map(cell => {
            // Convert rowIndex from paged to sorted index
            const sortedRowIndex = pageStartIndex + cell.rowIndex;
            // Find the actual item in sorted data to ensure correct index
            const pagedItem = table.paged[cell.rowIndex];
            if (pagedItem) {
              const itemIndexInSorted = dataForCut.findIndex((item: T) => {
                if (item === pagedItem) return true;
                return getItemKey(item, -1) === getItemKey(pagedItem, -1);
              });
              if (itemIndexInSorted >= 0) {
                return { rowIndex: itemIndexInSorted, colKey: cell.colKey };
              }
            }
            // Fallback to calculated index
            return { rowIndex: sortedRowIndex, colKey: cell.colKey };
          });
          // Filter out row number column from columns passed to clipboard
          const columnsForClipboard = sortedColumns.filter(col => String(col.key) !== '__rowNumber__').map(col => ({ key: col.key, label: col.label }));
          clipboard.cutCells(cellsInSortedData, dataForCut, columnsForClipboard);
        }
      }
      // Ctrl+V or Cmd+V - Paste
      else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        // Determine paste target: use focused cell, or start of selected range, or first selected cell
        const focused = cellSelection.focusedCell;
        const range = cellSelection.selectedRange;
        const selectedCells = cellSelection.getSelectedCells();
        
        // Priority: focused cell > range start > first selected cell
        let pasteTarget: { rowIndex: number; colKey: string } | null = null;
        
        if (focused) {
          pasteTarget = { rowIndex: focused.rowIndex, colKey: focused.colKey };
        } else if (range) {
          // Use the start of the range as paste target (where user started selecting)
          pasteTarget = { rowIndex: range.start.rowIndex, colKey: range.start.colKey };
        } else if (selectedCells.length > 0) {
          pasteTarget = selectedCells[0];
        }
        
        if (pasteTarget) {
          e.preventDefault();
          // Use table.sorted for paste (includes filter and sort) to ensure correct position
          // When grouped, use table.filtered; otherwise use table.sorted
          const dataForPaste = currentGroupBy ? table.filtered : table.sorted;
          
          // Convert rowIndex from pagedData index to dataForPaste index
          // pasteTarget.rowIndex is the index in table.paged, we need to find the actual item
          // and then find its index in dataForPaste
          const pagedItem = table.paged[pasteTarget.rowIndex];
          let actualRowIndex = pasteTarget.rowIndex;
          
          if (pagedItem) {
            // Find the item in dataForPaste
            const itemIndexInDataForPaste = dataForPaste.findIndex((item: T) => {
              // Try to match by reference first (faster)
              if (item === pagedItem) return true;
              // If that fails, try to match by a unique identifier (like id)
              // This is a fallback for cases where items are cloned
              return getItemKey(item, -1) === getItemKey(pagedItem, -1);
            });
            
            if (itemIndexInDataForPaste >= 0) {
              actualRowIndex = itemIndexInDataForPaste;
            } else {
              // If item not found, calculate index based on pagination
              // pasteTarget.rowIndex is in table.paged, convert to table.sorted index
              const pageStartIndex = (table.currentPage - 1) * table.itemsPerPage;
              actualRowIndex = pageStartIndex + pasteTarget.rowIndex;
              // Ensure it's within bounds
              if (actualRowIndex >= dataForPaste.length) {
                actualRowIndex = dataForPaste.length - 1;
              }
            }
          } else {
            // If pagedItem is null, calculate index based on pagination
            const pageStartIndex = (table.currentPage - 1) * table.itemsPerPage;
            actualRowIndex = pageStartIndex + pasteTarget.rowIndex;
            // Ensure it's within bounds
            if (actualRowIndex >= dataForPaste.length) {
              actualRowIndex = dataForPaste.length - 1;
            }
          }
          
          // Create a wrapper for onCellEdit that finds the item in dataToUse by reference/key
          const handleCellEditForPaste = (item: T, columnKey: keyof T, newValue: any, index: number) => {
            // Find the actual item in dataToUse by reference or key
            const itemInDataToUse = dataToUse.find((d: T) => {
              if (d === item) return true;
              return getItemKey(d, -1) === getItemKey(item, -1);
            });
            
            if (itemInDataToUse) {
              // Find the index in dataToUse
              const actualIndex = dataToUse.findIndex((d: T) => d === itemInDataToUse);
              handleCellEdit(itemInDataToUse, columnKey, newValue, actualIndex >= 0 ? actualIndex : index);
            } else {
              // Fallback: use the original handleCellEdit
              handleCellEdit(item, columnKey, newValue, index);
            }
          };
          
          const pasteTargetCells = [{ rowIndex: actualRowIndex, colKey: pasteTarget.colKey }];
          const pasteTargetColKey = pasteTarget.colKey; // Store colKey to avoid null reference
          
          // Helper to select the pasted range after paste
          const selectPastedRange = (pastedRows: number, pastedCols: number) => {
            // Calculate the pasted range in sortedData
            const startRowIndexInSorted = actualRowIndex;
            const endRowIndexInSorted = Math.min(actualRowIndex + pastedRows - 1, dataForPaste.length - 1);
            const startColIndex = sortedColumns.findIndex(c => String(c.key) === pasteTargetColKey);
            const endColIndex = Math.min(startColIndex + pastedCols - 1, sortedColumns.length - 1);
            
            if (startColIndex >= 0 && endColIndex >= 0 && startRowIndexInSorted >= 0 && endRowIndexInSorted >= 0) {
              const startColKey = String(sortedColumns[startColIndex].key);
              const endColKey = String(sortedColumns[endColIndex].key);
              
              // Calculate indices in pagedData based on pagination
              // actualRowIndex is the index in table.sorted
              // To get index in table.paged, we need to subtract the offset from current page
              const pageStartIndex = (table.currentPage - 1) * table.itemsPerPage;
              const startPagedIndex = startRowIndexInSorted - pageStartIndex;
              const endPagedIndex = endRowIndexInSorted - pageStartIndex;
              
              // Only select if the range is within the current page
              if (startPagedIndex >= 0 && endPagedIndex >= 0 && 
                  startPagedIndex < table.paged.length && 
                  endPagedIndex < table.paged.length) {
                // Use double requestAnimationFrame to ensure data updates and DOM render are complete
                requestAnimationFrame(() => {
                  requestAnimationFrame(() => {
                    // Set selection range for pasted cells directly
                    // Clear copied state to show solid border (like normal selection)
                    cellSelection.setCopied(false);
                    // Use setSelectionRange to set the range directly
                    cellSelection.setSelectionRange(
                      { rowIndex: startPagedIndex, colKey: startColKey },
                      { rowIndex: endPagedIndex, colKey: endColKey }
                    );
                    // Set focus to start cell
                    cellSelection.setFocusedCell(startPagedIndex, startColKey);
                  });
                });
              }
            }
          };
          
          // First try to paste from system clipboard (Excel, etc.)
          // If that fails or returns nothing, try internal clipboard
          // Filter out row number column from columns passed to clipboard
          const columnsForClipboard = sortedColumns.filter(col => String(col.key) !== '__rowNumber__').map(col => ({ key: col.key, label: col.label }));
          
          clipboard.pasteFromSystemClipboard(
            pasteTargetCells,
            dataForPaste,
            columnsForClipboard,
            handleCellEditForPaste
          ).then((success) => {
            if (success) {
              // Get clipboard data to determine pasted range
              const clipboardData = clipboard.getClipboardData();
              const pastedRows = clipboardData?.length || 1;
              const pastedCols = clipboardData?.[0]?.length || 1;
              // Use double requestAnimationFrame to ensure data updates and DOM render are complete
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  selectPastedRange(pastedRows, pastedCols);
                });
              });
            } else if (clipboard.canPaste()) {
              // Use internal clipboard
              const clipboardData = clipboard.getClipboardData();
              const pastedRows = clipboardData?.length || 1;
              const pastedCols = clipboardData?.[0]?.length || 1;
              clipboard.pasteCells(pasteTargetCells, dataForPaste, columnsForClipboard, handleCellEditForPaste);
              // Use double requestAnimationFrame to ensure data updates and DOM render are complete
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  selectPastedRange(pastedRows, pastedCols);
                });
              });
            }
          }).catch(() => {
            // If system clipboard access failed, try internal clipboard
            if (clipboard.canPaste()) {
              const clipboardData = clipboard.getClipboardData();
              const pastedRows = clipboardData?.length || 1;
              const pastedCols = clipboardData?.[0]?.length || 1;
              clipboard.pasteCells(pasteTargetCells, dataForPaste, columnsForClipboard, handleCellEditForPaste);
              // Use double requestAnimationFrame to ensure data updates and DOM render are complete
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  selectPastedRange(pastedRows, pastedCols);
                });
              });
            }
          });
        }
      }
      // Delete key - Clear selected cells (skip row number column)
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        const selectedCells = cellSelection.getSelectedCells();
        // Filter out row number column
        const cellsWithoutRowNumber = selectedCells.filter(cell => cell.colKey !== '__rowNumber__');
        if (cellsWithoutRowNumber.length > 0) {
          e.preventDefault();
          const dataForDelete = currentGroupBy ? table.filtered : dataToUse;
          cellsWithoutRowNumber.forEach(cell => {
            const item = dataForDelete[cell.rowIndex];
            if (item) {
              // Find actual index in dataToUse
              const actualIndex = dataToUse.findIndex(d => d === item);
              handleCellEdit(item, cell.colKey as keyof T, '', actualIndex >= 0 ? actualIndex : cell.rowIndex);
            }
          });
        }
      }
      // Escape - Clear selection
      else if (e.key === 'Escape') {
        cellSelection.clearSelection();
        cellSelection.setCopied(false);
      }
      // Arrow Keys - Navigate between cells
      else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        // Only handle if not in editing mode
        if (!editingCell) {
          e.preventDefault();
          const direction = e.key === 'ArrowUp' ? 'up' : 
                           e.key === 'ArrowDown' ? 'down' : 
                           e.key === 'ArrowLeft' ? 'left' : 'right';
          const extendSelection = e.shiftKey;
          const newPos = cellSelection.moveFocus(direction, extendSelection);
          
          // Scroll cell into view if needed
          if (newPos && tableRef.current) {
            const cellElement = tableRef.current.querySelector(
              `[data-row-index="${newPos.rowIndex}"][data-col-key="${newPos.colKey}"]`
            ) as HTMLElement;
            if (cellElement) {
              cellElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            }
          }
        }
      }
      // Tab / Shift+Tab - Navigate horizontally
      else if (e.key === 'Tab' && !editingCell) {
        e.preventDefault();
        const direction = e.shiftKey ? 'left' : 'right';
        const newPos = cellSelection.moveFocus(direction, false);
        
        if (newPos && tableRef.current) {
          const cellElement = tableRef.current.querySelector(
            `[data-row-index="${newPos.rowIndex}"][data-col-key="${newPos.colKey}"]`
          ) as HTMLElement;
          if (cellElement) {
            cellElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
          }
        }
      }
      // Enter / Shift+Enter - Navigate vertically
      else if (e.key === 'Enter' && !editingCell) {
        e.preventDefault();
        const direction = e.shiftKey ? 'up' : 'down';
        const newPos = cellSelection.moveFocus(direction, false);
        
        if (newPos && tableRef.current) {
          const cellElement = tableRef.current.querySelector(
            `[data-row-index="${newPos.rowIndex}"][data-col-key="${newPos.colKey}"]`
          ) as HTMLElement;
          if (cellElement) {
            cellElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
          }
        }
      }
      // Home / End - Navigate to start/end of row
      else if ((e.key === 'Home' || e.key === 'End') && !editingCell) {
        e.preventDefault();
        const focused = cellSelection.focusedCell || (cellSelection.selectedRange?.end);
        if (focused) {
          const currentColIndex = sortedColumns.findIndex(c => String(c.key) === focused.colKey);
          if (currentColIndex >= 0) {
            const targetColIndex = e.key === 'Home' ? 0 : sortedColumns.length - 1;
            const targetColKey = String(sortedColumns[targetColIndex]?.key);
            if (targetColKey) {
              cellSelection.setFocusedCell(focused.rowIndex, targetColKey);
              cellSelection.startSelection(focused.rowIndex, targetColKey, e.shiftKey);
            }
          }
        }
      }
      // Ctrl+Arrow - Navigate to edge of data
      else if ((e.ctrlKey || e.metaKey) && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !editingCell) {
        e.preventDefault();
        const focused = cellSelection.focusedCell || (cellSelection.selectedRange?.end);
        if (focused) {
          const dataToUse = currentGroupBy ? table.filtered : data;
          let targetRowIndex = focused.rowIndex;
          let targetColIndex = sortedColumns.findIndex(c => String(c.key) === focused.colKey);
          
          if (e.key === 'ArrowUp') {
            // Move to top of column
            targetRowIndex = 0;
          } else if (e.key === 'ArrowDown') {
            // Move to bottom of column
            targetRowIndex = dataToUse.length - 1;
          } else if (e.key === 'ArrowLeft') {
            // Move to leftmost column
            targetColIndex = 0;
          } else if (e.key === 'ArrowRight') {
            // Move to rightmost column
            targetColIndex = sortedColumns.length - 1;
          }
          
          const targetColKey = String(sortedColumns[targetColIndex]?.key);
          if (targetColKey) {
            cellSelection.setFocusedCell(targetRowIndex, targetColKey);
            cellSelection.startSelection(targetRowIndex, targetColKey, e.shiftKey);
            
            // Scroll into view
            if (tableRef.current) {
              const cellElement = tableRef.current.querySelector(
                `[data-row-index="${targetRowIndex}"][data-col-key="${targetColKey}"]`
              ) as HTMLElement;
              if (cellElement) {
                cellElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
              }
            }
          }
        }
      }
    };

    // Use document-level listener but check focus
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableCellSelection, cellSelection, clipboard, table.paged, sortedColumns, onCellEdit, currentGroupBy, data, editingCell, table.filtered]);

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
    const hasError = isEditing && validationError !== null;

    // If editing, show input with save/cancel buttons (only if enableCellSelection is false)
    if (isEditing && column.editable) {
      // Excel-like mode: no buttons, auto-save on blur
      if (enableCellSelection) {
        return (
          <div className="hh-cell-edit-wrapper">
            <input
              ref={editInputRef}
              type="text"
              className={`hh-cell-edit-input hh-cell-edit-input-excel ${hasError ? 'hh-cell-edit-input-error' : ''}`}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => {
                const saved = handleCellEditSave(item, column.key, index);
                // If validation failed, keep editing mode and focus back
                if (saved === false && editInputRef.current) {
                  setTimeout(() => {
                    editInputRef.current?.focus();
                  }, 0);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const saved = handleCellEditSave(item, column.key, index);
                  // If validation failed, keep focus
                  if (saved === false && editInputRef.current) {
                    editInputRef.current.focus();
                  }
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  handleCellEditCancel();
                }
                // Allow all other keys including Space, Delete, Backspace, etc.
                // Only stop propagation for navigation keys to prevent table-level handlers
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
                    e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
                    e.key === 'Tab' || e.key === 'Home' || e.key === 'End') {
                  e.stopPropagation();
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Allow normal text selection when clicking on input
                // Don't force selection
              }}
              onFocus={(e) => {
                // Focus cursor at the end of the value when input gets focus
                const input = e.target as HTMLInputElement;
                if (input) {
                  // Use setTimeout to ensure selection happens after focus
                  setTimeout(() => {
                    const length = input.value.length;
                    input.setSelectionRange(length, length);
                  }, 0);
                }
              }}
              onMouseDown={(e) => {
                // Prevent default to allow selection
                e.stopPropagation();
              }}
            />
            {hasError && (
              <div className="hh-cell-edit-error-message">{validationError}</div>
            )}
          </div>
        );
      }
      
      // Normal mode: show buttons
      return (
        <div className="hh-cell-edit-container">
          <div className="hh-cell-edit-input-wrapper">
            <input
              ref={editInputRef}
              type="text"
              className={`hh-cell-edit-input ${hasError ? 'hh-cell-edit-input-error' : ''}`}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const saved = handleCellEditSave(item, column.key, index);
                  // If validation failed, keep focus
                  if (saved === false && editInputRef.current) {
                    editInputRef.current.focus();
                  }
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  handleCellEditCancel();
                }
                // Allow all other keys including Space, Delete, Backspace, etc.
                // Only stop propagation for navigation keys to prevent table-level handlers
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || 
                    e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
                    e.key === 'Tab' || e.key === 'Home' || e.key === 'End') {
                  e.stopPropagation();
                }
              }}
              onClick={(e) => {
                e.stopPropagation();
                // Allow normal text selection when clicking on input
                // Don't force selection
              }}
              onFocus={(e) => {
                // Focus cursor at the end of the value when input gets focus
                const input = e.target as HTMLInputElement;
                if (input) {
                  // Use setTimeout to ensure selection happens after focus
                  setTimeout(() => {
                    const length = input.value.length;
                    input.setSelectionRange(length, length);
                  }, 0);
                }
              }}
              onMouseDown={(e) => {
                // Prevent default to allow selection
                e.stopPropagation();
              }}
            />
            {hasError && (
              <div className="hh-cell-edit-error-message">{validationError}</div>
            )}
          </div>
          <div className="hh-cell-edit-buttons">
            <button
              type="button"
              className="hh-cell-edit-button hh-cell-edit-save"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                const saved = handleCellEditSave(item, column.key, index);
                // If validation failed, keep focus
                if (saved === false && editInputRef.current) {
                  editInputRef.current.focus();
                }
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              title="Save"
            >
              <CheckIcon width={12} height={12} />
            </button>
            <button
              type="button"
              className="hh-cell-edit-button hh-cell-edit-cancel"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleCellEditCancel();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              title="Cancel"
            >
              <CloseIcon width={12} height={12} />
            </button>
          </div>
        </div>
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
  }, [onRenderCell, editingCell, editValue, validationError, handleCellEditSave, handleCellEditCancel]);

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
  const hasData = dataToUse.length > 0;
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
      className={`hh-table ${className || ''} hh-theme-${tableTheme.mode || 'light'} ${resizingColumn ? 'resizing' : ''} ${stickyHeader ? 'hh-sticky-header' : ''} ${enableCellSelection ? 'enable-cell-selection' : ''}`}
      style={{
        ...themeStyles,
        ...styles,
        ...(maxHeight ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight, overflow: 'auto' } : {}),
        ...(resizingColumn ? { cursor: 'col-resize' } : {}),
      }}
      tabIndex={enableCellSelection || enableKeyboardNavigation ? 0 : undefined}
    >
      {enableExport && (
        <div className="hh-export-toolbar">
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
              onHeaderMouseEnter={(key: string) => {
                // Skip row number column
                if (key === '__rowNumber__') return;
                // Check if column has showCallout enabled
                const column = sortedColumns.find(col => String(col.key) === key);
                if (column && column.showCallout === false) return;
                callout.handleHeaderMouseEnter(key);
              }}
              onHeaderMouseLeave={callout.handleHeaderMouseLeave}
              onCalloutMouseEnter={callout.handleCalloutMouseEnter}
              onCalloutMouseLeave={callout.handleCalloutMouseLeave}
              onColumnDragStart={handleColumnDragStart}
              onColumnDragOver={handleColumnDragOver}
              onColumnDrop={handleColumnDrop}
              onResizeStart={handleResizeStart}
              onSortAsc={(col) => {
                            // Skip row number column
                            if (String(col.key) === '__rowNumber__') return;
                            if (col.sortable !== false) {
                              table.handleSort(col.key, "asc");
                            }
                          }}
              onSortDesc={(col) => {
                            // Skip row number column
                            if (String(col.key) === '__rowNumber__') return;
                            if (col.sortable !== false) {
                              table.handleSort(col.key, "desc");
                            }
                          }}
              onFilter={(col) => {
                            // Skip row number column
                            if (String(col.key) === '__rowNumber__') return;
                            if (col.filterable !== false) {
                              handleOpenFilter(col.key);
                            }
                          }}
              onClearFilter={(col) => {
                            // Skip row number column
                            if (String(col.key) === '__rowNumber__') return;
                            if (col.filterable !== false) {
                              table.setFilter(String(col.key), []);
                            }
                          }}
              onPinLeft={(col) => {
                            // Skip row number column
                            if (String(col.key) === '__rowNumber__') return;
                            handleColumnPin(col.key, 'left');
                          }}
              onPinRight={(col) => {
                            // Skip row number column
                            if (String(col.key) === '__rowNumber__') return;
                            handleColumnPin(col.key, 'right');
                          }}
              onUnpin={(col) => {
                            // Skip row number column
                            if (String(col.key) === '__rowNumber__') return;
                            handleColumnPin(col.key, null);
                          }}
              onToggleVisibility={(col) => {
                            // Skip row number column
                            if (String(col.key) === '__rowNumber__') return;
                            if (enableColumnVisibility) {
                              handleToggleColumnVisibility(col.key);
                            }
                          }}
              onGroupBy={(col) => {
                            // Skip row number column
                            if (String(col.key) === '__rowNumber__') return;
                            if (currentGroupBy === col.key) {
                              setInternalGroupBy(undefined);
                            } else {
                              setInternalGroupBy(col.key);
                            }
                          }}
              currentGroupBy={currentGroupBy}
              enableColumnVisibility={enableColumnVisibility || false}
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
              enableCellSelection={enableCellSelection}
              isRangeFromFirstRow={isRangeFromFirstRow()}
              isColumnInRange={isColumnInRange}
              getColumnRangeInfo={getColumnRangeInfo}
              isCopied={cellSelection.isCopied}
            />
            <TableBody
              data={dataToUse}
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
              enableCellSelection={enableCellSelection}
              isCellSelected={cellSelection.isCellSelected}
              getCellRangeInfo={getCellRangeInfo}
              isRowAboveRange={isRowAboveRange}
              isColumnInRange={isColumnInRange}
              getColumnRangeInfo={getColumnRangeInfo}
              onCellMouseDown={handleCellMouseDown}
              onCellMouseEnter={handleCellMouseEnter}
              onCellMouseUp={handleCellMouseUp}
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
