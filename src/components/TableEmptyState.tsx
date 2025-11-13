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
export function TableEmptyState({
  emptyMessage,
  onRenderEmpty,
}: TableEmptyStateProps) {
  if (onRenderEmpty) {
    return <>{onRenderEmpty()}</>;
  }

  return (
    <div className="th-empty-state">
      <div className="th-empty-icon">📋</div>
      <div className="th-empty-message">{emptyMessage || 'No data available'}</div>
    </div>
  );
}

