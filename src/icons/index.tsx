import * as React from "react";

interface IconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Check icon (checkmark) - used for save/confirm actions
 */
export function CheckIcon({ width = 12, height = 12, className, style }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      width={width} 
      height={height}
      className={className}
      style={style}
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  );
}

/**
 * Close icon (X) - used for cancel/close actions
 */
export function CloseIcon({ width = 12, height = 12, className, style }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      width={width} 
      height={height}
      className={className}
      style={style}
    >
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  );
}

/**
 * Chevron down icon - used in table headers
 */
export function ChevronDownIcon({ width = 16, height = 16, className, style }: IconProps) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 2048 2048" 
      fill="currentColor"
      width={width}
      height={height}
      className={className}
      style={style}
    >
      <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" />
    </svg>
  );
}

/**
 * Pin icon - used to indicate pinned columns
 */
export function PinIcon({ width = 14, height = 14, className, style }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 2048 2048"
      fill="currentColor"
      className={className}
      style={style}
    >
      <path d="M1990 748q-33 33-64 60t-66 47-73 29-89 11q-34 0-65-6l-379 379q13 38 19 78t6 80q0 65-13 118t-37 100-60 89-79 87l-386-386-568 569-136 45 45-136 569-568-386-386q44-44 86-79t89-59 100-38 119-13q40 0 80 6t78 19l379-379q-6-31-6-65 0-49 10-88t30-74 46-65 61-65l690 690z" />
    </svg>
  );
}

/**
 * Filter icon - used to indicate filtered columns
 */
export function FilterIcon({ width = 14, height = 14, className, style }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 2048 2048"
      fill="currentColor"
      className={className}
      style={style}
    >
      <path d="M2048 128v219l-768 768v805H768v-805L0 347V128h2048z" />
    </svg>
  );
}

/**
 * Three dots icon - used for row actions menu
 */
export function ThreeDotsIcon({ width = 16, height = 16, className, style }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <circle cx="4" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="12" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

/**
 * Chevron right icon - used for expand/collapse in group headers
 */
export function ChevronRightIcon({ width = 16, height = 16, className, style }: IconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/**
 * Export icon (table/document) - used for export buttons
 */
export function ExportIcon({ width = 16, height = 16, className, style }: IconProps) {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 16 16" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path d="M2 2h12v12H2V2zm1 1v10h10V3H3zm1 1h8v1H4V4zm0 2h8v1H4V6zm0 2h8v1H4V8zm0 2h5v1H4v-1z" fill="currentColor"/>
    </svg>
  );
}

