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
export function TableSkeleton<T extends Record<string, any>>({
  columns,
  itemsPerPage,
  selectionMode,
  onRenderLoading,
}: TableSkeletonProps<T>) {
  if (onRenderLoading) {
    return <>{onRenderLoading()}</>;
  }

  return (
    <div className="th-loading-skeleton">
      <div className="th-skeleton-header">
        {selectionMode !== 'none' && <div className="th-skeleton-cell" style={{ width: '48px' }} />}
        {columns.map((col, i) => (
          <div key={i} className="th-skeleton-cell" style={{ width: col.width || '150px' }} />
        ))}
      </div>
      {Array.from({ length: itemsPerPage }).map((_, i) => (
        <div key={i} className="th-skeleton-row">
          {selectionMode !== 'none' && <div className="th-skeleton-cell" style={{ width: '48px' }} />}
          {columns.map((col, j) => (
            <div key={j} className="th-skeleton-cell" style={{ width: col.width || '150px' }} />
          ))}
        </div>
      ))}
    </div>
  );
}

