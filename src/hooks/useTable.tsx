import * as React from "react";
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
export function useTable<T extends Record<string, any>>(
    data: T[],
    itemsPerPage: number = 10
): UseTableReturn<T> {
    const [search, setSearch] = React.useState("");
    const [sortKey, setSortKey] = React.useState<keyof T | null>(null);
    const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = React.useState(1);
    const [filters, setFilters] = React.useState<Record<string, string[]>>({});

    /** --- 🧩 Set Filter --- */
    const setFilter = (field: string, values: string[]) => {
        setFilters((prev) => {
            const newFilters = { ...prev };
            if (values.length === 0) {
                // Remove field from filters if no values selected
                delete newFilters[field];
            } else {
                newFilters[field] = values;
            }
            return newFilters;
        });
    };

    /** --- 1️⃣ Filter by search & custom filters --- */
    const filtered = React.useMemo(() => {
        let result = data;

        // filter theo field values
        Object.entries(filters).forEach(([field, selectedValues]) => {
            if (selectedValues.length > 0) {
                result = result.filter((item) =>
                    selectedValues.includes(String(item[field]))
                );
            }
        });

        // filter theo search text
        if (search.trim()) {
            const lower = search.toLowerCase();
            result = result.filter((row) =>
                Object.values(row).some((v) =>
                    String(v).toLowerCase().includes(lower)
                )
            );
        }

        return result;
    }, [data, search, filters]);

    /** --- 2️⃣ Sort --- */
    const sorted = React.useMemo(() => {
        if (!sortKey) return filtered;
        return [...filtered].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (aVal == null) return 1;
            if (bVal == null) return -1;
            if (aVal === bVal) return 0;
            const compare = String(aVal).localeCompare(String(bVal), undefined, {
                numeric: true,
                sensitivity: "base",
            });
            return sortDir === "asc" ? compare : -compare;
        });
    }, [filtered, sortKey, sortDir]);

    /** --- 3️⃣ Pagination --- */
    const totalPages = Math.ceil(sorted.length / itemsPerPage);
    const paged = React.useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sorted.slice(start, start + itemsPerPage);
    }, [sorted, currentPage, itemsPerPage]);

    /** --- 4️⃣ Sort handler --- */
    const handleSort = React.useCallback((key: keyof T, direction?: "asc" | "desc") => {
        if (direction) {
            setSortKey(key);
            setSortDir(direction);
        } else if (sortKey === key) {
            setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    }, [sortKey]);

    /** --- 5️⃣ Reset page khi search/sort/filter đổi --- */
    React.useEffect(() => {
        setCurrentPage(1);
    }, [search, sortKey, sortDir, filters]);

    /** --- 6️⃣ Action helpers --- */
    const clearSearch = React.useCallback(() => {
        setSearch("");
    }, []);

    const clearFilters = React.useCallback(() => {
        setFilters({});
    }, []);

    const clearFilter = React.useCallback((field: string) => {
        setFilter(field, []);
    }, [setFilter]);

    const resetSort = React.useCallback(() => {
        setSortKey(null);
        setSortDir("asc");
    }, []);

    const resetAll = React.useCallback(() => {
        setSearch("");
        setFilters({});
        setSortKey(null);
        setSortDir("asc");
        setCurrentPage(1);
    }, []);

    const goToFirstPage = React.useCallback(() => {
        setCurrentPage(1);
    }, []);

    const goToLastPage = React.useCallback(() => {
        setCurrentPage(totalPages);
    }, [totalPages]);

    const goToNextPage = React.useCallback(() => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const goToPrevPage = React.useCallback(() => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    }, []);

    return {
        // data
        filtered,
        sorted,
        paged,

        // pagination
        currentPage,
        setCurrentPage,
        totalPages,
        itemsPerPage,
        goToFirstPage,
        goToLastPage,
        goToNextPage,
        goToPrevPage,

        // search
        search,
        setSearch,
        clearSearch,

        // sort
        sortKey,
        sortDir,
        handleSort,
        resetSort,

        // filter
        filters,
        setFilter,
        clearFilter,
        clearFilters,

        // reset all
        resetAll,
    };
}
