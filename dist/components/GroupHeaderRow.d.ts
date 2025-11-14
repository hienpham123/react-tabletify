interface GroupHeaderRowProps {
    groupKey: string;
    groupLabel: string;
    rowCount: number;
    isExpanded: boolean;
    onToggle: () => void;
    colSpan: number;
}
/**
 * GroupHeaderRow - Renders a group header row with expand/collapse functionality
 */
export declare function GroupHeaderRow({ groupKey, groupLabel, rowCount, isExpanded, onToggle, colSpan, }: GroupHeaderRowProps): import("react/jsx-runtime").JSX.Element;
export {};
