import type { Column } from "../types";
interface ExportButtonProps<T extends Record<string, any>> {
    data: T[];
    columns: Column<T>[];
    format: 'csv' | 'excel' | 'both';
    filename: string;
    onBeforeExport?: (data: T[], columns: Column<T>[]) => {
        data: T[];
        columns: Column<T>[];
    } | undefined;
    onAfterExport?: (format: 'csv' | 'excel', filename: string) => void;
}
/**
 * ExportButton - Button component for exporting table data
 */
export declare function ExportButton<T extends Record<string, any>>({ data, columns, format, filename, onBeforeExport, onAfterExport, }: ExportButtonProps<T>): import("react/jsx-runtime").JSX.Element;
export {};
