import * as React from "react";
import type { Column } from "../types";
interface TableHeaderCellProps<T extends Record<string, any>> {
    column: Column<T>;
    columnIndex: number;
    resizedWidth?: number;
    pinPosition: 'left' | 'right' | null;
    leftOffset: number;
    rightOffset: number;
    lastLeftPinnedColumnKey?: keyof T;
    firstRightPinnedColumnKey?: keyof T;
    stickyHeader: boolean;
    enableColumnReorder: boolean;
    isDragOver: boolean;
    sortKey: keyof T | null;
    sortDir: 'asc' | 'desc';
    hasFilter: boolean;
    anchorRef: (el: HTMLDivElement | null) => void;
    anchorRefForCallout: React.RefObject<HTMLDivElement>;
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
    onSortAsc: () => void;
    onSortDesc: () => void;
    onFilter: () => void;
    onClearFilter: () => void;
    onPinLeft: () => void;
    onPinRight: () => void;
    onUnpin: () => void;
    onToggleVisibility: () => void;
    onGroupBy: () => void;
    isGrouped: boolean;
    enableColumnVisibility: boolean;
    enableGroupBy: boolean;
    enableTotals: boolean;
    onTotalsChange: (value: 'none' | 'count') => void;
    totalsValue: 'none' | 'count';
    onDismiss: () => void;
    enableCellSelection?: boolean;
    isInRangeColumn?: boolean;
    isLeftColInRange?: boolean;
    isRightColInRange?: boolean;
    isCopied?: boolean;
}
/**
 * TableHeaderCell - Renders a single table header cell with sorting, filtering, and actions
 */
export declare function TableHeaderCell<T extends Record<string, any>>({ column, columnIndex, resizedWidth, pinPosition, leftOffset, rightOffset, lastLeftPinnedColumnKey, firstRightPinnedColumnKey, stickyHeader, enableColumnReorder, isDragOver, sortKey, sortDir, hasFilter, anchorRef, anchorRefForCallout, calloutKey, resizingColumn, onRenderHeader, onColumnHeaderClick, onHeaderMouseEnter, onHeaderMouseLeave, onCalloutMouseEnter, onCalloutMouseLeave, onColumnDragStart, onColumnDragOver, onColumnDrop, onResizeStart, onSortAsc, onSortDesc, onFilter, onClearFilter, onPinLeft, onPinRight, onUnpin, onToggleVisibility, onGroupBy, isGrouped, enableColumnVisibility, enableGroupBy, enableTotals, onTotalsChange, totalsValue, onDismiss, enableCellSelection, isInRangeColumn, isLeftColInRange, isRightColInRange, isCopied, }: TableHeaderCellProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
