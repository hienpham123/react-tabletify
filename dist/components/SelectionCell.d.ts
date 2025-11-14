interface SelectionCellProps {
    selectionMode: 'none' | 'single' | 'multiple';
    checked: boolean;
    indeterminate?: boolean;
    onChange: (checked: boolean) => void;
    onSelectAll?: (checked: boolean) => void;
}
/**
 * SelectionCell - Renders selection checkbox/radio in table header or row
 */
export declare function SelectionCell({ selectionMode, checked, indeterminate, onChange, onSelectAll, }: SelectionCellProps): import("react/jsx-runtime").JSX.Element | null;
export {};
