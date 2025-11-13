import * as React from "react";
import '../styles/callout.css';
interface HeaderCalloutProps {
    anchorRef: React.RefObject<HTMLDivElement>;
    onSortAsc: () => void;
    onSortDesc: () => void;
    onFilter: () => void;
    onDismiss: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    sortable?: boolean;
    filterable?: boolean;
}
export declare function HeaderCallout({ anchorRef, onSortAsc, onSortDesc, onFilter, onDismiss, onMouseEnter, onMouseLeave, sortable, filterable, }: HeaderCalloutProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=HeaderCallout.d.ts.map