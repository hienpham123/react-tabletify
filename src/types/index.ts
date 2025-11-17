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
  /** Optional CSS class name for the column header */
  className?: string;
  /** Optional inline styles for the column header */
  style?: React.CSSProperties;
  /** Optional CSS class name for cells in this column */
  cellClassName?: string;
  /** Optional inline styles for cells in this column */
  cellStyle?: React.CSSProperties;
  /** Optional width for the column (e.g., "100px", "20%", "auto") */
  width?: string | number;
  /** Optional minimum width for the column */
  minWidth?: string | number;
  /** Optional maximum width for the column */
  maxWidth?: string | number;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Whether the column is filterable */
  filterable?: boolean;
  /** Whether the column is resizable */
  resizable?: boolean;
  /** Text alignment for the column ('left' | 'center' | 'right') */
  align?: 'left' | 'center' | 'right';
  /** Whether the column is editable */
  editable?: boolean;
  /** Editor type for editable columns: 'text' (default), 'select' (dropdown), 'date', or custom via onRenderEditCell */
  editor?: 'text' | 'select' | 'date';
  /** Options for 'select' editor type */
  options?: Array<{ key: string; text: string; disabled?: boolean }>;
  /** 
   * Custom render function for editing cells
   * When provided, this will be used instead of the default input when editing
   * @param item - The data item for this row
   * @param columnKey - The key of the column being edited
   * @param value - The current value being edited
   * @param onChange - Callback to update the value: (newValue: any) => void
   * @param onBlur - Callback when the edit component loses focus: () => void
   * @param onKeyDown - Callback for keyboard events: (e: React.KeyboardEvent) => void
   * @param onSave - Callback to save the value: () => boolean (returns false if validation fails)
   * @param onCancel - Callback to cancel editing: () => void
   * @param hasError - Whether there is a validation error
   * @param validationError - The validation error message (if any)
   * @param enableCellSelection - Whether Excel-like cell selection is enabled
   * @returns React node to render as the edit component (e.g., input, select, datepicker)
   */
  onRenderEditCell?: (
    item: T,
    columnKey: keyof T,
    value: any,
    onChange: (newValue: any) => void,
    onBlur: () => void,
    onKeyDown: (e: React.KeyboardEvent) => void,
    onSave: (valueToSave?: any) => boolean | Promise<boolean>,
    onCancel: () => void,
    hasError: boolean,
    validationError: string | null,
    enableCellSelection: boolean
  ) => React.ReactNode;
  /** 
   * Validation function for editable columns
   * @param value - The new value being entered
   * @param item - The data item for this row
   * @param columnKey - The key of the column being edited
   * @returns Error message string if validation fails, or null/undefined if valid
   */
  validate?: (value: any, item: T, columnKey: keyof T) => string | null | undefined;
  /** Whether the column can be grouped */
  groupable?: boolean;
  /** Whether the column settings option is available */
  settingsable?: boolean;
  /** Whether the totals option is available */
  totalsable?: boolean;
  /** Pin position for the column ('left' | 'right' | null) */
  pinned?: 'left' | 'right' | null;
  /** Whether to show callout menu when hovering over header (default: true) */
  showCallout?: boolean;
}

/**
 * Selection mode for the table
 * - 'none': No selection allowed
 * - 'single': Only one item can be selected at a time (radio buttons)
 * - 'multiple': Multiple items can be selected (checkboxes)
 */
export type SelectionMode = 'none' | 'single' | 'multiple';

/**
 * Table density/layout mode
 * - 'compact': Tighter spacing, smaller padding
 * - 'normal': Standard spacing (default)
 * - 'spacious': More spacing, larger padding
 */
export type DensityMode = 'compact' | 'normal' | 'spacious';

/**
 * Theme mode for the table
 * - 'light': Light theme (default)
 * - 'dark': Dark theme
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Complete theme configuration for the table
 * Similar to Fluent UI's applyTheme()
 */
export interface TableTheme {
  /** Theme mode */
  mode?: ThemeMode;
  
  /** Color palette */
  colors: {
    /** Background colors */
    background?: string;
    surface?: string;
    headerBackground?: string;
    rowBackground?: string;
    rowBackgroundAlternate?: string;
    selectedRowBackground?: string;
    hoverRowBackground?: string;
    groupHeaderBackground?: string;
    
    /** Text colors */
    text?: string;
    textSecondary?: string;
    headerText?: string;
    rowText?: string;
    selectedRowText?: string;
    
    /** Border colors */
    border?: string;
    borderLight?: string;
    rowBorder?: string;
    
    /** Interactive colors */
    focus?: string;
    focusBorder?: string;
    hover?: string;
    active?: string;
    disabled?: string;
    
    /** Status colors */
    primary?: string;
    success?: string;
    warning?: string;
    error?: string;
  };
  
