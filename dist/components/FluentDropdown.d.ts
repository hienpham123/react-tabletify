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
export declare const FluentDropdown: React.FC<FluentDropdownProps>;
