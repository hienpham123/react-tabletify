import * as React from "react";
/**
 * Hook to manage row selection state and logic
 *
 * @template T - The type of data items
 * @param data - Array of data items
 * @param selectionMode - Selection mode: 'none', 'single', or 'multiple'
 * @param onSelectionChanged - Callback when selection changes
 * @param onActiveItemChanged - Callback when active item changes
 * @param getItemKey - Function to get unique key for item
 * @returns Selection state and handlers
 */
export declare function useRowSelection<T extends Record<string, any>>(data: T[], selectionMode: 'none' | 'single' | 'multiple', onSelectionChanged?: (selected: T[]) => void, onActiveItemChanged?: (item: T, index: number) => void, getItemKey?: (item: T, index: number) => string | number): {
    selectedItems: Set<string | number>;
    activeItemIndex: number | undefined;
    isAllSelected: boolean;
    isIndeterminate: boolean;
    getItemKey: (item: T, index: number) => string | number;
    handleCheckboxChange: (item: T, index: number, checked: boolean) => void;
    handleItemClick: (item: T, index: number, ev: React.MouseEvent) => void;
    handleSelectAll: (checked: boolean) => void;
    isItemSelected: (item: T, index: number) => boolean;
    setSelectedItems: React.Dispatch<React.SetStateAction<Set<string | number>>>;
};
//# sourceMappingURL=useRowSelection.d.ts.map