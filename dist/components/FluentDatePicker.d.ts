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
export declare const FluentDatePicker: React.FC<FluentDatePickerProps>;
