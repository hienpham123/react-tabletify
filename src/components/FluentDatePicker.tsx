import * as React from "react";

export interface FluentDatePickerProps {
    value?: string;
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

export const FluentDatePicker: React.FC<FluentDatePickerProps> = ({
    value,
    placeholder = "Select date...",
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
    const [calendarPosition, setCalendarPosition] = React.useState<{ top: number; left: number; width: number } | null>(null);
    const [currentMonth, setCurrentMonth] = React.useState<Date>(() => {
        if (value) {
            const date = new Date(value);
            return isNaN(date.getTime()) ? new Date() : date;
        }
        return new Date();
    });
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const calendarRef = React.useRef<HTMLDivElement>(null);

    // Parse value to Date object
    const selectedDate = React.useMemo(() => {
        if (!value) return null;
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    }, [value]);

    // Format date for display
    const displayValue = React.useMemo(() => {
        if (!selectedDate) return '';
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, [selectedDate]);

    // Format date for display text (e.g., "Nov 17, 2025")
    const displayText = React.useMemo(() => {
        if (!selectedDate) return '';
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[selectedDate.getMonth()];
        const day = selectedDate.getDate();
        const year = selectedDate.getFullYear();
        return `${month} ${day}, ${year}`;
    }, [selectedDate]);

    // Get days in month
    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    // Helper function to compare dates (year, month, day only)
    const isSameDate = (date1: Date, date2: Date): boolean => {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
    };

    // Generate calendar days
    const calendarDays = React.useMemo(() => {
        const days: Array<{ date: Date; isCurrentMonth: boolean; isSelected: boolean; isToday: boolean }> = [];
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const today = new Date();

        // Previous month days
        // Calculate how many days from previous month to show
        // firstDay: 0=Sunday, 1=Monday, ..., 6=Saturday
        // If firstDay = 0 (Sunday), no days needed from prev month
        // If firstDay = 1 (Monday), need 1 day (Sunday)
        // If firstDay = 6 (Saturday), need 6 days (Sun-Fri)
        const daysToShowFromPrevMonth = firstDay === 0 ? 0 : firstDay;
        if (daysToShowFromPrevMonth > 0) {
            // Get previous month correctly (handle year rollover)
            const prevMonthYear = currentMonth.getMonth() === 0 ? currentMonth.getFullYear() - 1 : currentMonth.getFullYear();
            const prevMonthIndex = currentMonth.getMonth() === 0 ? 11 : currentMonth.getMonth() - 1;
            const prevMonth = new Date(prevMonthYear, prevMonthIndex + 1, 0); // Last day of previous month
            const prevMonthDays = prevMonth.getDate();
            const startDay = prevMonthDays - daysToShowFromPrevMonth + 1; // +1 to include the start day
            for (let day = startDay; day <= prevMonthDays; day++) {
                const date = new Date(prevMonthYear, prevMonthIndex, day);
                // Verify date is correct
                if (date.getFullYear() === prevMonthYear && date.getMonth() === prevMonthIndex && date.getDate() === day) {
                    days.push({
                        date,
                        isCurrentMonth: false,
                        isSelected: selectedDate != null && isSameDate(date, selectedDate),
                        isToday: isSameDate(date, today),
                    });
                }
            }
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            days.push({
                date,
                isCurrentMonth: true,
                isSelected: selectedDate != null && isSameDate(date, selectedDate),
                isToday: isSameDate(date, today),
            });
        }

        // Next month days to fill the grid
        const totalDays = days.length;
        const remainingDays = 42 - totalDays; // 6 weeks * 7 days
        for (let day = 1; day <= remainingDays; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, day);
            days.push({
                date,
                isCurrentMonth: false,
                isSelected: selectedDate != null && isSameDate(date, selectedDate),
                isToday: isSameDate(date, today),
            });
        }

        return days;
    }, [currentMonth, selectedDate]);

    // Track if component has auto-opened to prevent re-opening on value change
    const hasAutoOpenedRef = React.useRef(false);

    // Auto-focus and auto-open when component mounts (for double-click to edit)
    React.useEffect(() => {
        if (autoFocus && inputRef.current && !hasAutoOpenedRef.current) {
            inputRef.current.focus();
            inputRef.current.select(); // Select all text for easy editing
            // Auto-open calendar when entering edit mode via double-click
            // Position calendar based on input field, not icon button
            if (inputRef.current) {
                const rect = inputRef.current.getBoundingClientRect();
                setCalendarPosition({
                    top: rect.bottom + window.scrollY + 2,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                });
                setIsOpen(true);
            }
            hasAutoOpenedRef.current = true;
        }
    }, [autoFocus]);

    // Update position when scrolling or resizing
    React.useEffect(() => {
        if (!isOpen || !calendarPosition) return;

        const updatePosition = () => {
            // Position calendar based on input field, not icon button
            if (inputRef.current && calendarRef.current) {
                const rect = inputRef.current.getBoundingClientRect();
                const calendarHeight = calendarRef.current.offsetHeight || 300; // Fallback height

                const viewportHeight = window.innerHeight;
                const spaceBelow = viewportHeight - rect.bottom;
                const spaceAbove = rect.top;

                // If not enough space below and more space above, open upward
                if (spaceBelow < calendarHeight && spaceAbove > spaceBelow) {
                    setCalendarPosition({
                        top: rect.top + window.scrollY - calendarHeight - 2,
                        left: rect.left + window.scrollX,
                        width: rect.width,
                    });
                } else {
                    setCalendarPosition({
                        top: rect.bottom + window.scrollY + 2,
                        left: rect.left + window.scrollX,
                        width: rect.width,
                    });
                }
            }
        };

        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        // Use setTimeout to ensure calendar is rendered before calculating height
        setTimeout(updatePosition, 0);

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isOpen, calendarPosition]);

    // Handle click outside
    React.useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node) &&
                calendarRef.current &&
                !calendarRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
                setCalendarPosition(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleDateClick = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;

        onChange(dateString);

        // Dismiss callout if provided
        if (onDismissCallout) {
            onDismissCallout();
        }

        // Close calendar immediately when date is selected
        setIsOpen(false);
        setCalendarPosition(null);

        // Focus back to button to show the updated value
        // Use setTimeout to ensure calendar is closed first
        setTimeout(() => {
            if (buttonRef.current) {
                buttonRef.current.focus();
            }
        }, 0);
    };

    const handleButtonClick = () => {
        if (isOpen) {
            setIsOpen(false);
            setCalendarPosition(null);
        } else {
            // Position calendar based on input field, not icon button
            if (inputRef.current) {
                const rect = inputRef.current.getBoundingClientRect();
                setCalendarPosition({
                    top: rect.bottom + window.scrollY + 2,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                });
            }
            setIsOpen(true);
        }
    };

    const handleButtonBlur = (e: React.FocusEvent) => {
        if (containerRef.current && containerRef.current.contains(e.relatedTarget as Node)) {
            return;
        }
        if (calendarRef.current && calendarRef.current.contains(e.relatedTarget as Node)) {
            return;
        }
        setIsOpen(false);
        setCalendarPosition(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (onKeyDown) {
            onKeyDown(e);
        }
        if (e.key === 'Escape') {
            setIsOpen(false);
            setCalendarPosition(null);
        }
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            if (direction === 'prev') {
                newDate.setMonth(prev.getMonth() - 1);
            } else {
                newDate.setMonth(prev.getMonth() + 1);
            }
            return newDate;
        });
    };

