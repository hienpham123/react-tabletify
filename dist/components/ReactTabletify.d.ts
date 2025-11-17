import type { ReactTabletifyProps } from "../types";
import "./../styles/table.css";
import "./../styles/row-actions.css";
import "./../styles/cell-selection.css";
import "./../styles/fluent-dropdown.css";
import "./../styles/fluent-datepicker.css";
export declare function ReactTabletify<T extends Record<string, any>>({ columns, data, itemsPerPage, groupBy, onRenderCell, onRenderRow, onRenderHeader, onItemInvoked, onColumnHeaderClick, getKey, onActiveItemChanged, onItemContextMenu, className, styles, selectionMode, onSelectionChanged, showPagination, itemsPerPageOptions, onItemsPerPageChange, theme, maxHeight, onCellEdit, pinnedColumns, onColumnPin, showTooltip, loading, onRenderLoading, emptyMessage, onRenderEmpty, stickyHeader, enableColumnVisibility, onColumnVisibilityChange, enableColumnReorder, onColumnReorder, enableKeyboardNavigation, enableRowReorder, onRowReorder, enableExport, exportFormat, exportFileName, onBeforeExport, onAfterExport, rowActions, enableCellSelection, ...otherProps }: ReactTabletifyProps<T>): import("react/jsx-runtime").JSX.Element;
