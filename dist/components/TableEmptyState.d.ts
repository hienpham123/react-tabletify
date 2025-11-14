import * as React from "react";
interface TableEmptyStateProps {
    emptyMessage?: string;
    onRenderEmpty?: () => React.ReactNode;
}
/**
 * Empty state component displayed when table has no data
 *
 * Shows a message indicating no data is available
 */
export declare function TableEmptyState({ emptyMessage, onRenderEmpty, }: TableEmptyStateProps): import("react/jsx-runtime").JSX.Element;
export {};
