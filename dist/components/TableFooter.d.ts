import type { Column } from "../types";
interface TableFooterProps<T extends Record<string, any>> {
    columns: Column<T>[];
    selectionMode: 'none' | 'single' | 'multiple';
    columnTotals: Record<string, 'none' | 'count'>;
    pinnedColumns: Record<string, 'left' | 'right'>;
    columnWidths: Record<string, number>;
    lastLeftPinnedColumnKey?: keyof T | null;
    firstRightPinnedColumnKey?: keyof T | null;
    totalCount: number;
    getLeftOffset: (column: Column<T>, index: number) => number;
    getRightOffset: (column: Column<T>, index: number) => number;
}
/**
 * TableFooter - Renders the table footer with totals row
 */
export declare function TableFooter<T extends Record<string, any>>({ columns, selectionMode, columnTotals, pinnedColumns, columnWidths, lastLeftPinnedColumnKey, firstRightPinnedColumnKey, totalCount, getLeftOffset, getRightOffset, }: TableFooterProps<T>): import("react/jsx-runtime").JSX.Element | null;
export {};
