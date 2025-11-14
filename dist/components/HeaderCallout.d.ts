import * as React from "react";
import '../styles/callout.css';
interface HeaderCalloutProps {
    anchorRef: React.RefObject<HTMLDivElement>;
    onSortAsc: () => void;
    onSortDesc: () => void;
    onFilter: () => void;
    onClearFilter?: () => void;
    onPinLeft?: () => void;
    onPinRight?: () => void;
    onUnpin?: () => void;
    onToggleVisibility?: () => void;
    onGroupBy?: () => void;
    isGrouped?: boolean;
    onColumnSettings?: boolean;
    onTotalsChange?: (value: 'none' | 'count') => void;
    totalsValue?: 'none' | 'count';
    columnLabel?: string;
    onDismiss: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    sortable?: boolean;
    filterable?: boolean;
    hasFilter?: boolean;
    pinned?: 'left' | 'right' | null;
    visible?: boolean;
    enableColumnVisibility?: boolean;
    enableColumnReorder?: boolean;
    enableGroupBy?: boolean;
    enableTotals?: boolean;
}
export declare function HeaderCallout({ anchorRef, onSortAsc, onSortDesc, onFilter, onClearFilter, onPinLeft, onPinRight, onUnpin, onToggleVisibility, onGroupBy, isGrouped, onColumnSettings, onTotalsChange, totalsValue, columnLabel, onDismiss, onMouseEnter, onMouseLeave, sortable, filterable, hasFilter, pinned, visible, enableColumnVisibility, enableColumnReorder, enableGroupBy, enableTotals, }: HeaderCalloutProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=HeaderCallout.d.ts.map