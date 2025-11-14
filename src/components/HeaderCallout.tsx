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
    onGroupBy,
    isGrouped = false,
    onColumnSettings,
    onTotalsChange,
    totalsValue = 'none',
    columnLabel = 'Column',
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
    enableGroupBy = false,
    enableTotals = false,
}: HeaderCalloutProps) {
    const calloutRef = React.useRef<HTMLDivElement>(null);
    const [hoveredSubmenu, setHoveredSubmenu] = React.useState<'column-settings' | 'totals' | null>(null);
    const submenuTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        return () => {
            if (submenuTimeoutRef.current) {
                clearTimeout(submenuTimeoutRef.current);
            }
        };
    }, []);

    if (!anchorRef.current) return null;
    const rect = anchorRef.current.getBoundingClientRect();

    const handleSubmenuEnter = (menu: 'column-settings' | 'totals') => {
        if (submenuTimeoutRef.current) {
            clearTimeout(submenuTimeoutRef.current);
        }
        setHoveredSubmenu(menu);
    };

    const handleSubmenuLeave = () => {
        submenuTimeoutRef.current = setTimeout(() => {
            setHoveredSubmenu(null);
        }, 150);
    };

    return (
        <>
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
                            <span className="th-callout-text">Ascending</span>
                        </button>
                        <button onClick={onSortDesc} className="th-callout-item">
                            <span className="th-callout-text">Descending</span>
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
                {enableGroupBy && onGroupBy && (
                    <>
                        <hr className="th-callout-divider" />
                        <button 
                            onClick={onGroupBy} 
                            className={`th-callout-item ${isGrouped ? 'th-callout-item-selected' : ''}`}
                        >
                            <span className="th-callout-text">Group by {columnLabel}</span>
                            {isGrouped && <span className="th-callout-checkmark">✓</span>}
                        </button>
                    </>
                )}
                {(onPinLeft || onPinRight || onUnpin || onColumnSettings || enableTotals) && <hr className="th-callout-divider" />}
                {onColumnSettings ? (
                    <div
                        className="th-callout-item th-callout-item-with-submenu"
                        onMouseEnter={() => handleSubmenuEnter('column-settings')}
                        onMouseLeave={handleSubmenuLeave}
                    >
                        <span className="th-callout-text">Column settings</span>
                        <span className="th-callout-arrow">›</span>
                        {hoveredSubmenu === 'column-settings' && (
                            <div
                                className="th-callout-submenu"
                                onMouseEnter={() => handleSubmenuEnter('column-settings')}
                                onMouseLeave={handleSubmenuLeave}
                            >
                                {pinned === null && onPinLeft && (
                                    <button onClick={onPinLeft} className="th-callout-submenu-item">
                                        <span className="th-callout-text">Pin left</span>
                                    </button>
                                )}
                                {pinned === null && onPinRight && (
                                    <button onClick={onPinRight} className="th-callout-submenu-item">
                                        <span className="th-callout-text">Pin right</span>
                                    </button>
                                )}
                                {pinned !== null && onUnpin && (
                                    <button onClick={onUnpin} className="th-callout-submenu-item">
                                        <span className="th-callout-text">Unpin</span>
                                    </button>
                                )}
                                {enableColumnVisibility && onToggleVisibility && (
                                    <>
                                        {(onPinLeft || onPinRight || onUnpin) && <hr className="th-callout-divider" />}
                                        <button onClick={onToggleVisibility} className="th-callout-submenu-item">
                                            <span className="th-callout-text">{visible ? 'Hide column' : 'Show column'}</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <>
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
                    </>
                )}
                {enableTotals && onTotalsChange && (
                    <div
                        className="th-callout-item th-callout-item-with-submenu"
                        onMouseEnter={() => handleSubmenuEnter('totals')}
                        onMouseLeave={handleSubmenuLeave}
                    >
                        <span className="th-callout-text">Totals</span>
                        <span className="th-callout-arrow">›</span>
                        {hoveredSubmenu === 'totals' && (
                            <div
                                className="th-callout-submenu"
                                onMouseEnter={() => handleSubmenuEnter('totals')}
                                onMouseLeave={handleSubmenuLeave}
                            >
                                <button
                                    onClick={() => onTotalsChange('none')}
                                    className={`th-callout-submenu-item ${totalsValue === 'none' ? 'th-callout-item-selected' : ''}`}
                                >
                                    <span className="th-callout-text">None</span>
                                    {totalsValue === 'none' && <span className="th-callout-checkmark">✓</span>}
                                </button>
                                <button
                                    onClick={() => onTotalsChange('count')}
                                    className={`th-callout-submenu-item ${totalsValue === 'count' ? 'th-callout-item-selected' : ''}`}
                                >
                                    <span className="th-callout-text">Count</span>
                                    {totalsValue === 'count' && <span className="th-callout-checkmark">✓</span>}
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {!onColumnSettings && enableColumnVisibility && onToggleVisibility && (
                    <>
                        <hr className="th-callout-divider" />
                        <button onClick={onToggleVisibility} className="th-callout-item">
                            <span className="th-callout-text">{visible ? 'Hide column' : 'Show column'}</span>
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
