import * as React from "react";
interface RowActionsCellProps<T extends Record<string, any>> {
    item: T;
    index: number;
    actions: Array<{
        key: string;
        label: string;
        icon?: React.ReactNode;
        onClick: (item: T, index: number) => void;
        disabled?: boolean;
    }>;
    onMenuToggle: (item: T, index: number) => void;
    isMenuOpen: boolean;
    buttonRef: React.RefObject<HTMLButtonElement | null>;
}
export declare function RowActionsCell<T extends Record<string, any>>({ item, index, actions, onMenuToggle, isMenuOpen, buttonRef, }: RowActionsCellProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
