import * as React from "react";
import type { Column } from "../types";
interface TableBodyProps<T extends Record<string, any>> {
    data: T[];
    columns: Column<T>[];
    paginatedGroups?: [string, T[]][] | null;
    currentGroupBy?: keyof T;
    expandedGroups: Set<string>;
    selectionMode: 'none' | 'single' | 'multiple';
    selectedItems: Set<string | number>;
    activeItemIndex: number | undefined | null;
    focusedRowIndex: number | undefined;
    enableRowReorder: boolean;
    draggedRowIndex: number | null | undefined;
    dragOverRowIndex: number | null | undefined;
    isDragging: boolean;
    columnWidths: Record<string, number>;
    pinnedColumns: Record<string, 'left' | 'right'>;
    lastLeftPinnedColumnKey?: keyof T | null;
    firstRightPinnedColumnKey?: keyof T | null;
    showTooltip: boolean;
    onRenderRow?: (item: T, index: number, columns: Column<T>[]) => React.ReactNode;
    getItemKey: (item: T, index: number) => string | number;
    onItemClick: (item: T, index: number, ev: React.MouseEvent) => void;
    onItemContextMenu?: (item: T, index: number, ev: React.MouseEvent) => void;
    onCheckboxChange: (item: T, index: number, checked: boolean) => void;
    onCellEditStart: (item: T, column: Column<T>, index: number) => void;
    onRowDragStart: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
    onRowDragOver: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
    onRowDragLeave: (e: React.DragEvent<HTMLTableRowElement>) => void;
    onRowDrop: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
    onRowDragEnd: (e: React.DragEvent<HTMLTableRowElement>) => void;
    renderCell: (item: T, column: Column<T>, index: number) => React.ReactNode;
    getCellText?: (item: T, column: Column<T>) => string;
    getLeftOffset: (column: Column<T>, index: number) => number;
    getRightOffset: (column: Column<T>, index: number) => number;
    toggleGroup: (groupKey: string) => void;
    filteredData: T[];
    pagedData: T[];
    rowActions?: (item: T, index: number) => Array<{
        key: string;
        label: string;
        icon?: React.ReactNode;
        onClick: (item: T, index: number) => void;
        disabled?: boolean;
    }>;
    openMenuKey: string | null;
    onMenuToggle: (item: T, index: number) => void;
    onMenuDismiss: () => void;
    enableCellSelection?: boolean;
    isCellSelected?: (rowIndex: number, colKey: string) => boolean;
    getCellRangeInfo?: (rowIndex: number, colKey: string) => {
        isStart: boolean;
        isEnd: boolean;
        isInRange: boolean;
        isTopRow?: boolean;
        isBottomRow?: boolean;
        isLeftCol?: boolean;
        isRightCol?: boolean;
    };
    isRowAboveRange?: (rowIndex: number) => boolean;
    isColumnInRange?: (colKey: string) => boolean;
    getColumnRangeInfo?: (colKey: string) => {
        isInRange: boolean;
        isLeftCol: boolean;
        isRightCol: boolean;
    };
    onCellMouseDown?: (rowIndex: number, colKey: string, e: React.MouseEvent) => void;
    onCellMouseEnter?: (rowIndex: number, colKey: string, e: React.MouseEvent) => void;
    onCellMouseUp?: (rowIndex: number, colKey: string, e: React.MouseEvent) => void;
}
/**
 * TableBody - Renders the table body with rows (grouped or ungrouped)
 */
export declare function TableBody<T extends Record<string, any>>({ data, columns, paginatedGroups, currentGroupBy, expandedGroups, selectionMode, selectedItems, activeItemIndex, focusedRowIndex, enableRowReorder, draggedRowIndex, dragOverRowIndex, isDragging, columnWidths, pinnedColumns, lastLeftPinnedColumnKey, firstRightPinnedColumnKey, showTooltip, onRenderRow, getItemKey, onItemClick, onItemContextMenu, onCheckboxChange, onCellEditStart, onRowDragStart, onRowDragOver, onRowDragLeave, onRowDrop, onRowDragEnd, renderCell, getCellText, getLeftOffset, getRightOffset, toggleGroup, filteredData, pagedData, rowActions, openMenuKey, onMenuToggle, onMenuDismiss, enableCellSelection, isCellSelected, getCellRangeInfo, isRowAboveRange, isColumnInRange, getColumnRangeInfo, onCellMouseDown, onCellMouseEnter, onCellMouseUp, }: TableBodyProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
