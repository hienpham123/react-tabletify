# ReactTabletify

A powerful, customizable data table component for React with Fluent UI styling.

## Features

- ✅ **Sorting** - Ascending/descending column sorting
- ✅ **Filtering** - Per-column filtering with search
- ✅ **Pagination** - Built-in pagination controls
- ✅ **Row Grouping** - Group rows by field with expand/collapse
- ✅ **Row Selection** - Single or multiple row selection
- ✅ **Custom Rendering** - Customize cells, rows, and headers
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
} from 'react-tabletify';
```

## License

MIT
