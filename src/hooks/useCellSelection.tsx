import * as React from "react";

export interface CellPosition {
  rowIndex: number;
  colKey: string;
}

export interface CellRange {
  start: CellPosition;
  end: CellPosition;
}

interface UseCellSelectionReturn {
  selectedCells: Set<string>;
  selectedRange: CellRange | null;
  isSelecting: boolean;
  isCopied: boolean;
  startSelection: (rowIndex: number, colKey: string, isShift: boolean) => void;
  updateSelection: (rowIndex: number, colKey: string) => void;
  endSelection: () => void;
  clearSelection: () => void;
  setCopied: (copied: boolean) => void;
  isCellSelected: (rowIndex: number, colKey: string) => boolean;
  getSelectedCells: () => CellPosition[];
  getSelectedRange: () => CellRange | null;
}

/**
 * Hook for managing cell selection (like Excel)
 * Supports single cell, range selection, and multiple ranges
 */
export function useCellSelection<T extends Record<string, any>>(
  data: T[],
  columns: Array<{ key: keyof T }>,
  enabled: boolean = true
): UseCellSelectionReturn {
  const [selectedCells, setSelectedCells] = React.useState<Set<string>>(new Set());
  const [selectedRange, setSelectedRange] = React.useState<CellRange | null>(null);
  const [isSelecting, setIsSelecting] = React.useState(false);
  const [selectionStart, setSelectionStart] = React.useState<CellPosition | null>(null);
  const [isCopied, setIsCopied] = React.useState(false);

  const getCellKey = React.useCallback((rowIndex: number, colKey: string): string => {
    return `${rowIndex}-${colKey}`;
  }, []);

  const normalizeRange = React.useCallback((start: CellPosition, end: CellPosition): CellRange => {
    const startRow = Math.min(start.rowIndex, end.rowIndex);
    const endRow = Math.max(start.rowIndex, end.rowIndex);
    
    // Find column indices
    const startColIndex = columns.findIndex(c => String(c.key) === start.colKey);
    const endColIndex = columns.findIndex(c => String(c.key) === end.colKey);
    
    // Fallback if column not found
    const safeStartColIndex = startColIndex >= 0 ? startColIndex : 0;
    const safeEndColIndex = endColIndex >= 0 ? endColIndex : columns.length - 1;
    
    const minColIndex = Math.min(safeStartColIndex, safeEndColIndex);
    const maxColIndex = Math.max(safeStartColIndex, safeEndColIndex);
    
    return {
      start: {
        rowIndex: startRow,
        colKey: String(columns[Math.max(0, minColIndex)]?.key || start.colKey),
      },
      end: {
        rowIndex: endRow,
        colKey: String(columns[Math.min(columns.length - 1, maxColIndex)]?.key || end.colKey),
      },
    };
  }, [columns]);

  const getCellsInRange = React.useCallback((range: CellRange): CellPosition[] => {
    const cells: CellPosition[] = [];
    const startRow = Math.min(range.start.rowIndex, range.end.rowIndex);
    const endRow = Math.max(range.start.rowIndex, range.end.rowIndex);
    
    const startColIndex = columns.findIndex(c => String(c.key) === range.start.colKey);
    const endColIndex = columns.findIndex(c => String(c.key) === range.end.colKey);
    
    // Fallback if column not found
    const safeStartColIndex = startColIndex >= 0 ? startColIndex : 0;
    const safeEndColIndex = endColIndex >= 0 ? endColIndex : columns.length - 1;
    
    const minColIndex = Math.min(safeStartColIndex, safeEndColIndex);
    const maxColIndex = Math.max(safeStartColIndex, safeEndColIndex);
    
    for (let row = startRow; row <= endRow; row++) {
      for (let col = minColIndex; col <= maxColIndex; col++) {
        if (columns[col]) {
          cells.push({
            rowIndex: row,
            colKey: String(columns[col].key),
          });
        }
      }
    }
    
    return cells;
  }, [columns]);

  const startSelection = React.useCallback((rowIndex: number, colKey: string, isShift: boolean) => {
    if (!enabled) return;
    
    const pos: CellPosition = { rowIndex, colKey };
    setSelectionStart(pos);
    setIsSelecting(true);
    
    if (isShift && selectedRange) {
      // Extend existing selection
      const newRange = normalizeRange(selectedRange.start, pos);
      setSelectedRange(newRange);
      const cells = getCellsInRange(newRange);
      setSelectedCells(new Set(cells.map(c => getCellKey(c.rowIndex, c.colKey))));
    } else {
      // Start new selection
      setSelectedRange({ start: pos, end: pos });
      setSelectedCells(new Set([getCellKey(rowIndex, colKey)]));
    }
  }, [enabled, selectedRange, normalizeRange, getCellsInRange, getCellKey]);

  const updateSelection = React.useCallback((rowIndex: number, colKey: string) => {
    if (!enabled || !isSelecting || !selectionStart) return;
    
    const endPos: CellPosition = { rowIndex, colKey };
    const range = normalizeRange(selectionStart, endPos);
    setSelectedRange(range);
    
    const cells = getCellsInRange(range);
    setSelectedCells(new Set(cells.map(c => getCellKey(c.rowIndex, c.colKey))));
  }, [enabled, isSelecting, selectionStart, normalizeRange, getCellsInRange, getCellKey]);

  const endSelection = React.useCallback(() => {
    setIsSelecting(false);
    setSelectionStart(null);
  }, []);

  const clearSelection = React.useCallback(() => {
    setSelectedCells(new Set());
    setSelectedRange(null);
    setIsSelecting(false);
    setSelectionStart(null);
    setIsCopied(false);
  }, []);

  const setCopied = React.useCallback((copied: boolean) => {
    setIsCopied(copied);
  }, []);

  const isCellSelected = React.useCallback((rowIndex: number, colKey: string): boolean => {
    return selectedCells.has(getCellKey(rowIndex, colKey));
  }, [selectedCells, getCellKey]);

  const getSelectedCells = React.useCallback((): CellPosition[] => {
    if (selectedRange) {
      return getCellsInRange(selectedRange);
    }
    return Array.from(selectedCells).map(key => {
      const [rowIndex, colKey] = key.split('-');
      return { rowIndex: parseInt(rowIndex, 10), colKey };
    });
  }, [selectedRange, selectedCells, getCellsInRange]);

  const getSelectedRange = React.useCallback((): CellRange | null => {
    return selectedRange;
  }, [selectedRange]);

  return {
    selectedCells,
    selectedRange,
    isSelecting,
    isCopied,
    startSelection,
    updateSelection,
    endSelection,
    clearSelection,
    setCopied,
    isCellSelected,
    getSelectedCells,
    getSelectedRange,
  };
}

