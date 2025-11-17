# Compatibility Guide

## React Version Support

ReactTabletify is designed to work with **React >= 16.8.0** (the minimum version that supports Hooks).

### Why React 16.8.0?

- React Hooks were introduced in React 16.8.0
- This component uses hooks extensively (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`)
- All modern React features are used in a backward-compatible way

## Node Version Support

- **Minimum Node.js**: 12.x (for build process)
- **Recommended Node.js**: 14.x or higher

## Browser Support

ReactTabletify is compiled to ES5 for maximum browser compatibility:

- ✅ Chrome (last 2 versions)
- ✅ Firefox (last 2 versions)
- ✅ Safari (last 2 versions)
- ✅ Edge (last 2 versions)
- ✅ IE 11 (with polyfills - see below)

## Features Used

### JavaScript Features
- ✅ ES5 compatible (compiled from TypeScript)
- ✅ No optional chaining (`?.`) - replaced with explicit checks
- ✅ No nullish coalescing (`??`) - replaced with `!= null` checks
- ✅ No async/await in public API
- ✅ Standard React patterns only

### React Features
- ✅ React Hooks (requires React 16.8+)
- ✅ Functional components only
- ✅ No class components required
- ✅ Compatible with both class and functional parent components

## Installation in Old Projects

### For React 16.8 - 17.x Projects

```bash
npm install react-tabletify
```

No additional configuration needed. The package is pre-compiled to ES5.

### For React 18+ Projects

```bash
npm install react-tabletify
```

Works out of the box with React 18+.

### For Class Component Projects

ReactTabletify is a functional component but can be used in class components:

```tsx
import React, { Component } from 'react';
import { ReactTabletify } from 'react-tabletify';
import 'react-tabletify/dist/index.css';

class MyComponent extends Component {
  render() {
    return (
      <ReactTabletify
        data={this.state.data}
        columns={this.state.columns}
      />
    );
  }
}
```

## Performance Optimizations

### For Large Datasets (1000+ rows)

1. **Use Pagination**: Always enable pagination for large datasets
   ```tsx
   <ReactTabletify
     data={largeData}
     columns={columns}
     itemsPerPage={50}
     showPagination={true}
   />
   ```

2. **Memoize Data**: Use `React.useMemo` for data transformations
   ```tsx
   const processedData = React.useMemo(() => {
     return rawData.map(/* transform */);
   }, [rawData]);
   ```

3. **Avoid Inline Functions**: Don't create functions in render
   ```tsx
   // ❌ Bad
   <ReactTabletify
     onItemClick={(item) => handleClick(item)}
   />
   
   // ✅ Good
   const handleItemClick = React.useCallback((item) => {
     // handle click
   }, []);
   
   <ReactTabletify
     onItemClick={handleItemClick}
   />
   ```

## Bundle Size

- **Minified**: ~150KB (with CSS)
- **Gzipped**: ~45KB
- **Tree-shakeable**: Yes (ESM build)

## Polyfills (for IE 11)

If you need to support IE 11, add these polyfills:

```bash
npm install core-js
```

```tsx
// At the top of your entry file
import 'core-js/stable';
import 'regenerator-runtime/runtime';
```

## TypeScript Support

- ✅ Full TypeScript support
- ✅ Type definitions included
- ✅ Works with TypeScript 3.5+

## CommonJS vs ESM

The package provides both builds:

- **CommonJS** (`dist/index.js`) - for Node.js and older bundlers
- **ESM** (`dist/index.esm.js`) - for modern bundlers (webpack 5+, Vite, etc.)

Your bundler will automatically choose the correct format.

## Troubleshooting

### "Hooks can only be called inside function components"

This means you're using React < 16.8.0. Upgrade React:

```bash
npm install react@^16.8.0 react-dom@^16.8.0
```

### "Cannot find module 'react-tabletify'"

Make sure you've installed the package:

```bash
npm install react-tabletify
```

### Styles not loading

Don't forget to import the CSS:

```tsx
import 'react-tabletify/dist/index.css';
```

### Performance issues with large datasets

1. Enable pagination
2. Use `React.memo` for custom cell renderers
3. Avoid creating new objects/arrays in render functions
4. Use `useMemo` and `useCallback` in parent components

