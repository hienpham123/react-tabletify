import * as React from "react";
import '../styles/row-actions.css';

interface RowAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (item: any, index: number) => void;
  disabled?: boolean;
}

interface RowActionsMenuProps<T extends Record<string, any>> {
  anchorRef: React.RefObject<HTMLElement | null>;
  actions: RowAction[];
  item: T;
  index: number;
  onDismiss: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function RowActionsMenu<T extends Record<string, any>>({
  anchorRef,
  actions,
  item,
  index,
  onDismiss,
  onMouseEnter,
  onMouseLeave,
}: RowActionsMenuProps<T>) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onDismiss();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismiss();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onDismiss, anchorRef]);

  if (!anchorRef.current || actions.length === 0) return null;

  const rect = anchorRef.current.getBoundingClientRect();
  const menuHeight = actions.length * 32 + 8; // Approximate height
  const viewportHeight = window.innerHeight;
  const spaceBelow = viewportHeight - rect.bottom;
  const spaceAbove = rect.top;

  // Position menu below button by default, or above if not enough space
  const positionTop = spaceBelow < menuHeight && spaceAbove > spaceBelow
    ? rect.top - menuHeight - 4
    : rect.bottom + 4;

  const handleActionClick = (action: RowAction) => {
    if (!action.disabled) {
      action.onClick(item, index);
      onDismiss();
    }
  };

  return (
    <div
      ref={menuRef}
      className="hh-row-actions-menu"
      style={{
        position: 'fixed',
        top: `${positionTop}px`,
        left: `${rect.left}px`, // Align to left edge of button
        zIndex: 1000,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {actions.map((action) => (
        <button
          key={action.key}
          className={`hh-row-actions-menu-item ${action.disabled ? 'hh-row-actions-menu-item-disabled' : ''}`}
          onClick={() => handleActionClick(action)}
          disabled={action.disabled}
        >
          {action.icon && (
            <span className="hh-row-actions-menu-icon">
              {action.icon}
            </span>
          )}
          <span className="hh-row-actions-menu-text">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}

