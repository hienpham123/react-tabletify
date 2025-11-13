import * as React from "react";

/**
 * Hook to manage inline cell editing functionality
 * 
 * @template T - The type of data items
 * @param onCellEdit - Callback when cell is edited
 * @returns Editing state and handlers
 */
export function useInlineEditing<T extends Record<string, any>>(
  onCellEdit?: (item: T, columnKey: keyof T, newValue: any, index: number) => void
) {
  const [editingCell, setEditingCell] = React.useState<{ rowIndex: number; columnKey: keyof T } | null>(null);
  const [editValue, setEditValue] = React.useState<string>('');
  const editInputRef = React.useRef<HTMLInputElement>(null);

  /**
   * Start editing a cell
   */
  const handleCellEditStart = React.useCallback((item: T, column: { key: keyof T; editable?: boolean }, rowIndex: number) => {
    if (column.editable !== true) return;
    setEditingCell({ rowIndex, columnKey: column.key });
    setEditValue(String(item[column.key] ?? ''));
  }, []);

  /**
   * Save edited cell value
   */
  const handleCellEditSave = React.useCallback((item: T, columnKey: keyof T, rowIndex: number) => {
    if (onCellEdit) {
      onCellEdit(item, columnKey, editValue, rowIndex);
    }
    setEditingCell(null);
    setEditValue('');
  }, [onCellEdit, editValue]);

  /**
   * Cancel editing
   */
  const handleCellEditCancel = React.useCallback(() => {
    setEditingCell(null);
    setEditValue('');
  }, []);

  /**
   * Focus and select text in input when editing starts
   */
  React.useEffect(() => {
    if (editingCell && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingCell]);

  return {
    editingCell,
    editValue,
    editInputRef,
    setEditValue,
    handleCellEditStart,
    handleCellEditSave,
    handleCellEditCancel,
  };
}