    const goToToday = () => {
        // Only navigate to current month, don't select the date
        // User must click on the date to select it
        const today = new Date();
        setCurrentMonth(today);
        // Don't call onChange - just navigate to today's month
        // Calendar will automatically highlight today's date
    };

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // Format date for input display (dd/mm/yyyy)
    const inputValue = React.useMemo(() => {
        if (!selectedDate) return '';
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const year = selectedDate.getFullYear();
        return `${day}/${month}/${year}`;
    }, [selectedDate]);

    // Local input state for typing
    const [localInputValue, setLocalInputValue] = React.useState(inputValue);

    // Sync local input value when selectedDate changes from outside
    React.useEffect(() => {
        setLocalInputValue(inputValue);
    }, [inputValue]);

    // Parse dd/mm/yyyy format
    const parseDateInput = (input: string): Date | null => {
        // Remove all non-digit characters except /
        const cleaned = input.replace(/[^\d/]/g, '');
        const parts = cleaned.split('/');

        if (parts.length !== 3) return null;

        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
        const year = parseInt(parts[2], 10);

        if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
        if (day < 1 || day > 31) return null;
        if (month < 0 || month > 11) return null;
        if (year < 1900 || year > 2100) return null;

        const date = new Date(year, month, day);
        // Validate date (e.g., 31/02/2024 is invalid)
        if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
            return null;
        }

