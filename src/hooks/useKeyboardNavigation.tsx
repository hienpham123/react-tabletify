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
export function useKeyboardNavigation<T extends Record<string, any>>(
  tableRef: React.RefObject<HTMLDivElement>,
  enableKeyboardNavigation: boolean,
  loading: boolean,
  currentItems: T[],
  selectionMode: 'none' | 'single' | 'multiple',
  getItemKey: (item: T, index: number) => string | number,
  onSelectionChange?: (selectedKeys: Set<string | number>) => void
) {
  const [focusedRowIndex, setFocusedRowIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!enableKeyboardNavigation || !tableRef.current || loading) return;

    /**
     * Handle keyboard events
     */
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading) return;
      
      if (currentItems.length === 0) return;

      let newFocusedIndex = focusedRowIndex ?? 0;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          newFocusedIndex = Math.min(newFocusedIndex + 1, currentItems.length - 1);
          setFocusedRowIndex(newFocusedIndex);
          break;
        case 'ArrowUp':
          e.preventDefault();
          newFocusedIndex = Math.max(newFocusedIndex - 1, 0);
          setFocusedRowIndex(newFocusedIndex);
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          if (focusedRowIndex !== null && selectionMode !== 'none') {
            const item = currentItems[focusedRowIndex];
            const itemKey = getItemKey(item, focusedRowIndex);
            if (selectionMode === 'single') {
              onSelectionChange?.(new Set([itemKey]));
            } else {
              // Toggle selection for multiple mode
              // This will be handled by the parent component
              onSelectionChange?.(new Set([itemKey]));
            }
          }
          break;
        case 'Escape':
          e.preventDefault();
          setFocusedRowIndex(null);
          onSelectionChange?.(new Set());
          break;
      }
    };

    tableRef.current.addEventListener('keydown', handleKeyDown);
    return () => {
      tableRef.current?.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableKeyboardNavigation, loading, focusedRowIndex, selectionMode, currentItems, getItemKey, onSelectionChange, tableRef]);

  return {
    focusedRowIndex,
    setFocusedRowIndex,
  };
}