  /** Spacing configuration */
  spacing?: {
    /** Padding for cells */
    cellPadding?: string;
    /** Padding for header cells */
    headerPadding?: string;
    /** Row height */
    rowHeight?: string;
    /** Compact row height */
    rowHeightCompact?: string;
    /** Spacious row height */
    rowHeightSpacious?: string;
    /** Gap between elements */
    gap?: string;
  };
  
  /** Typography */
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    fontSizeSmall?: string;
    fontSizeLarge?: string;
    fontWeight?: string;
    fontWeightBold?: string;
    lineHeight?: string;
  };
  
  /** Border radius */
  borderRadius?: {
    table?: string;
    cell?: string;
    button?: string;
  };
  
  /** Shadows */
  shadows?: {
    table?: string;
    header?: string;
    callout?: string;
    panel?: string;
  };
  
  /** Transitions */
  transitions?: {
    duration?: string;
    easing?: string;
  };
}

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

  /** 
   * Options for items per page selector (e.g., [10, 25, 50, 100])
   * When provided, a dropdown will be shown to change items per page
   */
  itemsPerPageOptions?: number[];

  /** 
   * Callback when items per page changes
   * @param itemsPerPage - The new items per page value
   */
  onItemsPerPageChange?: (itemsPerPage: number) => void;

  /** 
   * Table density/layout mode
   * @default 'normal'
   */
  density?: DensityMode;

  /** 
   * Theme mode (light/dark) or custom theme object
   * @default 'light'
   * 
   * @example
   * // Simple mode
   * theme="dark"
   * 
   * @example
   * // Custom theme
   * theme={{
   *   mode: 'light',
   *   colors: {
   *     background: '#ffffff',
   *     headerBackground: '#fafafa',
   *     primary: '#107c10',
   *   },
   *   spacing: {
   *     cellPadding: '12px',
   *     rowHeight: '48px',
   *   }
   * }}
   */
  theme?: ThemeMode | TableTheme;

  /** 
   * Enable zebra striping (alternating row colors)
   * @default false
   */
  zebraStripes?: boolean;

  /** 
   * Make header sticky when scrolling
   * @default false
   */
  stickyHeader?: boolean;

  /** 
   * Custom row height (in pixels)
   * @default undefined (auto)
   */
  rowHeight?: number;

  /** 
   * Enable column visibility toggle
   * @default false
   */
  enableColumnVisibility?: boolean;

  /** 
   * Enable column reordering (drag & drop)
   * @default false
   */
  enableColumnReorder?: boolean;

  /** 
   * Show loading state
   * @default false
   */
  loading?: boolean;

  /** 
   * Custom loading component
   */
  onRenderLoading?: () => React.ReactNode;

  /** 
   * Custom empty state message
   */
  emptyMessage?: string;

  /** 
   * Custom empty state component
   */
  onRenderEmpty?: () => React.ReactNode;

  /** 
   * Row actions menu items
   * @param item - The data item
   * @param index - The index of the row
   * @returns Array of action items
   */
  rowActions?: (item: T, index: number) => Array<{
    key: string;
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T, index: number) => void;
    disabled?: boolean;
  }>;
  enableCellSelection?: boolean;

  /** 
   * Custom row hover effect
   * @default true
   */
  enableRowHover?: boolean;

  /** 
   * Custom CSS class for table rows
   */
  rowClassName?: string | ((item: T, index: number) => string);

  /** 
   * Custom styles for table rows
   */
  rowStyles?: React.CSSProperties | ((item: T, index: number) => React.CSSProperties);

  /** 
   * Show borders around table
   * @default false
   */
  bordered?: boolean;

  /** 
   * Show row borders
   * @default true
   */
  rowBorders?: boolean;

  /** 
   * Header background color
   */
  headerBackgroundColor?: string;

  /** 
   * Header text color
   */
  headerTextColor?: string;

  /** 
   * Row background color (alternating if zebraStripes is true)
   */
  rowBackgroundColor?: string | [string, string]; // [even, odd] if zebraStripes

  /** 
   * Row text color
   */
  rowTextColor?: string;

  /** 
   * Selected row background color
   */
  selectedRowBackgroundColor?: string;

  /** 
   * Hover row background color
   */
  hoverRowBackgroundColor?: string;

  /** 
   * Focus outline color
   */
  focusColor?: string;

  /** 
   * Maximum table height (enables scrolling)
   */
  maxHeight?: string | number;

  /** 
   * Enable keyboard navigation
   * @default true
   */
  enableKeyboardNavigation?: boolean;

  /** 
   * Callback when column visibility changes
   */
  onColumnVisibilityChange?: (visibleColumns: (keyof T)[]) => void;

  /** 
   * Callback when column order changes
   */
  onColumnReorder?: (newOrder: (keyof T)[]) => void;

  /** 
   * Callback when a cell is edited
   * @param item - The data item being edited
   * @param columnKey - The key of the column being edited
   * @param newValue - The new value
   * @param index - The index of the row
   */
  onCellEdit?: (item: T, columnKey: keyof T, newValue: any, index: number) => void;

  /** 
   * Pinned columns configuration
   * @default {}
   */
  pinnedColumns?: Record<keyof T, 'left' | 'right'>;

  /** 
   * Callback when column pin status changes
   * @param columnKey - The key of the column
   * @param pinPosition - The new pin position ('left' | 'right' | null)
   */
  onColumnPin?: (columnKey: keyof T, pinPosition: 'left' | 'right' | null) => void;

  /** 
   * Whether to show tooltip on cells when content is truncated
   * @default true
   */
  showTooltip?: boolean;

  /** 
   * Enable row drag & drop to reorder rows
   * @default false
   */
  enableRowReorder?: boolean;

  /** 
   * Callback when row order changes after drag & drop
   * @param newData - The reordered data array
   * @param draggedItem - The item that was dragged
   * @param fromIndex - Original index of the dragged item
   * @param toIndex - New index where the item was dropped
   */
  onRowReorder?: (newData: T[], draggedItem: T, fromIndex: number, toIndex: number) => void;

  /** 
   * Enable export functionality (CSV/Excel)
   * @default false
   */
  enableExport?: boolean;

  /** 
   * Export format options
   * - 'csv': Export as CSV file
   * - 'excel': Export as Excel file (requires xlsx library)
   * - 'both': Show both CSV and Excel options
   * @default 'both'
   */
  exportFormat?: 'csv' | 'excel' | 'both';

  /** 
   * Custom filename for exported file (without extension)
   * @default 'export'
   */
  exportFileName?: string;

  /** 
   * Callback before export (can be used to transform data)
   * @param data - The data to be exported
   * @param columns - The columns to be exported
   * @returns Transformed data and columns, or undefined to use original
   */
  onBeforeExport?: (data: T[], columns: Column<T>[]) => { data: T[]; columns: Column<T>[] } | undefined;

  /** 
   * Callback after export
   * @param format - The export format used ('csv' or 'excel')
   * @param filename - The filename used
   */
  onAfterExport?: (format: 'csv' | 'excel', filename: string) => void;
}

