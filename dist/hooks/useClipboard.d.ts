import type { CellPosition } from "./useCellSelection";
interface UseClipboardReturn<T extends Record<string, any>> {
    copyCells: (cells: CellPosition[], data: T[], columns: Array<{
        key: keyof T;
        label: string;
    }>) => void;
    cutCells: (cells: CellPosition[], data: T[], columns: Array<{
        key: keyof T;
        label: string;
    }>) => void;
    pasteCells: (targetCells: CellPosition[], data: T[], columns: Array<{
        key: keyof T;
        label: string;
    }>, onCellEdit: (item: T, columnKey: keyof T, newValue: any, index: number) => void) => void;
    pasteFromSystemClipboard: (targetCells: CellPosition[], data: T[], columns: Array<{
        key: keyof T;
        label: string;
    }>, onCellEdit: (item: T, columnKey: keyof T, newValue: any, index: number) => void) => Promise<boolean>;
    canPaste: () => boolean;
    getClipboardData: () => string[][] | null;
    clearClipboard: () => void;
}
/**
 * Hook for managing clipboard operations (copy, cut, paste)
 * Similar to Excel functionality
 */
export declare function useClipboard<T extends Record<string, any>>(): UseClipboardReturn<T>;
export {};
