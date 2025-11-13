import * as React from "react";
/**
 * Column definition for the table
 * @template T - The type of data items in the table
 */
export interface Column<T extends Record<string, any>> {
    /** The key of the column (must be a key of T) */
    key: keyof T;
    /** The display label for the column header */
    label: string;
    /**
     * Optional custom render function for cells in this column
     * @param item - The data item for this row
     * @param columnKey - The key of the column being rendered
     * @param index - The index of the row in the current page
     * @returns React node to render in the cell
     */
    onRenderCell?: (item: T, columnKey: keyof T, index: number) => React.ReactNode;
}
/**
 * Selection mode for the table
 * - 'none': No selection allowed
 * - 'single': Only one item can be selected at a time (radio buttons)
 * - 'multiple': Multiple items can be selected (checkboxes)
 */
export type SelectionMode = 'none' | 'single' | 'multiple';
/**
 * Props for the ReactTabletify component
 * @template T - The type of data items in the table (must be an object/record)
 */
export interface ReactTabletifyProps<T extends Record<string, any>> {
    /** Array of column definitions */
    columns: Column<T>[];
    /** Array of data items to display in the table */
    data: T[];
    /**
     * Number of items to display per page
     * @default 10
     */
    itemsPerPage?: number;
    /**
     * Key to group rows by. When provided, rows will be grouped by this field value
     * and can be expanded/collapsed
     */
    groupBy?: keyof T;
    /**
     * Global custom render function for cells
     * This will be used if a column doesn't have its own onRenderCell
     * @param item - The data item for this row
     * @param columnKey - The key of the column being rendered
     * @param index - The index of the row in the current page
     * @returns React node to render in the cell
     */
    onRenderCell?: (item: T, columnKey: keyof T, index: number) => React.ReactNode;
    /**
     * Custom render function for entire rows
     * When provided, this will be used instead of the default row rendering
     * @param item - The data item for this row
     * @param index - The index of the row in the current page
     * @param columns - Array of column definitions
     * @returns React node to render as the row
     */
    onRenderRow?: (item: T, index: number, columns: Column<T>[]) => React.ReactNode;
    /**
     * Custom render function for column headers
     * @param column - The column definition
     * @param index - The index of the column
     * @returns React node to render as the header
     */
    onRenderHeader?: (column: Column<T>, index: number) => React.ReactNode;
    /**
     * Callback fired when a row is clicked/invoked
     * @param item - The data item that was clicked
     * @param index - The index of the row in the current page
     */
    onItemInvoked?: (item: T, index: number) => void;
    /**
     * Callback fired when a column header is clicked
     * @param column - The column definition that was clicked
     * @param ev - The mouse event
     */
    onColumnHeaderClick?: (column: Column<T>, ev?: React.MouseEvent) => void;
    /**
     * Function to get a unique key for each item
     * If not provided, will use item.id or the index
     * @param item - The data item
     * @param index - The index of the item in the data array
     * @returns Unique key (string or number)
     */
    getKey?: (item: T, index: number) => string | number;
    /**
     * Callback fired when the active item changes
     * @param item - The newly active item, or undefined if no item is active
     * @param index - The index of the active item, or undefined if no item is active
     */
    onActiveItemChanged?: (item: T | undefined, index: number | undefined) => void;
    /**
     * Callback fired when right-clicking on a row (context menu)
     * @param item - The data item that was right-clicked
     * @param index - The index of the row in the current page
     * @param ev - The mouse event
     */
    onItemContextMenu?: (item: T, index: number, ev: React.MouseEvent) => void;
    /**
     * Additional CSS class name for the table container
     */
    className?: string;
    /**
     * Inline styles for the table container
     */
    styles?: React.CSSProperties;
    /**
     * Selection mode for the table
     * @default 'none'
     */
    selectionMode?: SelectionMode;
    /**
     * Callback fired when selection changes
     * @param selectedItems - Array of currently selected items
     */
    onSelectionChanged?: (selectedItems: T[]) => void;
    /**
     * Whether to show pagination controls
     * @default true
     */
    showPagination?: boolean;
}
/**
 * Return type from the useTable hook
 * @template T - The type of data items
 */
export interface UseTableReturn<T extends Record<string, any>> {
    /** Filtered data (after applying filters and search) */
    filtered: T[];
    /** Paginated data (current page items) */
    paged: T[];
    /** Current page number (1-indexed) */
    currentPage: number;
    /** Function to set the current page */
    setCurrentPage: (page: number) => void;
    /** Total number of pages */
    totalPages: number;
    /** Number of items per page */
    itemsPerPage: number;
    /** Current search term */
    search: string;
    /** Function to set the search term */
    setSearch: (search: string) => void;
    /** Current sort key (column being sorted) */
    sortKey: keyof T | null;
    /** Current sort direction */
    sortDir: 'asc' | 'desc';
    /** Function to handle sorting */
    handleSort: (key: keyof T, direction?: 'asc' | 'desc') => void;
    /** Current filters (field -> selected values) */
    filters: Record<string, string[]>;
    /** Function to set filter for a field */
    setFilter: (field: string, values: string[]) => void;
}
//# sourceMappingURL=index.d.ts.map