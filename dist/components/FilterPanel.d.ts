import '../styles/filter-panel.css';
interface FilterPanelProps {
    field: string;
    values: string[];
    selected: string[];
    onApply: (selected: string[]) => void;
    onDismiss: () => void;
}
export declare function FilterPanel({ field, values, selected, onApply, onDismiss }: FilterPanelProps): import("react/jsx-runtime").JSX.Element;
export {};
