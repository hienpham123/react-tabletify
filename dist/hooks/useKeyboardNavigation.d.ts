import * as React from "react";
/**
 * Hook to manage keyboard navigation for table rows
 *
 * @template T - The type of data items
 * @param tableRef - Ref to the table container
 * @param enableKeyboardNavigation - Whether keyboard navigation is enabled
 * @param loading - Whether table is in loading state
 * @param currentItems - Current items to navigate (paginated/grouped)
 * @param selectionMode - Selection mode
 * @param getItemKey - Function to get unique key for item
 * @param onSelectionChange - Callback when selection changes via keyboard
 * @returns Keyboard navigation state and handlers
 */
export declare function useKeyboardNavigation<T extends Record<string, any>>(tableRef: React.RefObject<HTMLDivElement>, enableKeyboardNavigation: boolean, loading: boolean, currentItems: T[], selectionMode: 'none' | 'single' | 'multiple', getItemKey: (item: T, index: number) => string | number, onSelectionChange?: (selectedKeys: Set<string | number>) => void): {
    focusedRowIndex: number | null;
    setFocusedRowIndex: React.Dispatch<React.SetStateAction<number | null>>;
};
