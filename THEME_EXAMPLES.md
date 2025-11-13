# ReactTabletify - Theme System Examples

## 🎨 Theme System (giống Fluent UI applyTheme())

ReactTabletify hỗ trợ hệ thống theme hoàn chỉnh, tương tự Fluent UI's `applyTheme()`, cho phép bạn customize toàn bộ table.

## 📦 Import

```tsx
import { 
  ReactTabletify, 
  getTheme, 
  applyTheme, 
  defaultLightTheme, 
  defaultDarkTheme,
  type TableTheme 
} from 'react-tabletify';
```

## 🚀 Cách sử dụng

### 1. **Simple Theme Mode** (String)

```tsx
// Light theme (default)
<ReactTabletify
  data={data}
  columns={columns}
  theme="light"
/>

// Dark theme
<ReactTabletify
  data={data}
  columns={columns}
  theme="dark"
/>
```

### 2. **Custom Theme Object**

```tsx
const customTheme: TableTheme = {
  mode: 'light',
  colors: {
    background: '#ffffff',
    headerBackground: '#f0f0f0',
    rowBackground: '#ffffff',
    rowBackgroundAlternate: '#f9f9f9',
    selectedRowBackground: '#e3f2fd',
    hoverRowBackground: '#f5f5f5',
    text: '#212121',
    headerText: '#212121',
    rowText: '#212121',
    border: '#e0e0e0',
    focus: '#1976d2',
    primary: '#1976d2',
  },
  spacing: {
    cellPadding: '12px 16px',
    headerPadding: '12px 16px',
    rowHeight: '48px',
    rowHeightCompact: '36px',
    rowHeightSpacious: '64px',
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
    fontWeight: '400',
    fontWeightBold: '600',
  },
  borderRadius: {
    table: '8px',
    button: '4px',
  },
  shadows: {
    table: '0 2px 4px rgba(0,0,0,0.1)',
  },
};

<ReactTabletify
  data={data}
  columns={columns}
  theme={customTheme}
/>
```

### 3. **Extend Default Theme**

```tsx
import { defaultLightTheme } from 'react-tabletify';

const myTheme: TableTheme = {
  ...defaultLightTheme,
  colors: {
    ...defaultLightTheme.colors,
    primary: '#ff6b6b',  // Override primary color
    focus: '#ff6b6b',
  },
  spacing: {
    ...defaultLightTheme.spacing,
    rowHeight: '56px',  // Override row height
  },
};

<ReactTabletify
  data={data}
  columns={columns}
  theme={myTheme}
/>
```

### 4. **Dynamic Theme Switching**

```tsx
const [currentTheme, setCurrentTheme] = useState<TableTheme | 'light' | 'dark'>('light');

const toggleTheme = () => {
  setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
};

<>
  <button onClick={toggleTheme}>Toggle Theme</button>
  <ReactTabletify
    data={data}
    columns={columns}
    theme={currentTheme}
  />
</>
```

### 5. **Programmatic Theme Application**

```tsx
import { getTheme, applyTheme } from 'react-tabletify';

// Get theme object
const theme = getTheme('dark'); // or custom theme object

// Apply theme to get CSS variables
const themeStyles = applyTheme(theme);

// Use in your custom component
<div style={themeStyles}>
  {/* Your custom table implementation */}
</div>
```

## 🎨 Complete Theme Structure

```tsx
interface TableTheme {
  mode?: 'light' | 'dark';
  
  colors: {
    // Backgrounds
    background?: string;
    surface?: string;
    headerBackground?: string;
    rowBackground?: string;
    rowBackgroundAlternate?: string;
    selectedRowBackground?: string;
    hoverRowBackground?: string;
    groupHeaderBackground?: string;
    
    // Text
    text?: string;
    textSecondary?: string;
    headerText?: string;
    rowText?: string;
    selectedRowText?: string;
    
    // Borders
    border?: string;
    borderLight?: string;
    rowBorder?: string;
    
    // Interactive
    focus?: string;
    focusBorder?: string;
    hover?: string;
    active?: string;
    disabled?: string;
    
    // Status
    primary?: string;
    success?: string;
    warning?: string;
    error?: string;
  };
  
  spacing?: {
    cellPadding?: string;
    headerPadding?: string;
    rowHeight?: string;
    rowHeightCompact?: string;
    rowHeightSpacious?: string;
    gap?: string;
  };
  
  typography?: {
    fontFamily?: string;
    fontSize?: string;
    fontSizeSmall?: string;
    fontSizeLarge?: string;
    fontWeight?: string;
    fontWeightBold?: string;
    lineHeight?: string;
  };
  
  borderRadius?: {
    table?: string;
    cell?: string;
    button?: string;
  };
  
  shadows?: {
    table?: string;
    header?: string;
    callout?: string;
    panel?: string;
  };
  
  transitions?: {
    duration?: string;
    easing?: string;
  };
}
```

## 💡 Real-world Examples

### Material Design Theme

```tsx
const materialTheme: TableTheme = {
  mode: 'light',
  colors: {
    background: '#ffffff',
    headerBackground: '#f5f5f5',
    rowBackground: '#ffffff',
    selectedRowBackground: '#e3f2fd',
    hoverRowBackground: '#f5f5f5',
    text: '#212121',
    primary: '#1976d2',
    focus: '#1976d2',
  },
  spacing: {
    cellPadding: '16px',
    rowHeight: '48px',
  },
  borderRadius: {
    table: '4px',
    button: '4px',
  },
};
```

### High Contrast Theme

```tsx
const highContrastTheme: TableTheme = {
  mode: 'light',
  colors: {
    background: '#ffffff',
    headerBackground: '#000000',
    rowBackground: '#ffffff',
    selectedRowBackground: '#ffff00',
    text: '#000000',
    headerText: '#ffffff',
    border: '#000000',
    focus: '#0000ff',
  },
  spacing: {
    cellPadding: '12px',
    rowHeight: '44px',
  },
};
```

## 🔧 Utilities

### `getTheme(theme?: ThemeMode | TableTheme): TableTheme`
Lấy theme object từ string hoặc custom theme, merge với default theme.

### `applyTheme(theme: TableTheme): CSSProperties`
Áp dụng theme và trả về CSS properties với CSS variables.

### `defaultLightTheme: TableTheme`
Default light theme object.

### `defaultDarkTheme: TableTheme`
Default dark theme object.

## ✨ Features

- ✅ **Simple mode**: Chỉ cần string `'light'` hoặc `'dark'`
- ✅ **Custom theme**: Full control với theme object
- ✅ **Extend default**: Merge với default theme
- ✅ **CSS Variables**: Theme được apply qua CSS variables
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Dynamic**: Có thể thay đổi theme runtime

