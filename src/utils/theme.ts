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
    '--th-color-background': colors.background,
    '--th-color-surface': colors.surface,
    '--th-color-header-background': colors.headerBackground,
    '--th-color-row-background': colors.rowBackground,
    '--th-color-row-background-alternate': colors.rowBackgroundAlternate,
    '--th-color-selected-row-background': colors.selectedRowBackground,
    '--th-color-hover-row-background': colors.hoverRowBackground,
    '--th-color-group-header-background': colors.groupHeaderBackground,
    '--th-color-text': colors.text,
    '--th-color-text-secondary': colors.textSecondary,
    '--th-color-header-text': colors.headerText,
    '--th-color-row-text': colors.rowText,
    '--th-color-selected-row-text': colors.selectedRowText,
    '--th-color-border': colors.border,
    '--th-color-border-light': colors.borderLight,
    '--th-color-row-border': colors.rowBorder,
    '--th-color-focus': colors.focus,
    '--th-color-focus-border': colors.focusBorder,
    '--th-color-hover': colors.hover,
    '--th-color-active': colors.active,
    '--th-color-disabled': colors.disabled,
    '--th-color-primary': colors.primary,
    '--th-color-success': colors.success,
    '--th-color-warning': colors.warning,
    '--th-color-error': colors.error,
    
    '--th-spacing-cell-padding': spacing?.cellPadding,
    '--th-spacing-header-padding': spacing?.headerPadding,
    '--th-spacing-row-height': spacing?.rowHeight,
    '--th-spacing-row-height-compact': spacing?.rowHeightCompact,
    '--th-spacing-row-height-spacious': spacing?.rowHeightSpacious,
    '--th-spacing-gap': spacing?.gap,
    
    '--th-typography-font-family': typography?.fontFamily,
    '--th-typography-font-size': typography?.fontSize,
    '--th-typography-font-size-small': typography?.fontSizeSmall,
    '--th-typography-font-size-large': typography?.fontSizeLarge,
    '--th-typography-font-weight': typography?.fontWeight,
    '--th-typography-font-weight-bold': typography?.fontWeightBold,
    '--th-typography-line-height': typography?.lineHeight,
    
    '--th-border-radius-table': borderRadius?.table,
    '--th-border-radius-cell': borderRadius?.cell,
    '--th-border-radius-button': borderRadius?.button,
    
    '--th-shadow-table': shadows?.table,
    '--th-shadow-header': shadows?.header,
    '--th-shadow-callout': shadows?.callout,
    '--th-shadow-panel': shadows?.panel,
    
    '--th-transition-duration': transitions?.duration,
    '--th-transition-easing': transitions?.easing,
  } as React.CSSProperties;
}

