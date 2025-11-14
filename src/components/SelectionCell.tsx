import * as React from "react";

interface SelectionCellProps {
  selectionMode: 'none' | 'single' | 'multiple';
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
}

/**
 * SelectionCell - Renders selection checkbox/radio in table header or row
 */
export function SelectionCell({
  selectionMode,
  checked,
  indeterminate,
  onChange,
  onSelectAll,
}: SelectionCellProps) {
  if (selectionMode === 'none') {
    return null;
  }

  const isHeader = onSelectAll !== undefined;

  return (
    <td className="th-selection-column">
      <div className="th-selection-checkbox-wrapper">
        {selectionMode === 'multiple' ? (
          <input
            type="checkbox"
            className="th-selection-checkbox"
            checked={checked}
            ref={(input) => {
              if (input && indeterminate !== undefined) {
                input.indeterminate = indeterminate;
              }
            }}
            onChange={(e) => {
              if (isHeader && onSelectAll) {
                onSelectAll(e.target.checked);
              } else {
                onChange(e.target.checked);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          isHeader ? (
            <div className="th-selection-checkbox-wrapper"></div>
          ) : (
            <input
              type="radio"
              className="th-selection-checkbox"
              checked={checked}
              onChange={(e) => onChange(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
            />
          )
        )}
      </div>
    </td>
  );
}

