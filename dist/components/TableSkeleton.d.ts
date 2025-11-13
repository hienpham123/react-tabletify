import * as React from "react";
import type { Column } from "../types";
interface TableSkeletonProps<T extends Record<string, any>> {
    columns: Column<T>[];
    itemsPerPage: number;
    selectionMode: 'none' | 'single' | 'multiple';
    onRenderLoading?: () => React.ReactNode;
}
/**
 * Skeleton loader component for table loading state
 *
 * Displays animated skeleton placeholders matching the table structure
 */
export declare function TableSkeleton<T extends Record<string, any>>({ columns, itemsPerPage, selectionMode, onRenderLoading, }: TableSkeletonProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=TableSkeleton.d.ts.map