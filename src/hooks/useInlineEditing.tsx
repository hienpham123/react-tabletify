import * as React from "react";
import type { Column } from "../types";

/**
 * Hook to manage inline cell editing functionality
 * 
 * @template T - The type of data items
 * @param onCellEdit - Callback when cell is edited
 * @param columns - Array of column definitions (for validation)
 * @returns Editing state and handlers
 */
export function useInlineEditing<T extends Record<string, any>>(
  onCellEdit?: (item: T, columnKey: keyof T, newValue: any, index: number) => void,
  columns?: Column<T>[]
) {
  const [editingCell, setEditingCell] = React.useState<{ rowIndex: number; columnKey: keyof T } | null>(null);
  const [editValue, setEditValue] = React.useState<string>('');
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [currentItem, setCurrentItem] = React.useState<T | null>(null); // Store current item for validation
  const editInputRef = React.useRef<HTMLInputElement>(null);

  /**
   * Start editing a cell
   */
  const handleCellEditStart = React.useCallback((item: T, column: { key: keyof T; editable?: boolean }, rowIndex: number) => {
    if (column.editable !== true) return;
    setEditingCell({ rowIndex, columnKey: column.key });
    setEditValue(String(item[column.key] != null ? item[column.key] : ''));
    setCurrentItem(item); // Store item for real-time validation
    setValidationError(null); // Clear any previous validation errors
  }, []);

  /**
   * Save edited cell value
   */
  const handleCellEditSave = React.useCallback((item: T, columnKey: keyof T, rowIndex: number) => {
    // Find the column definition to check for validation
    const column = columns?.find(col => col.key === columnKey);
    
    // Validate if validation function is provided
    if (column?.validate) {
      const error = column.validate(editValue, item, columnKey);
      if (error) {
        // Validation failed - set error and don't save
        setValidationError(error);
        return false; // Return false to indicate save was prevented
      }
    }
    
    // Validation passed or no validation - proceed with save
    setValidationError(null);
    if (onCellEdit) {
      onCellEdit(item, columnKey, editValue, rowIndex);
    }
    setEditingCell(null);
    setEditValue('');
    setCurrentItem(null); // Clear current item
    return true; // Return true to indicate save was successful
  }, [onCellEdit, editValue, columns]);

  /**
   * Cancel editing
   */
  const handleCellEditCancel = React.useCallback(() => {
    setEditingCell(null);
    setEditValue('');
    setValidationError(null); // Clear validation error on cancel
    setCurrentItem(null); // Clear current item
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

  // Debounce timer for validation
  const validationTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Real-time validation when edit value changes (user is typing)
  // Debounced to improve performance
  React.useEffect(() => {
    if (editingCell && currentItem) {
      // Clear previous timer
      if (validationTimerRef.current) {
        clearTimeout(validationTimerRef.current);
      }

      // Debounce validation to avoid running on every keystroke
      validationTimerRef.current = setTimeout(() => {
        const column = columns?.find(col => col.key === editingCell.columnKey);
        
        // Validate if validation function is provided
        if (column?.validate) {
          const error = column.validate(editValue, currentItem, editingCell.columnKey);
          setValidationError(error || null);
        } else {
          // No validation function, clear any previous errors
          setValidationError(null);
        }
      }, 150); // 150ms debounce
    }

    // Cleanup timer on unmount
    return () => {
      if (validationTimerRef.current) {
        clearTimeout(validationTimerRef.current);
      }
    };
  }, [editValue, editingCell, currentItem, columns]);

  return {
    editingCell,
    editValue,
    editInputRef,
    setEditValue,
    validationError,
    handleCellEditStart,
    handleCellEditSave,
    handleCellEditCancel,
  };
}

