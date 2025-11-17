# ReactTabletify

[![npm version](https://img.shields.io/npm/v/react-tabletify)](https://www.npmjs.com/package/react-tabletify)
[![npm downloads](https://img.shields.io/npm/dm/react-tabletify)](https://www.npmjs.com/package/react-tabletify)
[![GitHub stars](https://img.shields.io/github/stars/hienpham123/react-tabletify)](https://github.com/hienpham123/react-tabletify)
[![License](https://img.shields.io/npm/l/react-tabletify)](https://github.com/hienpham123/react-tabletify/blob/main/LICENSE)

A fast, fully customizable React data table built purely with HTML and CSS.

## Features

- ✅ **Sorting** - Ascending/descending column sorting
- ✅ **Filtering** - Per-column filtering with search
- ✅ **Pagination** - Built-in pagination controls
- ✅ **Row Grouping** - Group rows by field with expand/collapse
- ✅ **Row Selection** - Single or multiple row selection
- ✅ **Custom Rendering** - Customize cells, rows, and headers
- ✅ **Theme System** - Comprehensive theming (light/dark/custom) like Fluent UI
- ✅ **TypeScript** - Full TypeScript support
- ✅ **Fluent UI Styled** - Beautiful Fluent UI design
- ✅ **Column Pinning** - Pin columns left/right when scrolling
- ✅ **Inline Editing** - Edit cells directly (double-click to edit)
- ✅ **Loading States** - Skeleton loader when fetching data
- ✅ **Empty States** - Custom message when no data available
- ✅ **Sticky Header** - Header fixed when scrolling
- ✅ **Sticky Totals Row** - Totals row fixed at bottom when scrolling
- ✅ **Keyboard Navigation** - Arrow keys, Enter/Space for selection
- ✅ **Column Visibility** - Show/hide columns
- ✅ **Column Reordering** - Drag & drop to reorder columns
- ✅ **Tooltip** - Show tooltip for truncated content
- ✅ **Items Per Page Options** - Customizable items per page dropdown
- ✅ **Nested Menus** - Column settings and totals submenus in header callout
- ✅ **Totals Row** - Display count/aggregations in footer row
- ✅ **Group By with Visual Indicator** - Group by column with checkmark in menu
- ✅ **Row Drag & Drop** - Drag and drop rows to reorder them
- ✅ **Export to CSV/Excel** - Export table data to CSV or Excel format (no external library required)
- ✅ **Row Actions Menu** - Context menu with custom actions for each row
- ✅ **Excel-like Cell Selection** - Select multiple cells, copy, cut, paste, and delete (Ctrl+C, Ctrl+X, Ctrl+V, Delete)
- ✅ **Excel-like Inline Editing** - Seamless inline editing when `enableCellSelection={true}` (no border, auto-save on blur)
- ✅ **Text Wrapping** - Automatic text wrapping and row height adjustment when `showTooltip={false}`
- ✅ **Cell Validation** - Real-time validation for editable cells with custom validation functions
- ✅ **Custom Edit Components** - Customize edit input (dropdown, datepicker, or any React component) when double-clicking to edit

## Installation

```bash
npm install react-tabletify
```

### Requirements

- **React**: >= 16.8.0 (Hooks support required)
- **React DOM**: >= 16.8.0
- **Node.js**: >= 12.0.0 (for build process)

### Browser Support

- ✅ Chrome (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)
- ✅ IE 11 (with polyfills - see [COMPATIBILITY.md](./COMPATIBILITY.md))

### Compatibility

ReactTabletify is compiled to ES5 for maximum compatibility and works with:
- ✅ React 16.8+ (Class and Functional components)
- ✅ React 17.x
- ✅ React 18.x
- ✅ React 19.x
- ✅ TypeScript 3.5+
- ✅ Both CommonJS and ESM builds included

See [COMPATIBILITY.md](./COMPATIBILITY.md) for detailed compatibility information and performance tips.

## Usage

**⚠️ Important: Don't forget to import the CSS file!**

```tsx
import React from 'react';
import { ReactTabletify, Column } from 'react-tabletify';
// ⚠️ IMPORTANT: Import CSS styles
import 'react-tabletify/dist/index.css';
// Or use the shorter path:
// import 'react-tabletify/index.css';

interface User {
  id: number;
  name: string;
  age: number;
  role: string;
  department: string;
}

const data: User[] = [
  { id: 1, name: "Alice", age: 25, role: "Dev", department: "Engineering" },
  { id: 2, name: "Bob", age: 29, role: "PM", department: "Product" },
  // ... more data
];

const columns: Column<User>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "age", label: "Age" },
  { key: "role", label: "Role" },
  { key: "department", label: "Department" },
];

function App() {
  return (
    <ReactTabletify
      data={data}
      columns={columns}
      itemsPerPage={10}
      selectionMode="multiple"
      onSelectionChanged={(selected) => console.log('Selected:', selected)}
    />
  );
}
```

## Props

### ReactTabletify

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | **required** | Array of data items |
| `columns` | `Column<T>[]` | **required** | Column definitions |
| `itemsPerPage` | `number` | `10` | Items per page |
| `groupBy` | `keyof T` | - | Group rows by this field |
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'none'` | Selection mode |
| `showPagination` | `boolean` | `true` | Show pagination controls |
| `onRenderCell` | `(item, key, index) => ReactNode` | - | Custom cell renderer |
| `onRenderRow` | `(item, index, columns) => ReactNode` | - | Custom row renderer |
| `onRenderHeader` | `(column, index) => ReactNode` | - | Custom header renderer |
| `onItemInvoked` | `(item, index) => void` | - | Row click handler |
| `onSelectionChanged` | `(selectedItems: T[]) => void` | - | Selection change handler |
| `getKey` | `(item, index) => string \| number` | - | Custom key function |
| `theme` | `'light' \| 'dark' \| TableTheme` | `'light'` | Theme mode or custom theme object |
| `loading` | `boolean` | `false` | Show loading state with skeleton |
| `onRenderLoading` | `() => ReactNode` | - | Custom loading component |
| `emptyMessage` | `string` | - | Custom empty state message |
| `onRenderEmpty` | `() => ReactNode` | - | Custom empty state component |
| `stickyHeader` | `boolean` | `false` | Fix header when scrolling |
| `enableKeyboardNavigation` | `boolean` | `true` | Enable keyboard navigation |
| `enableColumnVisibility` | `boolean` | - | Enable column visibility toggle |
| `onColumnVisibilityChange` | `(visible: (keyof T)[]) => void` | - | Callback when column visibility changes |
| `enableColumnReorder` | `boolean` | - | Enable column drag & drop reordering |
| `onColumnReorder` | `(order: (keyof T)[]) => void` | - | Callback when column order changes |
| `showTooltip` | `boolean` | `true` | Show tooltip for truncated content |
| `onCellEdit` | `(item, columnKey, newValue, index) => void` | - | Callback when cell is edited |
| `onRenderEditCell` | `(item, columnKey, value, onChange, onBlur, onKeyDown, onSave, onCancel, hasError, validationError, enableCellSelection) => ReactNode` | - | Custom render function for editing cells (dropdown, datepicker, etc.) - defined per column |
| `pinnedColumns` | `Record<string, 'left' \| 'right'>` | - | Initial pinned columns |
| `onColumnPin` | `(columnKey, pinPosition) => void` | - | Callback when column is pinned/unpinned |
| `maxHeight` | `string \| number` | - | Maximum height of table |
| `itemsPerPageOptions` | `number[]` | - | Options for items per page dropdown (e.g., [10, 25, 50, 100]) |
| `onItemsPerPageChange` | `(itemsPerPage: number) => void` | - | Callback when items per page changes |
| `enableRowReorder` | `boolean` | `false` | Enable row drag & drop to reorder rows |
| `onRowReorder` | `(newData, draggedItem, fromIndex, toIndex) => void` | - | Callback when row order changes after drag & drop |
| `enableExport` | `boolean` | `false` | Enable export functionality (CSV/Excel) |
| `exportFormat` | `'csv' \| 'excel' \| 'both'` | `'both'` | Export format options |
| `exportFileName` | `string` | `'export'` | Custom filename for exported file (without extension) |
| `onBeforeExport` | `(data, columns) => { data, columns } \| undefined` | - | Callback before export (can transform data) |
| `onAfterExport` | `(format, filename) => void` | - | Callback after export |
| `rowActions` | `(item, index) => Array<{key, label, icon?, onClick, disabled?}>` | - | Function that returns array of actions for each row |
| `enableCellSelection` | `boolean` | `false` | Enable Excel-like cell selection (copy, cut, paste) |
| `className` | `string` | - | Additional CSS class |
| `styles` | `CSSProperties` | - | Inline styles |

## Examples

### Basic Table

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  itemsPerPage={10}
/>
```

### With Grouping

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  groupBy="department"
  itemsPerPage={10}
/>
```

### With Selection

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  selectionMode="multiple"
  onSelectionChanged={(selected) => {
    console.log('Selected items:', selected);
  }}
/>
```

### Custom Cell Rendering

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  onRenderCell={(item, key) => {
    if (key === 'salary') {
      return `$${item.salary.toLocaleString()}`;
    }
    return String(item[key]);
  }}
/>
```

### With Theme

```tsx
import { ReactTabletify, type TableTheme } from 'react-tabletify';

// Change primary color to yellow
const yellowTheme: TableTheme = {
  mode: 'light',
  colors: {
    primary: '#ffc107',
    focus: '#ffc107',
  },
};

<ReactTabletify
  data={users}
  columns={columns}
  theme={yellowTheme}
/>

// Or use dark theme
<ReactTabletify
  data={users}
  columns={columns}
  theme="dark"
/>
```

### With Loading State

```tsx
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchData().then(() => setLoading(false));
}, []);

<ReactTabletify
  data={users}
  columns={columns}
  loading={loading}
  onRenderLoading={() => <CustomSpinner />} // Optional custom loader
/>
```

### With Empty State

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  emptyMessage="No users found"
  onRenderEmpty={() => <CustomEmptyState />} // Optional custom empty state
/>
```

### With Sticky Header

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  stickyHeader={true}
  maxHeight="600px"
/>
```

### With Keyboard Navigation

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  enableKeyboardNavigation={true}
  selectionMode="multiple"
/>
// Use Arrow Up/Down to navigate, Enter/Space to select, Escape to deselect
```

### With Column Visibility

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  enableColumnVisibility={true}
  onColumnVisibilityChange={(visible) => {
    console.log('Visible columns:', visible);
  }}
/>
// Right-click header or use callout menu to show/hide columns
```

### With Column Reordering

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  enableColumnReorder={true}
  onColumnReorder={(order) => {
    console.log('Column order:', order);
  }}
/>
// Drag column headers to reorder
```

### With Inline Editing

```tsx
<ReactTabletify
  data={users}
  columns={columns.map(col => ({
    ...col,
    editable: col.key === 'name' || col.key === 'age' // Enable editing for specific columns
  }))}
  onCellEdit={(item, columnKey, newValue, index) => {
    // Update your data
    updateUser(index, columnKey, newValue);
  }}
/>
// Double-click a cell to edit
```

### With Cell Validation

```tsx
<ReactTabletify
  data={users}
  columns={columns.map(col => ({
    ...col,
    editable: col.key === 'email' || col.key === 'age',
    // Add validation function
    validate: (value, item, columnKey) => {
      if (columnKey === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) {
          return 'Please enter a valid email address';
        }
      }
      if (columnKey === 'age') {
        const num = Number(value);
        if (isNaN(num) || num < 18 || num > 100) {
          return 'Age must be between 18 and 100';
        }
      }
      return null; // Return null if valid
    },
  }))}
  onCellEdit={(item, columnKey, newValue, index) => {
    // Update your data (only called if validation passes)
    updateUser(index, columnKey, newValue);
  }}
/>
// Validation runs in real-time as you type
// Error message appears below the input
// Save is prevented if validation fails
// Works with both inline editing modes (with/without buttons)
```

### With Built-in Editor Types

You can use built-in editor types for common use cases (dropdown, datepicker):

```tsx
<ReactTabletify
  data={users}
  columns={columns.map(col => {
    if (col.key === 'role') {
      return {
        ...col,
        editable: true,
        editor: 'select', // Built-in dropdown editor
        options: ['Dev', 'PM', 'Tester', 'Designer', 'Manager'], // Options for dropdown
      };
    }
    if (col.key === 'joinDate') {
      return {
        ...col,
        editable: true,
        editor: 'date', // Built-in date picker editor
      };
    }
    return col;
  })}
  onCellEdit={(item, columnKey, newValue, index) => {
    // Update your data
    updateUser(index, columnKey, newValue);
  }}
/>
// Double-click a cell to edit
// Dropdown and datepicker automatically open when entering edit mode
// Date picker supports direct text input in dd/mm/yyyy format
// Calendar positions smartly (opens upward if space is limited)
```

### With Custom Edit Components

For advanced use cases, you can customize the edit component for each column (e.g., custom dropdown, datepicker, or any React component):

```tsx
<ReactTabletify
  data={users}
  columns={columns.map(col => {
    if (col.key === 'status') {
      return {
        ...col,
        editable: true,
        // Custom dropdown using external library (e.g., react-select)
        onRenderEditCell: (item, columnKey, value, onChange, onBlur, onKeyDown, onSave, onCancel, hasError, validationError, enableCellSelection) => {
          return (
            <Select
              value={value || ''}
              onChange={(val) => onChange(val)}
              options={statusOptions}
              // ... other props
            />
          );
        }
      };
    }
    return col;
  })}
  onCellEdit={(item, columnKey, newValue, index) => {
    // Update your data
    updateUser(index, columnKey, newValue);
  }}
/>
// Use onRenderEditCell for external library components
// Built-in editors (editor: 'select' | 'date') are recommended for common use cases
// onRenderEditCell receives:
// - item: The data item
// - columnKey: The column key
// - value: Current value being edited
// - onChange: Callback to update value (newValue: any) => void
// - onBlur: Callback when component loses focus
// - onKeyDown: Callback for keyboard events
// - onSave: Callback to save (returns false if validation fails)
// - onCancel: Callback to cancel editing
// - hasError: Whether there is a validation error
// - validationError: The validation error message (if any)
// - enableCellSelection: Whether Excel-like mode is enabled
// Return any React component (input, select, datepicker, custom component, etc.)
```

### With Column Pinning

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  pinnedColumns={{ name: 'left' }} // Pin 'name' column to left
  onColumnPin={(columnKey, pinPosition) => {
    console.log(`Column ${columnKey} pinned ${pinPosition}`);
  }}
/>
// Use header callout menu to pin/unpin columns
```

### With Items Per Page Options

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  itemsPerPage={10}
  itemsPerPageOptions={[10, 25, 50, 100]}
  onItemsPerPageChange={(newItemsPerPage) => {
    console.log('Items per page changed to:', newItemsPerPage);
  }}
/>
// Dropdown to select items per page will appear in pagination
```

### With Totals Row

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  // Totals row can be configured via header callout menu
  // Right-click column header > Totals > Count
/>
// Totals row will display count and stick to bottom when scrolling
```

### With Row Drag & Drop

```tsx
const [data, setData] = useState(users);

<ReactTabletify
  data={data}
  columns={columns}
  enableRowReorder={true}
  onRowReorder={(newData, draggedItem, fromIndex, toIndex) => {
    console.log('Row moved from', fromIndex, 'to', toIndex);
    // Update your data state
    setData(newData);
  }}
/>
// Drag and drop rows to reorder them
// Note: Row reordering is disabled when grouping is enabled
```

### With Export (CSV/Excel)

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  enableExport={true}
  exportFormat="both" // 'csv', 'excel', or 'both'
  exportFileName="users-data"
  onBeforeExport={(data, columns) => {
    // Optional: Transform data before export
    // Return { data, columns } or undefined to use original
    return undefined;
  }}
  onAfterExport={(format, filename) => {
    console.log(`Exported ${filename}.${format === 'csv' ? 'csv' : 'xlsx'}`);
  }}
/>
// Export toolbar will appear at the top of the table
// Click CSV or Excel button to export filtered data
// Note: Excel export uses HTML format (no external library required)
```

### With Row Actions Menu

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  rowActions={(item, index) => [
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditIcon />, // Optional icon
      onClick: (item, index) => {
        console.log('Edit item:', item);
        // Handle edit action
      },
    },
    {
      key: 'delete',
      label: 'Delete',
      icon: <DeleteIcon />, // Optional icon
      onClick: (item, index) => {
        console.log('Delete item:', item);
        // Handle delete action
      },
      disabled: item.status === 'locked', // Optional: disable action
    },
    {
      key: 'duplicate',
      label: 'Duplicate',
      onClick: (item, index) => {
        console.log('Duplicate item:', item);
        // Handle duplicate action
      },
    },
  ]}
/>
// A three-dot menu button (⋮) will appear in the leftmost column (after selection column if enabled)
// Click to open a dropdown menu with your custom actions
// Menu automatically closes when clicking outside or pressing Escape
```

### With Excel-like Cell Selection

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  enableCellSelection={true}
  onCellEdit={(item, columnKey, newValue, index) => {
    // Update your data
    updateUser(index, columnKey, newValue);
  }}
/>
// Click and drag to select multiple cells
// Ctrl+C (Cmd+C on Mac) to copy - border changes to dashed
// Ctrl+X (Cmd+X on Mac) to cut
// Ctrl+V (Cmd+V on Mac) to paste - supports pasting from Excel/Google Sheets
// Delete or Backspace to clear selected cells
// Escape to clear selection
// Shift+Click to extend selection range
// When cell selection is enabled, row click focus is disabled
// Double-click a cell to edit - seamless inline editing (no border, auto-save on blur)
// Arrow keys, Tab, Enter to navigate between cells
```

### With Text Wrapping

```tsx
<ReactTabletify
  data={users}
  columns={columns}
  showTooltip={false} // Set to false to allow text wrapping
/>
// When showTooltip={true}: Long content shows "..." with tooltip on hover
// When showTooltip={false}: Long content wraps to multiple lines, row height auto-adjusts
```

## Architecture

ReactTabletify is built with a modular architecture using custom hooks for better code organization and maintainability:

- **`useTable`** - Core table logic (sorting, filtering, pagination)
- **`useRowSelection`** - Row selection management (single/multiple)
- **`useColumnManagement`** - Column visibility, reordering, pinning
- **`useColumnResize`** - Column resizing functionality
- **`useInlineEditing`** - Inline cell editing
- **`useKeyboardNavigation`** - Keyboard navigation support
- **`useHeaderCallout`** - Header callout menu management
- **`useRowReorder`** - Row drag & drop reordering
- **`useCellSelection`** - Excel-like cell selection and range management
- **`useClipboard`** - Copy, cut, and paste operations for cells
- **Export utilities** - CSV and Excel export functions (no external dependencies)

This modular approach makes the codebase easier to maintain, test, and extend.

## Hooks

### useTable

A custom hook for managing table state:

```tsx
import { useTable } from 'react-tabletify';

const table = useTable(data, 10);

// Access filtered data
console.log(table.filtered);

// Access current page
console.log(table.paged);

// Sort
table.handleSort('name', 'asc');

// Filter
table.setFilter('department', ['Engineering', 'Product']);

// Pagination
table.setCurrentPage(2);
```

## Styling

**⚠️ CSS Import Required**

You must import the CSS file for the table to display correctly:

```tsx
import 'react-tabletify/dist/index.css';
// Or use the shorter path:
// import 'react-tabletify/index.css';
```

The CSS file is located at `dist/index.css` in the package. Make sure to import it in your main entry file (e.g., `index.tsx` or `App.tsx`).

### Theme System (Fluent UI Style)

ReactTabletify supports a comprehensive theme system similar to Fluent UI's `applyTheme()`, allowing you to customize colors, spacing, typography, and more.

#### Quick Start - Change Primary Color

```tsx
import { ReactTabletify, type TableTheme } from 'react-tabletify';

// Simple: Just change primary color
const yellowTheme: TableTheme = {
  mode: 'light',
  colors: {
    primary: '#ffc107', // Yellow
    focus: '#ffc107',
    focusBorder: '#ffc107',
  },
};

<ReactTabletify
  data={data}
  columns={columns}
  theme={yellowTheme}
/>
```

#### Theme Modes

```tsx
// Light theme (default)
<ReactTabletify theme="light" ... />

// Dark theme
<ReactTabletify theme="dark" ... />
```

#### Custom Theme

```tsx
import { type TableTheme } from 'react-tabletify';

const customTheme: TableTheme = {
  mode: 'light',
  colors: {
    background: '#ffffff',
    headerBackground: '#f0f4f8',
    rowBackground: '#ffffff',
    selectedRowBackground: '#e3f2fd',
    hoverRowBackground: '#f5f5f5',
    text: '#1a1a1a',
    primary: '#1976d2',      // Primary color (affects checkboxes, buttons, focus)
    focus: '#1976d2',        // Focus outline color
    border: '#e0e0e0',
  },
  spacing: {
    cellPadding: '12px 16px',
    rowHeight: '48px',
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
  },
};

<ReactTabletify
  data={data}
  columns={columns}
  theme={customTheme}
/>
```

#### What Primary Color Affects

The `primary` color controls:
- ✅ Checkbox/Radio when checked
- ✅ Filter icon when filter is active
- ✅ Focus outline
- ✅ Primary buttons (Apply button in filter panel)
- ✅ Pagination active page button
- ✅ Resize handle hover
- ✅ Group toggle focus

#### Extend Default Theme

```tsx
import { defaultLightTheme, type TableTheme } from 'react-tabletify';

const myTheme: TableTheme = {
  ...defaultLightTheme,
  colors: {
    ...defaultLightTheme.colors,
    primary: '#ff6b6b',  // Override primary color
    focus: '#ff6b6b',
  },
};
```

#### Dynamic Theme Switching

```tsx
const [theme, setTheme] = useState<'light' | 'dark' | TableTheme>('light');

<ReactTabletify
  data={data}
  columns={columns}
  theme={theme}
/>
```

**📖 For more detailed theme examples, see [THEME_EXAMPLES.md](./THEME_EXAMPLES.md)**

### Custom Styling

You can override the default styles by targeting the CSS classes:

- `.hh-table` - Main table container
- `.hh-header-cell` - Column headers
- `.hh-filter-panel` - Filter panel
- `.hh-callout` - Header callout menu
- `.hh-pagination` - Pagination controls

## TypeScript

Full TypeScript support with exported types:

```tsx
import type {
  ReactTabletifyProps,
  Column,
  SelectionMode,
  UseTableReturn,
  TableTheme,
  ThemeMode,
} from 'react-tabletify';
```

## Theme Utilities

```tsx
import { 
  getTheme, 
  applyTheme, 
  defaultLightTheme, 
  defaultDarkTheme 
} from 'react-tabletify';

// Get theme object
const theme = getTheme('dark'); // or custom theme object

// Apply theme to get CSS variables
const themeStyles = applyTheme(theme);
```

## Performance & Compatibility

ReactTabletify is optimized for performance and maximum compatibility:

- ✅ **ES5 Compatible** - Compiled to ES5 for maximum browser support
- ✅ **React 16.8+** - Works with React 16.8, 17.x, 18.x, and 19.x
- ✅ **No Modern JS Features** - No optional chaining or nullish coalescing (compatible with older projects)
- ✅ **Memoized Components** - TableCell and TableRow are memoized for better performance
- ✅ **Debounced Validation** - Cell validation is debounced to improve typing performance
- ✅ **Throttled Events** - Scroll and drag events are throttled for smooth performance
- ✅ **Optimized Rendering** - Only re-renders when necessary

### For Large Datasets

- **Always use pagination** for datasets > 100 rows
- **Use server-side processing** for datasets > 10,000 rows
- **Memoize callbacks** and data transformations
- **Disable unused features** to improve performance

See [PERFORMANCE.md](./PERFORMANCE.md) for detailed performance optimization guide.

### Browser & Project Compatibility

- ✅ Works with React 16.8+ (Class and Functional components)
- ✅ Compatible with TypeScript 3.5+
- ✅ Both CommonJS and ESM builds included
- ✅ IE 11 support (with polyfills)

See [COMPATIBILITY.md](./COMPATIBILITY.md) for detailed compatibility information.

## Changelog

### Version 0.6.5
- ✅ **Built-in Editor Types** - Added `editor: 'text' | 'select' | 'date'` prop to Column interface for common editor types
- ✅ **Built-in Dropdown Editor** - Use `editor: 'select'` with `options` array for dropdown selection (Fluent UI styled)
- ✅ **Built-in Date Picker Editor** - Use `editor: 'date'` for date selection with calendar popup (Fluent UI styled)
- ✅ **Auto-open on Double-click** - Dropdown and datepicker automatically open when double-clicking to edit
- ✅ **Direct Date Input** - Date picker supports direct text input in `dd/mm/yyyy` format with auto-formatting
- ✅ **Smart Calendar Positioning** - Calendar callout positions based on input field and opens upward if space is limited
- ✅ **Improved Icon Layout** - Icon button no longer overlaps input text when column width is small
- ✅ **Fixed Calendar Grid** - Corrected calendar day alignment and removed duplicate day issues
- ✅ **Tooltip Prevention** - Table cell tooltips no longer appear when hovering over calendar/dropdown

### Version 0.6.4
- ✅ **Custom Edit Components** - Added `onRenderEditCell` prop to Column interface
- ✅ **Flexible Editing** - Support for dropdown, datepicker, or any custom React component when editing cells
- ✅ **Edit Component API** - Full control over edit component with onChange, onBlur, onKeyDown, onSave, onCancel callbacks
- ✅ **Excel-like Support** - Custom edit components work with both normal mode (with buttons) and Excel-like mode (auto-save on blur)
- ✅ **Validation Integration** - Custom edit components receive validation error state and messages

### Version 0.6.3
- ✅ **Performance Optimizations** - Memoized TableCell and TableRow components
- ✅ **Debounced Validation** - Cell validation debounced to 150ms for better typing performance
- ✅ **Throttled Scroll Events** - Scroll events throttled with requestAnimationFrame
- ✅ **Optimized Drag & Drop** - Improved drag & drop performance with throttling and memoization
- ✅ **ES5 Compatibility** - Removed optional chaining and nullish coalescing for maximum compatibility
- ✅ **React 16.8+ Support** - Fully compatible with React 16.8, 17.x, 18.x, and 19.x
- ✅ **Performance Documentation** - Added PERFORMANCE.md and COMPATIBILITY.md guides
- ✅ **Fixed Drag & Drop with Pagination** - Drag & drop now works correctly across pages
- ✅ **Improved Inline Editing** - Fixed memoization issues that prevented inline editing

### Version 0.6.2
- ✅ Added Cell Validation - Real-time validation for editable cells
- ✅ Custom validation functions per column - return error message string or null
- ✅ Validation runs in real-time as user types (onChange)
- ✅ Visual error feedback - red border and error message below input
- ✅ Prevents save when validation fails - keeps focus and shows error
- ✅ Works with both inline editing modes (Excel-like and with buttons)
- ✅ Validation also applies to copy/paste operations - invalid values are skipped

### Version 0.6.1
- ✅ Enhanced Excel-like inline editing - seamless editing when `enableCellSelection={true}` (no border, auto-save on blur)
- ✅ Added text wrapping support - automatic text wrapping and row height adjustment when `showTooltip={false}`
- ✅ Improved cell editing UX - cursor positioned at end of text when editing starts
- ✅ Fixed Space key handling during cell editing
- ✅ Conditional text display - ellipsis with tooltip when `showTooltip={true}`, full text with wrapping when `showTooltip={false}`

### Version 0.6.0
- ✅ Added Excel-like Cell Selection - Select multiple cells, copy, cut, paste, and delete
- ✅ Support for range selection (click and drag)
- ✅ Keyboard shortcuts: Ctrl+C (copy), Ctrl+X (cut), Ctrl+V (paste), Delete (clear), Escape (deselect)
- ✅ Shift+Click to extend selection range
- ✅ Visual feedback for selected cells and ranges
- ✅ Copy to system clipboard (TSV format)
- ✅ Paste from external sources (Excel, Google Sheets, etc.) - automatically parses TSV format
- ✅ Dashed border when cells are copied (visual indicator)
- ✅ Border styling for header row when range starts from first row
- ✅ Disabled row focus/active styling when cell selection is enabled

### Version 0.5.0
- ✅ Added Row Actions Menu - Context menu with custom actions for each row
- ✅ Three-dot menu button (⋮) in the leftmost column (after selection column)
- ✅ Support for custom actions with icons and disabled state
- ✅ Menu automatically closes when clicking outside or pressing Escape
- ✅ Actions column header displays "Action" label
- ✅ Improved menu positioning and styling

### Version 0.4.0
- ✅ Added Export to CSV/Excel functionality
- ✅ Export toolbar with CSV and Excel buttons
- ✅ Support for data transformation before export
- ✅ No external library required for Excel export (uses HTML format)
- ✅ Refactored components into smaller, more manageable units
- ✅ Improved component naming for professionalism
- ✅ Enhanced export button hover effects
- ✅ Fixed header callout hover behavior (stays visible when hovering over callout)

### Version 0.3.0
- ✅ Added Items Per Page Options dropdown in pagination
- ✅ Added Nested Menus in header callout (Column settings, Totals)
- ✅ Added Totals Row with count aggregation
- ✅ Added Sticky Totals Row (stays at bottom when scrolling)
- ✅ Added Group By with visual indicator (checkmark in menu)
- ✅ Improved header callout UI with submenus
- ✅ Enhanced pinned columns with box shadow on scroll
- ✅ Updated pagination UI design

### Version 0.2.0
- ✅ Added Loading States with skeleton loader
- ✅ Added Empty States with custom messages
- ✅ Added Sticky Header support
- ✅ Added Keyboard Navigation (Arrow keys, Enter/Space, Escape)
- ✅ Added Column Visibility Toggle
- ✅ Added Column Reordering (drag & drop)
- ✅ Fixed selection logic for grouped rows
- ✅ Refactored code into modular hooks for better maintainability
- ✅ Added comprehensive JSDoc comments
- ✅ Improved code organization and documentation
- ✅ Added chevron icon next to column header labels

### Version 0.1.4
- ✅ Added Column Pinning
- ✅ Added Inline Editing
- ✅ Added Tooltip support
- ✅ Enhanced theme system

## License

MIT
