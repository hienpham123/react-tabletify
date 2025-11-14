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
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  columns: Array<{ key: keyof T; label: string }>,
  filename: string = 'export'
): void {
  // Create header row
  const headers = columns.map(col => col.label);
  const headerRow = headers.join(',');

  // Create data rows
  const dataRows = data.map(item => {
    return columns.map(col => {
      const value = item[col.key];
      // Handle values that contain commas, quotes, or newlines
      if (value === null || value === undefined) {
        return '';
      }
      const stringValue = String(value);
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });

  // Combine header and data
  const csvContent = [headerRow, ...dataRows].join('\n');

  // Add BOM for UTF-8 to support Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Escape HTML special characters
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Export data to Excel format (.xlsx)
 * Uses HTML table format that Excel can read
 * No external library required
 * @param data - Array of data objects
 * @param columns - Column definitions with key and label
 * @param filename - Name of the file (without extension)
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  columns: Array<{ key: keyof T; label: string }>,
  filename: string = 'export'
): void {
  // Create header row
  const headerRow = columns.map(col => col.label);
  
  // Create data rows
  const dataRows = data.map(item => 
    columns.map(col => {
      const value = item[col.key];
      return value === null || value === undefined ? '' : value;
    })
  );

  // Build HTML table that Excel can read
  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">\n';
  html += '<head>\n';
  html += '<meta charset="utf-8">\n';
  html += '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->\n';
  html += '</head>\n';
  html += '<body>\n';
  html += '<table>\n';

  // Header row
  html += '<tr>\n';
  headerRow.forEach(header => {
    html += `<th>${escapeHtml(String(header))}</th>\n`;
  });
  html += '</tr>\n';

  // Data rows
  dataRows.forEach(row => {
    html += '<tr>\n';
    row.forEach(cell => {
      const cellValue = cell === null || cell === undefined ? '' : String(cell);
      // Check if it's a number
      if (typeof cell === 'number') {
        html += `<td style="mso-number-format:General">${cellValue}</td>\n`;
      } else {
        html += `<td>${escapeHtml(cellValue)}</td>\n`;
      }
    });
    html += '</tr>\n';
  });

  html += '</table>\n';
  html += '</body>\n';
  html += '</html>';

  // Create blob with Excel MIME type
  const blob = new Blob([html], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export data based on format
 * @param format - 'csv' or 'excel'
 * @param data - Array of data objects
 * @param columns - Column definitions with key and label
 * @param filename - Name of the file (without extension)
 */
export function exportData<T extends Record<string, any>>(
  format: 'csv' | 'excel',
  data: T[],
  columns: Array<{ key: keyof T; label: string }>,
  filename: string = 'export'
): void {
  if (format === 'csv') {
    exportToCSV(data, columns, filename);
  } else {
    exportToExcel(data, columns, filename);
  }
}

