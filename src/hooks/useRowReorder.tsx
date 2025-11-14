import * as React from "react";

/**
 * Hook to manage row drag & drop reordering
 * 
 * @template T - The type of data items
 * @param enableRowReorder - Whether row reordering is enabled
 * @param data - Original data array
 * @param filteredData - Filtered data array (from useTable)
 * @param currentGroupBy - Current groupBy field (if any)
 * @param onRowReorder - Callback when row order changes
 * @returns Row reorder state and handlers
 */
export function useRowReorder<T extends Record<string, any>>(
  enableRowReorder: boolean,
  data: T[],
  filteredData: T[],
  currentGroupBy: keyof T | undefined,
  onRowReorder?: (newData: T[], draggedItem: T, fromIndex: number, toIndex: number) => void
) {
  // Row drag & drop state
  const [draggedRowIndex, setDraggedRowIndex] = React.useState<number | null>(null);
  const [dragOverRowIndex, setDragOverRowIndex] = React.useState<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [reorderedData, setReorderedData] = React.useState<T[] | null>(null);

  // Use reordered data if available, otherwise use original data
  const effectiveData = reorderedData || data;

  // Reset reordered data when original data changes
  React.useEffect(() => {
    setReorderedData(null);
  }, [data]);

  /**
   * Handle row drag start
   */
  const handleRowDragStart = React.useCallback((e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    if (!enableRowReorder) {
      e.preventDefault();
      return;
    }
    e.stopPropagation(); // Prevent triggering onClick
    setIsDragging(true);
    setDraggedRowIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Set data for drag operation (required for some browsers)
    e.dataTransfer.setData('text/plain', String(index));
    // Add visual feedback
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '0.5';
    }
  }, [enableRowReorder]);

  /**
   * Handle row drag over
   */
  const handleRowDragOver = React.useCallback((e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    if (!enableRowReorder || draggedRowIndex === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverRowIndex !== index) {
      setDragOverRowIndex(index);
    }
  }, [enableRowReorder, draggedRowIndex, dragOverRowIndex]);

  /**
   * Handle row drag leave
   */
  const handleRowDragLeave = React.useCallback((e: React.DragEvent<HTMLTableRowElement>) => {
    if (!enableRowReorder) return;
    // Only clear if we're leaving the row itself, not a child element
    if (e.currentTarget === e.target || e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    setDragOverRowIndex(null);
  }, [enableRowReorder]);

  /**
   * Handle row drop
   */
  const handleRowDrop = React.useCallback((e: React.DragEvent<HTMLTableRowElement>, dropIndex: number) => {
    if (!enableRowReorder || draggedRowIndex === null || draggedRowIndex === dropIndex) {
      setDraggedRowIndex(null);
      setDragOverRowIndex(null);
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // Don't allow reordering when grouped
    if (currentGroupBy) {
      setDraggedRowIndex(null);
      setDragOverRowIndex(null);
      return;
    }

    // Get the actual data array to reorder
    // Use effectiveData (which includes reordered state) or original data
    const dataToReorder = [...effectiveData];
    
    // Find the actual indices in the data array
    const draggedItem = filteredData[draggedRowIndex];
    const dropItem = filteredData[dropIndex];
    
    // Find indices in original data array
    const fromIndex = dataToReorder.findIndex(item => item === draggedItem);
    const toIndex = dataToReorder.findIndex(item => item === dropItem);
    
    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      setDraggedRowIndex(null);
      setDragOverRowIndex(null);
      return;
    }

    // Create new array with reordered items
    const newData = [...dataToReorder];
    const itemToMove = newData[fromIndex];
    
    // Remove item from old position
    newData.splice(fromIndex, 1);
    
    // Insert at new position
    const adjustedToIndex = fromIndex < toIndex ? toIndex - 1 : toIndex;
    newData.splice(adjustedToIndex, 0, itemToMove);

    // Update state
    setReorderedData(newData);
    
    // Call callback with the reordered data
    if (onRowReorder) {
      onRowReorder(newData, itemToMove, fromIndex, adjustedToIndex);
    }

    // Reset drag state
    setDraggedRowIndex(null);
    setDragOverRowIndex(null);
  }, [enableRowReorder, draggedRowIndex, currentGroupBy, filteredData, effectiveData, onRowReorder]);

  /**
   * Handle row drag end
   */
  const handleRowDragEnd = React.useCallback((e: React.DragEvent<HTMLTableRowElement>) => {
    if (!enableRowReorder) return;
    // Reset opacity
    if (e.currentTarget) {
      e.currentTarget.style.opacity = '1';
    }
    setIsDragging(false);
    setDraggedRowIndex(null);
    setDragOverRowIndex(null);
    // Use setTimeout to prevent onClick from firing after drag
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
  }, [enableRowReorder]);

  return {
    // State
    draggedRowIndex,
    dragOverRowIndex,
    isDragging,
    reorderedData,
    effectiveData,
    
    // Handlers
    handleRowDragStart,
    handleRowDragOver,
    handleRowDragLeave,
    handleRowDrop,
    handleRowDragEnd,
  };
}

