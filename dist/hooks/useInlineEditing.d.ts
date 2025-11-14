import * as React from "react";
/**
 * Hook to manage inline cell editing functionality
 *
 * @template T - The type of data items
 * @param onCellEdit - Callback when cell is edited
 * @returns Editing state and handlers
 */
export declare function useInlineEditing<T extends Record<string, any>>(onCellEdit?: (item: T, columnKey: keyof T, newValue: any, index: number) => void): {
    editingCell: {
        rowIndex: number;
        columnKey: keyof T;
    } | null;
    editValue: string;
    editInputRef: React.RefObject<HTMLInputElement | null>;
    setEditValue: React.Dispatch<React.SetStateAction<string>>;
    handleCellEditStart: (item: T, column: {
        key: keyof T;
        editable?: boolean;
    }, rowIndex: number) => void;
    handleCellEditSave: (item: T, columnKey: keyof T, rowIndex: number) => void;
    handleCellEditCancel: () => void;
};
