/**
 * ReactTabletify - A powerful, customizable data table component for React
 * 
 * @packageDocumentation
 */

export { ReactTabletify } from './components/ReactTabletify';
export { useTable } from './hooks/useTable';
export { getTheme, applyTheme, defaultLightTheme, defaultDarkTheme } from './utils/theme';
export type {
  ReactTabletifyProps,
  Column,
  SelectionMode,
  UseTableReturn,
  TableTheme,
  ThemeMode,
  DensityMode,
} from './types';

// Export component types for convenience
export type { ReactTabletifyProps as TableProps } from './types';
