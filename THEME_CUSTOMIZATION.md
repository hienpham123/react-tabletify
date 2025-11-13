# Hướng dẫn Customize Theme - Đổi màu Primary

## Cách 1: Chỉ đổi màu Primary (Đơn giản nhất)

Khi bạn chỉ muốn đổi màu primary (màu xanh lá #107c10) sang màu khác, ví dụ màu vàng:

```tsx
import { ReactTabletify, type TableTheme } from 'react-tabletify';

// Chỉ cần override màu primary
const yellowTheme: TableTheme = {
  mode: 'light',
  colors: {
    primary: '#ffc107', // Màu vàng (Amber)
    focus: '#ffc107',   // Focus color cũng dùng vàng
    focusBorder: '#ffc107',
  },
};

function MyComponent() {
  return (
    <ReactTabletify
      data={data}
      columns={columns}
      theme={yellowTheme} // Áp dụng theme vàng
    />
  );
}
```

## Cách 2: Đổi màu Primary với các màu khác

Nếu bạn muốn đổi primary và các màu liên quan:

```tsx
const customTheme: TableTheme = {
  mode: 'light',
  colors: {
    primary: '#ffc107',        // Màu vàng chính
    focus: '#ffc107',          // Focus outline
    focusBorder: '#ffc107',    // Focus border
    // Các màu khác giữ nguyên default
  },
};
```

## Cách 3: Full Custom Theme

Nếu bạn muốn customize toàn bộ theme:

```tsx
const fullCustomTheme: TableTheme = {
  mode: 'light',
  colors: {
    // Background colors
    background: '#ffffff',
    surface: '#ffffff',
    headerBackground: '#fff9e6', // Header màu vàng nhạt
    rowBackground: '#ffffff',
    rowBackgroundAlternate: '#fffef5',
    selectedRowBackground: '#fff8dc',
    hoverRowBackground: '#fffef0',
    
    // Text colors
    text: '#1a1a1a',
    headerText: '#1a1a1a',
    rowText: '#1a1a1a',
    
    // Border colors
    border: '#e0e0e0',
    
    // Primary & Focus (màu vàng)
    primary: '#ffc107',
    focus: '#ffc107',
    focusBorder: '#ffc107',
    
    // Interactive colors
    hover: '#fffef0',
    active: '#fff8dc',
  },
  spacing: {
    cellPadding: '10px 12px',
    rowHeight: 'auto',
  },
  typography: {
    fontFamily: '"Segoe UI", sans-serif',
    fontSize: '14px',
  },
};
```

## Màu Primary ảnh hưởng đến:

- ✅ Checkbox khi checked
- ✅ Radio button khi selected
- ✅ Filter icon khi có filter active
- ✅ Focus outline
- ✅ Primary buttons (Apply button trong filter panel)
- ✅ Resize handle hover
- ✅ Group toggle focus

## Ví dụ các màu Primary phổ biến:

```tsx
// Vàng (Amber)
primary: '#ffc107'

// Vàng đậm (Gold)
primary: '#ffa000'

// Vàng nhạt (Yellow)
primary: '#ffeb3b'

// Xanh dương
primary: '#2196f3'

// Đỏ
primary: '#f44336'

// Tím
primary: '#9c27b0'

// Cam
primary: '#ff9800'
```

## Lưu ý:

1. **Theme được merge với default theme**: Bạn chỉ cần override những gì muốn thay đổi, các giá trị khác sẽ giữ nguyên default.

2. **Focus color nên giống primary**: Để UX nhất quán, nên set `focus` và `focusBorder` cùng màu với `primary`.

3. **Dark mode**: Nếu dùng dark mode, màu primary nên sáng hơn để dễ nhìn:
   ```tsx
   const darkYellowTheme: TableTheme = {
     mode: 'dark',
     colors: {
       primary: '#ffd54f', // Vàng sáng hơn cho dark mode
       focus: '#ffd54f',
     },
   };
   ```

