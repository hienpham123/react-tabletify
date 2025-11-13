import type { UseTableReturn } from "../types";
/**
 * Custom hook for table data management
 * Handles filtering, sorting, and pagination
 *
 * @template T - The type of data items
 * @param data - Array of data items
 * @param itemsPerPage - Number of items per page (default: 10)
 * @returns Object containing filtered data, pagination state, and control functions
 *
 * @example
 * ```tsx
 * const table = useTable(users, 10);
 * // table.paged contains current page items
 * // table.setCurrentPage(2) to change page
 * // table.handleSort('name', 'asc') to sort
 * ```
 */
export declare function useTable<T extends Record<string, any>>(data: T[], itemsPerPage?: number): UseTableReturn<T>;
//# sourceMappingURL=useTable.d.ts.map