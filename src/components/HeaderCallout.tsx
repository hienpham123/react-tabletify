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
    groupable?: boolean;
    settingsable?: boolean;
    totalsable?: boolean;
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
    groupable = false,
    settingsable = false,
    totalsable = false,
}: HeaderCalloutProps) {
    const calloutRef = React.useRef<HTMLDivElement>(null);
    const [hoveredSubmenu, setHoveredSubmenu] = React.useState<'column-settings' | 'totals' | null>(null);
    const submenuTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
    
    // Calculate initial position - use anchorRef.current if available, otherwise use default
    const initialRect = anchorRef.current?.getBoundingClientRect();
    const [calloutStyle, setCalloutStyle] = React.useState<React.CSSProperties>({
        top: initialRect ? initialRect.bottom + 6 : 0,
        left: initialRect ? initialRect.left : 0,
        position: "fixed",
    });

    React.useEffect(() => {
        return () => {
            if (submenuTimeoutRef.current) {
                clearTimeout(submenuTimeoutRef.current);
            }
        };
    }, []);

    React.useEffect(() => {
        if (!calloutRef.current || !anchorRef.current) return;
        
        // Use setTimeout to ensure callout is rendered before calculating height
        const updatePosition = () => {
            if (!calloutRef.current || !anchorRef.current) return;
            
            const anchorRect = anchorRef.current.getBoundingClientRect();
            const calloutRect = calloutRef.current.getBoundingClientRect();
            const calloutHeight = calloutRect.height || 200; // Fallback height
            
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - anchorRect.bottom;
            const spaceAbove = anchorRect.top;
            
            // If not enough space below and more space above, open upward
            if (spaceBelow < calloutHeight && spaceAbove > spaceBelow) {
                setCalloutStyle({
                    top: anchorRect.top - calloutHeight - 6,
                    left: anchorRect.left,
                    position: "fixed",
                });
            } else {
                setCalloutStyle({
                    top: anchorRect.bottom + 6,
                    left: anchorRect.left,
                    position: "fixed",
                });
            }
        };
        
        setTimeout(updatePosition, 0);
        
        // Also update on scroll and resize
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        
        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
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
                className="hh-callout"
                style={calloutStyle}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {sortable && (
                    <>
                        <button onClick={onSortAsc} className="hh-callout-item">
                            <span className="hh-callout-text">Ascending</span>
                        </button>
                        <button onClick={onSortDesc} className="hh-callout-item">
                            <span className="hh-callout-text">Descending</span>
                        </button>
                    </>
                )}
                {sortable && filterable && <hr className="hh-callout-divider" />}
                {filterable && hasFilter && onClearFilter && (
                    <button onClick={onClearFilter} className="hh-callout-item">
                        <span className="hh-callout-text">Clear filter</span>
                    </button>
                )}
                {filterable && hasFilter && onClearFilter && <hr className="hh-callout-divider" />}
                {filterable && (
                    <button onClick={onFilter} className="hh-callout-item">
                        <span className="hh-callout-text">Filter by</span>
                    </button>
                )}
                {groupable && onGroupBy && (
                    <>
                        <hr className="hh-callout-divider" />
                        <button
                            onClick={onGroupBy}
                            className={`hh-callout-item ${isGrouped ? 'hh-callout-item-selected' : ''}`}
                        >
                            <span className="hh-callout-text">Group by {columnLabel}</span>
                            {isGrouped && <span className="hh-callout-checkmark">✓</span>}
                        </button>
                    </>
                )}
                {((settingsable && onColumnSettings) || totalsable) && <hr className="hh-callout-divider" />}
                {settingsable && onColumnSettings && (
                    <div
                        className="hh-callout-item hh-callout-item-with-submenu"
                        onMouseEnter={() => handleSubmenuEnter('column-settings')}
                        onMouseLeave={handleSubmenuLeave}
                    >
                        <span className="hh-callout-text">Column settings</span>
                        <span className="hh-callout-arrow">›</span>
                        {hoveredSubmenu === 'column-settings' && (
                            <div
                                className="hh-callout-submenu"
                                onMouseEnter={() => handleSubmenuEnter('column-settings')}
                                onMouseLeave={handleSubmenuLeave}
                            >
                                {pinned === null && onPinLeft && (
                                    <button onClick={onPinLeft} className="hh-callout-submenu-item">
                                        <span className="hh-callout-text">Pin left</span>
                                    </button>
                                )}
                                {pinned === null && onPinRight && (
                                    <button onClick={onPinRight} className="hh-callout-submenu-item">
                                        <span className="hh-callout-text">Pin right</span>
                                    </button>
                                )}
                                {pinned !== null && onUnpin && (
                                    <button onClick={onUnpin} className="hh-callout-submenu-item">
                                        <span className="hh-callout-text">Unpin</span>
                                    </button>
                                )}
                                {enableColumnVisibility && onToggleVisibility && (
                                    <>
                                        {(onPinLeft || onPinRight || onUnpin) && <hr className="hh-callout-divider" />}
                                        <button onClick={onToggleVisibility} className="hh-callout-submenu-item">
                                            <span className="hh-callout-text">{visible ? 'Hide column' : 'Show column'}</span>
                                        </button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )}
                {totalsable && onTotalsChange && (
                    <div
                        className="hh-callout-item hh-callout-item-with-submenu"
                        onMouseEnter={() => handleSubmenuEnter('totals')}
                        onMouseLeave={handleSubmenuLeave}
                    >
                        <span className="hh-callout-text">Totals</span>
                        <span className="hh-callout-arrow">›</span>
                        {hoveredSubmenu === 'totals' && (
                            <div
                                className="hh-callout-submenu"
                                onMouseEnter={() => handleSubmenuEnter('totals')}
                                onMouseLeave={handleSubmenuLeave}
                            >
                                <button
                                    onClick={() => onTotalsChange('none')}
                                    className={`hh-callout-submenu-item ${totalsValue === 'none' ? 'hh-callout-item-selected' : ''}`}
                                >
                                    <span className="hh-callout-text">None</span>
                                    {totalsValue === 'none' && <span className="hh-callout-checkmark">✓</span>}
                                </button>
                                <button
                                    onClick={() => onTotalsChange('count')}
                                    className={`hh-callout-submenu-item ${totalsValue === 'count' ? 'hh-callout-item-selected' : ''}`}
                                >
                                    <span className="hh-callout-text">Count</span>
                                    {totalsValue === 'count' && <span className="hh-callout-checkmark">✓</span>}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
