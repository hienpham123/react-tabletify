import * as React from "react";
import { exportData } from "../utils/export";
import type { Column } from "../types";
import { ExportIcon } from "../icons";

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
          <ExportIcon width={16} height={16} />
          <span>CSV</span>
        </button>
        <button
          className="hh-export-button"
          onClick={() => handleExport('excel')}
          disabled={isExporting}
          title="Export to Excel"
        >
          <ExportIcon width={16} height={16} />
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
      <ExportIcon width={16} height={16} />
      <span>{format === 'csv' ? 'CSV' : 'Excel'}</span>
    </button>
  );
}

