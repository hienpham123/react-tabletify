import type { ReactTabletifyProps } from "../types";
import "./../styles/table.css";
/**
 * ReactTabletify - A powerful, customizable data table component for React
 *
 * Features:
 * - Sorting (ascending/descending)
 * - Filtering (per column with search)
 * - Pagination
 * - Row grouping with expand/collapse
 * - Row selection (single/multiple)
 * - Custom cell/row/header rendering
 * - Fluent UI styled components
 *
 * @template T - The type of data items (must be an object/record)
 * @param props - Component props
 * @returns React component
 *
 * @example
 * ```tsx
 * interface User {
 *   id: number;
 *   name: string;
 *   age: number;
 *   role: string;
 * }
 *
 * const data: User[] = [
 *   { id: 1, name: "Alice", age: 25, role: "Dev" },
 *   { id: 2, name: "Bob", age: 29, role: "PM" },
 * ];
 *
 * <ReactTabletify
 *   data={data}
 *   columns={[
 *     { key: "id", label: "ID" },
 *     { key: "name", label: "Name" },
 *     { key: "age", label: "Age" },
 *     { key: "role", label: "Role" },
 *   ]}
 *   itemsPerPage={10}
 *   selectionMode="multiple"
 *   onSelectionChanged={(selected) => console.log(selected)}
 * />
 * ```
 */
export declare function ReactTabletify<T extends Record<string, any>>({ columns, data, itemsPerPage, groupBy, onRenderCell, onRenderRow, onRenderHeader, onItemInvoked, onColumnHeaderClick, getKey, onActiveItemChanged, onItemContextMenu, className, styles, selectionMode, onSelectionChanged, showPagination, theme, maxHeight, ...otherProps }: ReactTabletifyProps<T>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ReactTabletify.d.ts.map