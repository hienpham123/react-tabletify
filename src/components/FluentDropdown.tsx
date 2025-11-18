import * as React from "react";

export interface FluentDropdownOption {
    key: string;
    text: string;
    disabled?: boolean;
}

export interface FluentDropdownProps {
    value?: string;
    options: FluentDropdownOption[];
    placeholder?: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    onSave?: (valueToSave?: any) => boolean | Promise<boolean>;
    className?: string;
    hasError?: boolean;
    enableCellSelection?: boolean;
    autoFocus?: boolean;
    onDismissCallout?: () => void;
}

export const FluentDropdown: React.FC<FluentDropdownProps> = ({
    value,
    options,
    placeholder = "Select...",
    onChange,
    onBlur,
    onKeyDown,
    onSave,
    className = "",
    hasError = false,
    enableCellSelection = false,
    autoFocus = false,
    onDismissCallout,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [focusedIndex, setFocusedIndex] = React.useState(-1);
    const [listPosition, setListPosition] = React.useState<{ top: number; left: number; width: number } | null>(null);
    const [internalValue, setInternalValue] = React.useState<string>(value || '');
    const containerRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const listRef = React.useRef<HTMLDivElement>(null);

    // Sync internal value with prop value only when value prop changes from parent
    // Use a ref to track the previous value prop to detect external changes
    const prevValueRef = React.useRef<string>(value || '');
    React.useEffect(() => {
        // Only sync if value prop changed from parent (not from user selection)
        // This prevents overriding user's selection before save
        if (value !== prevValueRef.current) {
            prevValueRef.current = value || '';
            setInternalValue(value || '');
        }
    }, [value]);

    // Use useMemo to ensure selectedOption is recalculated when internalValue changes
    const selectedOption = React.useMemo(() => {
        return options.find(opt => opt.key === internalValue);
    }, [options, internalValue]);

    // Track if component has auto-opened to prevent re-opening on value change
    const hasAutoOpenedRef = React.useRef(false);
    
    // Auto-focus and auto-open when component mounts (for double-click to edit)
    React.useEffect(() => {
        if (autoFocus && buttonRef.current && !hasAutoOpenedRef.current) {
            buttonRef.current.focus();
            // Auto-open dropdown when entering edit mode via double-click
            // Set position first, then open
            const rect = buttonRef.current.getBoundingClientRect();
            setListPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
            setIsOpen(true);
            hasAutoOpenedRef.current = true;
        }
    }, [autoFocus]);

    // Update position when scrolling or resizing
    React.useEffect(() => {
        if (isOpen && buttonRef.current && listRef.current) {
            const updatePosition = () => {
                if (buttonRef.current && listRef.current) {
                    const rect = buttonRef.current.getBoundingClientRect();
                    const listHeight = listRef.current.offsetHeight || 200; // Fallback height
                    
                    const viewportHeight = window.innerHeight;
                    const spaceBelow = viewportHeight - rect.bottom;
                    const spaceAbove = rect.top;
                    
                    // If not enough space below and more space above, open upward
                    if (spaceBelow < listHeight && spaceAbove > spaceBelow) {
                        setListPosition({
                            top: rect.top + window.scrollY - listHeight,
                            left: rect.left + window.scrollX,
                            width: rect.width,
                        });
                    } else {
                        setListPosition({
                            top: rect.bottom + window.scrollY,
                            left: rect.left + window.scrollX,
                            width: rect.width,
                        });
                    }
                }
            };

            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition);
            // Use setTimeout to ensure list is rendered before calculating height
            setTimeout(updatePosition, 0);

            return () => {
                window.removeEventListener("scroll", updatePosition, true);
                window.removeEventListener("resize", updatePosition);
            };
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (listRef.current && !listRef.current.contains(event.target as Node) &&
                containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setFocusedIndex(-1);
                setListPosition(null);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (onKeyDown) {
            onKeyDown(e);
        }

        if (e.key === "Escape") {
            setIsOpen(false);
            setFocusedIndex(-1);
            setListPosition(null);
            if (buttonRef.current) {
                buttonRef.current.focus();
            }
            return;
        }

        if (!isOpen) {
            if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
                e.preventDefault();
                setIsOpen(true);
                setFocusedIndex(0);
            }
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            const enabledOptions = options.filter(opt => !opt.disabled);
            const currentIndex = enabledOptions.findIndex(opt => opt.key === value);
            let nextIndex = currentIndex + 1;
            if (nextIndex >= enabledOptions.length) {
                nextIndex = 0;
            }
            setFocusedIndex(nextIndex);
            if (listRef.current) {
                const optionElement = listRef.current.children[nextIndex] as HTMLElement;
                if (optionElement) {
                    optionElement.scrollIntoView({ block: "nearest" });
                }
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const enabledOptions = options.filter(opt => !opt.disabled);
            const currentIndex = enabledOptions.findIndex(opt => opt.key === value);
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) {
                prevIndex = enabledOptions.length - 1;
            }
            setFocusedIndex(prevIndex);
            if (listRef.current) {
                const optionElement = listRef.current.children[prevIndex] as HTMLElement;
                if (optionElement) {
                    optionElement.scrollIntoView({ block: "nearest" });
                }
            }
        } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const enabledOptions = options.filter(opt => !opt.disabled);
            if (focusedIndex >= 0 && focusedIndex < enabledOptions.length) {
                const selectedKey = enabledOptions[focusedIndex].key;
                // Update internal value immediately for UI feedback
                setInternalValue(selectedKey);
                // Also call onChange to update parent state immediately
                onChange(selectedKey);
                setIsOpen(false);
                setFocusedIndex(-1);
                setListPosition(null);

                // Update value to display (don't save yet)
                // User must click save button to save
                if (buttonRef.current) {
                    buttonRef.current.focus();
                }
            }
        } else if (e.key === "Tab") {
            setIsOpen(false);
            setFocusedIndex(-1);
            setListPosition(null);
        }
    };

    const handleOptionClick = (optionKey: string) => {
        // Update internal value immediately for UI feedback
        setInternalValue(optionKey);
        // Also call onChange to update parent state immediately
        onChange(optionKey);

        // Dismiss callout if provided
        if (onDismissCallout) {
            onDismissCallout();
        }

        // Close dropdown immediately when value is selected
        setIsOpen(false);
        setFocusedIndex(-1);
        setListPosition(null);

        // Focus back to button to show the updated value
        // Use setTimeout to ensure dropdown is closed first
        setTimeout(() => {
            if (buttonRef.current) {
                buttonRef.current.focus();
            }
        }, 0);
    };

    const handleButtonClick = () => {
        if (!isOpen && buttonRef.current) {
            // Calculate position for dropdown list
            const rect = buttonRef.current.getBoundingClientRect();
            setListPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
            const enabledOptions = options.filter(opt => !opt.disabled);
            const currentIndex = enabledOptions.findIndex(opt => opt.key === internalValue);
            setFocusedIndex(currentIndex >= 0 ? currentIndex : 0);
        }
        setIsOpen(!isOpen);
    };

    const handleButtonBlur = (e: React.FocusEvent) => {
        // Don't close if focus is moving to the dropdown list
        if (containerRef.current && containerRef.current.contains(e.relatedTarget as Node)) {
            return;
        }
        setIsOpen(false);
        setFocusedIndex(-1);
        setListPosition(null);
        // Don't call onBlur here - we don't want auto-save on blur for custom edit components
        // User must click Save button to save
        // Only call onBlur if focus is truly leaving the edit container (handled by parent)
    };

    const baseClassName = enableCellSelection
        ? `hh-fluent-dropdown-button hh-fluent-dropdown-button-excel ${hasError ? 'hh-fluent-dropdown-error' : ''}`
        : `hh-fluent-dropdown-button ${hasError ? 'hh-fluent-dropdown-error' : ''}`;

    return (
        <div className={`hh-fluent-dropdown-container ${className}`} ref={containerRef}>
            <button
                ref={buttonRef}
                type="button"
                className={baseClassName}
                onClick={handleButtonClick}
                onBlur={handleButtonBlur}
                onKeyDown={handleKeyDown}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                <span className={`hh-fluent-dropdown-text ${!selectedOption ? 'hh-fluent-dropdown-text-placeholder' : ''}`}>
                    {selectedOption ? selectedOption.text : placeholder}
                </span>
                <span className={`hh-fluent-dropdown-chevron ${isOpen ? 'hh-fluent-dropdown-chevron-open' : ''}`}>
                    ▼
                </span>
            </button>
            {isOpen && listPosition && (
                <div
                    className="hh-fluent-dropdown-list"
                    ref={listRef}
                    role="listbox"
                    style={{
                        top: `${listPosition.top}px`,
                        left: `${listPosition.left}px`,
                        width: `${listPosition.width}px`,
                    }}
                >
                    {options.map((option, index) => {
                        const enabledOptions = options.filter(opt => !opt.disabled);
                        const optionIndex = enabledOptions.findIndex(opt => opt.key === option.key);
                        const isFocused = optionIndex === focusedIndex && !option.disabled;
                        const isSelected = option.key === internalValue;

                        return (
                            <div
                                key={option.key}
                                className={`hh-fluent-dropdown-option ${option.disabled ? 'hh-fluent-dropdown-option-disabled' : ''} ${isFocused ? 'hh-fluent-dropdown-option-focused' : ''} ${isSelected ? 'hh-fluent-dropdown-option-selected' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!option.disabled) {
                                        handleOptionClick(option.key);
                                    }
                                }}
                                onMouseDown={(e) => {
                                    // Prevent blur on button when clicking option
                                    e.preventDefault();
                                }}
                                onMouseEnter={() => !option.disabled && setFocusedIndex(optionIndex)}
                                role="option"
                                aria-selected={isSelected}
                                aria-disabled={option.disabled}
                            >
                                {option.text}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

