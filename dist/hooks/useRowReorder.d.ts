import * as React from "react";
/**
 * Hook to manage row drag & drop reordering
 *
 * @template T - The type of data items
 * @param enableRowReorder - Whether row reordering is enabled
 * @param data - Original data array
 * @param filteredData - Filtered data array (from useTable)
 * @param currentGroupBy - Current groupBy field (if any)
 * @param onRowReorder - Callback when row order changes
 * @returns Row reorder state and handlers
 */
export declare function useRowReorder<T extends Record<string, any>>(enableRowReorder: boolean, data: T[], filteredData: T[], currentGroupBy: keyof T | undefined, onRowReorder?: (newData: T[], draggedItem: T, fromIndex: number, toIndex: number) => void): {
    draggedRowIndex: number | null;
    dragOverRowIndex: number | null;
    isDragging: boolean;
    reorderedData: T[] | null;
    effectiveData: T[];
    handleRowDragStart: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
    handleRowDragOver: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
    handleRowDragLeave: (e: React.DragEvent<HTMLTableRowElement>) => void;
    handleRowDrop: (e: React.DragEvent<HTMLTableRowElement>, dropIndex: number) => void;
    handleRowDragEnd: (e: React.DragEvent<HTMLTableRowElement>) => void;
};
