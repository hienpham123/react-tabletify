import * as React from "react";
import '../styles/callout.css'

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

export function HeaderCallout({
    anchorRef,
    onSortAsc,
    onSortDesc,
    onFilter,
    onClearFilter,
    onPinLeft,
    onPinRight,
    onUnpin,
    onToggleVisibility,
    onDismiss,
    onMouseEnter,
    onMouseLeave,
    sortable = true,
    filterable = true,
    hasFilter = false,
    pinned = null,
    visible = true,
    enableColumnVisibility = false,
    enableColumnReorder = false,
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
            {filterable && hasFilter && onClearFilter && (
                <button onClick={onClearFilter} className="th-callout-item">
                    <span className="th-callout-text">Clear filter</span>
                </button>
            )}
            {filterable && hasFilter && onClearFilter && <hr className="th-callout-divider" />}
            {filterable && (
                <button onClick={onFilter} className="th-callout-item">
                    <span className="th-callout-text">Filter by</span>
                </button>
            )}
            {(onPinLeft || onPinRight || onUnpin) && <hr className="th-callout-divider" />}
            {pinned === null && onPinLeft && (
                <button onClick={onPinLeft} className="th-callout-item">
                    <span className="th-callout-text">Pin left</span>
                </button>
            )}
            {pinned === null && onPinRight && (
                <button onClick={onPinRight} className="th-callout-item">
                    <span className="th-callout-text">Pin right</span>
                </button>
            )}
            {pinned !== null && onUnpin && (
                <button onClick={onUnpin} className="th-callout-item">
                    <span className="th-callout-text">Unpin</span>
                </button>
            )}
            {enableColumnVisibility && onToggleVisibility && (
                <>
                    <hr className="th-callout-divider" />
                    <button onClick={onToggleVisibility} className="th-callout-item">
                        <span className="th-callout-text">{visible ? 'Hide column' : 'Show column'}</span>
                    </button>
                </>
            )}
        </div>
    );
}
