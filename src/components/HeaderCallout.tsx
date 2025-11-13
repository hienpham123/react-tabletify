import * as React from "react";
import '../styles/callout.css'

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

export function HeaderCallout({
    anchorRef,
    onSortAsc,
    onSortDesc,
    onFilter,
    onDismiss,
    onMouseEnter,
    onMouseLeave,
    sortable = true,
    filterable = true,
}: HeaderCalloutProps) {
    const calloutRef = React.useRef<HTMLDivElement>(null);

    if (!anchorRef.current) return null;
    const rect = anchorRef.current.getBoundingClientRect();

    return (
        <div
            ref={calloutRef}
            className="th-callout"
            style={{
                top: rect.bottom + 6,
                left: rect.left,
                position: "fixed",
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {sortable && (
                <>
                    <button onClick={onSortAsc} className="th-callout-item">
                        <span className="th-callout-icon">↑</span>
                        <span className="th-callout-text">A to Z</span>
                    </button>
                    <button onClick={onSortDesc} className="th-callout-item">
                        <span className="th-callout-icon">↓</span>
                        <span className="th-callout-text">Z to A</span>
                    </button>
                </>
            )}
            {sortable && filterable && <hr className="th-callout-divider" />}
            {filterable && (
                <button onClick={onFilter} className="th-callout-item">
                    <span className="th-callout-text">Filter by</span>
                </button>
            )}
        </div>
    );
}
