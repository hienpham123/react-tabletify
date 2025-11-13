import * as React from "react";

/**
 * Hook to manage header callout visibility and interactions
 * 
 * @template T - The type of data items
 * @param resizingColumn - Whether a column is currently being resized
 * @returns Callout state and handlers
 */
export function useHeaderCallout<T extends Record<string, any>>(
  resizingColumn: string | null
) {
  const [calloutKey, setCalloutKey] = React.useState<keyof T | null>(null);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  /**
   * Handle header mouse enter - show callout after delay
   */
  const handleHeaderMouseEnter = React.useCallback((key: keyof T | string) => {
    // Don't show callout when resizing
    if (resizingColumn) return;

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setCalloutKey(key as keyof T);
    }, 150);
  }, [resizingColumn]);

  /**
   * Handle header mouse leave - hide callout after delay
   */
  const handleHeaderMouseLeave = React.useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setCalloutKey(null);
    }, 200);
  }, []);

  /**
   * Dismiss callout immediately
   */
  const dismissCallout = React.useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setCalloutKey(null);
  }, []);

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return {
    calloutKey,
    setCalloutKey,
    handleHeaderMouseEnter,
    handleHeaderMouseLeave,
    dismissCallout,
  };
}

