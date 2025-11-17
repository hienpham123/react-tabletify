import * as React from "react";
import { exportData } from "../utils/export";
import type { Column } from "../types";

interface ExportButtonProps<T extends Record<string, any>> {
  data: T[];
  columns: Column<T>[];
  format: 'csv' | 'excel' | 'both';
  filename: string;
  onBeforeExport?: (data: T[], columns: Column<T>[]) => { data: T[]; columns: Column<T>[] } | undefined;
  onAfterExport?: (format: 'csv' | 'excel', filename: string) => void;
}

/**
 * ExportButton - Button component for exporting table data
 */
export function ExportButton<T extends Record<string, any>>({
  data,
  columns,
  format,
  filename,
  onBeforeExport,
  onAfterExport,
}: ExportButtonProps<T>) {
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = React.useCallback((exportFormat: 'csv' | 'excel') => {
    setIsExporting(true);
    try {
      // Prepare columns for export (only visible columns with labels)
      const exportColumns = columns
        .filter(col => col.key && col.label)
        .map(col => ({
          key: col.key,
          label: col.label,
        }));

      // Prepare data
      let dataToExport = data;
      let exportCols = columns;

      // Apply transformation if provided
      if (onBeforeExport) {
        const transformed = onBeforeExport(data, columns);
        if (transformed) {
          dataToExport = transformed.data;
          exportCols = transformed.columns;
          // Update export columns
          const transformedExportColumns = exportCols
            .filter(col => col.key && col.label)
            .map(col => ({
              key: col.key,
              label: col.label,
            }));
          exportData(exportFormat, dataToExport, transformedExportColumns, filename);
        } else {
          exportData(exportFormat, dataToExport, exportColumns, filename);
        }
      } else {
        exportData(exportFormat, dataToExport, exportColumns, filename);
      }

      // Call after export callback
      onAfterExport?.(exportFormat, filename);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [data, columns, filename, onBeforeExport, onAfterExport]);

  if (format === 'both') {
    return (
      <div className="hh-export-buttons">
        <button
          className="hh-export-button"
          onClick={() => handleExport('csv')}
          disabled={isExporting}
          title="Export to CSV"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2h12v12H2V2zm1 1v10h10V3H3zm1 1h8v1H4V4zm0 2h8v1H4V6zm0 2h8v1H4V8zm0 2h5v1H4v-1z" fill="currentColor"/>
          </svg>
          <span>CSV</span>
        </button>
        <button
          className="hh-export-button"
          onClick={() => handleExport('excel')}
          disabled={isExporting}
          title="Export to Excel"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2h12v12H2V2zm1 1v10h10V3H3zm1 1h8v1H4V4zm0 2h8v1H4V6zm0 2h8v1H4V8zm0 2h5v1H4v-1z" fill="currentColor"/>
          </svg>
          <span>Excel</span>
        </button>
      </div>
    );
  }

  return (
    <button
      className="hh-export-button"
      onClick={() => handleExport(format)}
      disabled={isExporting}
      title={`Export to ${format === 'csv' ? 'CSV' : 'Excel'}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 2h12v12H2V2zm1 1v10h10V3H3zm1 1h8v1H4V4zm0 2h8v1H4V6zm0 2h8v1H4V8zm0 2h5v1H4v-1z" fill="currentColor"/>
      </svg>
      <span>{format === 'csv' ? 'CSV' : 'Excel'}</span>
    </button>
  );
}

