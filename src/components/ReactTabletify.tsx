import * as React from "react";
import { useTable } from "../hooks/useTable";
import { Pagination } from "./Pagination";
import { HeaderCallout } from "./HeaderCallout";
import { FilterPanel } from "./FilterPanel";
import type { ReactTabletifyProps, Column } from "../types";
import { getTheme, applyTheme } from "../utils/theme";
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
export function ReactTabletify<T extends Record<string, any>>({
  columns,
  data,
  itemsPerPage = 10,
  groupBy,
  onRenderCell,
  onRenderRow,
  onRenderHeader,
  onItemInvoked,
  onColumnHeaderClick,
  getKey,
  onActiveItemChanged,
  onItemContextMenu,
  className,
  styles,
  selectionMode = 'none',
  onSelectionChanged,
  showPagination = true,
  theme,
  maxHeight,
  ...otherProps
}: ReactTabletifyProps<T>) {
  const table = useTable<T>(data, itemsPerPage);
  const [calloutKey, setCalloutKey] = React.useState<keyof T | null>(null);
  const [filterField, setFilterField] = React.useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = React.useState<Set<string | number>>(new Set());
  const [activeItemIndex, setActiveItemIndex] = React.useState<number | undefined>(undefined);
  const [columnWidths, setColumnWidths] = React.useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = React.useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = React.useState<number>(0);
  const [resizeStartWidth, setResizeStartWidth] = React.useState<number>(0);
  const anchorRefs = React.useRef<Record<string, HTMLDivElement>>({});
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Get unique key for item
  const getItemKey = React.useCallback((item: T, index: number): string | number => {
    if (getKey) return getKey(item, index);
    return item.id !== undefined ? item.id : index;
  }, [getKey]);

  // Handle checkbox selection
  const handleCheckboxChange = React.useCallback((item: T, index: number, checked: boolean) => {
    const key = getItemKey(item, index);
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (selectionMode === 'single') {
        newSet.clear();
        if (checked) {
          newSet.add(key);
        }
      } else if (selectionMode === 'multiple') {
        if (checked) {
          newSet.add(key);
        } else {
          newSet.delete(key);
        }
      }

      if (onSelectionChanged) {
        const selected = data.filter((d, i) => newSet.has(getItemKey(d, i)));
        onSelectionChanged(selected);
      }

      return newSet;
    });

    setActiveItemIndex(index);
    if (onActiveItemChanged) {
      onActiveItemChanged(item, index);
    }
  }, [selectionMode, getItemKey, onSelectionChanged, onActiveItemChanged, data]);

  // Handle selection
  const handleItemClick = React.useCallback((item: T, index: number, ev: React.MouseEvent) => {
    // Don't trigger if clicking on checkbox
    if ((ev.target as HTMLElement).closest('.th-selection-checkbox')) {
      return;
    }

    if (onItemInvoked) {
      onItemInvoked(item, index);
    }

    if (selectionMode !== 'none') {
      const key = getItemKey(item, index);
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        if (selectionMode === 'single') {
          newSet.clear();
          newSet.add(key);
        } else if (selectionMode === 'multiple') {
          if (ev.ctrlKey || ev.metaKey) {
            if (newSet.has(key)) {
              newSet.delete(key);
            } else {
              newSet.add(key);
            }
          } else {
            newSet.clear();
            newSet.add(key);
          }
        }

        if (onSelectionChanged) {
          const selected = data.filter((d, i) => newSet.has(getItemKey(d, i)));
          onSelectionChanged(selected);
        }

        return newSet;
      });
    }

    setActiveItemIndex(index);
    if (onActiveItemChanged) {
      onActiveItemChanged(item, index);
    }
  }, [onItemInvoked, selectionMode, getItemKey, onSelectionChanged, onActiveItemChanged, data]);


  const handleOpenFilter = (key: keyof T) => {
    setFilterField(String(key));
    setCalloutKey(null);
  };

  const handleApplyFilter = (values: string[]) => {
    table.setFilter(filterField!, values);
    setFilterField(null);
  };

  const uniqueValues = React.useMemo(() => {
    if (!filterField) return [];
    return Array.from(new Set(data.map((d) => String(d[filterField as keyof T]))));
  }, [filterField, data]);

  const handleHeaderMouseEnter = (key: keyof T) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setCalloutKey(key);
    }, 150);
  };

  const handleHeaderMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setCalloutKey(null);
    }, 200);
  };

  // Resize handlers
  const handleResizeStart = React.useCallback((colKey: keyof T, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const colKeyStr = String(colKey);
    const th = anchorRefs.current[colKeyStr]?.parentElement as HTMLTableCellElement;
    if (!th) return;

    const startWidth = th.offsetWidth;
    const startX = e.clientX;

    setResizingColumn(colKeyStr);

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + diff); // Min width 50px
      setColumnWidths(prev => ({ ...prev, [colKeyStr]: newWidth }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Reset page when groupBy changes
  React.useEffect(() => {
    if (groupBy) {
      table.setCurrentPage(1);
    }
  }, [groupBy]);

  // Group rows logic - group sorted data, then paginate groups
  const groupedData = React.useMemo(() => {
    if (!groupBy) return null;

    const groups: Record<string, T[]> = {};
    const sortedData = table.sortKey
      ? [...table.filtered].sort((a, b) => {
        const aVal = a[table.sortKey!];
        const bVal = b[table.sortKey!];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (aVal === bVal) return 0;
        const compare = String(aVal).localeCompare(String(bVal), undefined, {
          numeric: true,
          sensitivity: "base",
        });
        return table.sortDir === "asc" ? compare : -compare;
      })
      : table.filtered;

    sortedData.forEach((row) => {
      const groupKey = String(row[groupBy]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(row);
    });

    return groups;
  }, [table.filtered, table.sortKey, table.sortDir, groupBy]);

  // Reset page when number of groups changes (due to filter)
  React.useEffect(() => {
    if (groupBy && groupedData) {
      const totalGroups = Object.keys(groupedData).length;
      const totalPages = Math.ceil(totalGroups / table.itemsPerPage);
      if (table.currentPage > totalPages && totalPages > 0) {
        table.setCurrentPage(1);
      }
    }
  }, [groupedData, groupBy, table.itemsPerPage, table.currentPage, table.setCurrentPage]);

  // Paginate groups - sort groups by key first
  const paginatedGroups = React.useMemo(() => {
    if (!groupBy || !groupedData) return null;

    const groupEntries = Object.entries(groupedData);
    // Sort groups by key for consistent ordering
    groupEntries.sort(([a], [b]) => a.localeCompare(b));

    const start = (table.currentPage - 1) * table.itemsPerPage;
    const end = start + table.itemsPerPage;

    return groupEntries.slice(start, end);
  }, [groupedData, table.currentPage, table.itemsPerPage, groupBy]);

  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  // Get all items on current page (for selection state checking)
  const currentPageItemsForSelection = React.useMemo(() => {
    if (groupBy && paginatedGroups) {
      // When grouped, get all items from all groups on current page
      const items: T[] = [];
      paginatedGroups.forEach(([groupKey, rows]) => {
        rows.forEach((row) => {
          items.push(row);
        });
      });
      return items;
    } else {
      // When not grouped, use table.paged
      return table.paged;
    }
  }, [groupBy, paginatedGroups, table.paged]);

  // Handle select all/none
  const handleSelectAll = React.useCallback((checked: boolean) => {
    if (selectionMode === 'multiple') {
      // Get all items on current page
      let currentPageItems: T[] = [];

      if (groupBy && paginatedGroups) {
        // When grouped, get all items from all groups on current page (not just expanded ones)
        paginatedGroups.forEach(([groupKey, rows]) => {
          rows.forEach((row) => {
            currentPageItems.push(row);
          });
        });
      } else {
        // When not grouped, use table.paged
        currentPageItems = table.paged;
      }

      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        if (checked) {
          currentPageItems.forEach((item) => {
            // Find actual index in filtered data to get correct key
            const actualIndex = table.filtered.findIndex((d) => {
              const dKey = getItemKey(d, table.filtered.indexOf(d));
              const itemKey = getItemKey(item, currentPageItems.indexOf(item));
              return dKey === itemKey || d === item;
            });
            const finalIndex = actualIndex >= 0 ? actualIndex : table.filtered.indexOf(item);
            newSet.add(getItemKey(item, finalIndex));
          });
        } else {
          currentPageItems.forEach((item) => {
            // Find actual index in filtered data to get correct key
            const actualIndex = table.filtered.findIndex((d) => {
              const dKey = getItemKey(d, table.filtered.indexOf(d));
              const itemKey = getItemKey(item, currentPageItems.indexOf(item));
              return dKey === itemKey || d === item;
            });
            const finalIndex = actualIndex >= 0 ? actualIndex : table.filtered.indexOf(item);
            newSet.delete(getItemKey(item, finalIndex));
          });
        }

        if (onSelectionChanged) {
          const selected = data.filter((d, i) => newSet.has(getItemKey(d, i)));
          onSelectionChanged(selected);
        }

        return newSet;
      });
    }
  }, [selectionMode, table.paged, table.filtered, getItemKey, onSelectionChanged, data, groupBy, paginatedGroups]);

  // Check if all items on current page are selected
  const isAllSelected = React.useMemo(() => {
    if (selectionMode !== 'multiple') return false;
    if (currentPageItemsForSelection.length === 0) return false;
    return currentPageItemsForSelection.every((item) => {
      // Find actual index in filtered data to get correct key
      const actualIndex = table.filtered.findIndex((d) => {
        const dKey = getItemKey(d, table.filtered.indexOf(d));
        const itemKey = getItemKey(item, currentPageItemsForSelection.indexOf(item));
        return dKey === itemKey || d === item;
      });
      const finalIndex = actualIndex >= 0 ? actualIndex : table.filtered.indexOf(item);
      return selectedItems.has(getItemKey(item, finalIndex));
    });
  }, [selectionMode, currentPageItemsForSelection, selectedItems, getItemKey, table.filtered]);

  // Check if some items are selected (indeterminate state)
  const isIndeterminate = React.useMemo(() => {
    if (selectionMode !== 'multiple') return false;
    if (currentPageItemsForSelection.length === 0) return false;
    const selectedCount = currentPageItemsForSelection.filter((item) => {
      // Find actual index in filtered data to get correct key
      const actualIndex = table.filtered.findIndex((d) => {
        const dKey = getItemKey(d, table.filtered.indexOf(d));
        const itemKey = getItemKey(item, currentPageItemsForSelection.indexOf(item));
        return dKey === itemKey || d === item;
      });
      const finalIndex = actualIndex >= 0 ? actualIndex : table.filtered.indexOf(item);
      return selectedItems.has(getItemKey(item, finalIndex));
    }).length;
    return selectedCount > 0 && selectedCount < currentPageItemsForSelection.length;
  }, [selectionMode, currentPageItemsForSelection, selectedItems, getItemKey, table.filtered]);

  // Render cell content
  const renderCell = React.useCallback((item: T, column: Column<T>, index: number) => {
    // Column-specific render
    if (column.onRenderCell) {
      return column.onRenderCell(item, column.key, index);
    }
    // Global onRenderCell
    if (onRenderCell) {
      return onRenderCell(item, column.key, index);
    }
    // Default render
    return String(item[column.key] ?? '');
  }, [onRenderCell]);

  // Get and apply theme
  const tableTheme = React.useMemo(() => getTheme(theme), [theme]);
  const themeStyles = React.useMemo(() => applyTheme(tableTheme), [tableTheme]);

  return (
    <div 
      className={`th-table ${className || ''} th-theme-${tableTheme.mode || 'light'}`} 
      style={{
        ...themeStyles,
        ...styles,
        ...(maxHeight ? { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight, overflow: 'auto' } : {}),
      }}
    >
      <table>
        <thead>
          <tr>
            {selectionMode !== 'none' && (
              <th className="th-selection-column">
                {selectionMode === 'multiple' ? (
                  <div className="th-selection-checkbox-wrapper">
                    <input
                      type="checkbox"
                      className="th-selection-checkbox"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                ) : (
                  <div className="th-selection-checkbox-wrapper"></div>
                )}
              </th>
            )}
            {columns.map((col, colIndex) => {
              const colKeyStr = String(col.key);
              const resizedWidth = columnWidths[colKeyStr];
              const headerStyle: React.CSSProperties = {
                ...col.style,
                width: resizedWidth ? `${resizedWidth}px` : col.width,
                minWidth: col.minWidth,
                maxWidth: col.maxWidth,
                textAlign: col.align,
                position: 'relative',
              };
              const headerClassName = col.className
                ? `th-header-cell ${col.className}`
                : 'th-header-cell';

              return (
                <th
                  key={colKeyStr}
                  style={headerStyle}
                >
                  {onRenderHeader ? (
                    onRenderHeader(col, colIndex)
                  ) : (
                    <div
                      className={headerClassName}
                      ref={(el) => {
                        if (el) anchorRefs.current[String(col.key)] = el;
                      }}
                      onMouseEnter={() => handleHeaderMouseEnter(col.key)}
                      onMouseLeave={handleHeaderMouseLeave}
                      onClick={(ev) => onColumnHeaderClick?.(col, ev)}
                    >
                      <span className="th-header-label">{col.label}</span>
                      <div className="th-header-icons">
                        {table.filters[String(col.key)] && table.filters[String(col.key)].length > 0 && (
                          <span className="th-header-filter-icon" title="Filtered">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 5h18M6 12h12M10 19h4" />
                              <circle cx="18" cy="18" r="3.5" fill="currentColor" />
                              <path
                                d="M16.5 18l1 1 2-2.2"
                                stroke="#fff"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>

                          </span>
                        )}
                        {table.sortKey === col.key && (
                          <span className="th-header-sort-icon">
                            {table.sortDir === "asc" ? (
                              <span className="th-sort-arrow">↑</span>
                            ) : (
                              <span className="th-sort-arrow">↓</span>
                            )}
                          </span>
                        )}
                      </div>
                      <span className="th-header-action">⋮</span>
                    </div>
                  )}
                  {col.resizable !== false && (
                    <div
                      className="th-resize-handle"
                      onMouseDown={(e) => handleResizeStart(col.key, e)}
                      style={{
                        cursor: 'col-resize',
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        zIndex: 1,
                      }}
                    />
                  )}
                  {calloutKey === col.key && (
                    <HeaderCallout
                      anchorRef={{ current: anchorRefs.current[String(col.key)] }}
                      onSortAsc={() => {
                        if (col.sortable !== false) {
                          table.handleSort(col.key, "asc");
                          setCalloutKey(null);
                        }
                      }}
                      onSortDesc={() => {
                        if (col.sortable !== false) {
                          table.handleSort(col.key, "desc");
                          setCalloutKey(null);
                        }
                      }}
                      onFilter={() => {
                        if (col.filterable !== false) {
                          handleOpenFilter(col.key);
                        }
                      }}
                      onDismiss={() => setCalloutKey(null)}
                      onMouseEnter={() => {
                        if (hoverTimeoutRef.current) {
                          clearTimeout(hoverTimeoutRef.current);
                        }
                      }}
                      onMouseLeave={handleHeaderMouseLeave}
                      sortable={col.sortable !== false}
                      filterable={col.filterable !== false}
                    />
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {groupBy && paginatedGroups ? (
            paginatedGroups.map(([groupKey, rows]) => {
              const isExpanded = expandedGroups.has(groupKey);
              return (
                <React.Fragment key={groupKey}>
                  <tr className="th-group-header">
                    <td colSpan={columns.length + (selectionMode !== 'none' ? 1 : 0)} className="th-group-header-cell">
                      <button
                        className="th-group-toggle"
                        onClick={() => toggleGroup(groupKey)}
                        aria-expanded={isExpanded}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={isExpanded ? "expanded" : ""}
                        >
                          <path
                            d="M6 4L10 8L6 12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                          />
                        </svg>
                        <span className="th-group-label">
                          {String(groupBy)}: {groupKey}
                        </span>
                        <span className="th-group-count">({rows.length})</span>
                      </button>
                    </td>
                  </tr>
                  {isExpanded &&
                    rows.map((row, i) => {
                      // Find actual index in filtered data
                      const actualIndex = table.filtered.findIndex((d) => {
                        const dKey = getItemKey(d, table.filtered.indexOf(d));
                        const rowKey = getItemKey(row, i);
                        return dKey === rowKey || d === row;
                      });
                      const finalIndex = actualIndex >= 0 ? actualIndex : i;
                      const itemKey = getItemKey(row, finalIndex);
                      const isSelected = selectedItems.has(itemKey);
                      const isActive = activeItemIndex === finalIndex;

                      if (onRenderRow) {
                        return (
                          <React.Fragment key={itemKey}>
                            {onRenderRow(row, finalIndex, columns)}
                          </React.Fragment>
                        );
                      }

                      return (
                        <tr
                          key={itemKey}
                          className={`th-group-row ${isSelected ? 'th-row-selected' : ''} ${isActive ? 'th-row-active' : ''}`}
                          onClick={(ev) => handleItemClick(row, finalIndex, ev)}
                          onContextMenu={(ev) => onItemContextMenu?.(row, finalIndex, ev)}
                        >
                          {selectionMode !== 'none' && (
                            <td className="th-selection-column">
                              <div className="th-selection-checkbox-wrapper">
                                <input
                                  type={selectionMode === 'single' ? 'radio' : 'checkbox'}
                                  className="th-selection-checkbox"
                                  checked={isSelected}
                                  onChange={(e) => handleCheckboxChange(row, finalIndex, e.target.checked)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </td>
                          )}
                          {columns.map((col) => {
                            const colKeyStr = String(col.key);
                            const resizedWidth = columnWidths[colKeyStr];
                            const cellStyle: React.CSSProperties = {
                              ...col.cellStyle,
                              textAlign: col.align,
                              width: resizedWidth ? `${resizedWidth}px` : col.width,
                            };
                            const cellClassName = col.cellClassName
                              ? col.cellClassName
                              : '';
                            return (
                              <td
                                key={colKeyStr}
                                style={cellStyle}
                                className={cellClassName}
                              >
                                {renderCell(row, col, finalIndex)}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                </React.Fragment>
              );
            })
          ) : (
            table.paged.map((row, i) => {
              const itemKey = getItemKey(row, i);
              const isSelected = selectedItems.has(itemKey);
              const isActive = activeItemIndex === i;

              if (onRenderRow) {
                return (
                  <React.Fragment key={itemKey}>
                    {onRenderRow(row, i, columns)}
                  </React.Fragment>
                );
              }

              return (
                <tr
                  key={itemKey}
                  className={`${isSelected ? 'th-row-selected' : ''} ${isActive ? 'th-row-active' : ''}`}
                  onClick={(ev) => handleItemClick(row, i, ev)}
                  onContextMenu={(ev) => onItemContextMenu?.(row, i, ev)}
                >
                  {selectionMode !== 'none' && (
                    <td className="th-selection-column">
                      <div className="th-selection-checkbox-wrapper">
                        <input
                          type={selectionMode === 'single' ? 'radio' : 'checkbox'}
                          className="th-selection-checkbox"
                          checked={isSelected}
                          onChange={(e) => handleCheckboxChange(row, i, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </td>
                  )}
                  {columns.map((col) => {
                    const colKeyStr = String(col.key);
                    const resizedWidth = columnWidths[colKeyStr];
                    const cellStyle: React.CSSProperties = {
                      ...col.cellStyle,
                      textAlign: col.align,
                      width: resizedWidth ? `${resizedWidth}px` : col.width,
                    };
                    const cellClassName = col.cellClassName
                      ? col.cellClassName
                      : '';
                    return (
                      <td
                        key={colKeyStr}
                        style={cellStyle}
                        className={cellClassName}
                      >
                        {renderCell(row, col, i)}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {showPagination && (
        <Pagination
          totalItems={groupBy && groupedData ? Object.keys(groupedData).length : table.filtered.length}
          itemsPerPage={table.itemsPerPage}
          currentPage={table.currentPage}
          onPageChange={table.setCurrentPage}
        />
      )}

      {filterField && (
        <FilterPanel
          field={filterField}
          values={uniqueValues}
          selected={table.filters[filterField] || []}
          onApply={handleApplyFilter}
          onDismiss={() => setFilterField(null)}
        />
      )}
    </div>
  );
}
