export interface CellPosition {
    rowIndex: number;
    colKey: string;
}
export interface CellRange {
    start: CellPosition;
    end: CellPosition;
}
interface UseCellSelectionReturn {
    selectedCells: Set<string>;
    selectedRange: CellRange | null;
    isSelecting: boolean;
    isCopied: boolean;
    startSelection: (rowIndex: number, colKey: string, isShift: boolean) => void;
    updateSelection: (rowIndex: number, colKey: string) => void;
    endSelection: () => void;
    clearSelection: () => void;
    setCopied: (copied: boolean) => void;
    isCellSelected: (rowIndex: number, colKey: string) => boolean;
    getSelectedCells: () => CellPosition[];
    getSelectedRange: () => CellRange | null;
}
/**
 * Hook for managing cell selection (like Excel)
 * Supports single cell, range selection, and multiple ranges
 */
export declare function useCellSelection<T extends Record<string, any>>(data: T[], columns: Array<{
    key: keyof T;
}>, enabled?: boolean): UseCellSelectionReturn;
export {};
