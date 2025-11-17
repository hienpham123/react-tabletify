# Performance Optimization Guide

## For Large Datasets (1000+ rows)

### 1. Always Use Pagination

Pagination is the most important optimization for large datasets:

```tsx
<ReactTabletify
  data={largeData}
  columns={columns}
  itemsPerPage={50}  // Show 50 rows per page
  showPagination={true}
/>
```

**Why?** Rendering 1000 rows at once causes:
- Slow initial render
- High memory usage
- Laggy scrolling
- Poor user experience

### 2. Memoize Your Data

Use `React.useMemo` to prevent unnecessary recalculations:

```tsx
const processedData = React.useMemo(() => {
  return rawData.map(item => ({
    ...item,
    computedField: expensiveCalculation(item)
  }));
}, [rawData]);
```

### 3. Memoize Callbacks

Always memoize callbacks passed to ReactTabletify:

```tsx
// ❌ Bad - creates new function on every render
<ReactTabletify
  onItemClick={(item) => handleClick(item)}
/>

// ✅ Good - function is memoized
const handleItemClick = React.useCallback((item) => {
  // handle click
}, []);

<ReactTabletify
  onItemClick={handleItemClick}
/>
```

### 4. Memoize Custom Renderers

If you have custom cell renderers, memoize them:

```tsx
const renderCell = React.useCallback((item, columnKey, index) => {
  return <CustomCell item={item} />;
}, []);

<ReactTabletify
  onRenderCell={renderCell}
/>
```

### 5. Avoid Inline Objects/Arrays

Don't create new objects or arrays in render:

```tsx
// ❌ Bad - new array created on every render
<ReactTabletify
  columns={columns.map(col => ({ ...col, style: { color: 'red' } }))}
/>

// ✅ Good - memoize the columns
const styledColumns = React.useMemo(() => {
  return columns.map(col => ({ ...col, style: { color: 'red' } }));
}, [columns]);

<ReactTabletify
  columns={styledColumns}
/>
```

### 6. Use Server-Side Processing

For very large datasets (10,000+ rows), use server-side processing:

```tsx
const [serverData, setServerData] = React.useState([]);
const [serverTotalCount, setServerTotalCount] = React.useState(0);
const [serverLoading, setServerLoading] = React.useState(false);

const handleServerDataRequest = React.useCallback(async (params) => {
  setServerLoading(true);
  try {
    const response = await fetch('/api/data', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    const result = await response.json();
    setServerData(result.data);
    setServerTotalCount(result.totalCount);
  } finally {
    setServerLoading(false);
  }
}, []);

<ReactTabletify
  data={serverData}
  serverSideProcessing={true}
  onServerDataRequest={handleServerDataRequest}
  serverTotalCount={serverTotalCount}
  serverLoading={serverLoading}
/>
```

### 7. Optimize Column Definitions

Keep column definitions stable:

```tsx
// ❌ Bad - columns recreated on every render
function MyComponent() {
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
  ];
  
  return <ReactTabletify columns={columns} />;
}

// ✅ Good - columns defined outside or memoized
const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
];

function MyComponent() {
  return <ReactTabletify columns={COLUMNS} />;
}
```

### 8. Disable Unused Features

Disable features you don't need to improve performance:

```tsx
<ReactTabletify
  data={data}
  columns={columns}
  enableRowReorder={false}  // Disable if not needed
  enableCellSelection={false}  // Disable if not needed
  enableExport={false}  // Disable if not needed
  showTooltip={false}  // Disable tooltips for better performance
/>
```

### 9. Use React.memo for Parent Components

If your parent component re-renders frequently, memoize it:

```tsx
const MyTable = React.memo(({ data, columns }) => {
  return (
    <ReactTabletify
      data={data}
      columns={columns}
    />
  );
});
```

### 10. Batch State Updates

When updating multiple cells, batch the updates:

```tsx
// ❌ Bad - multiple state updates
const handleBatchEdit = (updates) => {
  updates.forEach(update => {
    setData(prev => updateItem(prev, update));
  });
};

// ✅ Good - single state update
const handleBatchEdit = (updates) => {
  setData(prev => {
    const newData = [...prev];
    updates.forEach(update => {
      updateItemInPlace(newData, update);
    });
    return newData;
  });
};
```

## Performance Benchmarks

### Small Dataset (< 100 rows)
- Initial render: < 50ms
- Scroll: 60 FPS
- Edit: < 10ms response

### Medium Dataset (100-1000 rows)
- Initial render: < 200ms (with pagination)
- Scroll: 60 FPS
- Edit: < 10ms response

### Large Dataset (1000-10000 rows)
- Initial render: < 500ms (with pagination)
- Scroll: 60 FPS (with pagination)
- Edit: < 10ms response
- **Recommendation**: Use server-side processing

## Common Performance Issues

### Issue: Slow Initial Render

**Solution:**
1. Enable pagination
2. Reduce number of columns
3. Simplify cell renderers
4. Use server-side processing

### Issue: Laggy Scrolling

**Solution:**
1. Enable pagination
2. Disable virtual scrolling if enabled (it's disabled by default)
3. Reduce number of visible columns
4. Simplify cell content

### Issue: Slow Editing

**Solution:**
1. Debounce validation (already done internally)
2. Avoid expensive calculations in validation
3. Use `React.memo` for custom cell renderers

### Issue: High Memory Usage

**Solution:**
1. Use pagination
2. Use server-side processing
3. Avoid storing large objects in cell data
4. Clean up event listeners

## Best Practices Summary

1. ✅ **Always use pagination** for datasets > 100 rows
2. ✅ **Memoize callbacks** and data transformations
3. ✅ **Keep column definitions stable**
4. ✅ **Disable unused features**
5. ✅ **Use server-side processing** for very large datasets
6. ✅ **Avoid inline functions/objects** in render
7. ✅ **Batch state updates** when possible
8. ✅ **Use React.memo** for frequently re-rendering parents

## Monitoring Performance

Use React DevTools Profiler to identify performance bottlenecks:

1. Open React DevTools
2. Go to Profiler tab
3. Click "Record"
4. Interact with your table
5. Stop recording
6. Analyze which components take longest to render

Look for:
- Components with long render times
- Components that re-render unnecessarily
- Large component trees

