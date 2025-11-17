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
                <div className="hh-filter-options-list">
                    {filteredValues.length > 0 ? (
                        filteredValues.map((v) => (
                            <div key={v} className="hh-filter-option">
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
                        <div className="hh-filter-no-results">No results found</div>
                    )}
                </div>
            </div>

            <div className="hh-filter-footer">
                <button className="hh-btn" onClick={handleClearAll}>Clear all</button>
                <button className="hh-btn primary" onClick={() => onApply(chosen)}>Apply</button>
            </div>
        </div>
    );
}
