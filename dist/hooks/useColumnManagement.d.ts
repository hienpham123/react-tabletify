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
export declare function useColumnManagement<T extends Record<string, any>>(columns: Column<T>[], pinnedColumns?: Record<string, 'left' | 'right'>, enableColumnVisibility?: boolean, onColumnVisibilityChange?: (visible: (keyof T)[]) => void, enableColumnReorder?: boolean, onColumnReorder?: (order: (keyof T)[]) => void, onColumnPin?: (columnKey: keyof T, pinPosition: 'left' | 'right' | null) => void): {
    internalPinnedColumns: Record<string, "left" | "right">;
    visibleColumns: Set<keyof T>;
    columnOrder: (keyof T)[];
    draggedColumn: keyof T | null;
    dragOverColumn: keyof T | null;
    sortedColumns: Column<T>[];
    handleToggleColumnVisibility: (colKey: keyof T) => void;
    handleColumnPin: (colKey: keyof T, pinPosition: 'left' | 'right' | null) => void;
    handleColumnDragStart: (colKey: keyof T) => void;
    handleColumnDragOver: (e: React.DragEvent, colKey: keyof T) => void;
    handleColumnDrop: (colKey: keyof T) => void;
};
