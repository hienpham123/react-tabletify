import * as React from "react";
import type { Column } from "../types";
interface TableHeaderProps<T extends Record<string, any>> {
    columns: Column<T>[];
    selectionMode: 'none' | 'single' | 'multiple';
    isAllSelected: boolean;
    isIndeterminate: boolean;
    onSelectAll: (checked: boolean) => void;
    columnWidths: Record<string, number>;
    pinnedColumns: Record<string, 'left' | 'right'>;
    lastLeftPinnedColumnKey?: keyof T | null;
    firstRightPinnedColumnKey?: keyof T | null;
    stickyHeader: boolean;
    enableColumnReorder: boolean;
    dragOverColumn: keyof T | null;
    sortKey: keyof T | null;
    sortDir: 'asc' | 'desc';
    filters: Record<string, string[]>;
    anchorRefs: React.RefObject<Record<string, HTMLDivElement>>;
    calloutKey: string | null;
    resizingColumn: string | null;
    onRenderHeader?: (column: Column<T>, index: number) => React.ReactNode;
    onColumnHeaderClick?: (column: Column<T>, ev?: React.MouseEvent) => void;
    onHeaderMouseEnter: (key: string) => void;
    onHeaderMouseLeave: () => void;
    onCalloutMouseEnter: () => void;
    onCalloutMouseLeave: () => void;
    onColumnDragStart: (key: keyof T) => void;
    onColumnDragOver: (e: React.DragEvent, key: keyof T) => void;
    onColumnDrop: (key: keyof T) => void;
    onResizeStart: (key: string, e: React.MouseEvent) => void;
    onSortAsc: (column: Column<T>) => void;
    onSortDesc: (column: Column<T>) => void;
    onFilter: (column: Column<T>) => void;
    onClearFilter: (column: Column<T>) => void;
    onPinLeft: (column: Column<T>) => void;
    onPinRight: (column: Column<T>) => void;
    onUnpin: (column: Column<T>) => void;
    onToggleVisibility: (column: Column<T>) => void;
    onGroupBy: (column: Column<T>) => void;
    currentGroupBy?: keyof T;
    enableColumnVisibility: boolean;
    onTotalsChange: (column: Column<T>, value: 'none' | 'count') => void;
    columnTotals: Record<string, 'none' | 'count'>;
    getLeftOffset: (column: Column<T>, index: number) => number;
    getRightOffset: (column: Column<T>, index: number) => number;
    dismissCallout: () => void;
    enableRowActions?: boolean;
    enableCellSelection?: boolean;
    isRangeFromFirstRow?: boolean;
    isColumnInRange?: (colKey: string) => boolean;
    getColumnRangeInfo?: (colKey: string) => {
        isInRange: boolean;
        isLeftCol: boolean;
        isRightCol: boolean;
    };
    isCopied?: boolean;
}
/**
 * TableHeader - Renders the table header with all column headers
 */
export declare function TableHeader<T extends Record<string, any>>({ columns, selectionMode, isAllSelected, isIndeterminate, onSelectAll, columnWidths, pinnedColumns, lastLeftPinnedColumnKey, firstRightPinnedColumnKey, stickyHeader, enableColumnReorder, dragOverColumn, sortKey, sortDir, filters, anchorRefs, calloutKey, resizingColumn, onRenderHeader, onColumnHeaderClick, onHeaderMouseEnter, onHeaderMouseLeave, onCalloutMouseEnter, onCalloutMouseLeave, onColumnDragStart, onColumnDragOver, onColumnDrop, onResizeStart, onSortAsc, onSortDesc, onFilter, onClearFilter, onPinLeft, onPinRight, onUnpin, onToggleVisibility, onGroupBy, currentGroupBy, enableColumnVisibility, onTotalsChange, columnTotals, getLeftOffset, getRightOffset, dismissCallout, enableRowActions, enableCellSelection, isRangeFromFirstRow, isColumnInRange, getColumnRangeInfo, isCopied, }: TableHeaderProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
