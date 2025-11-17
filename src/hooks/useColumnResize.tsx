import * as React from "react";

/**
 * Hook to manage column resizing functionality
 * 
 * @template T - The type of data items
 * @param anchorRefs - Refs to column header elements
 * @param onResizeStart - Callback when resize starts
 * @returns Resize state and handlers
 */
export function useColumnResize<T extends Record<string, any>>(
  anchorRefs: React.RefObject<Record<string, HTMLDivElement>>,
  onResizeStart?: () => void
) {
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = React.useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = React.useState<number>(0);
  const [resizeStartWidth, setResizeStartWidth] = React.useState<number>(0);

  /**
   * Handle resize start
   */
  const handleResizeStart = React.useCallback((colKey: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const colKeyStr = String(colKey);
    const anchorRef = anchorRefs.current && anchorRefs.current[colKeyStr];
    const th = anchorRef && anchorRef.parentElement as HTMLTableCellElement;
    if (!th) return;
    
    if (onResizeStart) {
      onResizeStart();
    }

    const startWidth = th.offsetWidth;
    const startX = e.clientX;

    setResizingColumn(colKeyStr);

    // Set cursor on document body to maintain resize cursor
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    setResizeStartX(startX);
    setResizeStartWidth(startWidth);

    /**
     * Handle mouse move during resize
     */
    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + diff); // Minimum width 50px
      setColumnWidths(prev => ({
        ...prev,
        [colKeyStr]: newWidth,
      }));
    };

    /**
     * Handle mouse up to end resize
     */
    const handleMouseUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      setResizingColumn(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [anchorRefs, onResizeStart]);

  return {
    columnWidths,
    resizingColumn,
    handleResizeStart,
  };
}