        return date;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newValue = e.target.value;

        // Allow empty value (user can delete everything including /)
        if (newValue === '') {
            setLocalInputValue('');
            return;
        }

        // Only allow digits and /
        newValue = newValue.replace(/[^\d/]/g, '');

        // Split by / to get parts
        const parts = newValue.split('/');
        let dayPart = parts[0] || '';
        let monthPart = parts[1] || '';
        let yearPart = parts[2] || '';

        // Auto-format: when user types 2 digits for day, auto-add /
        if (dayPart.length === 2 && monthPart === '' && !newValue.includes('/')) {
            newValue = dayPart + '/';
        }
        // Auto-format: when user types single digit month (e.g., "3" after "22/"), auto-pad and add /
        else if (dayPart.length === 2 && monthPart.length === 1 && yearPart === '') {
            const monthNum = parseInt(monthPart, 10);
            if (monthNum >= 1 && monthNum <= 9) {
                // Auto-pad month to 2 digits and add /
                newValue = dayPart + '/' + String(monthNum).padStart(2, '0') + '/';
            }
        }
        // Auto-format: when user types 2 digits for month, auto-add /
        else if (dayPart.length === 2 && monthPart.length === 2 && yearPart === '' && newValue.split('/').length === 2) {
            newValue = dayPart + '/' + monthPart + '/';
        }

        // Limit to dd/mm/yyyy format (max 10 characters: dd/mm/yyyy)
        if (newValue.length > 10) {
            newValue = newValue.substring(0, 10);
        }

        setLocalInputValue(newValue);

