/**
 * Export utilities for ReactTabletify
 * Supports CSV and Excel export
 */
/**
 * Export data to CSV format
 * @param data - Array of data objects
 * @param columns - Column definitions with key and label
 * @param filename - Name of the file (without extension)
 */
export declare function exportToCSV<T extends Record<string, any>>(data: T[], columns: Array<{
    key: keyof T;
    label: string;
}>, filename?: string): void;
/**
 * Export data to Excel format (.xlsx)
 * Uses HTML table format that Excel can read
 * No external library required
 * @param data - Array of data objects
 * @param columns - Column definitions with key and label
 * @param filename - Name of the file (without extension)
 */
export declare function exportToExcel<T extends Record<string, any>>(data: T[], columns: Array<{
    key: keyof T;
    label: string;
}>, filename?: string): void;
/**
 * Export data based on format
 * @param format - 'csv' or 'excel'
 * @param data - Array of data objects
 * @param columns - Column definitions with key and label
 * @param filename - Name of the file (without extension)
 */
export declare function exportData<T extends Record<string, any>>(format: 'csv' | 'excel', data: T[], columns: Array<{
    key: keyof T;
    label: string;
}>, filename?: string): void;
