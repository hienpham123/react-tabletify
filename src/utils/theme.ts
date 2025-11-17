import type { TableTheme, ThemeMode } from '../types';

/**
 * Default light theme
 */
export const defaultLightTheme: TableTheme = {
  mode: 'light',
  colors: {
    background: '#ffffff',
    surface: '#ffffff',
    headerBackground: '#faf9f8',
    rowBackground: '#ffffff',
    rowBackgroundAlternate: '#f9f9f9',
    selectedRowBackground: '#edebe9',
    hoverRowBackground: '#f3f2f1',
    groupHeaderBackground: '#f3f2f1',
    text: '#323130',
    textSecondary: '#605e5c',
    headerText: '#323130',
    rowText: '#323130',
    selectedRowText: '#323130',
    border: '#edebe9',
    borderLight: '#f1f1f1',
    rowBorder: '#f1f1f1',
    focus: '#107c10',
    focusBorder: '#107c10',
    hover: '#f3f2f1',
    active: '#edebe9',
    disabled: '#a19f9d',
    primary: '#107c10',
    success: '#107c10',
    warning: '#ffaa44',
    error: '#d13438',
  },
  spacing: {
    cellPadding: '10px 12px',
    headerPadding: '10px 12px',
    rowHeight: 'auto',
    rowHeightCompact: '32px',
    rowHeightSpacious: '56px',
    gap: '8px',
  },
  typography: {
    fontFamily: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif',
    fontSize: '14px',
    fontSizeSmall: '12px',
    fontSizeLarge: '16px',
    fontWeight: '400',
    fontWeightBold: '600',
    lineHeight: '20px',
  },
  borderRadius: {
    table: '8px',
    cell: '0',
    button: '2px',
  },
  shadows: {
    table: '0 2px 8px rgba(0,0,0,0.08)',
    header: 'none',
    callout: '0 3.2px 7.2px rgba(0, 0, 0, 0.132), 0 0.6px 1.8px rgba(0, 0, 0, 0.108)',
    panel: '-2px 0 8px rgba(0, 0, 0, 0.15), -1px 0 2px rgba(0, 0, 0, 0.1)',
  },
  transitions: {
    duration: '0.1s',
    easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)',
  },
};

/**
 * Default dark theme
 */
export const defaultDarkTheme: TableTheme = {
  mode: 'dark',
  colors: {
    background: '#1a1a1a',
    surface: '#252526',
    headerBackground: '#2d2d30',
    rowBackground: '#252526',
    rowBackgroundAlternate: '#2d2d30',
    selectedRowBackground: '#3e3e42',
    hoverRowBackground: '#2d2d30',
    groupHeaderBackground: '#2d2d30',
    text: '#cccccc',
    textSecondary: '#858585',
    headerText: '#cccccc',
    rowText: '#cccccc',
    selectedRowText: '#ffffff',
    border: '#3e3e42',
    borderLight: '#2d2d30',
    rowBorder: '#3e3e42',
    focus: '#4ec9b0',
    focusBorder: '#4ec9b0',
    hover: '#2d2d30',
    active: '#3e3e42',
    disabled: '#858585',
    primary: '#4ec9b0',
    success: '#4ec9b0',
    warning: '#dcdcaa',
    error: '#f48771',
  },
  spacing: {
    cellPadding: '10px 12px',
    headerPadding: '10px 12px',
    rowHeight: 'auto',
    rowHeightCompact: '32px',
    rowHeightSpacious: '56px',
    gap: '8px',
  },
  typography: {
    fontFamily: '"Segoe UI", "Segoe UI Web (West European)", "Segoe UI", -apple-system, BlinkMacSystemFont, "Roboto", "Helvetica Neue", sans-serif',
    fontSize: '14px',
    fontSizeSmall: '12px',
    fontSizeLarge: '16px',
    fontWeight: '400',
    fontWeightBold: '600',
    lineHeight: '20px',
  },
  borderRadius: {
    table: '8px',
    cell: '0',
    button: '2px',
  },
  shadows: {
    table: '0 2px 8px rgba(0,0,0,0.3)',
    header: 'none',
    callout: '0 3.2px 7.2px rgba(0, 0, 0, 0.4), 0 0.6px 1.8px rgba(0, 0, 0, 0.3)',
    panel: '-2px 0 8px rgba(0, 0, 0, 0.4), -1px 0 2px rgba(0, 0, 0, 0.3)',
  },
  transitions: {
    duration: '0.1s',
    easing: 'cubic-bezier(0.1, 0.9, 0.2, 1)',
  },
};