/**
 * Return type from the useTable hook
 * @template T - The type of data items
 */
export interface UseTableReturn<T extends Record<string, any>> {
  /** Filtered data (after applying filters and search) */
  filtered: T[];
  /** Sorted data (after applying filters, search, and sorting) */
  sorted: T[];
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
  /** Go to first page */
  goToFirstPage: () => void;
  /** Go to last page */
  goToLastPage: () => void;
  /** Go to next page */
  goToNextPage: () => void;
  /** Go to previous page */
  goToPrevPage: () => void;
  /** Current search term */
  search: string;
  /** Function to set the search term */
  setSearch: (search: string) => void;
  /** Clear search term */
  clearSearch: () => void;
  /** Current sort key (column being sorted) */
  sortKey: keyof T | null;
  /** Current sort direction */
  sortDir: 'asc' | 'desc';
  /** Function to handle sorting */
  handleSort: (key: keyof T, direction?: 'asc' | 'desc') => void;
  /** Reset sorting to default */
  resetSort: () => void;
  /** Current filters (field -> selected values) */
  filters: Record<string, string[]>;
  /** Function to set filter for a field */
  setFilter: (field: string, values: string[]) => void;
  /** Clear filter for a specific field */
  clearFilter: (field: string) => void;
  /** Clear all filters */
  clearFilters: () => void;
  /** Reset all: clear search, filters, sort, and go to page 1 */
  resetAll: () => void;
}