        // Try to parse when user finishes typing (e.g., after 10 characters: dd/mm/yyyy)
        if (newValue.length === 10) {
            const parsedDate = parseDateInput(newValue);
            if (parsedDate) {
                const year = parsedDate.getFullYear();
                const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
                const day = String(parsedDate.getDate()).padStart(2, '0');
                const dateString = `${year}-${month}-${day}`;
                onChange(dateString);
            }
        }
    };

    const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // When input loses focus, try to parse and update
        const parsedDate = parseDateInput(localInputValue);
        if (parsedDate) {
            const year = parsedDate.getFullYear();
            const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
            const day = String(parsedDate.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
            onChange(dateString);
        } else if (localInputValue && localInputValue.length > 0) {
            // If invalid, reset to current value
            setLocalInputValue(inputValue);
        }

        if (onBlur) {
            onBlur();
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (onKeyDown) {
            onKeyDown(e);
        }
        if (e.key === 'Enter') {
            e.preventDefault();
            const parsedDate = parseDateInput(localInputValue);
            if (parsedDate) {
                const year = parsedDate.getFullYear();
                const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
                const day = String(parsedDate.getDate()).padStart(2, '0');
                const dateString = `${year}-${month}-${day}`;
                onChange(dateString);
            }
            inputRef.current?.blur();
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            setCalendarPosition(null);
            setLocalInputValue(inputValue);
            inputRef.current?.blur();
        }
    };

    const baseInputClassName = enableCellSelection
        ? `hh-fluent-datepicker-input hh-fluent-datepicker-input-excel ${hasError ? 'hh-fluent-datepicker-error' : ''}`
        : `hh-fluent-datepicker-input ${hasError ? 'hh-fluent-datepicker-error' : ''}`;

    return (
        <div className={`hh-fluent-datepicker-container ${className}`} ref={containerRef}>
            <div className="hh-fluent-datepicker-input-wrapper">
                <input
                    ref={inputRef}
                    type="text"
                    className={baseInputClassName}
                    value={localInputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    placeholder={placeholder || "dd/mm/yyyy"}
                    onClick={(e) => {
                        // Don't open calendar when clicking input, only when clicking icon
                        e.stopPropagation();
                    }}
                />
                <button
                    ref={buttonRef}
                    type="button"
                    className="hh-fluent-datepicker-icon-button"
                    onClick={handleButtonClick}
                    onBlur={handleButtonBlur}
                    aria-expanded={isOpen}
                    aria-haspopup="dialog"
                    title="Open calendar"
                >
                    <span className="hh-fluent-datepicker-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" width="16" height="16">
                            <path d="M768 768h128v128H768V768zm384 768h128v128h-128v-128zm384-768h128v128h-128V768zm-384 0h128v128h-128V768zm-384 256h128v128H768v-128zm-384 0h128v128H384v-128zm1152 0h128v128h-128v-128zm-384 0h128v128h-128v-128zm-384 256h128v128H768v-128zm-384 0h128v128H384v-128zm1152 0h128v128h-128v-128zm-384 0h128v128h-128v-128zm-384 256h128v128H768v-128zm-384 0h128v128H384v-128zM2048 128v1792H0V128h384V0h128v128h1024V0h128v128h384zM128 256v256h1792V256h-256v128h-128V256H512v128H384V256H128zm1792 1536V640H128v1152h1792z" fill="currentColor" />
                        </svg>
                    </span>
                </button>
            </div>
            {isOpen && calendarPosition && (
                <div
                    className="hh-fluent-datepicker-calendar"
                    ref={calendarRef}
                    style={{
                        top: `${calendarPosition.top}px`,
                        left: `${calendarPosition.left}px`,
                        width: `${calendarPosition.width}px`,
                    }}
                >
                    <div className="hh-fluent-datepicker-header">
                        <button
                            type="button"
                            className="hh-fluent-datepicker-nav-button"
                            onClick={() => navigateMonth('prev')}
                            aria-label="Previous month"
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                        <span className="hh-fluent-datepicker-month-year">
                            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                        </span>
                        <button
                            type="button"
                            className="hh-fluent-datepicker-nav-button"
                            onClick={() => navigateMonth('next')}
                            aria-label="Next month"
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>
                    <div className="hh-fluent-datepicker-today-container">
                        <button
                            type="button"
                            className="hh-fluent-datepicker-today-button"
                            onClick={goToToday}
                        >
                            Today
                        </button>
                    </div>
                    <div className="hh-fluent-datepicker-days-header">
                        {dayNames.map((day, index) => (
                            <div key={index} className="hh-fluent-datepicker-day-header">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="hh-fluent-datepicker-days-grid">
                        {calendarDays.map((day, index) => {
                            // Format date for tooltip (dd/mm/yyyy)
                            const dayDate = day.date;
                            const dayStr = String(dayDate.getDate()).padStart(2, '0');
                            const monthStr = String(dayDate.getMonth() + 1).padStart(2, '0');
                            const yearStr = dayDate.getFullYear();
                            const dateTooltip = `${dayStr}/${monthStr}/${yearStr}`;

                            return (
                                <button
                                    key={`${day.date.getTime()}-${index}`}
                                    type="button"
                                    className={`hh-fluent-datepicker-day ${!day.isCurrentMonth ? 'hh-fluent-datepicker-day-other-month' : ''
                                        } ${day.isSelected ? 'hh-fluent-datepicker-day-selected' : ''
                                        } ${day.isToday ? 'hh-fluent-datepicker-day-today' : ''
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDateClick(day.date);
                                    }}
                                    onMouseEnter={(e) => {
                                        e.stopPropagation();
                                    }}
                                    onMouseOver={(e) => {
                                        e.stopPropagation();
                                    }}
                                    title={dateTooltip}
                                    disabled={!day.isCurrentMonth}
                                >
                                    {day.date.getDate()}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

