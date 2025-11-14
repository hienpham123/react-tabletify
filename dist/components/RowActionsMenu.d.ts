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
export declare function RowActionsMenu<T extends Record<string, any>>({ anchorRef, actions, item, index, onDismiss, onMouseEnter, onMouseLeave, }: RowActionsMenuProps<T>): import("react/jsx-runtime").JSX.Element | null;
export {};
