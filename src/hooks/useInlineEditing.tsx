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
    // Always call onCellEdit if provided (it might be handleCellEdit which manages internal state)
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
   * Focus and position cursor at end of text when editing starts
   */
  React.useEffect(() => {
    if (editingCell && editInputRef.current) {
      // Use setTimeout to ensure the input is rendered before focusing
      setTimeout(() => {
        if (editInputRef.current) {
          editInputRef.current.focus();
          // Position cursor at the end of the value instead of selecting all
          const length = editInputRef.current.value.length;
          editInputRef.current.setSelectionRange(length, length);
        }
      }, 0);
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

