import * as React from "react";
interface IconProps {
    width?: number | string;
    height?: number | string;
    className?: string;
    style?: React.CSSProperties;
}
/**
 * Check icon (checkmark) - used for save/confirm actions
 */
export declare function CheckIcon({ width, height, className, style }: IconProps): import("react/jsx-runtime").JSX.Element;
/**
 * Close icon (X) - used for cancel/close actions
 */
export declare function CloseIcon({ width, height, className, style }: IconProps): import("react/jsx-runtime").JSX.Element;
/**
 * Chevron down icon - used in table headers
 */
export declare function ChevronDownIcon({ width, height, className, style }: IconProps): import("react/jsx-runtime").JSX.Element;
/**
 * Pin icon - used to indicate pinned columns
 */
export declare function PinIcon({ width, height, className, style }: IconProps): import("react/jsx-runtime").JSX.Element;
/**
 * Filter icon - used to indicate filtered columns
 */
export declare function FilterIcon({ width, height, className, style }: IconProps): import("react/jsx-runtime").JSX.Element;
/**
 * Three dots icon - used for row actions menu
 */
export declare function ThreeDotsIcon({ width, height, className, style }: IconProps): import("react/jsx-runtime").JSX.Element;
/**
 * Chevron right icon - used for expand/collapse in group headers
 */
export declare function ChevronRightIcon({ width, height, className, style }: IconProps): import("react/jsx-runtime").JSX.Element;
/**
 * Export icon (table/document) - used for export buttons
 */
export declare function ExportIcon({ width, height, className, style }: IconProps): import("react/jsx-runtime").JSX.Element;
export {};
