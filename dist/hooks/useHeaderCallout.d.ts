import * as React from "react";
/**
 * Hook to manage header callout visibility and interactions
 *
 * @template T - The type of data items
 * @param resizingColumn - Whether a column is currently being resized
 * @returns Callout state and handlers
 */
export declare function useHeaderCallout<T extends Record<string, any>>(resizingColumn: string | null): {
    calloutKey: keyof T | null;
    setCalloutKey: React.Dispatch<React.SetStateAction<keyof T | null>>;
    handleHeaderMouseEnter: (key: keyof T | string) => void;
    handleHeaderMouseLeave: () => void;
    handleCalloutMouseEnter: () => void;
    handleCalloutMouseLeave: () => void;
    dismissCallout: () => void;
};