/**
 * Get theme object from theme prop
 * @param theme - Theme mode string or custom theme object
 * @returns Complete theme object
 */
export function getTheme(theme?: ThemeMode | TableTheme): TableTheme {
  if (!theme) {
    return defaultLightTheme;
  }
  
  if (typeof theme === 'string') {
    return theme === 'dark' ? defaultDarkTheme : defaultLightTheme;
  }
  
  // Merge custom theme with default theme
  const baseTheme = theme.mode === 'dark' ? defaultDarkTheme : defaultLightTheme;
  
  return {
    ...baseTheme,
    ...theme,
    colors: {
      ...baseTheme.colors,
      ...theme.colors,
    },
    spacing: theme.spacing ? {
      ...baseTheme.spacing,
      ...theme.spacing,
    } : baseTheme.spacing,
    typography: theme.typography ? {
      ...baseTheme.typography,
      ...theme.typography,
    } : baseTheme.typography,
    borderRadius: theme.borderRadius ? {
      ...baseTheme.borderRadius,
      ...theme.borderRadius,
    } : baseTheme.borderRadius,
    shadows: theme.shadows ? {
      ...baseTheme.shadows,
      ...theme.shadows,
    } : baseTheme.shadows,
    transitions: theme.transitions ? {
      ...baseTheme.transitions,
      ...theme.transitions,
    } : baseTheme.transitions,
  };
}

/**
 * Apply theme to table - generates CSS variables
 * Similar to Fluent UI's applyTheme()
 * 
 * @param theme - Theme object
 * @returns CSS properties object with CSS variables
 */
export function applyTheme(theme: TableTheme): React.CSSProperties {
  const { colors, spacing, typography, borderRadius, shadows, transitions } = theme;
  
  return {
    // CSS Variables for theme
    '--hh-color-background': colors.background,
    '--hh-color-surface': colors.surface,
    '--hh-color-header-background': colors.headerBackground,
    '--hh-color-row-background': colors.rowBackground,
    '--hh-color-row-background-alternate': colors.rowBackgroundAlternate,
    '--hh-color-selected-row-background': colors.selectedRowBackground,
    '--hh-color-hover-row-background': colors.hoverRowBackground,
    '--hh-color-group-header-background': colors.groupHeaderBackground,
    '--hh-color-text': colors.text,
    '--hh-color-text-secondary': colors.textSecondary,
    '--hh-color-header-text': colors.headerText,
    '--hh-color-row-text': colors.rowText,
    '--hh-color-selected-row-text': colors.selectedRowText,
    '--hh-color-border': colors.border,
    '--hh-color-border-light': colors.borderLight,
    '--hh-color-row-border': colors.rowBorder,
    '--hh-color-focus': colors.focus,
    '--hh-color-focus-border': colors.focusBorder,
    '--hh-color-hover': colors.hover,
    '--hh-color-active': colors.active,
    '--hh-color-disabled': colors.disabled,
    '--hh-color-primary': colors.primary,
    '--hh-color-success': colors.success,
    '--hh-color-warning': colors.warning,
    '--hh-color-error': colors.error,
    
    '--hh-spacing-cell-padding': spacing?.cellPadding,
    '--hh-spacing-header-padding': spacing?.headerPadding,
    '--hh-spacing-row-height': spacing?.rowHeight,
    '--hh-spacing-row-height-compact': spacing?.rowHeightCompact,
    '--hh-spacing-row-height-spacious': spacing?.rowHeightSpacious,
    '--hh-spacing-gap': spacing?.gap,
    
    '--hh-typography-font-family': typography?.fontFamily,
    '--hh-typography-font-size': typography?.fontSize,
    '--hh-typography-font-size-small': typography?.fontSizeSmall,
    '--hh-typography-font-size-large': typography?.fontSizeLarge,
    '--hh-typography-font-weight': typography?.fontWeight,
    '--hh-typography-font-weight-bold': typography?.fontWeightBold,
    '--hh-typography-line-height': typography?.lineHeight,
    
    '--hh-border-radius-table': borderRadius?.table,
    '--hh-border-radius-cell': borderRadius?.cell,
    '--hh-border-radius-button': borderRadius?.button,
    
    '--hh-shadow-table': shadows?.table,
    '--hh-shadow-header': shadows?.header,
    '--hh-shadow-callout': shadows?.callout,
    '--hh-shadow-panel': shadows?.panel,
    
    '--hh-transition-duration': transitions?.duration,
    '--hh-transition-easing': transitions?.easing,
  } as React.CSSProperties;
}

