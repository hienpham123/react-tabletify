import * as React from "react";
import type { Column } from "../types";
interface TableCellProps<T extends Record<string, any>> {
    column: Column<T>;
    item: T;
    index: number;
    resizedWidth?: number;
    pinPosition: 'left' | 'right' | null;
    leftOffset: number;
    rightOffset: number;
    lastLeftPinnedColumnKey?: keyof T | null;
    firstRightPinnedColumnKey?: keyof T | null;
    showTooltip: boolean;
    onDoubleClick?: () => void;
    renderCell: (item: T, column: Column<T>, index: number) => React.ReactNode;
    getCellText?: (item: T, column: Column<T>) => string;
    isSelected?: boolean;
    isRangeStart?: boolean;
    isRangeEnd?: boolean;
    isInRange?: boolean;
    isTopRow?: boolean;
    isBottomRow?: boolean;
    isLeftCol?: boolean;
    isRightCol?: boolean;
    isInRangeColumn?: boolean;
    isLeftColInRange?: boolean;
    isRightColInRange?: boolean;
    isCopied?: boolean;
    isFocused?: boolean;
    rowIndex?: number;
    colKey?: string;
    onMouseDown?: (e: React.MouseEvent) => void;
    onMouseEnter?: (e: React.MouseEvent) => void;
    onMouseUp?: (e: React.MouseEvent) => void;
    enableCellSelection?: boolean;
}
/**
 * TableCell - Renders a single table cell
 * Memoized to prevent unnecessary re-renders
 */
declare function TableCellComponent<T extends Record<string, any>>({ column, item, index, resizedWidth, pinPosition, leftOffset, rightOffset, lastLeftPinnedColumnKey, firstRightPinnedColumnKey, showTooltip, onDoubleClick, renderCell, getCellText, isSelected, isRangeStart, isRangeEnd, isInRange, isTopRow, isBottomRow, isLeftCol, isRightCol, isInRangeColumn, isLeftColInRange, isRightColInRange, isCopied, isFocused, rowIndex, colKey, onMouseDown, onMouseEnter, onMouseUp, enableCellSelection, }: TableCellProps<T>): import("react/jsx-runtime").JSX.Element;
export declare const TableCell: typeof TableCellComponent;
export {};
