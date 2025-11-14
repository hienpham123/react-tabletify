# ReactTabletify made by **Hie Ho** ⚡

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

## Installation

```bash
npm install react-tabletify
```

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
| `pinnedColumns` | `Record<string, 'left' \| 'right'>` | - | Initial pinned columns |
| `onColumnPin` | `(columnKey, pinPosition) => void` | - | Callback when column is pinned/unpinned |
| `maxHeight` | `string \| number` | - | Maximum height of table |
| `itemsPerPageOptions` | `number[]` | - | Options for items per page dropdown (e.g., [10, 25, 50, 100]) |
| `onItemsPerPageChange` | `(itemsPerPage: number) => void` | - | Callback when items per page changes |
| `enableRowReorder` | `boolean` | `false` | Enable row drag & drop to reorder rows |
| `onRowReorder` | `(newData, draggedItem, fromIndex, toIndex) => void` | - | Callback when row order changes after drag & drop |
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

- `.th-table` - Main table container
- `.th-header-cell` - Column headers
- `.th-filter-panel` - Filter panel
- `.th-callout` - Header callout menu
- `.th-pagination` - Pagination controls

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

## Changelog

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
