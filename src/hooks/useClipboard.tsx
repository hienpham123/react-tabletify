import * as React from "react";
import type { CellPosition } from "./useCellSelection";

interface UseClipboardReturn<T extends Record<string, any>> {
  copyCells: (cells: CellPosition[], data: T[], columns: Array<{ key: keyof T; label: string }>) => void;
  cutCells: (cells: CellPosition[], data: T[], columns: Array<{ key: keyof T; label: string }>) => void;
  pasteCells: (targetCells: CellPosition[], data: T[], columns: Array<{ key: keyof T; label: string }>, onCellEdit: (item: T, columnKey: keyof T, newValue: any, index: number) => void) => void;
  pasteFromSystemClipboard: (targetCells: CellPosition[], data: T[], columns: Array<{ key: keyof T; label: string }>, onCellEdit: (item: T, columnKey: keyof T, newValue: any, index: number) => void) => Promise<boolean>;
  canPaste: () => boolean;
  getClipboardData: () => string[][] | null;
  clearClipboard: () => void;
}

/**
 * Hook for managing clipboard operations (copy, cut, paste)
 * Similar to Excel functionality
 */
export function useClipboard<T extends Record<string, any>>(): UseClipboardReturn<T> {
  const [clipboardData, setClipboardData] = React.useState<string[][] | null>(null);
  const [isCut, setIsCut] = React.useState(false);
  const [cutCells, setCutCells] = React.useState<CellPosition[]>([]);

  const copyCells = React.useCallback((
    cells: CellPosition[],
    data: T[],
    columns: Array<{ key: keyof T; label: string }>
  ) => {
    if (cells.length === 0) return;

    // Sort cells by row, then by column
    const sortedCells = [...cells].sort((a, b) => {
      if (a.rowIndex !== b.rowIndex) {
        return a.rowIndex - b.rowIndex;
      }
      const aIndex = columns.findIndex(c => String(c.key) === a.colKey);
      const bIndex = columns.findIndex(c => String(c.key) === b.colKey);
      return aIndex - bIndex;
    });

    // Group cells by row
    const rowsMap = new Map<number, CellPosition[]>();
    sortedCells.forEach(cell => {
      if (!rowsMap.has(cell.rowIndex)) {
        rowsMap.set(cell.rowIndex, []);
      }
      rowsMap.get(cell.rowIndex)!.push(cell);
    });

    // Build 2D array
    const result: string[][] = [];
    rowsMap.forEach((rowCells, rowIndex) => {
      const row: string[] = [];
      rowCells.sort((a, b) => {
        const aIndex = columns.findIndex(c => String(c.key) === a.colKey);
        const bIndex = columns.findIndex(c => String(c.key) === b.colKey);
        return aIndex - bIndex;
      });
      rowCells.forEach(cell => {
        const item = data[rowIndex];
        if (item) {
          const value = item[cell.colKey as keyof T];
          row.push(value !== null && value !== undefined ? String(value) : '');
        } else {
          row.push('');
        }
      });
      result.push(row);
    });

    setClipboardData(result);
    setIsCut(false);
    setCutCells([]);

    // Also copy to system clipboard as TSV (tab-separated values)
    const tsv = result.map(row => row.join('\t')).join('\n');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(tsv).catch(() => {
        // Fallback: use execCommand for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = tsv;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      });
    }
  }, []);

  const cutCellsFn = React.useCallback((
    cells: CellPosition[],
    data: T[],
    columns: Array<{ key: keyof T; label: string }>
  ) => {
    copyCells(cells, data, columns);
    setIsCut(true);
    setCutCells(cells);
  }, [copyCells]);

  const pasteCells = React.useCallback((
    targetCells: CellPosition[],
    data: T[],
    columns: Array<{ key: keyof T; label: string }>,
    onCellEdit: (item: T, columnKey: keyof T, newValue: any, index: number) => void
  ) => {
    if (!clipboardData || clipboardData.length === 0 || targetCells.length === 0) return;

    // If clipboard has only 1 cell and target has multiple cells, paste that value to all target cells
    if (clipboardData.length === 1 && clipboardData[0].length === 1) {
      const value = clipboardData[0][0];
      targetCells.forEach(cell => {
        const item = data[cell.rowIndex];
        if (item) {
          onCellEdit(item, cell.colKey as keyof T, value, cell.rowIndex);
        }
      });
    } else {
      // Paste data starting from first target cell, repeating if needed
      const targetStart = targetCells[0];
      if (!targetStart) return;
      
      // Find the starting column index
      const startColIndex = columns.findIndex(c => String(c.key) === targetStart.colKey);
      if (startColIndex === -1) {
        return;
      }

      // Paste each row from clipboard
      clipboardData.forEach((row, rowOffset) => {
        const targetRowIndex = targetStart.rowIndex + rowOffset;
        if (targetRowIndex < 0 || targetRowIndex >= data.length) {
          return;
        }

        const targetItem = data[targetRowIndex];
        if (!targetItem) {
          return;
        }

        // Paste each value in the row to consecutive columns starting from startColIndex
        row.forEach((value, colOffset) => {
          const targetColIndex = startColIndex + colOffset;
          
          // Skip if column index is out of bounds
          if (targetColIndex < 0 || targetColIndex >= columns.length) {
            return;
          }

          const targetCol = columns[targetColIndex];
          if (!targetCol) {
            return;
          }
          
          // Paste the value
          try {
            onCellEdit(targetItem, targetCol.key, value, targetRowIndex);
          } catch (error) {
            // Silently handle errors
          }
        });
      });
    }

    // If it was a cut operation, clear the cut cells
    if (isCut && cutCells.length > 0) {
      cutCells.forEach(cell => {
        const item = data[cell.rowIndex];
        if (item) {
          onCellEdit(item, cell.colKey as keyof T, '', cell.rowIndex);
        }
      });
      setIsCut(false);
      setCutCells([]);
    }
  }, [clipboardData, isCut, cutCells]);

  const pasteFromSystemClipboard = React.useCallback(async (
    targetCells: CellPosition[],
    data: T[],
    columns: Array<{ key: keyof T; label: string }>,
    onCellEdit: (item: T, columnKey: keyof T, newValue: any, index: number) => void
  ): Promise<boolean> => {
    if (targetCells.length === 0) return false;

    try {
      let clipboardText = '';
      
      // Try to read from system clipboard
      if (navigator.clipboard && navigator.clipboard.readText) {
        clipboardText = await navigator.clipboard.readText();
      } else {
        // Clipboard API not available
        return false;
      }

      if (!clipboardText || clipboardText.trim().length === 0) return false;

      // Parse TSV (tab-separated values) - Excel uses tabs for columns and newlines for rows
      const rows = clipboardText.split(/\r?\n/).filter(row => row.trim().length > 0);
      if (rows.length === 0) return false;


      const parsedData: string[][] = rows.map(row => {
        // Split by tab, but handle quoted values
        const cells: string[] = [];
        let currentCell = '';
        let inQuotes = false;
        
        for (let i = 0; i < row.length; i++) {
          const char = row[i];
          
          if (char === '"') {
            if (inQuotes && row[i + 1] === '"') {
              // Escaped quote
              currentCell += '"';
              i++; // Skip next quote
            } else {
              // Toggle quote state
              inQuotes = !inQuotes;
            }
          } else if (char === '\t' && !inQuotes) {
            // Tab separator (outside quotes)
            cells.push(currentCell);
            currentCell = '';
          } else {
            currentCell += char;
          }
        }
        
        // Add the last cell
        cells.push(currentCell);
        return cells;
      });


      if (parsedData.length === 0 || parsedData[0].length === 0) return false;

      // Paste data starting from first target cell
      const targetStart = targetCells[0];
      
      // If clipboard has only 1 cell and target has multiple cells, paste that value to all target cells
      if (parsedData.length === 1 && parsedData[0].length === 1) {
        const value = parsedData[0][0];
        targetCells.forEach(cell => {
          const item = data[cell.rowIndex];
          if (item) {
            onCellEdit(item, cell.colKey as keyof T, value, cell.rowIndex);
          }
        });
        return true;
      } else {
        // Paste data starting from first target cell, repeating if needed
        let pasted = false;
        const targetStart = targetCells[0];
        if (!targetStart) return false;
        
        // Find the starting column index
        const startColIndex = columns.findIndex(c => String(c.key) === targetStart.colKey);
        if (startColIndex === -1) {
          return false;
        }

        // Paste each row from clipboard
        parsedData.forEach((row, rowOffset) => {
          const targetRowIndex = targetStart.rowIndex + rowOffset;
          if (targetRowIndex < 0 || targetRowIndex >= data.length) return;

          const targetItem = data[targetRowIndex];
          if (!targetItem) return;

          // Paste each value in the row to consecutive columns starting from startColIndex
          row.forEach((value, colOffset) => {
            const targetColIndex = startColIndex + colOffset;
            
            // Skip if column index is out of bounds
            if (targetColIndex < 0 || targetColIndex >= columns.length) {
              return;
            }

            const targetCol = columns[targetColIndex];
            if (!targetCol) {
              return;
            }
            
            // Paste the value
            try {
              onCellEdit(targetItem, targetCol.key, value, targetRowIndex);
              pasted = true;
            } catch (error) {
              // Silently handle errors
            }
          });
        });
        return pasted;
      }
    } catch (error) {
      // Clipboard access might be denied or not available
      return false;
    }
  }, []);

  const canPaste = React.useCallback((): boolean => {
    return clipboardData !== null && clipboardData.length > 0;
  }, [clipboardData]);

  const getClipboardData = React.useCallback((): string[][] | null => {
    return clipboardData;
  }, [clipboardData]);

  const clearClipboard = React.useCallback(() => {
    setClipboardData(null);
    setIsCut(false);
    setCutCells([]);
  }, []);

  return {
    copyCells,
    cutCells: cutCellsFn,
    pasteCells,
    pasteFromSystemClipboard,
    canPaste,
    getClipboardData,
    clearClipboard,
  };
}

