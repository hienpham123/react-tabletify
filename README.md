# ReactTabletify

A powerful, customizable data table component for React with Fluent UI styling.

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

## License

MIT
