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
}
export declare function HeaderCallout({ anchorRef, onSortAsc, onSortDesc, onFilter, onClearFilter, onPinLeft, onPinRight, onUnpin, onToggleVisibility, onDismiss, onMouseEnter, onMouseLeave, sortable, filterable, hasFilter, pinned, visible, enableColumnVisibility, enableColumnReorder, }: HeaderCalloutProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=HeaderCallout.d.ts.map