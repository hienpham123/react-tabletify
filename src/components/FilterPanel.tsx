import * as React from "react";
import '../styles/filter-panel.css';
import { CloseIcon } from "../icons";

interface FilterPanelProps {
    field: string;
    values: string[];
    selected: string[];
    onApply: (selected: string[]) => void;
    onDismiss: () => void;
}

const ITEM_HEIGHT = 36; // Height of each filter option item in pixels
const OVERSCAN = 5; // Number of items to render outside visible area for smooth scrolling

export function FilterPanel({ field, values, selected, onApply, onDismiss }: FilterPanelProps) {
    const [chosen, setChosen] = React.useState<string[]>(selected);
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const optionsListRef = React.useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = React.useState<number>(0);
    const [containerHeight, setContainerHeight] = React.useState<number>(0);

    // Sync state when selected prop changes (only when panel opens or field changes)
    React.useEffect(() => {
        setChosen(selected);
        setSearchTerm(""); // Reset search when field changes
        setScrollTop(0); // Reset scroll position when field changes
    }, [field]); // Only sync when field changes (panel opens for different field)

    const toggle = (v: string) => {
        setChosen((prev) =>
            prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]
        );
    };

    const handleClearAll = () => {
        setChosen([]);
    };

    // Filter values based on search term
    const filteredValues = React.useMemo(() => {
        if (!searchTerm.trim()) return values;
        const lowerSearch = searchTerm.toLowerCase();
        return values.filter((v) => v.toLowerCase().includes(lowerSearch));
    }, [values, searchTerm]);

    // Measure container height
    React.useEffect(() => {
        const updateContainerHeight = () => {
            if (optionsListRef.current) {
                setContainerHeight(optionsListRef.current.clientHeight);
            }
        };

        // Use requestAnimationFrame to ensure DOM is ready
        requestAnimationFrame(() => {
            updateContainerHeight();
        });

        window.addEventListener('resize', updateContainerHeight);
        return () => window.removeEventListener('resize', updateContainerHeight);
    }, []);

    // Calculate virtual scrolling range
    const virtualScrollRange = React.useMemo(() => {
        if (filteredValues.length === 0 || containerHeight === 0) {
            return {
                start: 0,
                end: 0,
                totalHeight: 0,
                visibleItems: [],
                offsetY: 0
            };
        }

        const totalHeight = filteredValues.length * ITEM_HEIGHT;

        // Calculate start and end indices with overscan
        let start = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
        let end = Math.min(
            filteredValues.length,
            Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + OVERSCAN
        );

        return {
            start,
            end,
            totalHeight,
            visibleItems: filteredValues.slice(start, end),
            offsetY: start * ITEM_HEIGHT,
        };
    }, [filteredValues, scrollTop, containerHeight]);

    // Handle scroll event with throttling
    const handleScroll = React.useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget;
        setScrollTop(target.scrollTop);
    }, []);

    // Update container height when panel opens or filtered values change
    React.useEffect(() => {
        const updateHeight = () => {
            if (optionsListRef.current) {
                const height = optionsListRef.current.clientHeight;
                if (height > 0) {
                    setContainerHeight(height);
                }
            }
        };

        // Update immediately and also after a short delay to ensure accurate measurement
        updateHeight();
        const timeoutId = setTimeout(updateHeight, 100);
        return () => clearTimeout(timeoutId);
    }, [filteredValues.length, field]);

    return (
        <div className="hh-filter-panel open">
            <div className="hh-filter-header">
                <strong>Filter by '{field}'</strong>
                <button className="hh-filter-close" onClick={onDismiss} aria-label="Close">
                    <CloseIcon width={16} height={16} />
                </button>
            </div>

            <div className="hh-filter-content">
                <div className="hh-filter-search">
                    <input
                        type="text"
                        className="hh-filter-search-input"
                        placeholder={`Select ${field} to display...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div
                    className="hh-filter-options-list"
                    ref={optionsListRef}
                    onScroll={handleScroll}
                >
                    {filteredValues.length > 0 ? (
                        <>
                            {/* Virtual scrolling container */}
                            <div
                                style={{
                                    height: virtualScrollRange.totalHeight,
                                    position: 'relative'
                                }}
                            >
                                <div
                                    style={{
                                        transform: `translateY(${virtualScrollRange.offsetY}px)`,
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                    }}
                                >
                                    {virtualScrollRange.visibleItems.map((v, index) => {
                                        const actualIndex = virtualScrollRange.start + index;
                                        return (
                                            <div key={v} className="hh-filter-option">
                                                <input
                                                    type="checkbox"
                                                    id={`filter-${field}-${v}`}
                                                    checked={chosen.includes(v)}
                                                    onChange={() => toggle(v)}
                                                />
                                                <label htmlFor={`filter-${field}-${v}`}>{v}</label>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="hh-filter-no-results">No results found</div>
                    )}
                </div>
            </div>

            <div className="hh-filter-footer">
                <button className="hh-btn primary" onClick={() => onApply(chosen)}>Apply</button>
                <button className="hh-btn" onClick={handleClearAll}>Clear all</button>
            </div>
        </div>
    );
}
