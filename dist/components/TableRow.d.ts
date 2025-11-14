import * as React from "react";
import type { Column } from "../types";
interface TableRowProps<T extends Record<string, any>> {
    item: T;
    index: number;
    itemKey: string | number;
    columns: Column<T>[];
    selectionMode: 'none' | 'single' | 'multiple';
    isSelected: boolean;
    isActive: boolean;
    isFocused?: boolean;
    isDragging?: boolean;
    isDragOver?: boolean;
    canDrag: boolean;
    columnWidths: Record<string, number>;
    pinnedColumns: Record<string, 'left' | 'right'>;
    lastLeftPinnedColumnKey?: keyof T | null;
    firstRightPinnedColumnKey?: keyof T | null;
    showTooltip: boolean;
    onItemClick: (item: T, index: number, ev: React.MouseEvent) => void;
    onItemContextMenu?: (item: T, index: number, ev: React.MouseEvent) => void;
    onCheckboxChange: (item: T, index: number, checked: boolean) => void;
    onCellEditStart: (item: T, column: Column<T>, index: number) => void;
    onDragStart: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
    onDragOver: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
    onDragLeave: (e: React.DragEvent<HTMLTableRowElement>) => void;
    onDrop: (e: React.DragEvent<HTMLTableRowElement>, index: number) => void;
    onDragEnd: (e: React.DragEvent<HTMLTableRowElement>) => void;
    renderCell: (item: T, column: Column<T>, index: number) => React.ReactNode;
    getCellText?: (item: T, column: Column<T>) => string;
    getLeftOffset: (column: Column<T>, index: number) => number;
    getRightOffset: (column: Column<T>, index: number) => number;
    isDraggingState: boolean;
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
        isCopied?: boolean;
    };
    isRowAboveRange?: boolean;
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
 * TableRow - Renders a single table row with cells
 */
export declare function TableRow<T extends Record<string, any>>({ item, index, itemKey, columns, selectionMode, isSelected, isActive, isFocused, isDragging, isDragOver, canDrag, columnWidths, pinnedColumns, lastLeftPinnedColumnKey, firstRightPinnedColumnKey, showTooltip, onItemClick, onItemContextMenu, onCheckboxChange, onCellEditStart, onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd, renderCell, getCellText, getLeftOffset, getRightOffset, isDraggingState, rowActions, openMenuKey, onMenuToggle, onMenuDismiss, enableCellSelection, isCellSelected, getCellRangeInfo, isRowAboveRange, isColumnInRange, getColumnRangeInfo, onCellMouseDown, onCellMouseEnter, onCellMouseUp, }: TableRowProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
