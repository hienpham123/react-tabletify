import * as React from "react";
import '../styles/filter-panel.css'

interface FilterPanelProps {
    field: string;
    values: string[];
    selected: string[];
    onApply: (selected: string[]) => void;
    onDismiss: () => void;
}

export function FilterPanel({ field, values, selected, onApply, onDismiss }: FilterPanelProps) {
    const [chosen, setChosen] = React.useState<string[]>(selected);
    const [searchTerm, setSearchTerm] = React.useState<string>("");

    // Sync state when selected prop changes (only when panel opens or field changes)
    React.useEffect(() => {
        setChosen(selected);
        setSearchTerm(""); // Reset search when field changes
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

    return (
        <div className="th-filter-panel open">
            <div className="th-filter-header">
                <strong>Filter by '{field}'</strong>
                <button className="th-filter-close" onClick={onDismiss} aria-label="Close">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.8536 3.85355C13.0488 3.65829 13.0488 3.34171 12.8536 3.14645C12.6583 2.95118 12.3417 2.95118 12.1464 3.14645L8 7.29289L3.85355 3.14645C3.65829 2.95118 3.34171 2.95118 3.14645 3.14645C2.95118 3.34171 2.95118 3.65829 3.14645 3.85355L7.29289 8L3.14645 12.1464C2.95118 12.3417 2.95118 12.6583 3.14645 12.8536C3.34171 13.0488 3.65829 13.0488 3.85355 12.8536L8 8.70711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.70711 8L12.8536 3.85355Z" fill="currentColor"/>
                    </svg>
                </button>
            </div>

            <div className="th-filter-content">
                <div className="th-filter-search">
                    <input
                        type="text"
                        className="th-filter-search-input"
                        placeholder={`Select ${field} to display...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="th-filter-options-list">
                    {filteredValues.length > 0 ? (
                        filteredValues.map((v) => (
                            <div key={v} className="th-filter-option">
                                <input
                                    type="checkbox"
                                    id={`filter-${field}-${v}`}
                                    checked={chosen.includes(v)}
                                    onChange={() => toggle(v)}
                                />
                                <label htmlFor={`filter-${field}-${v}`}>{v}</label>
                            </div>
                        ))
                    ) : (
                        <div className="th-filter-no-results">No results found</div>
                    )}
                </div>
            </div>

            <div className="th-filter-footer">
                <button className="th-btn" onClick={handleClearAll}>Clear all</button>
                <button className="th-btn primary" onClick={() => onApply(chosen)}>Apply</button>
            </div>
        </div>
    );
}
