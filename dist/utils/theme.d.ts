/// <reference types="react" />
import type { TableTheme, ThemeMode } from '../types';
/**
 * Default light theme
 */
export declare const defaultLightTheme: TableTheme;
/**
 * Default dark theme
 */
export declare const defaultDarkTheme: TableTheme;
/**
 * Get theme object from theme prop
 * @param theme - Theme mode string or custom theme object
 * @returns Complete theme object
 */
export declare function getTheme(theme?: ThemeMode | TableTheme): TableTheme;
/**
 * Apply theme to table - generates CSS variables
 * Similar to Fluent UI's applyTheme()
 *
 * @param theme - Theme object
 * @returns CSS properties object with CSS variables
 */
export declare function applyTheme(theme: TableTheme): React.CSSProperties;
//# sourceMappingURL=theme.d.ts.map