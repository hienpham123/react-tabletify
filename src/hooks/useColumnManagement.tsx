import * as React from "react";
import type { Column } from "../types";

/**
 * Hook to manage column visibility, reordering, and pinning
 * 
 * @template T - The type of data items
 * @param columns - Array of column definitions
 * @param pinnedColumns - Initial pinned columns configuration
 * @param enableColumnVisibility - Whether column visibility toggle is enabled
 * @param onColumnVisibilityChange - Callback when column visibility changes
 * @param enableColumnReorder - Whether column reordering is enabled
 * @param onColumnReorder - Callback when column order changes
 * @param onColumnPin - Callback when column pinning changes
 * @returns Column management state and handlers
 */
export function useColumnManagement<T extends Record<string, any>>(
  columns: Column<T>[],
  pinnedColumns?: Record<string, 'left' | 'right'>,
  enableColumnVisibility?: boolean,
  onColumnVisibilityChange?: (visible: (keyof T)[]) => void,
  enableColumnReorder?: boolean,
  onColumnReorder?: (order: (keyof T)[]) => void,
  onColumnPin?: (columnKey: keyof T, pinPosition: 'left' | 'right' | null) => void
) {
  const [internalPinnedColumns, setInternalPinnedColumns] = React.useState<Record<string, 'left' | 'right'>>(pinnedColumns || {});
  const [visibleColumns, setVisibleColumns] = React.useState<Set<keyof T>>(new Set(columns.map(col => col.key)));
  const [columnOrder, setColumnOrder] = React.useState<(keyof T)[]>(columns.map(col => col.key));
  const [draggedColumn, setDraggedColumn] = React.useState<keyof T | null>(null);
  const [dragOverColumn, setDragOverColumn] = React.useState<keyof T | null>(null);

  // Sync column visibility changes
  React.useEffect(() => {
    if (enableColumnVisibility && onColumnVisibilityChange) {
      onColumnVisibilityChange(Array.from(visibleColumns));
    }
  }, [visibleColumns, enableColumnVisibility, onColumnVisibilityChange]);

  // Sync column order changes
  React.useEffect(() => {
    if (enableColumnReorder && onColumnReorder) {
      onColumnReorder(columnOrder);
    }
  }, [columnOrder, enableColumnReorder, onColumnReorder]);

  /**
   * Toggle column visibility
   */
  const handleToggleColumnVisibility = React.useCallback((colKey: keyof T) => {
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(colKey)) {
        next.delete(colKey);
      } else {
        next.add(colKey);
      }
      return next;
    });
  }, []);

  /**
   * Handle column pinning
   */
  const handleColumnPin = React.useCallback((colKey: keyof T, pinPosition: 'left' | 'right' | null) => {
    setInternalPinnedColumns(prev => {
      const next = { ...prev };
      if (pinPosition === null) {
        delete next[String(colKey)];
      } else {
        next[String(colKey)] = pinPosition;
      }
      return next;
    });
    if (onColumnPin) {
      onColumnPin(colKey, pinPosition);
    }
  }, [onColumnPin]);

  /**
   * Handle column drag start
   */
  const handleColumnDragStart = React.useCallback((colKey: keyof T) => {
    if (!enableColumnReorder) return;
    setDraggedColumn(colKey);
  }, [enableColumnReorder]);

  /**
   * Handle column drag over
   */
  const handleColumnDragOver = React.useCallback((e: React.DragEvent, colKey: keyof T) => {
    if (!enableColumnReorder || !draggedColumn || draggedColumn === colKey) return;
    e.preventDefault();
    setDragOverColumn(colKey);
  }, [enableColumnReorder, draggedColumn]);

  /**
   * Handle column drop
   */
  const handleColumnDrop = React.useCallback((colKey: keyof T) => {
    if (!enableColumnReorder || !draggedColumn || draggedColumn === colKey) return;
    
    setColumnOrder(prev => {
      const newOrder = [...prev];
      const draggedIndex = newOrder.indexOf(draggedColumn);
      const dropIndex = newOrder.indexOf(colKey);
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(dropIndex, 0, draggedColumn);
      return newOrder;
    });
    
    setDraggedColumn(null);
    setDragOverColumn(null);
  }, [enableColumnReorder, draggedColumn]);

  /**
   * Filter visible columns
   */
  const filteredColumns = React.useMemo(() => {
    if (!enableColumnVisibility) return columns;
    return columns.filter(col => visibleColumns.has(col.key));
  }, [columns, visibleColumns, enableColumnVisibility]);

  /**
   * Apply column order
   */
  const orderedColumns = React.useMemo(() => {
    if (!enableColumnReorder) return filteredColumns;
    const orderMap = new Map(columnOrder.map((key, index) => [key, index]));
    return [...filteredColumns].sort((a, b) => {
      const aIndex = orderMap.get(a.key) ?? Infinity;
      const bIndex = orderMap.get(b.key) ?? Infinity;
      return aIndex - bIndex;
    });
  }, [filteredColumns, columnOrder, enableColumnReorder]);

  /**
   * Sort columns by pin position: left pinned -> unpinned -> right pinned
   */
  const sortedColumns = React.useMemo(() => {
    const leftPinned: Column<T>[] = [];
    const unpinned: Column<T>[] = [];
    const rightPinned: Column<T>[] = [];

    orderedColumns.forEach((col) => {
      const pinPosition = internalPinnedColumns[String(col.key)] || col.pinned || null;
      if (pinPosition === 'left') {
        leftPinned.push(col);
      } else if (pinPosition === 'right') {
        rightPinned.push(col);
      } else {
        unpinned.push(col);
      }
    });

    return [...leftPinned, ...unpinned, ...rightPinned];
  }, [orderedColumns, internalPinnedColumns]);

  return {
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
  };
}

