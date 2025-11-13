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
}
export declare function HeaderCallout({ anchorRef, onSortAsc, onSortDesc, onFilter, onDismiss, onMouseEnter, onMouseLeave, }: HeaderCalloutProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=HeaderCallout.d.ts.map