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
export function useRowSelection<T extends Record<string, any>>(
  data: T[],
  selectionMode: 'none' | 'single' | 'multiple',
  onSelectionChanged?: (selected: T[]) => void,
  onActiveItemChanged?: (item: T, index: number) => void,
  getItemKey?: (item: T, index: number) => string | number
) {
  const [selectedItems, setSelectedItems] = React.useState<Set<string | number>>(new Set());
  const [activeItemIndex, setActiveItemIndex] = React.useState<number | undefined>(undefined);

  /**
   * Get unique key for item
   */
  const getKey = React.useCallback((item: T, index: number): string | number => {
    if (getItemKey) return getItemKey(item, index);
    return item.id !== undefined ? item.id : index;
  }, [getItemKey]);

  /**
   * Handle checkbox selection change
   */
  const handleCheckboxChange = React.useCallback((item: T, index: number, checked: boolean) => {
    const key = getKey(item, index);
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (selectionMode === 'single') {
        newSet.clear();
        if (checked) {
          newSet.add(key);
        }
      } else if (selectionMode === 'multiple') {
        if (checked) {
          newSet.add(key);
        } else {
          newSet.delete(key);
        }
      }

      if (onSelectionChanged) {
        const selected = data.filter((d, i) => newSet.has(getKey(d, i)));
        onSelectionChanged(selected);
      }

      return newSet;
    });

    setActiveItemIndex(index);
    if (onActiveItemChanged) {
      onActiveItemChanged(item, index);
    }
  }, [selectionMode, getKey, onSelectionChanged, onActiveItemChanged, data]);

  /**
   * Handle row click selection
   */
  const handleItemClick = React.useCallback((item: T, index: number, ev: React.MouseEvent) => {
    // Don't trigger if clicking on checkbox
    if ((ev.target as HTMLElement).closest('.th-selection-checkbox')) {
      return;
    }

    if (selectionMode !== 'none') {
      const key = getKey(item, index);
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        if (selectionMode === 'single') {
          newSet.clear();
          newSet.add(key);
        } else if (selectionMode === 'multiple') {
          if (ev.ctrlKey || ev.metaKey) {
            if (newSet.has(key)) {
              newSet.delete(key);
            } else {
              newSet.add(key);
            }
          } else {
            newSet.clear();
            newSet.add(key);
          }
        }

        if (onSelectionChanged) {
          const selected = data.filter((d, i) => newSet.has(getKey(d, i)));
          onSelectionChanged(selected);
        }

        return newSet;
      });
    }

    setActiveItemIndex(index);
    if (onActiveItemChanged) {
      onActiveItemChanged(item, index);
    }
  }, [selectionMode, getKey, onSelectionChanged, onActiveItemChanged, data]);

  /**
   * Handle select all checkbox
   */
  const handleSelectAll = React.useCallback((checked: boolean) => {
    if (selectionMode !== 'multiple') return;
    
    setSelectedItems(prev => {
      const newSet: Set<string | number> = checked ? new Set(data.map((d, i) => getKey(d, i))) : new Set();
      
      if (onSelectionChanged) {
        const selected = checked ? [...data] : [];
        onSelectionChanged(selected);
      }
      
      return newSet;
    });
  }, [selectionMode, data, getKey, onSelectionChanged]);

  /**
   * Check if all items are selected
   */
  const isAllSelected = React.useMemo(() => {
    if (selectionMode !== 'multiple' || data.length === 0) return false;
    return data.every((d, i) => selectedItems.has(getKey(d, i)));
  }, [selectionMode, data, selectedItems, getKey]);

  /**
   * Check if selection is indeterminate (some but not all selected)
   */
  const isIndeterminate = React.useMemo(() => {
    if (selectionMode !== 'multiple' || data.length === 0) return false;
    const selectedCount = data.filter((d, i) => selectedItems.has(getKey(d, i))).length;
    return selectedCount > 0 && selectedCount < data.length;
  }, [selectionMode, data, selectedItems, getKey]);

  /**
   * Check if item is selected
   */
  const isItemSelected = React.useCallback((item: T, index: number) => {
    return selectedItems.has(getKey(item, index));
  }, [selectedItems, getKey]);

  return {
    selectedItems,
    activeItemIndex,
    isAllSelected,
    isIndeterminate,
    getItemKey: getKey,
    handleCheckboxChange,
    handleItemClick,
    handleSelectAll,
    isItemSelected,
    setSelectedItems,
  };
}

