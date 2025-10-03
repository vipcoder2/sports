/**
 * Disabled webview detection - always return false for no restrictions
 */
export const isSocialMediaWebview = (): boolean => {
  return false;
};

export const isBot = (): boolean => {
  return false;
};

export const isCopyrightBot = (): boolean => {
  return false;
};