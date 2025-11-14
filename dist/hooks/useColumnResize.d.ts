import * as React from "react";
/**
 * Hook to manage column resizing functionality
 *
 * @template T - The type of data items
 * @param anchorRefs - Refs to column header elements
 * @param onResizeStart - Callback when resize starts
 * @returns Resize state and handlers
 */
export declare function useColumnResize<T extends Record<string, any>>(anchorRefs: React.RefObject<Record<string, HTMLDivElement>>, onResizeStart?: () => void): {
    columnWidths: Record<string, number>;
    resizingColumn: string | null;
    handleResizeStart: (colKey: string, e: React.MouseEvent) => void;
};
