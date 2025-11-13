# ReactTabletify - Customization Options

## 🎨 UI Customization Options (giống Fluent UI DetailList)

### 1. **Density/Layout Modes**
```tsx
<ReactTabletify
  density="compact"  // 'compact' | 'normal' | 'spacious'
  // compact: Tighter spacing, smaller padding
  // normal: Standard spacing (default)
  // spacious: More spacing, larger padding
/>
```

### 2. **Theme Modes**
```tsx
<ReactTabletify
  theme="dark"  // 'light' | 'dark'
/>
```

### 3. **Zebra Striping**
```tsx
<ReactTabletify
  zebraStripes={true}  // Alternating row colors
  rowBackgroundColor={['#f9f9f9', '#ffffff']}  // [even, odd]
/>
```

### 4. **Sticky Header**
```tsx
<ReactTabletify
  stickyHeader={true}  // Header stays visible when scrolling
  maxHeight="600px"    // Required for scrolling
/>
```

### 5. **Row Height**
```tsx
<ReactTabletify
  rowHeight={48}  // Custom row height in pixels
/>
```

### 6. **Loading State**
```tsx
<ReactTabletify
  loading={true}
  onRenderLoading={() => <div>Loading...</div>}  // Custom loading component
/>
```

### 7. **Empty State**
```tsx
<ReactTabletify
  emptyMessage="No data available"
  onRenderEmpty={() => <div>Custom empty state</div>}  // Custom empty component
/>
```

### 8. **Row Actions Menu**
```tsx
<ReactTabletify
  rowActions={(item, index) => [
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditIcon />,
      onClick: (item, index) => console.log('Edit', item),
    },
    {
      key: 'delete',
      label: 'Delete',
      onClick: (item, index) => console.log('Delete', item),
      disabled: item.status === 'locked',
    },
  ]}
/>
```

### 9. **Custom Row Styling**
```tsx
<ReactTabletify
  rowClassName={(item, index) => `custom-row ${item.status}`}
  rowStyles={(item, index) => ({ 
    backgroundColor: item.status === 'active' ? '#e8f5e9' : '#fff' 
  })}
  enableRowHover={true}
/>
```

### 10. **Borders & Visual**
```tsx
<ReactTabletify
  bordered={true}        // Show borders around table
  rowBorders={true}      // Show row borders
  headerBackgroundColor="#fafafa"
  headerTextColor="#323130"
  rowBackgroundColor="#ffffff"
  rowTextColor="#323130"
  selectedRowBackgroundColor="#edebe9"
  hoverRowBackgroundColor="#f3f2f1"
  focusColor="#107c10"
/>
```

### 11. **Column Visibility Toggle**
```tsx
<ReactTabletify
  enableColumnVisibility={true}
  onColumnVisibilityChange={(visibleColumns) => {
    console.log('Visible columns:', visibleColumns);
  }}
/>
```

### 12. **Column Reordering**
```tsx
<ReactTabletify
  enableColumnReorder={true}
  onColumnReorder={(newOrder) => {
    console.log('New column order:', newOrder);
  }}
/>
```

### 13. **Keyboard Navigation**
```tsx
<ReactTabletify
  enableKeyboardNavigation={true}  // Arrow keys, Enter, Space, etc.
/>
```

### 14. **Complete Example**
```tsx
<ReactTabletify
  data={data}
  columns={columns}
  density="normal"
  theme="light"
  zebraStripes={true}
  stickyHeader={true}
  maxHeight="600px"
  rowHeight={40}
  bordered={true}
  enableRowHover={true}
  headerBackgroundColor="#faf9f8"
  rowBackgroundColor={['#ffffff', '#f9f9f9']}
  selectedRowBackgroundColor="#edebe9"
  hoverRowBackgroundColor="#f3f2f1"
  loading={isLoading}
  emptyMessage="No items found"
  rowActions={(item, index) => [
    { key: 'edit', label: 'Edit', onClick: () => editItem(item) },
    { key: 'delete', label: 'Delete', onClick: () => deleteItem(item) },
  ]}
  enableColumnVisibility={true}
  enableColumnReorder={true}
  enableKeyboardNavigation={true}
/>
```

## 📋 Tất cả Options đã thêm:

✅ **Density modes** - compact, normal, spacious  
✅ **Theme modes** - light, dark  
✅ **Zebra striping** - alternating row colors  
✅ **Sticky header** - header stays visible  
✅ **Custom row height** - fixed row height  
✅ **Loading state** - with custom renderer  
✅ **Empty state** - with custom message/component  
✅ **Row actions menu** - per-row action menu  
✅ **Custom row styling** - className & styles functions  
✅ **Borders** - table & row borders  
✅ **Color customization** - header, row, selected, hover colors  
✅ **Column visibility** - show/hide columns  
✅ **Column reordering** - drag & drop columns  
✅ **Keyboard navigation** - arrow keys, enter, space  
✅ **Focus color** - custom focus outline  

Tất cả các options này cho phép bạn customize UI giống như Fluent UI DetailList!

